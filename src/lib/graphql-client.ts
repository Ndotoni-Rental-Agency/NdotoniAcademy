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
 * Signed-in calls explicitly pass the ID token as `authToken` rather than
 * relying on authMode: 'userPool''s default — Amplify always derives that
 * default from the access token, which carries no profile claims (no
 * email/given_name/family_name). The backend's ensureUser() needs `email`
 * off the identity claims to materialize/look up the caller, so this has to
 * be the ID token; AppSync's Cognito User Pools authorizer accepts either
 * token type.
 *
 * Signed-out calls fall back to `authMode: 'apiKey'` (the api key itself
 * comes from Amplify.configure's API.GraphQL.apiKey — see amplify.ts). Only
 * the small set of fields tagged @aws_api_key on the backend (the public
 * catalog + free-preview lessons) accept that mode; every other field still
 * rejects a guest call with a real auth error, exactly as before this
 * existed. Most call sites don't need to know which mode is in play — the
 * backend enforces the actual boundary either way.
 */
// Amplify's own `graphql()` call doesn't consistently resolve with an
// `{ errors }` result — depending on the failure (a GraphQL error vs. a
// network/auth failure before the request even completes), it can also
// *reject* with a raw, non-Error object shaped like `{ errors: [...] }`.
// Callers all do `err instanceof Error ? err.message : String(err)`, and
// `String()` on a plain object yields the useless "[object Object]" — so
// this extracts a real message from whatever shape shows up, and every
// throw path logs the untouched original for debugging.
function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'errors' in err) {
    const errors = (err as { errors?: unknown }).errors;
    if (Array.isArray(errors) && errors.length && typeof errors[0]?.message === 'string') {
      return errors[0].message;
    }
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export class GraphQLClient {
  static async execute<T = unknown>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const session = await fetchAuthSession();
    const authToken = session.tokens?.idToken?.toString();
    try {
      const result = authToken
        ? await getClient().graphql({ query, variables, authToken })
        : await getClient().graphql({ query, variables, authMode: 'apiKey' });
      if ('errors' in result && result.errors?.length) {
        console.error('[GraphQLClient] GraphQL errors ->', result.errors);
        throw new Error(result.errors[0].message);
      }
      return (result as { data: T }).data;
    } catch (err) {
      if (err instanceof Error) throw err;
      console.error('[GraphQLClient] request failed ->', err);
      const message = extractMessage(err);
      // Preserve the original error name (e.g. UserUnAuthenticatedException)
      // so callers like auth-context.tsx can identify the error type correctly.
      const wrapped = new Error(message);
      if (err && typeof err === 'object' && 'name' in err && typeof (err as { name: unknown }).name === 'string') {
        wrapped.name = (err as { name: string }).name;
      }
      throw wrapped;
    }
  }
}
