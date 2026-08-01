'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, LogIn, Loader2, XCircle } from 'lucide-react';
import { getCurrentUser } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify';
import { GraphQLClient } from '@/lib/graphql-client';
import { acceptInvitation } from '@/graphql/mutations';
import type { AcceptInvitationMutation, AcceptInvitationMutationVariables } from '@/API';
import { useAuth } from '@/lib/auth-context';

type Status = 'checking' | 'missing-token' | 'needs-auth' | 'success' | 'already-member' | 'error';

function Invite() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { refetch } = useAuth();

  const [status, setStatus] = useState<Status>(token ? 'checking' : 'missing-token');
  const [error, setError] = useState('');

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
        setStatus('error');
        setError(message);
      }
    })();
  }, [token, refetch]);

  const signInHref = token ? `/login?next=${encodeURIComponent(`/invite?token=${token}`)}` : '/login';

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
      {status === 'checking' && (
        <>
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-5" />
          <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Checking your invitation…</h1>
        </>
      )}

      {status === 'needs-auth' && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
            <LogIn className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Sign in to accept</h1>
          <p className="text-sm text-ink-500 mb-6">
            Sign in (or create an account with the email this invite was sent to) to join the organization.
          </p>
          <Link
            href={signInHref}
            className="inline-block w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
          >
            Sign in
          </Link>
        </>
      )}

      {(status === 'success' || status === 'already-member') && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">You&apos;re in</h1>
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
          <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Couldn&apos;t accept invitation</h1>
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
          <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Invalid invitation link</h1>
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
