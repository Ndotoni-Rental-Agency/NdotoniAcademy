'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Lock, Loader2, CheckCircle2, PartyPopper, XCircle, Download } from 'lucide-react';
import LessonMarkdown from '@/components/LessonMarkdown';
import CourseOutline, { type OutlineModule, type OutlineLesson } from '@/components/CourseOutline';
import { GraphQLClient } from '@/lib/graphql-client';
import { lesson as lessonQuery, modulesForCourse as modulesForCourseQuery, lessonsForModule as lessonsForModuleQuery } from '@/graphql/queries';
import { LessonType } from '@/API';
import type { LessonQuery, ModulesForCourseQuery, LessonsForModuleQuery } from '@/API';
import { LESSON_TYPE_ICONS, LESSON_TYPE_LABELS } from '@/components/LessonForm';
import VideoPlayer from '@/components/VideoPlayer';
import Quiz from '@/components/Quiz';
import FlashcardViewer from '@/components/FlashcardViewer';
import { toEmbeddableUrl } from '@/lib/embed-url';
import { DocumentIcon, extensionFromUrl, filenameFromUrl } from '@/lib/document-file';

type Lesson = NonNullable<LessonQuery['lesson']>;

/** Shared fallback for a lesson type whose content field is missing — same dashed-border language already used for the locked-lesson and "end of course" states, so a blank/incomplete lesson reads as a deliberate empty state, not a broken page. */
function EmptyLessonContent({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink-200 py-16 px-6 text-center">
      <p className="text-sm text-ink-400">{message}</p>
    </div>
  );
}

export default function LessonViewerPage() {
  const params = useParams();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  // Full course map — powers both the "Course content" sidebar and the "up
  // next" card, the same idea Khan Academy/Quizlet use: let learners see
  // (and jump to) what's ahead, not just link to the single next lesson.
  const [outline, setOutline] = useState<OutlineModule[] | null>(null);

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

  // No lesson-completion tracking exists in this app yet (see Quiz's own
  // "This score isn't saved anywhere yet") — the next lesson is offered
  // unconditionally at the bottom of every lesson, not gated behind marking
  // this one "done".
  const flatLessons = outline?.flatMap((m) => m.lessons) ?? null;
  const currentIndex = flatLessons?.findIndex((l) => l.lessonId === lessonId) ?? -1;
  const nextLesson: OutlineLesson | 'end' | null =
    flatLessons && currentIndex !== -1 ? (currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : 'end') : null;

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
  const NextIcon = nextLesson && nextLesson !== 'end' ? LESSON_TYPE_ICONS[nextLesson.type] : null;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link href={`/courses/${courseId}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-indigo-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to course
        </Link>

        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 lg:items-start">
          <div className="max-w-3xl min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide text-ink-400">{LESSON_TYPE_LABELS[lesson.type]}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-8">{lesson.title}</h1>

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
                    ? <LessonMarkdown content={lesson.body} />
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
                        <p className="text-xs text-ink-400 mt-1">This score isn&apos;t saved anywhere yet.</p>
                        <button
                          onClick={() => setQuizResult(null)}
                          className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          Retake
                        </button>
                      </div>
                    ) : (
                      <Quiz
                        questions={lesson.questions ?? []}
                        onComplete={(score, total) => setQuizResult({ score, total })}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {nextLesson && nextLesson !== 'end' && (
              nextLesson.isFree ? (
                <Link
                  href={`/courses/${courseId}/modules/${nextLesson.moduleId}/lessons/${nextLesson.lessonId}`}
                  className="mt-10 flex items-center gap-4 rounded-2xl border-2 border-ink-100 p-5 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400 mb-1.5">Up next</p>
                    <div className="flex items-center gap-2">
                      {NextIcon && <NextIcon className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                      <p className="font-bold text-ink-900 truncate group-hover:text-indigo-700 transition-colors">{nextLesson.title}</p>
                    </div>
                    <p className="text-xs text-ink-400 mt-0.5">{LESSON_TYPE_LABELS[nextLesson.type]}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-ink-300 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                </Link>
              ) : (
                <div className="mt-10 flex items-center gap-4 rounded-2xl border-2 border-ink-100 p-5 opacity-70">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400 mb-1.5">Up next</p>
                    <div className="flex items-center gap-2">
                      {NextIcon && <NextIcon className="w-4 h-4 text-ink-400 flex-shrink-0" />}
                      <p className="font-bold text-ink-700 truncate">{nextLesson.title}</p>
                    </div>
                    <p className="text-xs text-ink-400 mt-0.5">Not free to preview</p>
                  </div>
                  <Lock className="w-5 h-5 text-ink-300 flex-shrink-0" />
                </div>
              )
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
            <aside className="mt-10 lg:mt-0 lg:sticky lg:top-8">
              <CourseOutline courseId={courseId} outline={outline} currentModuleId={moduleId} currentLessonId={lessonId} />
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
