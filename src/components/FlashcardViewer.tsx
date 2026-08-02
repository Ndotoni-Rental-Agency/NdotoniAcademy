'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import type { MediaValue } from './MediaField';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  frontMedia?: MediaValue | null;
  backMedia?: MediaValue | null;
}

function CardMedia({ media }: { media: MediaValue }) {
  if (media.type === 'VIDEO') {
    return <video src={media.url} controls className="max-h-40 max-w-full rounded-lg" />;
  }
  if (media.type === 'AUDIO') {
    return <audio src={media.url} controls className="max-w-full" />;
  }
  // eslint-disable-next-line @next/next/no-img-element -- learner-uploaded media, not a static asset
  return <img src={media.url} alt="" className="max-h-40 max-w-full rounded-lg object-contain" />;
}

export default function FlashcardViewer({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) {
    return <p className="text-sm text-ink-400">No cards in this lesson yet.</p>;
  }

  const card = cards[index];
  const media = flipped ? card.backMedia : card.frontMedia;

  function go(direction: -1 | 1) {
    setIndex((i) => Math.min(Math.max(i + direction, 0), cards.length - 1));
    setFlipped(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="w-full aspect-[2/1] rounded-2xl border-2 border-indigo-200 bg-indigo-50 flex flex-col items-center justify-center gap-3 px-8 text-center hover:border-indigo-300 transition-colors"
      >
        {media && <CardMedia media={media} />}
        <p className="text-lg font-bold text-ink-900">{flipped ? card.back : card.front}</p>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
          <RotateCw className="w-3.5 h-3.5" /> {flipped ? 'Showing answer — tap to flip back' : 'Tap to reveal'}
        </span>
      </button>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <span className="text-xs text-ink-400">{index + 1} / {cards.length}</span>
        <button
          onClick={() => go(1)}
          disabled={index === cards.length - 1}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors disabled:opacity-30"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
