import type { Metadata } from 'next';
import ConfirmEmailClient from './ConfirmEmailClient';

export const metadata: Metadata = {
  title: 'Confirm your email',
  robots: { index: false, follow: false },
};

export default function ConfirmEmailPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <ConfirmEmailClient />
    </main>
  );
}
