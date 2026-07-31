'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import { useAuth, defaultDashboardPath } from '@/lib/auth-context';

export default function AuthButton({
  mode,
  accountType,
  next,
  className,
  children,
}: {
  mode: 'signin' | 'signup';
  accountType?: 'individual' | 'organization';
  /** Where to send a sign-in success — see AuthModal's `next` prop doc for what makes a safe value here. */
  next?: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  function handleClick() {
    // Already signed in? Go straight there — don't make someone who's
    // already authenticated sit through a "Sign up"/"Log in" modal again.
    if (user) {
      router.push(next ?? defaultDashboardPath(user));
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
      <AuthModal isOpen={open} onClose={() => setOpen(false)} initialMode={mode} accountType={accountType} next={next} />
    </>
  );
}
