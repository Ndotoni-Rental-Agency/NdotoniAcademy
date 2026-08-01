'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from './AuthModal';

function LoginModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const next = searchParams.get('next') || undefined;

  function close() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }

  return <AuthModal isOpen onClose={close} initialMode={mode} next={next} />;
}

export default function LoginModalClient() {
  return (
    <Suspense fallback={null}>
      <LoginModal />
    </Suspense>
  );
}
