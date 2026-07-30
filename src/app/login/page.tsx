import type { Metadata } from 'next';
import LoginModalClient from '@/components/LoginModalClient';

export const metadata: Metadata = {
  title: 'Log in',
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <LoginModalClient />
    </main>
  );
}
