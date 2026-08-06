'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GraphQLClient } from '@/lib/graphql-client';
import { lesson as lessonQuery } from '@/graphql/queries';
import type { LessonQuery, LessonQueryVariables } from '@/API';
import LessonForm, { type EditableLesson, LESSON_TYPE_ICONS, LESSON_TYPE_LABELS, LESSON_TYPE_TINTS } from '@/components/LessonForm';

// `lessonId === 'new'` is the create-mode sentinel — one route handles both
// so the header/auth-guard/loading boilerplate isn't duplicated across two
// near-identical files. LessonForm already tells create from edit apart via
// whether `editLesson` is passed.
const NEW_LESSON_SENTINEL = 'new';

export default function LessonEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;
  const isNew = lessonId === NEW_LESSON_SENTINEL;
  const { user, loading: authLoading } = useAuth();

  const [editLesson, setEditLesson] = useState<EditableLesson | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, user, router, pathname]);

  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    setLoadError('');
    try {
      const { lesson: fetched } = await GraphQLClient.execute<LessonQuery>(
        lessonQuery,
        { lessonId, moduleId, courseId } satisfies LessonQueryVariables
      );
      if (!fetched) {
        setLoadError('not-found');
      } else {
        setEditLesson(fetched);
      }
    } catch (err) {
      console.error('[LessonEditorPage] load failed ->', err);
      setLoadError(err instanceof Error ? err.message : 'Something went wrong loading this lesson.');
    } finally {
      setLoading(false);
    }
  }, [isNew, lessonId, moduleId, courseId]);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  function backToStudio() {
    router.push(`/studio/${courseId}`);
  }

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
      </div>
    );
  }

  if (!isNew && (loadError || !editLesson)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-ink-500 mb-3">
            {loadError === 'not-found' ? "This lesson doesn't exist, or you don't have access to it." : loadError || 'Something went wrong.'}
          </p>
          <Link href={`/studio/${courseId}`} className="text-sm text-coral-600 font-bold">Back to course &rarr;</Link>
        </div>
      </div>
    );
  }

  const editTint = editLesson ? LESSON_TYPE_TINTS[editLesson.type] : null;
  const EditIcon = editLesson ? LESSON_TYPE_ICONS[editLesson.type] : null;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Soft decorative shapes — same "geometric blob" language the course
          landing hero uses, toned down to a light wash so it reads as
          texture behind the header/type-picker instead of competing with
          the form once real content is being typed. */}
      <div className="pointer-events-none absolute -right-24 -top-28 w-[26rem] h-[26rem] rounded-[3.5rem] bg-coral-50 rotate-12 -z-10" />
      <div className="pointer-events-none absolute -left-32 top-40 w-72 h-72 rounded-full bg-brand-50/70 -z-10" />

      <header className="flex items-center gap-4 border-b border-ink-100 px-5 py-3.5 bg-white/80 backdrop-blur-sm">
        <button
          type="button"
          onClick={backToStudio}
          className="text-ink-400 hover:text-ink-700 transition-colors flex-shrink-0"
          aria-label="Back to course"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {editTint && EditIcon && (
          <span className={`hidden sm:flex w-8 h-8 rounded-lg items-center justify-center flex-shrink-0 ${editTint.bg} ${editTint.text}`}>
            <EditIcon className="w-4 h-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-base font-semibold text-ink-900 truncate">
            {isNew ? 'Add a lesson' : editLesson?.title || 'Edit lesson'}
          </h1>
          {editLesson && (
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">{LESSON_TYPE_LABELS[editLesson.type]}</p>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-8 sm:py-12 px-1 relative">
        <LessonForm
          moduleId={moduleId}
          courseId={courseId}
          editLesson={editLesson ?? undefined}
          onSaved={backToStudio}
          onCancel={backToStudio}
        />
      </div>
    </div>
  );
}
