'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, LogIn, Loader2, LogOut, XCircle } from 'lucide-react';
import { getCurrentUser } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify';
import { GraphQLClient } from '@/lib/graphql-client';
import { acceptInvitation } from '@/graphql/mutations';
import type { AcceptInvitationMutation, AcceptInvitationMutationVariables } from '@/API';
import { useAuth } from '@/lib/auth-context';

type Status = 'checking' | 'missing-token' | 'needs-auth' | 'wrong-account' | 'success' | 'already-member' | 'error';

function Invite() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { refetch, signOut } = useAuth();

  const [status, setStatus] = useState<Status>(token ? 'checking' : 'missing-token');
  const [error, setError] = useState('');
  // Only populated for 'wrong-account' — the email of the account currently
  // signed in, so the message can be specific about what to switch away from.
  const [signedInEmail, setSignedInEmail] = useState('');

  useEffect(() => {
    if (!token) return;
    configureAmplify();

    (async () => {
      // Signed-in? getCurrentUser() throws if there's no session.
      try {
        await getCurrentUser();
      } catch {
        setStatus('needs-auth');
        return;
      }

      try {
        await GraphQLClient.execute<AcceptInvitationMutation>(
          acceptInvitation,
          { token } satisfies AcceptInvitationMutationVariables
        );
        // Someone already signed in when they click the invite link (as
        // opposed to a brand-new signup, whose first `me` fetch already
        // reflects this) has a stale AuthContext user — without this,
        // "Go to your dashboard" below would show the pre-acceptance
        // dashboard mode until their next full reload.
        await refetch();
        setStatus('success');
      } catch (err) {
        console.error('[invite] acceptInvitation failed ->', err);
        const message = err instanceof Error ? err.message : String(err);
        // A brand-new signup already had this invitation auto-accepted by the
        // post-confirmation trigger before this page ever ran — not an error.
        if (message.includes('already been used or revoked')) {
          await refetch();
          setStatus('already-member');
          return;
        }
        // Backend's invitation-service.ts throws this exact wording when the
        // signed-in account's email doesn't match the invited one — give
        // that case a dedicated recovery path instead of a dead-end error.
        if (message.includes('accept an invitation for a different email')) {
          const freshUser = await refetch();
          setSignedInEmail(freshUser?.email ?? '');
          setStatus('wrong-account');
          return;
        }
        setStatus('error');
        setError(message);
      }
    })();
  }, [token, refetch]);

  const nextParam = token ? `?next=${encodeURIComponent(`/invite?token=${token}`)}` : '';
  const signInHref = `/login${nextParam}`;
  const signUpHref = `/login${nextParam}${nextParam ? '&' : '?'}mode=signup`;

  async function handleSwitchAccount() {
    await signOut();
    router.push(signInHref);
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
      {status === 'checking' && (
        <>
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-5" />
          <h1 className="text-xl font-semibold text-ink-900 mb-1.5">Checking your invitation…</h1>
        </>
      )}

      {status === 'needs-auth' && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
            <LogIn className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="text-xl font-semibold text-ink-900 mb-1.5">Sign in to accept</h1>
          <p className="text-sm text-ink-500 mb-6">
            Use the email address this invite was sent to. Already have an account? Sign in — otherwise, create one.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={signInHref}
              className="inline-block w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href={signUpHref}
              className="inline-block w-full rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </>
      )}

      {status === 'wrong-account' && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-warm-50 flex items-center justify-center mx-auto mb-5">
            <LogOut className="w-7 h-7 text-warm-600" />
          </div>
          <h1 className="text-xl font-semibold text-ink-900 mb-1.5">Wrong account</h1>
          <p className="text-sm text-ink-500 mb-6">
            {signedInEmail ? <>You&apos;re signed in as <strong className="text-ink-700">{signedInEmail}</strong>, but</> : 'You’re signed in, but'} this invitation was sent to a different email address. Sign out and continue with the invited account.
          </p>
          <button
            onClick={handleSwitchAccount}
            className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out and switch accounts
          </button>
        </>
      )}

      {(status === 'success' || status === 'already-member') && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-xl font-semibold text-ink-900 mb-1.5">You&apos;re in</h1>
          <p className="text-sm text-ink-500 mb-6">
            {status === 'success'
              ? "You've joined the organization."
              : "You're already part of this organization."}
          </p>
          <Link
            href="/dashboard"
            className="inline-block w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
          >
            Go to your dashboard
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-ink-900 mb-1.5">Couldn&apos;t accept invitation</h1>
          <p className="text-sm text-ink-500 mb-6">{error || 'This invitation may have expired or been revoked.'}</p>
          <Link
            href="/dashboard"
            className="inline-block w-full rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors"
          >
            Go to your dashboard
          </Link>
        </>
      )}

      {status === 'missing-token' && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-ink-900 mb-1.5">Invalid invitation link</h1>
          <p className="text-sm text-ink-500 mb-6">
            This link is missing some information. Copy the full link from your invitation email.
          </p>
        </>
      )}
    </div>
  );
}

export default function InviteClient() {
  return (
    <Suspense fallback={null}>
      <Invite />
    </Suspense>
  );
}
