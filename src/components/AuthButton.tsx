'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import { useAuth, defaultDashboardPath } from '@/lib/auth-context';

export default function AuthButton({
  mode,
  next,
  asInstructor,
  className,
  children,
}: {
  mode: 'signin' | 'signup';
  /** Where to send a sign-in success — see AuthModal's `next` prop doc for what makes a safe value here. */
  next?: string;
  /**
   * This CTA is a "become an instructor" entry point (the /instructors
   * page) — an org-less account should land in instructor mode, not the
   * default learner shell. No-op for anyone who already belongs to an
   * organization, since their role there is real and isn't self-service.
   */
  asInstructor?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user, setWantsToTeach } = useAuth();
  const router = useRouter();

  function handleClick() {
    // Already signed in? Go straight there — don't make someone who's
    // already authenticated sit through a "Sign up"/"Log in" modal again.
    if (user) {
      if (asInstructor && user.organizations.length === 0) setWantsToTeach(true);
      router.push(next ?? defaultDashboardPath(user, asInstructor));
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
      <AuthModal isOpen={open} onClose={() => setOpen(false)} initialMode={mode} next={next} asInstructor={asInstructor} />
    </>
  );
}
