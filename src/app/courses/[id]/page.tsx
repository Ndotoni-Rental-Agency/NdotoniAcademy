'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Award, User, Play, ArrowRight, Zap, TrendingUp, Shield, Star,
  Video, FileText, HelpCircle, Loader2, ChevronRight, Lock, CheckCircle2,
} from 'lucide-react';
import { getCategoryTheme } from '@/lib/category-theme';
import { instructorDisplayName } from '@/lib/course-display';
import { GraphQLClient } from '@/lib/graphql-client';
import { useAuth } from '@/lib/auth-context';
import { course as courseQuery, modulesForCourse, lessonsForModule, myCourseProgress as myCourseProgressQuery } from '@/graphql/queries';
import type { CourseQuery, ModulesForCourseQuery, LessonsForModuleQuery, CourseProgress, MyCourseProgressQuery, MyCourseProgressQueryVariables } from '@/API';
import { LESSON_TYPE_ICONS } from '@/components/LessonForm';

type PublicCourse = NonNullable<CourseQuery['course']>;
type CourseModule = ModulesForCourseQuery['modulesForCourse'][number];
type ModuleLesson = LessonsForModuleQuery['lessonsForModule'][number];

interface ResumeTarget {
  moduleId: string;
  lessonId: string;
  title: string;
}

function formatMinutes(seconds: number): string {
  if (!seconds) return '';
  return `${Math.round(seconds / 60)} min`;
}

