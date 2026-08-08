'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, List, Lock, Loader2, CheckCircle2, PartyPopper, XCircle, Download, ChevronRight } from 'lucide-react';
import LessonMarkdown from '@/components/LessonMarkdown';
import CourseOutline, { type OutlineModule, type OutlineLesson } from '@/components/CourseOutline';
import Modal from '@/components/Modal';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import {
  lesson as lessonQuery, modulesForCourse as modulesForCourseQuery,
  lessonsForModule as lessonsForModuleQuery, myCourseProgress as myCourseProgressQuery,
} from '@/graphql/queries';
import { markLessonComplete } from '@/graphql/mutations';
import { LessonType } from '@/API';
import type {
  LessonQuery, ModulesForCourseQuery, LessonsForModuleQuery, CourseProgress,
  MyCourseProgressQuery, MyCourseProgressQueryVariables, MarkLessonCompleteMutation, MarkLessonCompleteMutationVariables,
} from '@/API';
import { LESSON_TYPE_ICONS, LESSON_TYPE_LABELS, LESSON_TYPE_TINTS } from '@/components/LessonForm';
import VideoPlayer from '@/components/VideoPlayer';
import Quiz from '@/components/Quiz';
import FlashcardViewer from '@/components/FlashcardViewer';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import { toEmbeddableUrl } from '@/lib/embed-url';
import { DocumentIcon, extensionFromUrl, filenameFromUrl } from '@/lib/document-file';

type Lesson = NonNullable<LessonQuery['lesson']>;

// Floor/ceiling for MarkCompleteButton's dwell delay — long enough that
// clicking every lesson in a course back to back isn't instant, short
// enough that a genuinely quick lesson doesn't feel punitive.
const MIN_DWELL_MS = 10_000;
const MAX_DWELL_MS = 60_000;

/**
 * How long MarkCompleteButton stays disabled, scaled to the content: a
 * video/audio's own stored duration, roughly 1s per 20 words for text, a
 * flat floor for everything else (document/embed/animation/flashcards) —
 * there's no length signal for those short of heavier per-type tracking.
 */
function dwellMsFor(lesson: Lesson): number {
  if ((lesson.type === LessonType.VIDEO || lesson.type === LessonType.AUDIO) && lesson.durationSeconds) {
    return Math.min(Math.max(lesson.durationSeconds * 1000, MIN_DWELL_MS), MAX_DWELL_MS);
  }
  if (lesson.type === LessonType.TEXT && lesson.body) {
    const words = lesson.body.trim().split(/\s+/).filter(Boolean).length;
    return Math.min(Math.max((words / 20) * 1000, MIN_DWELL_MS), MAX_DWELL_MS);
  }
  return MIN_DWELL_MS;
}

/** Shared fallback for a lesson type whose content field is missing — same dashed-border language already used for the locked-lesson and "end of course" states, so a blank/incomplete lesson reads as a deliberate empty state, not a broken page. */
function EmptyLessonContent({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink-200 py-16 px-6 text-center">
      <p className="text-sm text-ink-400">{message}</p>
    </div>
  );
}

