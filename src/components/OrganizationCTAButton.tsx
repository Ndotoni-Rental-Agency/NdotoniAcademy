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
      <AuthModal isOpen={open} onClose={() => setOpen(false)} initialMode="signup" accountType="organization" />
    </>
  );
}
