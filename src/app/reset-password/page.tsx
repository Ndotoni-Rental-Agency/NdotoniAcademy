import type { Metadata } from 'next';
import ResetPasswordClient from './ResetPasswordClient';

export const metadata: Metadata = {
  title: 'Reset your password',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <ResetPasswordClient />
    </main>
  );
}
