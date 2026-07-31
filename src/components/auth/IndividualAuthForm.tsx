'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { signIn, signUp, resetPassword } from 'aws-amplify/auth';
import SocialLoginButtons from './SocialLoginButtons';
import { inputClass } from './shared';
import { configureAmplify } from '@/lib/amplify';

type Step = 'form' | 'submitting' | 'check-email' | 'reset-sent';

export default function IndividualAuthForm({
  mode,
  onSwitchMode,
  onSuccess,
}: {
  mode: 'signin' | 'signup';
  onSwitchMode: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');

  // Switching between sign in / sign up shouldn't carry a stale error or a
  // "check your email" screen from a previous attempt into the new mode.
  // Reset during render (same pattern AuthModal uses for its own mode reset)
  // rather than in an effect — this is a derived-state reset, not a
  // synchronization with an external system.
  const [prevMode, setPrevMode] = useState(mode);
  if (mode !== prevMode) {
    setPrevMode(mode);
    setStep('form');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStep('submitting');
    configureAmplify();

    try {
      if (mode === 'signup') {
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              given_name: firstName,
              family_name: lastName,
            },
          },
        });
        // Not signed in yet — Cognito needs the email confirmed first (see
        // /confirm-email, which the confirmation email links to).
        setStep('check-email');
      } else {
        const { isSignedIn } = await signIn({ username: email, password });
        if (isSignedIn) {
          onSuccess();
        } else {
          // MFA / additional challenges aren't wired up yet.
          setStep('form');
          setError('Additional sign-in steps are required but not supported yet.');
        }
      }
    } catch (err) {
      setStep('form');
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email above first, then click "Forgot password?".');
      return;
    }
    setError('');
    setStep('submitting');
    configureAmplify();

    try {
      await resetPassword({ username: email });
      setStep('reset-sent');
    } catch (err) {
      setStep('form');
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (step === 'check-email') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-ink-900 mb-2">Check your email</h2>
        <p className="text-sm text-ink-500">
          We sent a confirmation link to <strong className="text-ink-700">{email}</strong>. Click it to activate your account, then sign in.
        </p>
      </div>
    );
  }

  if (step === 'reset-sent') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-ink-900 mb-2">Check your email</h2>
        <p className="text-sm text-ink-500">
          We sent a password reset link to <strong className="text-ink-700">{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-extrabold text-ink-900 mb-6">
        {mode === 'signup' ? 'Create Account' : 'Sign In'}
      </h2>

      <SocialLoginButtons />

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-ink-700 mb-1.5">First Name</label>
              <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputClass} disabled={step === 'submitting'} />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-ink-700 mb-1.5">Last Name</label>
              <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputClass} disabled={step === 'submitting'} />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="modal-email" className="block text-sm font-semibold text-ink-700 mb-1.5">Email</label>
          <input id="modal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={inputClass} required disabled={step === 'submitting'} />
        </div>

        <div>
          <label htmlFor="modal-password" className="block text-sm font-semibold text-ink-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              id="modal-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter your password'}
              className={`${inputClass} pr-11`}
              required
              minLength={mode === 'signup' ? 8 : undefined}
              disabled={step === 'submitting'}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mode === 'signin' && (
          <div className="flex justify-end">
            <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Forgot password?</button>
          </div>
        )}

        {mode === 'signup' && (
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-ink-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-ink-500 leading-relaxed">I agree to the Terms and Privacy Policy</span>
          </label>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={step === 'submitting' || (mode === 'signup' && !agreedToTerms)}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {step === 'submitting' ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-ink-500 mt-5">
        {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={onSwitchMode} className="font-bold text-indigo-600 hover:text-indigo-700">
          {mode === 'signup' ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </>
  );
}
