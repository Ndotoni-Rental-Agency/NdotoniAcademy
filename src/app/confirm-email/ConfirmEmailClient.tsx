'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { confirmSignUp } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify';

type Status = 'confirming' | 'success' | 'already-confirmed' | 'error' | 'missing-params';

function ConfirmEmail() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const code = searchParams.get('code');

  const [status, setStatus] = useState<Status>(username && code ? 'confirming' : 'missing-params');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username || !code) return;
    configureAmplify();

    confirmSignUp({ username, confirmationCode: code })
      .then(() => setStatus('success'))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        // Cognito's message for re-clicking an already-used link.
        if (message.includes('Current status is CONFIRMED')) {
          setStatus('already-confirmed');
          return;
        }
        setStatus('error');
        // .name is the underlying Cognito exception type — more reliable
        // than matching .message text. For an expired/reused code, prefer
        // the friendly fallback text (below, in the 'error' render branch)
        // over Cognito's raw "Invalid code provided..." message.
        const name = err instanceof Error ? err.name : '';
        const isExpiredOrMismatched = name === 'ExpiredCodeException' || name === 'CodeMismatchException';
        setError(isExpiredOrMismatched ? '' : message);
      });
  }, [username, code]);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
      {status === 'confirming' && (
        <>
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-5" />
          <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Confirming your email…</h1>
          <p className="text-sm text-ink-500">This only takes a second.</p>
        </>
      )}

      {(status === 'success' || status === 'already-confirmed') && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">
            {status === 'success' ? 'Email confirmed' : 'Already confirmed'}
          </h1>
          <p className="text-sm text-ink-500 mb-6">
            {status === 'success'
              ? "Your account is ready. Sign in to get started."
              : "This link's already been used — your email was confirmed earlier."}
          </p>
          <Link
            href="/login"
            className="inline-block w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
          >
            Sign in
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Couldn&apos;t confirm your email</h1>
          <p className="text-sm text-ink-500 mb-6">{error || 'This link may have expired. Try signing up again to get a new one.'}</p>
          <Link
            href="/login?mode=signup"
            className="inline-block w-full rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors"
          >
            Back to sign up
          </Link>
        </>
      )}

      {status === 'missing-params' && (
        <>
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Invalid confirmation link</h1>
          <p className="text-sm text-ink-500 mb-6">
            This link is missing some information. Copy the full link from your confirmation email, or request a new one.
          </p>
          <Link
            href="/login?mode=signup"
            className="inline-block w-full rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors"
          >
            Back to sign up
          </Link>
        </>
      )}
    </div>
  );
}

export default function ConfirmEmailClient() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmail />
    </Suspense>
  );
}
