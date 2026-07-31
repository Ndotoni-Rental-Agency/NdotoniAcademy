'use client';

import { useAuth } from '@/lib/auth-context';

/** Hides its children once a session is present — for prompts like "Already have an account? Log in" that make no sense once you already are. */
export default function SignedOutOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return null;
  return <>{children}</>;
}
