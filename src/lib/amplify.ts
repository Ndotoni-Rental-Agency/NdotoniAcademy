import { Amplify } from 'aws-amplify';

// Cognito User Pool + AppSync config. All NEXT_PUBLIC_* so they're readable
// client-side — none of these are secrets, they're public client identifiers
// (same trust level as an OAuth client ID).
//
// Values come from the CDK Auth/Service stack outputs for whichever
// environment this build targets:
//   UserPoolId       <- Academy-Auth-<stage> stack output "UserPoolId"
//   UserPoolClientId <- Academy-Auth-<stage> stack output "UserPoolClientId"
//   CognitoDomain    <- Academy-Auth-<stage> stack output "CognitoDomain"
//   GraphQLApiUrl    <- Academy-Service-<stage> stack output "GraphQLApiUrl"
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? '';
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? '';
const region = process.env.NEXT_PUBLIC_AWS_REGION ?? 'af-south-1';
const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN ?? '';
const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? '';

let configured = false;

/**
 * Idempotent — safe to call from every page that needs Auth or the GraphQL
 * client. Amplify.configure() is synchronous and cheap, so there's no real
 * cost to calling it more than once, but we guard anyway for clarity.
 */
export function configureAmplify() {
  if (configured) return;
  configured = true;

  if (!userPoolId || !userPoolClientId) {
    // Don't throw — a missing config shouldn't crash the whole page tree.
    // Auth calls will fail loudly and specifically instead, which is easier
    // to debug than a build-time crash.
    console.error(
      'Amplify not configured: NEXT_PUBLIC_COGNITO_USER_POOL_ID / NEXT_PUBLIC_COGNITO_CLIENT_ID missing.'
    );
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        signUpVerificationMethod: 'code',
        loginWith: cognitoDomain
          ? {
              oauth: {
                domain: cognitoDomain,
                scopes: ['email', 'openid', 'profile'],
                redirectSignIn: [`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback`],
                redirectSignOut: [`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/`],
                responseType: 'code',
              },
            }
          : undefined,
      },
    },
    API: graphqlEndpoint
      ? {
          GraphQL: {
            endpoint: graphqlEndpoint,
            region,
            defaultAuthMode: 'userPool',
          },
        }
      : undefined,
  });
}
