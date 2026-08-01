'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, XCircle } from 'lucide-react';
import { confirmResetPassword } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify';
import { inputClass } from '@/components/auth/shared';

type Status = 'form' | 'submitting' | 'success' | 'missing-params' | 'link-invalid';

function ResetPassword() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const code = searchParams.get('code');

  const [status, setStatus] = useState<Status>(username && code ? 'form' : 'missing-params');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !code) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError('');
    setStatus('submitting');
    configureAmplify();

    try {
      await confirmResetPassword({ username, confirmationCode: code, newPassword });
      setStatus('success');
    } catch (err) {
      // Checking .name (the underlying Cognito exception type) rather than
      // matching .message text — more reliable, and lets us replace
      // Cognito's raw "Invalid code provided..." with a clearer dedicated
      // screen instead of showing that text inline above the same form.
      const name = err instanceof Error ? err.name : '';
      if (name === 'ExpiredCodeException' || name === 'CodeMismatchException') {
        setStatus('link-invalid');
        return;
      }
      setStatus('form');
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (status === 'missing-params') {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Invalid reset link</h1>
        <p className="text-sm text-ink-500 mb-6">
          This link is missing some information. Copy the full link from your password reset email, or request a new one.
        </p>
        <Link
          href="/login"
          className="inline-block w-full rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  if (status === 'link-invalid') {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">This link has expired or was already used</h1>
        <p className="text-sm text-ink-500 mb-6">
          Password reset links only work once and expire after a while, for your security. Request a new one to keep going.
        </p>
        <Link
          href="/login"
          className="inline-block w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-brand-600" />
        </div>
        <h1 className="text-xl font-extrabold text-ink-900 mb-1.5">Password updated</h1>
        <p className="text-sm text-ink-500 mb-6">You can sign in with your new password now.</p>
        <Link
          href="/login"
          className="inline-block w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Reset your password</h1>
      <p className="text-sm text-ink-500 mb-6">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-semibold text-ink-700 mb-1.5">
            New password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={`${inputClass} pr-11`}
              required
              minLength={8}
              disabled={status === 'submitting'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-ink-400">Uppercase, lowercase, and a number.</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-ink-700 mb-1.5">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
            className={inputClass}
            required
            minLength={8}
            disabled={status === 'submitting'}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {status === 'submitting' ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordClient() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
