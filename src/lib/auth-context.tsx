'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { configureAmplify } from './amplify';
import { GraphQLClient } from './graphql-client';
import { me } from '@/graphql/queries';
import type { MeQuery } from '@/API';

export type AuthUser = NonNullable<MeQuery['me']>;

// Instructor is otherwise strictly a per-organization MembershipRole — the
// backend has no concept of an independent instructor at all. For someone
// with no organization, "instructor mode" is purely a local preference,
// scoped per account so it doesn't leak across different accounts signed
// into the same browser.
function wantsToTeachKey(userId: string): string {
  return `academy-wants-to-teach:${userId}`;
}

function readWantsToTeach(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(wantsToTeachKey(userId)) === '1';
}

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
  /** Only meaningful for a user with no organization — see dashboardModeFor. */
  wantsToTeach: boolean;
  setWantsToTeach: (next: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [wantsToTeach, setWantsToTeachState] = useState(false);

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
      setWantsToTeachState(nextUser ? readWantsToTeach(nextUser.id) : false);
      return nextUser;
    } catch (err) {
      // UserUnAuthenticatedException is the normal "no session" path for a
      // signed-out visitor — getCurrentUser() throws it before any network
      // call is made, so it's expected noise rather than a real failure.
      // Everything else is worth surfacing.
      const isSignedOut =
        err instanceof Error &&
        (err.name === 'UserUnAuthenticatedException' ||
          err.message.includes('UserUnAuthenticatedException') ||
          err.message.includes('needs to be authenticated'));
      if (!isSignedOut) {
        console.error('[auth] fetchUser failed ->', err);
      }
      setUser(null);
      setWantsToTeachState(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const setWantsToTeach = useCallback(
    (next: boolean) => {
      if (user && typeof window !== 'undefined') {
        const key = wantsToTeachKey(user.id);
        if (next) localStorage.setItem(key, '1');
        else localStorage.removeItem(key);
      }
      setWantsToTeachState(next);
    },
    [user]
  );

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
    setWantsToTeachState(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchUser, signOut, wantsToTeach, setWantsToTeach }}>
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

export type DashboardMode = 'learner' | 'instructor' | 'organization';

/**
 * Which dashboard shell a signed-in user sees — driven by their real role
 * in the first organization they belong to (there's no org switcher yet
 * for someone in several), not just whether they have one at all. OWNER/
 * ADMIN manage the org; INSTRUCTOR teaches (and may still have training
 * assigned to them); everyone else — a plain MEMBER, or no org at all —
 * gets the learner shell.
 *
 * `wantsToTeach` (see AuthContext) only applies to someone with no
 * organization at all — the backend has no "instructor" concept outside a
 * membership, so it can only ever be a local preference, and only for
 * someone whose real role isn't already decided by an org they belong to. A
 * plain org MEMBER can't self-promote this way; that's still exclusively an
 * OWNER/ADMIN action via changeMemberRole.
 */
export function dashboardModeFor(user: AuthUser | null, wantsToTeach = false): DashboardMode {
  const role = user?.organizations[0]?.role;
  if (role === 'OWNER' || role === 'ADMIN') return 'organization';
  if (role === 'INSTRUCTOR') return 'instructor';
  if (!user?.organizations[0] && wantsToTeach) return 'instructor';
  return 'learner';
}

/**
 * Where a signed-in user should land when no more specific destination
 * (an explicit `next`) applies.
 */
export function defaultDashboardPath(user: AuthUser | null, wantsToTeach = false): string {
  switch (dashboardModeFor(user, wantsToTeach)) {
    case 'organization': return '/dashboard/team';
    case 'instructor': return '/dashboard/courses';
    default: return '/dashboard';
  }
}
