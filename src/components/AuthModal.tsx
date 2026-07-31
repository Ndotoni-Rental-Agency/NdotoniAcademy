'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, Building2 } from 'lucide-react';
import IndividualAuthForm from './auth/IndividualAuthForm';
import OrganizationSignupWizard from './auth/OrganizationSignupWizard';
import { defaultDashboardPath, type AuthUser } from '@/lib/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  accountType?: 'individual' | 'organization';
  /**
   * Where to land after a *sign-in* success (not a fresh org signup — that
   * always goes to /dashboard/team, since completing the wizard inherently
   * means "you just made/joined an org" regardless of which page's CTA
   * started the flow). Only pass this for a destination that renders
   * something sensible for any user, signed-in-with-no-org included —
   * /dashboard/team blanks out for an org-less user, /dashboard/courses
   * doesn't, which is why the instructors page uses this and the
   * organizations page doesn't.
   */
  next?: string;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', accountType = 'individual', next }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [signupType, setSignupType] = useState<'individual' | 'organization'>(accountType);

  const isOrgFlow = mode === 'signup' && signupType === 'organization';

  // The modal itself never unmounts between opens (parents just flip `isOpen`), so mode/signupType
  // would otherwise leak from a previous open. Reset them whenever we transition closed -> open.
  // (Field-level state lives inside IndividualAuthForm/OrganizationSignupWizard, which DO unmount
  // when this component returns null below, so they reset for free.)
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setMode(initialMode);
      setSignupType(accountType);
    }
  }

  if (!isOpen) return null;

  function handleIndividualSuccess(user: AuthUser | null) {
    onClose();
    router.push(next ?? defaultDashboardPath(user));
  }

  function handleOrgComplete() {
    onClose();
    router.push('/dashboard/team');
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-ink-400 hover:text-ink-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Account type toggle - only during signup */}
          {mode === 'signup' && (
            <div className="flex gap-1.5 p-1 bg-ink-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setSignupType('individual')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition-all ${
                  signupType === 'individual' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Individual
              </button>
              <button
                type="button"
                onClick={() => setSignupType('organization')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition-all ${
                  signupType === 'organization' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Organization
              </button>
            </div>
          )}

          {!isOrgFlow ? (
            <IndividualAuthForm
              mode={mode}
              onSwitchMode={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              onSuccess={handleIndividualSuccess}
            />
          ) : (
            <OrganizationSignupWizard onComplete={handleOrgComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
