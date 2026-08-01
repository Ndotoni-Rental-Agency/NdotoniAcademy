'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import IndividualAuthForm from './auth/IndividualAuthForm';
import { useAuth, defaultDashboardPath, type AuthUser } from '@/lib/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  /**
   * Where to land after a sign-in success. Only pass this for a destination
   * that renders something sensible for any user, org or not — e.g.
   * /dashboard/create-organization works for anyone; /dashboard/team blanks
   * out for someone with no organization.
   */
  next?: string;
  /** See AuthButton's doc for the same prop — this is where it actually takes effect. */
  asInstructor?: boolean;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', next, asInstructor }: AuthModalProps) {
  const router = useRouter();
  const { setWantsToTeach } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // The modal itself never unmounts between opens (parents just flip `isOpen`), so mode
  // would otherwise leak from a previous open. Reset it whenever we transition closed -> open.
  // (Field-level state lives inside IndividualAuthForm, which DOES unmount when this
  // component returns null below, so it resets for free.)
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setMode(initialMode);
  }

  if (!isOpen) return null;

  function handleIndividualSuccess(user: AuthUser | null) {
    if (asInstructor && user && user.organizations.length === 0) setWantsToTeach(true);
    onClose();
    router.push(next ?? defaultDashboardPath(user, asInstructor));
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
          <IndividualAuthForm
            mode={mode}
            onSwitchMode={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
            onSuccess={handleIndividualSuccess}
          />
        </div>
      </div>
    </div>
  );
}
