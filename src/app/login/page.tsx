'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/components/AuthModal';

function LoginModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  function close() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }

  return <AuthModal isOpen onClose={close} initialMode={mode} />;
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <LoginModal />
      </Suspense>
    </main>
  );
}
