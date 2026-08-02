'use client';

import { ChevronUp, ChevronDown, X, Loader2 } from 'lucide-react';
import { LESSON_TYPE_ICONS } from './LessonForm';
import type { LessonType } from '@/API';

export interface LessonRowData {
  lessonId: string;
  moduleId: string;
  title: string;
  type: LessonType;
  order: number;
  isFree: boolean;
  durationSeconds?: number | null;
}

interface CourseLessonRowProps {
  lesson: LessonRowData;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  onMove: (direction: -1 | 1) => void;
  onToggleFree: () => void;
  onDelete: () => void;
}

function formatDuration(seconds?: number | null): string | null {
  if (!seconds) return null;
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

export default function CourseLessonRow({ lesson, isFirst, isLast, busy, onMove, onToggleFree, onDelete }: CourseLessonRowProps) {
  const Icon = LESSON_TYPE_ICONS[lesson.type];
  const duration = formatDuration(lesson.durationSeconds);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-ink-100 px-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-coral-50 text-coral-700 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-semibold text-ink-900 flex-1 min-w-0 truncate">{lesson.title}</span>
      {duration && <span className="text-xs text-ink-400 flex-shrink-0">{duration}</span>}
      <button
        type="button"
        onClick={onToggleFree}
        disabled={busy}
        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 transition-colors disabled:opacity-60 ${
          lesson.isFree ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
        }`}
      >
        {lesson.isFree ? 'Free' : 'Paid'}
      </button>
      <div className="flex items-center flex-shrink-0">
        <button onClick={() => onMove(-1)} disabled={busy || isFirst} className="text-ink-300 hover:text-ink-600 disabled:opacity-30 transition-colors p-0.5" aria-label="Move up">
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onMove(1)} disabled={busy || isLast} className="text-ink-300 hover:text-ink-600 disabled:opacity-30 transition-colors p-0.5" aria-label="Move down">
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} disabled={busy} className="text-ink-300 hover:text-red-500 disabled:opacity-30 transition-colors p-0.5 ml-1" aria-label="Delete lesson">
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
