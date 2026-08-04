'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface MarkCompleteButtonProps {
  dwellMs: number;
  completed: boolean;
  onComplete: () => Promise<void>;
}

/**
 * Learner-initiated "I finished this" signal for passive lesson content
 * (video/audio/text/document/embed/animation/flashcards) — there's no
 * reliable way to detect real engagement for these short of much heavier
 * per-type tracking (video watch-percentage, text scroll position, ...), so
 * the button stays disabled for `dwellMs` (scaled to the content — a
 * video/audio's own duration, ~1s per 20 words of text, a flat floor for
 * everything else, see dwellMsFor in the lesson viewer page) as a cheap
 * guard against instantly clicking through an entire course.
 */
export default function MarkCompleteButton({ dwellMs, completed, onComplete }: MarkCompleteButtonProps) {
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setReady(false);
    const timer = setTimeout(() => setReady(true), dwellMs);
    return () => clearTimeout(timer);
  }, [dwellMs]);

  if (completed) {
    return (
      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-brand-700">
        <Check className="w-4 h-4" /> Completed
      </div>
    );
  }

  async function handleClick() {
    setSubmitting(true);
    try {
      await onComplete();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!ready || submitting}
      className="mt-8 inline-flex items-center gap-2 rounded-xl border-2 border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-ink-200 disabled:hover:bg-transparent disabled:hover:text-ink-700"
    >
      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      {ready ? 'Mark as complete' : 'Keep going — one moment...'}
    </button>
  );
}