/** Previous/next lesson card — same shape either direction, just a different label, so a learner can move both ways through a course without hunting for the sidebar. */
function LessonNavCard({ courseId, lesson, label }: { courseId: string; lesson: OutlineLesson; label: string }) {
  const Icon = LESSON_TYPE_ICONS[lesson.type];
  const tint = LESSON_TYPE_TINTS[lesson.type];

  if (!lesson.isFree) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border-2 border-ink-100 p-4 opacity-70">
        <div className="w-8 h-8 rounded-lg bg-ink-100 text-ink-400 flex items-center justify-center flex-shrink-0">
          <Lock className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400 mb-1">{label}</p>
          <p className="font-bold text-ink-700 truncate text-sm">{lesson.title}</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/courses/${courseId}/modules/${lesson.moduleId}/lessons/${lesson.lessonId}`}
      className="flex items-center gap-3 rounded-2xl border-2 border-ink-100 p-4 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tint.bg} ${tint.text}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400 mb-1">{label}</p>
        <p className="font-bold text-ink-900 truncate text-sm group-hover:text-indigo-700 transition-colors">{lesson.title}</p>
      </div>
    </Link>
  );
}

export default function LessonViewerPage() {
  const params = useParams();
  const toast = useToast();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [retakingQuiz, setRetakingQuiz] = useState(false);
  // Full course map — powers both the "Course content" sidebar and the "up
  // next" card, the same idea Khan Academy/Quizlet use: let learners see
  // (and jump to) what's ahead, not just link to the single next lesson.
  const [outline, setOutline] = useState<OutlineModule[] | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [outlineOpen, setOutlineOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { lesson: fetched } = await GraphQLClient.execute<LessonQuery>(lessonQuery, { lessonId, moduleId, courseId });
      if (!fetched) {
        setError('not-found');
      } else {
        setLesson(fetched);
      }
    } catch (err) {
      console.error('[LessonViewerPage] load failed ->', err);
      setError(err instanceof Error ? err.message : 'Something went wrong loading this lesson.');
    } finally {
      setLoading(false);
    }
  }, [lessonId, moduleId, courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  // The route component doesn't remount between two lessons of the same
  // type (e.g. quiz -> quiz via "Up next") — reset per-lesson quiz UI state
  // explicitly instead of leaking the previous lesson's result/retake state.
  useEffect(() => {
    setQuizResult(null);
    setRetakingQuiz(false);
    setOutlineOpen(false);
  }, [lessonId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { modulesForCourse: modules } = await GraphQLClient.execute<ModulesForCourseQuery>(modulesForCourseQuery, { courseId });
        const sortedModules = [...modules].sort((a, b) => a.order - b.order);
        const withLessons = await Promise.all(
          sortedModules.map(async (mod): Promise<OutlineModule> => {
            const { lessonsForModule: lessons } = await GraphQLClient.execute<LessonsForModuleQuery>(lessonsForModuleQuery, {
              moduleId: mod.moduleId,
              courseId,
            });
            return {
              moduleId: mod.moduleId,
              title: mod.title,
              lessons: [...lessons]
                .sort((a, b) => a.order - b.order)
                .map((l) => ({ moduleId: mod.moduleId, lessonId: l.lessonId, title: l.title, type: l.type, isFree: l.isFree })),
            };
          })
        );
        if (!cancelled) setOutline(withLessons);
      } catch (err) {
        console.error('[LessonViewerPage] outline load failed ->', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const loadProgress = useCallback(async () => {
    try {
      const { myCourseProgress: fetched } = await GraphQLClient.execute<MyCourseProgressQuery>(
        myCourseProgressQuery,
        { courseId } satisfies MyCourseProgressQueryVariables
      );
      setProgress(fetched);
    } catch (err) {
      console.error('[LessonViewerPage] progress load failed ->', err);
    }
  }, [courseId]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  async function handleMarkComplete() {
    try {
      const { markLessonComplete: updated } = await GraphQLClient.execute<MarkLessonCompleteMutation>(
        markLessonComplete,
        { lessonId, courseId } satisfies MarkLessonCompleteMutationVariables
      );
      setProgress(updated);
      toast.success('Lesson marked complete.');
    } catch (err) {
      console.error('[LessonViewerPage] markLessonComplete failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not mark this lesson complete.');
    }
  }

  const isLessonComplete = progress?.completedLessonIds.includes(lessonId) ?? false;

  // The next lesson is offered unconditionally at the bottom of every
  // lesson, not gated behind marking this one complete — completion is
  // tracked (see progress above) but never blocks navigation.
  const flatLessons = outline?.flatMap((m) => m.lessons) ?? null;
  const currentIndex = flatLessons?.findIndex((l) => l.lessonId === lessonId) ?? -1;
  const nextLesson: OutlineLesson | 'end' | null =
    flatLessons && currentIndex !== -1 ? (currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : 'end') : null;
  const prevLesson: OutlineLesson | null =
    flatLessons && currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const currentModuleTitle = outline?.find((m) => m.moduleId === moduleId)?.title ?? null;
  const progressPct = progress && progress.totalLessons > 0
    ? Math.min(100, Math.round((progress.completedLessonIds.length / progress.totalLessons) * 100))
    : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
      </main>
    );
  }

  if (error || !lesson) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-500 mb-3">{error === 'not-found' ? 'This lesson could not be found.' : error}</p>
          <Link href={`/courses/${courseId}`} className="text-sm text-indigo-600 font-bold">Back to course &rarr;</Link>
        </div>
      </main>
    );
  }

  const Icon = LESSON_TYPE_ICONS[lesson.type];
  const tint = LESSON_TYPE_TINTS[lesson.type];

  return (
    <main className="min-h-screen bg-white">
      {/* Sticky course-progress bar — sits just below the site's own sticky
          nav (h-14, z-50), so top-14 + a lower z-index instead of stacking
          on top of it. */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
          <Link href={`/courses/${courseId}`} className="flex-shrink-0 text-ink-400 hover:text-indigo-600 transition-colors" aria-label="Back to course">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            {progress ? (
              <>
                <p className="text-[10px] font-bold text-ink-400 mb-1 truncate">
                  {progress.completedLessonIds.length} of {progress.totalLessons} lessons complete
                </p>
                <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
                </div>
              </>
            ) : (
              <p className="text-sm font-semibold text-ink-500 truncate">{currentModuleTitle}</p>
            )}
          </div>
          {outline && outline.length > 0 && (
            <button
              type="button"
              onClick={() => setOutlineOpen(true)}
              className="lg:hidden flex-shrink-0 flex items-center gap-1.5 rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs font-bold text-ink-600 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
            >
              <List className="w-3.5 h-3.5" /> Contents
            </button>
          )}
        </div>
      </div>

      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${nextLesson && nextLesson !== 'end' && nextLesson.isFree ? 'pb-24 lg:pb-12' : ''}`}>
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 lg:items-start">
          <div className="max-w-3xl min-w-0">
            {currentModuleTitle && (
              <p className="text-xs font-bold text-ink-400 mb-2 truncate">{currentModuleTitle}</p>
            )}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tint.bg} ${tint.text}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide text-ink-400">{LESSON_TYPE_LABELS[lesson.type]}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900 mb-3">{lesson.title}</h1>
            <div className={`w-10 h-0.5 rounded-full bg-current ${tint.text} mb-8`} />

            {!lesson.isFree ? (
              <div className="flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-ink-200 py-16 px-6">
                <Lock className="w-8 h-8 text-ink-300 mb-3" />
                <p className="text-sm font-semibold text-ink-700 mb-1">This lesson isn&apos;t free to preview</p>
                <p className="text-xs text-ink-400 max-w-xs">Purchasing individual courses isn&apos;t available yet.</p>
              </div>
            ) : (
              <>
                {lesson.type === LessonType.VIDEO && (
                  lesson.videoUrl
                    ? <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />
                    : <EmptyLessonContent message="This video hasn't been added yet." />
                )}

                {lesson.type === LessonType.AUDIO && (
                  lesson.audioUrl
                    ? <audio controls src={lesson.audioUrl} className="w-full" />
                    : <EmptyLessonContent message="This audio hasn't been added yet." />
                )}

                {lesson.type === LessonType.EMBED && (
                  lesson.embedUrl
                    ? (
                      <iframe
                        src={toEmbeddableUrl(lesson.embedUrl)}
                        className="w-full aspect-video rounded-2xl border border-ink-200"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                        title={lesson.title}
                      />
                    )
                    : <EmptyLessonContent message="This embed hasn't been added yet." />
                )}

                {lesson.type === LessonType.ANIMATION && (
                  <EmptyLessonContent message="Animation playback isn't available in the viewer yet — check back soon." />
                )}

                {lesson.type === LessonType.TEXT && (
                  lesson.body
                    ? (
                      <div className="rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-900/[0.03] p-6 sm:p-9">
                        <LessonMarkdown content={lesson.body} />
                      </div>
                    )
                    : <EmptyLessonContent message="This lesson doesn't have any text yet." />
                )}

                {lesson.type === LessonType.FLASHCARDS && (
                  <FlashcardViewer cards={lesson.cards ?? []} />
                )}

                {lesson.type === LessonType.DOCUMENT && (() => {
                  const documentUrl = lesson.document?.url;
                  if (!documentUrl) {
                    return (
                      <div className="rounded-2xl border-2 border-dashed border-ink-200 py-16 px-6 text-center">
                        <p className="text-sm text-ink-400">This document couldn&apos;t be loaded.</p>
                      </div>
                    );
                  }
                  const extension = extensionFromUrl(documentUrl);
                  return extension === 'pdf' ? (
                    <div className="space-y-3">
                      <iframe src={documentUrl} title={lesson.title} className="w-full h-[75vh] rounded-2xl border border-ink-200" />
                      <a
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  ) : (
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-2xl border-2 border-ink-100 p-6 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-ink-50 flex items-center justify-center flex-shrink-0">
                        <DocumentIcon extension={extension} className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-ink-900 truncate group-hover:text-indigo-700 transition-colors">{filenameFromUrl(documentUrl)}</p>
                        <p className="text-xs text-ink-400 uppercase tracking-wide mt-0.5">{extension} document</p>
                      </div>
                      <Download className="w-5 h-5 text-ink-300 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                    </a>
                  );
                })()}

                {lesson.type === LessonType.QUIZ && (
                  <>
                    {quizResult ? (
                      <div className="rounded-2xl border-2 border-ink-100 p-8 text-center">
                        {quizResult.score / quizResult.total >= 0.7 ? (
                          <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
                        ) : (
                          <XCircle className="w-10 h-10 text-ink-300 mx-auto mb-3" />
                        )}
                        <p className="text-lg font-bold text-ink-900">You scored {quizResult.score}/{quizResult.total}</p>
                        <button
                          onClick={() => setQuizResult(null)}
                          className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          Retake
                        </button>
                      </div>
                    ) : isLessonComplete && !retakingQuiz ? (
                      <div className="rounded-2xl border-2 border-ink-100 p-8 text-center">
                        <CheckCircle2 className="w-10 h-10 text-brand-600 mx-auto mb-3" />
                        <p className="text-sm font-bold text-ink-900">You&apos;ve already completed this quiz</p>
                        <button
                          onClick={() => setRetakingQuiz(true)}
                          className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          Retake
                        </button>
                      </div>
                    ) : (
                      <Quiz
                        questions={lesson.questions ?? []}
                        onComplete={(score, total) => {
                          setQuizResult({ score, total });
                          void handleMarkComplete();
                        }}
                      />
                    )}
                  </>
                )}

                {lesson.type !== LessonType.QUIZ && (
                  <MarkCompleteButton
                    key={lesson.lessonId}
                    dwellMs={dwellMsFor(lesson)}
                    completed={isLessonComplete}
                    onComplete={handleMarkComplete}
                  />
                )}
              </>
            )}

            {(prevLesson || (nextLesson && nextLesson !== 'end')) && (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prevLesson && <LessonNavCard courseId={courseId} lesson={prevLesson} label="Previous" />}
                {nextLesson && nextLesson !== 'end' && (
                  <div className={!prevLesson ? 'sm:col-start-2' : ''}>
                    <LessonNavCard courseId={courseId} lesson={nextLesson} label="Up next" />
                  </div>
                )}
              </div>
            )}

            {nextLesson === 'end' && (
              <div className="mt-10 flex flex-col items-center text-center rounded-2xl border-2 border-dashed border-ink-200 py-10 px-6">
                <PartyPopper className="w-8 h-8 text-indigo-600 mb-3" />
                <p className="font-bold text-ink-900 mb-1">You&apos;ve reached the end of the course</p>
                <p className="text-xs text-ink-400">Nice work getting through every lesson.</p>
                <Link href={`/courses/${courseId}`} className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Back to course &rarr;
                </Link>
              </div>
            )}
          </div>

          {outline && outline.length > 0 && (
            <aside className="hidden lg:block lg:sticky lg:top-20">
              <CourseOutline
                courseId={courseId}
                outline={outline}
                currentModuleId={moduleId}
                currentLessonId={lessonId}
                completedLessonIds={progress ? new Set(progress.completedLessonIds) : undefined}
              />
            </aside>
          )}
        </div>
      </div>

      {/* Mobile course-content drawer — the sidebar above is desktop-only
          (hidden below lg), so this is the only way a mobile learner sees
          the outline without scrolling to the very bottom of the lesson. */}
      {outline && outline.length > 0 && (
        <Modal open={outlineOpen} onClose={() => setOutlineOpen(false)} title="Course content">
          <div className="p-4">
            <CourseOutline
              courseId={courseId}
              outline={outline}
              currentModuleId={moduleId}
              currentLessonId={lessonId}
              completedLessonIds={progress ? new Set(progress.completedLessonIds) : undefined}
            />
          </div>
        </Modal>
      )}

      {/* Mobile sticky "up next" bar — the primary next-step action stays
          reachable without scrolling past a long video/text lesson to the
          nav cards at the bottom. Desktop already has room for those cards
          in view without this. Unconditional, same as the top-of-page "Up
          next" card — never blocks navigation on completing the current one. */}
      {nextLesson && nextLesson !== 'end' && nextLesson.isFree && (
        <Link
          href={`/courses/${courseId}/modules/${nextLesson.moduleId}/lessons/${nextLesson.lessonId}`}
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center gap-3 bg-white/95 backdrop-blur border-t border-ink-200 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
        >
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-400">Up next</p>
            <p className="text-sm font-bold text-ink-900 truncate">{nextLesson.title}</p>
          </div>
          <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      )}
    </main>
  );
}
