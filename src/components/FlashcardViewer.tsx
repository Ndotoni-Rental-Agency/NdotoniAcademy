'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { MediaType } from '@/API';
import type { MediaValue } from './MediaField';
import InlineMarkdown from './InlineMarkdown';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  frontMedia?: MediaValue | null;
  backMedia?: MediaValue | null;
}

function CardMedia({ media }: { media: MediaValue }) {
  if (media.type === MediaType.VIDEO) {
    return <video src={media.url} controls className="max-h-32 max-w-full rounded-lg" />;
  }
  if (media.type === MediaType.AUDIO) {
    return <audio src={media.url} controls className="max-w-full" />;
  }
  // eslint-disable-next-line @next/next/no-img-element -- learner-uploaded media, not a static asset
  return <img src={media.url} alt="" className="max-h-32 max-w-full rounded-lg object-contain" />;
}

/** One physical side of the card — absolutely positioned over its sibling, backface hidden so only whichever side the current rotation points at is ever visible. */
function CardFace({
  label, text, media, bg, border, tint, back,
}: {
  label: string;
  text: string;
  media?: MediaValue | null;
  bg: string;
  border: string;
  tint: string;
  back?: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 px-8 py-6 text-center ${bg} ${border}`}
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: back ? 'rotateY(180deg)' : undefined,
      }}
    >
      <span className={`text-[10px] font-bold uppercase tracking-wide ${tint}`}>{label}</span>
      {media && <CardMedia media={media} />}
      <p className="text-lg font-bold text-ink-900 line-clamp-6"><InlineMarkdown content={text} /></p>
    </div>
  );
}

export default function FlashcardViewer({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) {
    return <p className="text-sm text-ink-400">No cards in this lesson yet.</p>;
  }

  const card = cards[index];

  function go(direction: -1 | 1) {
    setIndex((i) => Math.min(Math.max(i + direction, 0), cards.length - 1));
    setFlipped(false);
  }

  return (
    <div>
      <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${((index + 1) / cards.length) * 100}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="block w-full aspect-[2/1] group"
        style={{ perspective: '1400px' }}
        aria-label={flipped ? 'Showing the answer — tap to flip back to the question' : 'Showing the question — tap to reveal the answer'}
      >
        <div
          className="relative w-full h-full rounded-2xl transition-transform duration-500 ease-out group-hover:shadow-lg"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <CardFace
            label="Question" text={card.front} media={card.frontMedia}
            bg="bg-indigo-50" border="border-indigo-200" tint="text-indigo-500"
          />
          <CardFace
            label="Answer" text={card.back} media={card.backMedia}
            bg="bg-brand-50" border="border-brand-200" tint="text-brand-600" back
          />
        </div>
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-ink-400">
        <RotateCw className="w-3.5 h-3.5" /> Tap the card to flip
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <span className="text-xs text-ink-400 font-semibold">{index + 1} / {cards.length}</span>
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
