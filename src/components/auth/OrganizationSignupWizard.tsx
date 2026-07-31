'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { signUp } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify';
import { savePendingOrganization } from '@/lib/pending-organization';
import { inputClass, orgTypes } from './shared';

const stepLabels = ['Organization', 'Your account'];

export default function OrganizationSignupWizard() {
  const [orgStep, setOrgStep] = useState<1 | 2 | 'check-email'>(1);

  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('COMPANY');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    configureAmplify();

    try {
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
      // Cognito needs the email confirmed before this account can sign in
      // and actually create the organization (that mutation needs an
      // authenticated caller) — so remember what they asked for here, and
      // /dashboard/create-organization picks it up and pre-fills once
      // they've confirmed and signed in for the first time.
      savePendingOrganization({ name: orgName, type: orgType });
      setOrgStep('check-email');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (orgStep === 'check-email') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-ink-900 mb-2">Check your email</h2>
        <p className="text-sm text-ink-500">
          We sent a confirmation link to <strong className="text-ink-700">{email}</strong>. Click it to activate your account, then sign in — you&apos;ll be prompted to finish creating{' '}
          <strong className="text-ink-700">{orgName || 'your organization'}</strong>.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Step progress */}
      <div className="flex items-center gap-2 mb-6">
        {stepLabels.map((label, i) => {
          const step = (i + 1) as 1 | 2;
          const isDone = orgStep > step;
          const isCurrent = orgStep === step;
          return (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${isDone || isCurrent ? 'bg-indigo-600' : 'bg-ink-100'}`} />
              <p className={`text-[10px] mt-1.5 font-semibold ${isCurrent ? 'text-indigo-600' : 'text-ink-400'}`}>{label}</p>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {orgStep === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <h2 className="text-2xl font-extrabold text-ink-900 mb-1">What&apos;s your organization called?</h2>
            <p className="text-sm text-ink-500 mb-6">You&apos;ll be the owner, with full control over settings and roles.</p>
            <form onSubmit={(e) => { e.preventDefault(); setOrgStep(2); }} className="space-y-4">
              <div>
                <label htmlFor="orgName" className="block text-sm font-semibold text-ink-700 mb-1.5">Organization name</label>
                <input id="orgName" type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Bahari Freight Ltd" className={inputClass} required autoFocus />
              </div>
              <div>
                <label htmlFor="orgType" className="block text-sm font-semibold text-ink-700 mb-1.5">Organization type</label>
                <select id="orgType" value={orgType} onChange={(e) => setOrgType(e.target.value)} className={inputClass}>
                  {orgTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {orgStep === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <h2 className="text-2xl font-extrabold text-ink-900 mb-1">Create your account</h2>
            <p className="text-sm text-ink-500 mb-6">
              You&apos;ll sign in to manage <strong className="text-ink-700">{orgName || 'your organization'}</strong>.
            </p>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="orgFirstName" className="block text-sm font-semibold text-ink-700 mb-1.5">First Name</label>
                  <input id="orgFirstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputClass} autoFocus disabled={submitting} />
                </div>
                <div>
                  <label htmlFor="orgLastName" className="block text-sm font-semibold text-ink-700 mb-1.5">Last Name</label>
                  <input id="orgLastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputClass} disabled={submitting} />
                </div>
              </div>
              <div>
                <label htmlFor="orgEmail" className="block text-sm font-semibold text-ink-700 mb-1.5">Work email</label>
                <input id="orgEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={inputClass} required disabled={submitting} />
              </div>
              <div>
                <label htmlFor="orgPassword" className="block text-sm font-semibold text-ink-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="orgPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className={`${inputClass} pr-11`}
                    required
                    minLength={8}
                    disabled={submitting}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-ink-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-ink-500 leading-relaxed">I agree to the Terms and Privacy Policy</span>
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button type="button" onClick={() => setOrgStep(1)} disabled={submitting} className="flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 px-4 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors disabled:opacity-60">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={submitting || !agreedToTerms}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Please wait…' : <>Create account <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
