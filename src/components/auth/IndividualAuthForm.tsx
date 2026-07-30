'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import SocialLoginButtons from './SocialLoginButtons';
import { inputClass } from './shared';

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSuccess();
  }

  return (
    <>
      <h2 className="text-2xl font-extrabold text-ink-900 mb-6">
        {mode === 'signup' ? 'Create Account' : 'Sign In'}
      </h2>

      <SocialLoginButtons onSocialLogin={onSuccess} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-ink-700 mb-1.5">First Name</label>
              <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-ink-700 mb-1.5">Last Name</label>
              <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputClass} />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="modal-email" className="block text-sm font-semibold text-ink-700 mb-1.5">Email</label>
          <input id="modal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={inputClass} required />
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
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mode === 'signin' && (
          <div className="flex justify-end">
            <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Forgot password?</button>
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

        <button type="submit" className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
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
