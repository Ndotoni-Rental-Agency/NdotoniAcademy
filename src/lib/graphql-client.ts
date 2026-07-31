import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify';

// `any` is deliberate: generateClient()'s inferred return type recurses deep
// enough to blow TypeScript's comparison depth (TS2321) the moment it's
// captured in a variable, even without an explicit annotation. ndotoniStays'
// equivalent client hits the same wall for the same reason.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any = null;

function getClient() {
  if (!client) {
    configureAmplify();
    client = generateClient();
  }
  return client;
}

/**
 * Thin wrapper around Amplify's generateClient().graphql().
 *
 * Unlike ndotoniStays' equivalent, there's no API-key fallback here —
 * Academy's AppSync API has exactly one auth mode (Cognito User Pools, see
 * `defaultAuthMode: 'userPool'` in amplify.ts) and every field requires a
 * signed-in user. A call made while signed out fails with an auth error;
 * check `getCurrentUser()` first if that's a case you need to handle
 * gracefully (see src/app/invite/InviteClient.tsx for the pattern).
 *
 * Explicitly passes the ID token as `authToken` rather than relying on
 * authMode: 'userPool''s default — Amplify always derives that default from
 * the access token, which carries no profile claims (no email/given_name/
 * family_name). The backend's ensureUser() needs `email` off the identity
 * claims to materialize/look up the caller, so this has to be the ID token;
 * AppSync's Cognito User Pools authorizer accepts either token type.
 */
export class GraphQLClient {
  static async execute<T = unknown>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const session = await fetchAuthSession();
    const authToken = session.tokens?.idToken?.toString();
    const result = await getClient().graphql({ query, variables, authToken });
    if ('errors' in result && result.errors?.length) {
      throw new Error(result.errors[0].message);
    }
    return (result as { data: T }).data;
  }
}
