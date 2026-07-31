import type { Metadata } from 'next';
import AuthCallbackClient from './AuthCallbackClient';

export const metadata: Metadata = {
  title: 'Signing you in…',
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <AuthCallbackClient />
    </main>
  );
}
