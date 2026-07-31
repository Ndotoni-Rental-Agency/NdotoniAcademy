'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import AuthModal from './AuthModal';

/**
 * The /organizations page's "Create your organization" CTA — aware of both
 * whether you're signed in AND whether you already have an organization,
 * unlike the generic AuthButton (which only checks sign-in state and always
 * lands on a role-based dashboard default, not specifically org management
 * or org creation).
 */
export default function OrganizationCTAButton({ className }: { className?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const hasOrg = Boolean(user?.organizations[0]?.organization);

  function handleClick() {
    if (user) {
      router.push(hasOrg ? '/dashboard/team' : '/dashboard/create-organization');
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {user && hasOrg ? 'Manage organization' : 'Create your organization'} <ArrowRight className="w-4 h-4" />
      </button>
      {/*
        Signup here is always the regular individual flow now — accounts get
        created first, then converted into an organization owner from
        /dashboard/create-organization, never the other way around. `next`
        only matters for the sign-in branch (an existing account choosing
        "Sign in" instead of signing up fresh) — signup itself can't reach
        `next` at all, since Cognito requires confirming the new account
        before any session exists to redirect with.
      */}
      <AuthModal isOpen={open} onClose={() => setOpen(false)} initialMode="signup" next="/dashboard/create-organization" />
    </>
  );
}
