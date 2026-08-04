'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Lock, Play } from 'lucide-react';
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
}

/**
 * Always-visible course map alongside the lesson being viewed — the same
 * idea as Khan Academy/Quizlet's unit sidebar: see the whole course, jump to
 * any free lesson directly, not just the one right after this one. No
 * "completed" checkmarks — there's no lesson-progress tracking in this app
 * yet (see the lesson viewer's own note on that), so this only ever
 * highlights *current*, not *done*.
 */
export default function CourseOutline({ courseId, outline, currentModuleId, currentLessonId }: CourseOutlineProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([currentModuleId]));

  function toggle(moduleId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }

  return (
    <div className="rounded-2xl border border-ink-200 overflow-hidden">
      <p className="px-4 py-3 text-xs font-bold text-ink-400 uppercase tracking-wide border-b border-ink-100 bg-ink-50">
        Course content
      </p>
      <div className="divide-y divide-ink-100">
        {outline.map((mod) => {
          const isOpen = expanded.has(mod.moduleId);
          return (
            <div key={mod.moduleId}>
              <button
                type="button"
                onClick={() => toggle(mod.moduleId)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-ink-50 transition-colors"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-ink-900 truncate">{mod.title}</span>
                  <span className="block text-[11px] text-ink-400 mt-0.5">
                    {mod.lessons.length} lesson{mod.lessons.length === 1 ? '' : 's'}
                  </span>
                </span>
                <ChevronRight className={`w-4 h-4 text-ink-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>
              {isOpen && (
                <div className="pb-2">
                  {mod.lessons.map((lesson) => {
                    const isCurrent = lesson.lessonId === currentLessonId && mod.moduleId === currentModuleId;
                    const Icon = LESSON_TYPE_ICONS[lesson.type];
                    const content = (
                      <>
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isCurrent ? 'text-indigo-600' : 'text-ink-400'}`} />
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
