'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, XCircle } from 'lucide-react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { configureAmplify } from '@/lib/amplify';

export default function AuthCallbackClient() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    configureAmplify();

    // Amplify's OAuth listener picks up the `code` param on this page and
    // exchanges it for tokens automatically — it reports the outcome via
    // Hub events rather than a promise we can await directly.
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signInWithRedirect') {
        router.replace('/dashboard');
      } else if (payload.event === 'signInWithRedirect_failure') {
        setError('Sign-in failed. Please try again.');
      }
    });

    // Covers the case where the exchange finished before this listener
    // attached (fast network) — the Hub event would already have fired.
    getCurrentUser()
      .then(() => router.replace('/dashboard'))
      .catch(() => {
        /* not signed in yet — wait for the Hub event above */
      });

    return unsubscribe;
  }, [router]);

  if (error) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Couldn&apos;t sign you in</h1>
        <p className="text-sm text-ink-500 mb-6">{error}</p>
        <Link
          href="/login"
          className="inline-block w-full rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
      <p className="text-sm text-ink-500">Signing you in…</p>
    </div>
  );
}