function ModuleRow({
  courseId, mod, index, theme, completedLessonIds, completion,
}: {
  courseId: string;
  mod: CourseModule;
  /** Display position (1-based) — `mod.order` is a sparse backend sort key (1000, 2000, ...), not meant to be shown. */
  index: number;
  theme: ReturnType<typeof getCategoryTheme>;
  /** Undefined for an anonymous visitor or a learner who hasn't started — no badge shown either way. */
  completedLessonIds?: Set<string>;
  /** Eagerly computed (see CourseDetailPage's resume-target effect) so the module-complete checkmark shows on the collapsed row, without waiting for this row's own lazy lesson fetch. */
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
        console.error('[CourseDetailPage] loadLessons failed ->', err);
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

export default function CourseDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const courseId = params.id as string;

  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [resumeTarget, setResumeTarget] = useState<ResumeTarget | null>(null);
  const [moduleCompletion, setModuleCompletion] = useState<Record<string, { done: number; total: number }> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [{ course: fetchedCourse }, { modulesForCourse: fetchedModules }] = await Promise.all([
        GraphQLClient.execute<CourseQuery>(courseQuery, { id: courseId }),
        GraphQLClient.execute<ModulesForCourseQuery>(modulesForCourse, { courseId }),
      ]);
      if (!fetchedCourse) {
        setError('not-found');
      } else {
        setCourse(fetchedCourse);
        setModules([...fetchedModules].sort((a, b) => a.order - b.order));
      }
    } catch (err) {
      console.error('[CourseDetailPage] load failed ->', err);
      setError(err instanceof Error ? err.message : 'Something went wrong loading this course.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Best-effort, separate from the main load — an unauthenticated visitor
  // (browsing is public, unlike this query) just never gets progress, no
  // error shown for that expected case.
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { myCourseProgress: fetched } = await GraphQLClient.execute<MyCourseProgressQuery>(
          myCourseProgressQuery,
          { courseId } satisfies MyCourseProgressQueryVariables
        );
        setProgress(fetched);
      } catch (err) {
        console.error('[CourseDetailPage] progress load failed ->', err);
      }
    })();
  }, [user, courseId]);

  // Only for a learner who has actually started (same gate the progress bar
  // above already uses) — walks every module's lessons in order (same
  // per-module fetches the studio/lesson-viewer already make) to find the
  // first not-yet-completed one, or the last lesson if the course is fully
  // done. Skipped entirely for anonymous visitors and fresh learners so
  // their page load doesn't pay for N extra queries they get no benefit from.
  useEffect(() => {
    if (!progress || progress.completedLessonIds.length === 0 || modules.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const completed = new Set(progress.completedLessonIds);
        const withLessons = await Promise.all(
          modules.map(async (mod) => {
            const { lessonsForModule: lessons } = await GraphQLClient.execute<LessonsForModuleQuery>(
              lessonsForModule,
              { moduleId: mod.moduleId, courseId }
            );
            return { moduleId: mod.moduleId, lessons: [...lessons].sort((a, b) => a.order - b.order) };
          })
        );
        if (cancelled) return;
        let target: ResumeTarget | null = null;
        let foundIncomplete = false;
        const completionMap: Record<string, { done: number; total: number }> = {};
        for (const mod of withLessons) {
          const done = mod.lessons.filter((l) => completed.has(l.lessonId)).length;
          completionMap[mod.moduleId] = { done, total: mod.lessons.length };

          if (foundIncomplete) continue;
          const nextIncomplete = mod.lessons.find((l) => !completed.has(l.lessonId));
          if (nextIncomplete) {
            target = { moduleId: mod.moduleId, lessonId: nextIncomplete.lessonId, title: nextIncomplete.title };
            foundIncomplete = true;
            continue;
          }
          const last = mod.lessons[mod.lessons.length - 1];
          if (last) target = { moduleId: mod.moduleId, lessonId: last.lessonId, title: last.title };
        }
        setResumeTarget(target);
        setModuleCompletion(completionMap);
      } catch (err) {
        console.error('[CourseDetailPage] resume target load failed ->', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [progress, modules, courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-500 mb-3">
            {error === 'not-found' ? "This course doesn't exist, or isn't published." : error || 'Something went wrong.'}
          </p>
          <Link href="/courses" className="text-sm text-indigo-600 font-bold">Browse courses &rarr;</Link>
        </div>
      </main>
    );
  }

  const theme = getCategoryTheme(course.category ?? '');
  const by = instructorDisplayName(course);
  const totalLessons = modules.reduce((sum, m) => sum + m.lessonCount, 0);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className={`relative ${theme.solidBg} text-white overflow-hidden`}>
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-white/10 rotate-45" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-white/10" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link href="/courses" className="text-sm text-white/70 hover:text-white font-medium mb-6 inline-flex items-center gap-1.5 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> All courses
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1">
              {course.category && (
                <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-white/20 text-white px-3 py-1 rounded-md mb-4">
                  {course.category}
                </span>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold leading-[1.05] tracking-tight mb-4">{course.title}</h1>
              {course.description && (
                <p className="text-white/85 leading-relaxed mb-6 text-base sm:text-lg line-clamp-2 sm:line-clamp-none">{course.description}</p>
              )}

              {by && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{by}</p>
                    <p className="text-xs text-white/70">Instructor</p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA card */}
            <div className="lg:w-80 flex-shrink-0 bg-white rounded-2xl overflow-hidden text-ink-900 shadow-2xl shadow-black/20">
              {course.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- CloudFront URLs aren't in next.config's image domains
                <img src={course.thumbnailUrl} alt="" className="w-full h-40 object-cover" />
              )}
              <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.softBg} flex items-center justify-center`}>
                    <Video className={`w-5 h-5 ${theme.solidText}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{modules.length} Module{modules.length === 1 ? '' : 's'}</p>
                    <p className="text-xs text-ink-500">{totalLessons} lesson{totalLessons === 1 ? '' : 's'} total</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.softBg} flex items-center justify-center`}>
                    <Award className={`w-5 h-5 ${theme.solidText}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">TZS {course.priceTzs.toLocaleString()}</p>
                    <p className="text-xs text-ink-500">One-time</p>
                  </div>
                </div>
              </div>

              {/* Only shown once the learner has actually started — a "0%"
                  bar before anyone's begun would just be noise. */}
              {progress && progress.completedLessonIds.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-ink-500 mb-1.5">
                    <span>Your progress</span>
                    <span>{progress.completedLessonIds.length}/{progress.totalLessons}</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${theme.solidBg}`}
                      style={{ width: `${Math.min(100, Math.round((progress.completedLessonIds.length / Math.max(progress.totalLessons, 1)) * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {resumeTarget ? (
                <Link
                  href={`/courses/${course.id}/modules/${resumeTarget.moduleId}/lessons/${resumeTarget.lessonId}`}
                  className={`flex items-center justify-center gap-2 w-full rounded-xl ${theme.solidBg} text-white font-bold py-3.5 ${theme.solidBgHover} transition-colors text-sm shadow-lg`}
                >
                  <Play className="w-4 h-4" /> Resume: {resumeTarget.title}
                </Link>
              ) : (
                <a
                  href="#course-content"
                  className={`flex items-center justify-center gap-2 w-full rounded-xl ${theme.solidBg} text-white font-bold py-3.5 ${theme.solidBgHover} transition-colors text-sm shadow-lg`}
                >
                  <Play className="w-4 h-4" /> View course content
                </a>
              )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course content */}
      <section id="course-content" className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-ink-900">Course content</h2>
            <span className="text-sm text-ink-400 bg-ink-100 px-3 py-1 rounded-full">
              {modules.length} module{modules.length === 1 ? '' : 's'}
            </span>
          </div>

          {modules.length === 0 ? (
            <p className="text-sm text-ink-400">This course doesn&apos;t have any modules yet.</p>
          ) : (
            <div className="space-y-4">
              {modules.map((mod, i) => (
                <ModuleRow
                  key={mod.moduleId}
                  courseId={course.id}
                  mod={mod}
                  index={i + 1}
                  theme={theme}
                  completedLessonIds={progress ? new Set(progress.completedLessonIds) : undefined}
                  completion={moduleCompletion?.[mod.moduleId]}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why this course */}
      <section className="border-t border-ink-100 bg-ink-50 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-8 text-center">Why take this course</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, title: 'Learn fast', desc: 'Bite-sized modules you finish in one sitting' },
              { icon: TrendingUp, title: 'Track progress', desc: 'See exactly how far you have come' },
              { icon: Shield, title: 'Verified content', desc: 'Built and published by a real instructor' },
              { icon: Star, title: 'Expert-led', desc: 'Created by working professionals' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className={`w-12 h-12 rounded-2xl ${theme.softBg} ${theme.solidText} flex items-center justify-center mx-auto mb-3`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-ink-900 text-sm mb-0.5">{item.title}</h3>
                <p className="text-xs text-ink-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-ink-100 py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-8">How each lesson works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Video, title: 'Watch or read', desc: 'Video, text, flashcards, or audio, whatever fits the topic.' },
              { icon: FileText, title: 'Go at your pace', desc: 'No deadlines. Come back to a lesson anytime.' },
              { icon: HelpCircle, title: 'Check yourself', desc: 'Quizzes at the end of a lesson confirm what stuck.' },
            ].map((item) => (
              <div key={item.title} className="relative">
                <div className={`w-11 h-11 rounded-xl ${theme.solidBg} text-white flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-ink-900 mb-1">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`${theme.solidBg} py-12 sm:py-14 relative overflow-hidden`}>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rotate-45" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">{resumeTarget ? 'Keep going' : 'Ready to start?'}</h2>
          <p className="text-white/80 mb-6">
            {resumeTarget ? `Next up: ${resumeTarget.title}` : 'Jump into the course content above.'}
          </p>
          {resumeTarget ? (
            <Link
              href={`/courses/${course.id}/modules/${resumeTarget.moduleId}/lessons/${resumeTarget.lessonId}`}
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold ${theme.solidText} hover:bg-white/90 transition-colors shadow-lg`}
            >
              <Play className="w-4 h-4" /> Resume course
            </Link>
          ) : (
            <a
              href="#course-content"
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold ${theme.solidText} hover:bg-white/90 transition-colors shadow-lg`}
            >
              <Play className="w-4 h-4" /> View course content
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
