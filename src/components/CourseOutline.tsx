'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, Lock, Play } from 'lucide-react';
import { LESSON_TYPE_ICONS } from './LessonForm';
import type { LessonType } from '@/API';

export interface OutlineLesson {
  moduleId: string;
  lessonId: string;
  title: string;
  type: LessonType;
  isFree: boolean;
}

export interface OutlineModule {
  moduleId: string;
  title: string;
  lessons: OutlineLesson[];
}

interface CourseOutlineProps {
  courseId: string;
  outline: OutlineModule[];
  currentModuleId: string;
  currentLessonId: string;
  /** Omit while progress hasn't loaded yet — the "X of Y completed" summary and per-lesson checkmarks just don't render until then. */
  completedLessonIds?: Set<string>;
}

/**
 * Always-visible course map alongside the lesson being viewed — the same
 * idea as Khan Academy/Quizlet's unit sidebar: see the whole course, jump to
 * any free lesson directly, not just the one right after this one, and see
 * which ones are already done.
 */
export default function CourseOutline({ courseId, outline, currentModuleId, currentLessonId, completedLessonIds }: CourseOutlineProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([currentModuleId]));

  function toggle(moduleId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }

  const totalLessons = outline.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = completedLessonIds
    ? outline.reduce((sum, m) => sum + m.lessons.filter((l) => completedLessonIds.has(l.lessonId)).length, 0)
    : null;

  return (
    <div className="rounded-2xl border border-ink-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100 bg-ink-50">
        <p className="text-xs font-bold text-ink-400 uppercase tracking-wide">Course content</p>
        {completedCount !== null && (
          <p className="text-[11px] text-ink-500 mt-0.5">{completedCount} of {totalLessons} completed</p>
        )}
      </div>
      <div className="divide-y divide-ink-100">
        {outline.map((mod) => {
          const isOpen = expanded.has(mod.moduleId);
          const moduleDone = completedLessonIds
            ? mod.lessons.filter((l) => completedLessonIds.has(l.lessonId)).length
            : null;
          const isModuleComplete = moduleDone !== null && mod.lessons.length > 0 && moduleDone === mod.lessons.length;
          return (
            <div key={mod.moduleId}>
              <button
                type="button"
                onClick={() => toggle(mod.moduleId)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-ink-50 transition-colors"
              >
                {isModuleComplete && (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-brand-600" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-ink-900 truncate">{mod.title}</span>
                  <span className="block text-[11px] text-ink-400 mt-0.5">
                    {moduleDone !== null
                      ? `${moduleDone}/${mod.lessons.length} complete`
                      : `${mod.lessons.length} lesson${mod.lessons.length === 1 ? '' : 's'}`}
                  </span>
                </span>
                <ChevronRight className={`w-4 h-4 text-ink-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>
              {isOpen && (
                <div className="pb-2">
                  {mod.lessons.map((lesson) => {
                    const isCurrent = lesson.lessonId === currentLessonId && mod.moduleId === currentModuleId;
                    const isDone = completedLessonIds?.has(lesson.lessonId) ?? false;
                    const Icon = LESSON_TYPE_ICONS[lesson.type];
                    const content = (
                      <>
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-brand-600" />
                        ) : (
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isCurrent ? 'text-indigo-600' : 'text-ink-400'}`} />
                        )}
                        <span className={`flex-1 min-w-0 truncate ${isCurrent ? 'font-bold text-indigo-700' : 'text-ink-600'}`}>
                          {lesson.title}
                        </span>
                        {lesson.isFree ? (
                          isCurrent && <Play className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                        ) : (
                          <Lock className="w-3 h-3 text-ink-300 flex-shrink-0" />
                        )}
                      </>
                    );
                    const rowClass = `flex items-center gap-2 pl-8 pr-4 py-2 text-xs border-l-2 ${
                      isCurrent ? 'bg-indigo-50 border-indigo-500' : 'border-transparent'
                    }`;
                    return lesson.isFree ? (
                      <Link
                        key={lesson.lessonId}
                        href={`/courses/${courseId}/modules/${lesson.moduleId}/lessons/${lesson.lessonId}`}
                        className={`${rowClass} hover:bg-indigo-50/60 transition-colors`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={lesson.lessonId} className={`${rowClass} opacity-60`}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
