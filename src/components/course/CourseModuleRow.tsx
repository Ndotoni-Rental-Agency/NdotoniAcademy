'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, Play, Lock, Loader2 } from 'lucide-react';
import { getCategoryTheme } from '@/lib/category-theme';
import { GraphQLClient } from '@/lib/graphql-client';
import { lessonsForModule } from '@/graphql/queries';
import { LESSON_TYPE_ICONS } from '@/components/LessonForm';
import type { ModulesForCourseQuery, LessonsForModuleQuery } from '@/API';

type CourseModule = ModulesForCourseQuery['modulesForCourse'][number];
type ModuleLesson = LessonsForModuleQuery['lessonsForModule'][number];

export function formatMinutes(seconds: number): string {
  if (!seconds) return '';
  return `${Math.round(seconds / 60)} min`;
}

export default function CourseModuleRow({
  courseId, mod, index, theme, completedLessonIds, completion,
}: {
  courseId: string;
  mod: CourseModule;
  /** Display position (1-based) — `mod.order` is a sparse backend sort key (1000, 2000, ...), not meant to be shown. */
  index: number;
  theme: ReturnType<typeof getCategoryTheme>;
  /** Undefined for an anonymous visitor or a learner who hasn't started — no badge shown either way. */
  completedLessonIds?: Set<string>;
  /** Eagerly computed by the page (see its resume-target effect) so the module-complete checkmark shows on the collapsed row, without waiting for this row's own lazy lesson fetch. */
  completion?: { done: number; total: number };
}) {
  const [expanded, setExpanded] = useState(false);
  const [lessons, setLessons] = useState<ModuleLesson[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = !expanded;
    setExpanded(next);
    if (next && !loaded) {
      setLoading(true);
      try {
        const { lessonsForModule: fetched } = await GraphQLClient.execute<LessonsForModuleQuery>(lessonsForModule, { moduleId: mod.moduleId, courseId });
        setLessons([...fetched].sort((a, b) => a.order - b.order));
        setLoaded(true);
      } catch (err) {
        console.error('[CourseModuleRow] loadLessons failed ->', err);
      } finally {
        setLoading(false);
      }
    }
  }

  // Prefer the eagerly-computed completion (available before this row is
  // ever expanded); fall back to this row's own lazily-loaded lesson list
  // once opened, for the rare case the eager pass didn't run.
  const doneCount = completion?.done ?? (loaded && completedLessonIds ? lessons.filter((l) => completedLessonIds.has(l.lessonId)).length : null);
  const totalCount = completion?.total ?? (loaded ? lessons.length : null);
  const isModuleComplete = doneCount !== null && totalCount !== null && totalCount > 0 && doneCount === totalCount;

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all ${mod.isFree ? `${theme.border}` : 'border-ink-200'}`}>
      <button type="button" onClick={toggle} className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
            isModuleComplete ? 'bg-brand-600 text-white' : mod.isFree ? `${theme.solidBg} text-white` : 'bg-ink-100 text-ink-500'
          }`}>
            {isModuleComplete ? <CheckCircle2 className="w-5 h-5" /> : index}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-ink-900 truncate">{mod.title}</h3>
            <p className="text-xs text-ink-400 mt-0.5">
              {doneCount !== null && totalCount !== null
                ? `${doneCount}/${totalCount} complete`
                : `${mod.lessonCount} lesson${mod.lessonCount === 1 ? '' : 's'}`}
              {mod.totalDurationSeconds > 0 && ` · ${formatMinutes(mod.totalDurationSeconds)}`}
            </p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-ink-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 text-ink-400 animate-spin" />
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-xs text-ink-400">No lessons in this module yet.</p>
          ) : (
            lessons.map((lesson) => {
              const Icon = LESSON_TYPE_ICONS[lesson.type];
              const isComplete = completedLessonIds?.has(lesson.lessonId) ?? false;
              const content = (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isComplete ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
                  }`}>
                    {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-semibold text-ink-900 flex-1 min-w-0 truncate">{lesson.title}</span>
                  {lesson.durationSeconds ? <span className="text-xs text-ink-400 flex-shrink-0">{formatMinutes(lesson.durationSeconds)}</span> : null}
                  {lesson.isFree ? (
                    !isComplete && <Play className="w-4 h-4 text-ink-400 flex-shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-ink-300 flex-shrink-0" />
                  )}
                </>
              );
              return lesson.isFree ? (
                <Link
                  key={lesson.lessonId}
                  href={`/courses/${courseId}/modules/${mod.moduleId}/lessons/${lesson.lessonId}`}
                  className="flex items-center gap-3 rounded-lg border border-ink-100 px-3 py-2.5 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
                >
                  {content}
                </Link>
              ) : (
                <div key={lesson.lessonId} className="flex items-center gap-3 rounded-lg border border-ink-100 px-3 py-2.5 opacity-70">
                  {content}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
