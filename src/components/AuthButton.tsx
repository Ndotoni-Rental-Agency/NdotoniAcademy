'use client';

import { useState, type ReactNode } from 'react';
import AuthModal from './AuthModal';

export default function AuthButton({
  mode,
  accountType,
  className,
  children,
}: {
  mode: 'signin' | 'signup';
  accountType?: 'individual' | 'organization';
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <AuthModal isOpen={open} onClose={() => setOpen(false)} initialMode={mode} accountType={accountType} />
    </>
  );
}
