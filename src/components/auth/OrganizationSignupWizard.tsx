'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mail, Plus, Trash2, PartyPopper, Check, Eye, EyeOff } from 'lucide-react';
import { inputClass, orgTypes } from './shared';

const stepLabels = ['Organization', 'Your account', 'Invite team'];

export default function OrganizationSignupWizard({ onComplete }: { onComplete: () => void }) {
  const [orgStep, setOrgStep] = useState<1 | 2 | 3 | 4>(1);

  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('COMPANY');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);

  function updateInviteEmail(i: number, value: string) {
    setInviteEmails((prev) => prev.map((v, idx) => (idx === i ? value : v)));
  }

  function addInviteRow() {
    if (inviteEmails.length < 3) setInviteEmails((prev) => [...prev, '']);
  }

  function removeInviteRow(i: number) {
    setInviteEmails((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <>
      {/* Step progress */}
      {orgStep < 4 && (
        <div className="flex items-center gap-2 mb-6">
          {stepLabels.map((label, i) => {
            const step = (i + 1) as 1 | 2 | 3;
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
      )}

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
            <form onSubmit={(e) => { e.preventDefault(); setOrgStep(3); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="orgFirstName" className="block text-sm font-semibold text-ink-700 mb-1.5">First Name</label>
                  <input id="orgFirstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputClass} autoFocus />
                </div>
                <div>
                  <label htmlFor="orgLastName" className="block text-sm font-semibold text-ink-700 mb-1.5">Last Name</label>
                  <input id="orgLastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="orgEmail" className="block text-sm font-semibold text-ink-700 mb-1.5">Work email</label>
                <input id="orgEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={inputClass} required />
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
              <div className="flex gap-3">
                <button type="button" onClick={() => setOrgStep(1)} className="flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 px-4 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {orgStep === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <h2 className="text-2xl font-extrabold text-ink-900 mb-1">Invite your team</h2>
            <p className="text-sm text-ink-500 mb-6">Optional. You can always invite people later from your team page.</p>
            <div className="space-y-2.5 mb-4">
              {inviteEmails.map((value, i) => (
                <div key={i} className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input
                      type="email"
                      value={value}
                      onChange={(e) => updateInviteEmail(i, e.target.value)}
                      placeholder="colleague@company.com"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  {inviteEmails.length > 1 && (
                    <button type="button" onClick={() => removeInviteRow(i)} className="text-ink-300 hover:text-red-500 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {inviteEmails.length < 3 && (
              <button type="button" onClick={addInviteRow} className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 mb-6">
                <Plus className="w-4 h-4" /> Add another
              </button>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={() => setOrgStep(2)} className="flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 px-4 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setOrgStep(4)} className="flex-1 rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-600 hover:bg-ink-50 transition-colors">
                Skip for now
              </button>
              <button type="button" onClick={() => setOrgStep(4)} className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
                Send invites
              </button>
            </div>
          </motion.div>
        )}

        {orgStep === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
              className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-5"
            >
              <PartyPopper className="w-7 h-7 text-indigo-600" />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-ink-900 mb-2">
              {orgName || 'Your organization'} is ready
            </h2>
            <p className="text-sm text-ink-500 mb-8 max-w-xs mx-auto">
              You&apos;re the owner. Assign training, manage roles, and invite more people any time from your team page.
            </p>
            <div className="space-y-2 mb-8 text-left bg-ink-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-ink-700">
                <Check className="w-4 h-4 text-brand-600 flex-shrink-0" /> Organization created
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-700">
                <Check className="w-4 h-4 text-brand-600 flex-shrink-0" /> You&apos;re set as owner
              </div>
              {inviteEmails.some((e) => e.trim()) && (
                <div className="flex items-center gap-2 text-sm text-ink-700">
                  <Check className="w-4 h-4 text-brand-600 flex-shrink-0" /> Invitations sent
                </div>
              )}
            </div>
            <button onClick={onComplete} className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
              Go to your team page
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
