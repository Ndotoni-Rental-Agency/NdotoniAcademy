'use client';

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

export default function LoginPage() {
  const [isOpen] = useState(true);

  return (
    <main className="min-h-screen bg-white">
      <AuthModal
        isOpen={isOpen}
        onClose={() => window.history.back()}
        initialMode="signin"
      />
    </main>
  );
}
