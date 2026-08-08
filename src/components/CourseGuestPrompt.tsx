'use client';

import { useState } from 'react';
import AuthModal from './AuthModal';
import Modal from './Modal';

interface CourseGuestPromptProps {
  open: boolean;
  onDismiss: () => void;
  courseTitle: string;
  priceTzs: number;
  next: string;
}

// Shown once per course visit to a signed-out visitor. A free course still
// lets them back out and browse (guests can already reach free-preview
// lessons via API-key auth), but a paid course only offers sign-in — there's
// no guest path into content that isn't free.
export default function CourseGuestPrompt({ open, onDismiss, courseTitle, priceTzs, next }: CourseGuestPromptProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const isPaid = priceTzs > 0;

  return (
    <>
      <Modal open={open && !authOpen} onClose={onDismiss} title={isPaid ? 'Sign in to enroll' : 'Welcome'}>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-ink-600">
            {isPaid
              ? `${courseTitle} is a paid course (TZS ${priceTzs.toLocaleString()}). Sign in to enroll and get full access.`
              : `Sign in to track your progress in ${courseTitle}, or continue browsing the free preview as a guest.`}
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="w-full rounded-full bg-ink-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-ink-800 transition-colors"
            >
              Sign in
            </button>
            {!isPaid && (
              <button
                type="button"
                onClick={onDismiss}
                className="w-full rounded-full border border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors"
              >
                Continue as guest
              </button>
            )}
          </div>
        </div>
      </Modal>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} next={next} />
    </>
  );
}
