import type { Metadata } from 'next';
import InviteClient from './InviteClient';

export const metadata: Metadata = {
  title: 'Accept invitation',
  robots: { index: false, follow: false },
};

export default function InvitePage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <InviteClient />
    </main>
  );
}
