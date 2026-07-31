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
  /**
   * Re-run the session check and re-fetch `me`, returning the fresh value
   * directly — call after a profile edit, or right after sign-in when a
   * caller needs the just-fetched user synchronously (context consumers
   * elsewhere won't see the update until their next render, which is too
   * late if you're about to redirect based on it).
   */
  refetch: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (): Promise<AuthUser | null> => {
    configureAmplify();
    try {
      // Throws if there's no signed-in session — cheaper than a failed
      // GraphQL call for the common "signed out" case.
      const currentUser = await getCurrentUser();
      console.log('[auth] getCurrentUser() ->', currentUser);
      const data = await GraphQLClient.execute<MeQuery>(me);
      console.log('[auth] me query ->', data);
      const nextUser = data.me ?? null;
      setUser(nextUser);
      return nextUser;
    } catch (err) {
      console.error('[auth] fetchUser failed ->', err);
      setUser(null);
      return null;
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

/**
 * Where a signed-in user should land when no more specific destination
 * (an explicit `next`) applies — based on their real organization
 * memberships, not a one-size-fits-all /dashboard. A user can belong to
 * several organizations; this just takes the first one, since there's no
 * org switcher yet to pick among them.
 */
export function defaultDashboardPath(user: AuthUser | null): string {
  const memberships = user?.organizations ?? [];
  if (memberships.some((m) => m.role === 'OWNER' || m.role === 'ADMIN')) return '/dashboard/team';
  if (memberships.some((m) => m.role === 'INSTRUCTOR')) return '/dashboard/courses';
  return '/dashboard';
}
