'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { configureAmplify } from './amplify';
import { GraphQLClient } from './graphql-client';
import { me } from '@/graphql/queries';
import type { MeQuery } from '@/API';

export type AuthUser = NonNullable<MeQuery['me']>;

interface AuthContextValue {
  /** null while signed out, populated once the `me` query resolves. */
  user: AuthUser | null;
  /** True until the first session check + `me` fetch settles. */
  loading: boolean;
  /** Re-run the session check and re-fetch `me` — call after a profile edit. */
  refetch: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    configureAmplify();
    try {
      // Throws if there's no signed-in session — cheaper than a failed
      // GraphQL call for the common "signed out" case.
      const currentUser = await getCurrentUser();
      console.log('[auth] getCurrentUser() ->', currentUser);
      const data = await GraphQLClient.execute<MeQuery>(me);
      console.log('[auth] me query ->', data);
      setUser(data.me ?? null);
    } catch (err) {
      console.error('[auth] fetchUser failed ->', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchUser();
    })();

    // Sign-in can land here two ways this app cares about: email/password
    // (signedIn) and the Google/Apple hosted-UI redirect (signInWithRedirect,
    // handled on /auth/callback but the event still fires globally). Both
    // mean "go fetch who's actually signed in now."
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'signInWithRedirect':
          (async () => {
            await fetchUser();
          })();
          break;
        case 'signedOut':
        case 'signInWithRedirect_failure':
          setUser(null);
          setLoading(false);
          break;
      }
    });

    return unsubscribe;
  }, [fetchUser]);

  const signOut = useCallback(async () => {
    await amplifySignOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

/** `firstName`/`lastName` are separate, possibly-null fields on the real User — this is the one place that decides how to join them for display. */
export function displayName(user: Pick<AuthUser, 'firstName' | 'lastName' | 'email'> | null | undefined): string {
  if (!user) return '';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return name || user.email;
}
