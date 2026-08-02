'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { course as courseQuery, modulesForCourse } from '@/graphql/queries';
import { updateCourse } from '@/graphql/mutations';
import { CourseStatus } from '@/API';
import type { CourseQuery, ModulesForCourseQuery, UpdateCourseMutation, UpdateCourseMutationVariables } from '@/API';
import { CreateCourseModal, type EditableCourse } from '@/components/CreateCourseModal';
import StudioModuleList from '@/components/StudioModuleList';
import StudioLessonPane, { type CourseModuleData } from '@/components/StudioLessonPane';

type CourseData = NonNullable<CourseQuery['course']>;

export default function StudioPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const courseId = params.courseId as string;
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [modules, setModules] = useState<CourseModuleData[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, user, router, pathname]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [{ course: fetchedCourse }, { modulesForCourse: fetchedModules }] = await Promise.all([
        GraphQLClient.execute<CourseQuery>(courseQuery, { id: courseId }),
        GraphQLClient.execute<ModulesForCourseQuery>(modulesForCourse, { courseId }),
      ]);
      if (!fetchedCourse) {
        setLoadError('not-found');
      } else {
        const sorted = [...fetchedModules].sort((a, b) => a.order - b.order);
        setCourse(fetchedCourse);
        setModules(sorted);
        setSelectedModuleId((prev) => prev && sorted.some((m) => m.moduleId === prev) ? prev : sorted[0]?.moduleId ?? null);
      }
    } catch (err) {
      console.error('[StudioPage] load failed ->', err);
      setLoadError(err instanceof Error ? err.message : 'Something went wrong loading this course.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  async function togglePublish() {
    if (!course) return;
    const nextStatus = course.status === CourseStatus.PUBLISHED ? CourseStatus.DRAFT : CourseStatus.PUBLISHED;
    setPublishing(true);
    setActionError('');
    try {
      const { updateCourse: updated } = await GraphQLClient.execute<UpdateCourseMutation>(updateCourse, {
        id: course.id,
        input: { status: nextStatus },
      } satisfies UpdateCourseMutationVariables);
      setCourse((prev) => (prev ? { ...prev, status: updated.status } : prev));
      toast.success(nextStatus === CourseStatus.PUBLISHED ? 'Course published.' : 'Course moved to draft.');
    } catch (err) {
      console.error('[StudioPage] togglePublish failed ->', err);
      const message = err instanceof Error ? err.message : 'Could not update publish status.';
      setActionError(message);
      toast.error(message);
    } finally {
      setPublishing(false);
    }
  }

  function handleModuleDeleted(moduleId: string) {
    setModules((prev) => {
      const next = prev.filter((m) => m.moduleId !== moduleId);
      setSelectedModuleId(next[0]?.moduleId ?? null);
      return next;
    });
  }

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
      </div>
    );
  }

  if (loadError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="text-center">
          <p className="text-ink-500 mb-3">
            {loadError === 'not-found' ? "This course doesn't exist, or you don't have access to it." : loadError || 'Something went wrong.'}
          </p>
          <Link href="/dashboard/courses" className="text-sm text-coral-600 font-bold">Back to Courses &rarr;</Link>
        </div>
      </div>
    );
  }

  const editableCourse: EditableCourse = {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    priceTzs: course.priceTzs,
    thumbnailUrl: course.thumbnailUrl,
  };

  const selectedModule = modules.find((m) => m.moduleId === selectedModuleId) ?? null;

  return (
    <div className="lg:h-dvh flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-ink-200 px-5 py-3 flex-shrink-0">
        <Link href="/dashboard/courses" className="text-ink-400 hover:text-ink-700 transition-colors flex-shrink-0" aria-label="Back to Courses">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-ink-900 truncate">{course.title}</h1>
            <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
              course.status === CourseStatus.PUBLISHED ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
            }`}>
              {course.status.toLowerCase()}
            </span>
          </div>
          {actionError && (
            <p className="flex items-center gap-1.5 text-xs text-red-600 mt-0.5">
              <XCircle className="w-3.5 h-3.5" /> {actionError}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowEditModal(true)}
            className="rounded-lg border-2 border-ink-200 px-3.5 py-2 text-xs font-bold text-ink-700 hover:border-coral-200 hover:bg-coral-50 hover:text-coral-700 transition-colors"
          >
            Edit details
          </button>
          <button
            onClick={togglePublish}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-coral-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-coral-700 transition-colors disabled:opacity-60"
          >
            {publishing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {course.status === CourseStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </header>

      <CreateCourseModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        editCourse={editableCourse}
        onSaved={() => {
          setShowEditModal(false);
          void load();
        }}
      />

      {/* Two-pane body — stacked on mobile (module list above lesson pane),
          side by side from lg up. */}
      <div className="flex-1 flex flex-col lg:flex-row lg:min-h-0">
        <StudioModuleList
          courseId={course.id}
          modules={modules}
          selectedModuleId={selectedModuleId}
          onSelect={setSelectedModuleId}
          onModulesChange={setModules}
          onModuleSaved={() => void load()}
        />

        {selectedModule ? (
          <StudioLessonPane
            module={selectedModule}
            onModuleDeleted={() => handleModuleDeleted(selectedModule.moduleId)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <div>
              <p className="text-sm font-semibold text-ink-700 mb-1">No modules yet</p>
              <p className="text-xs text-ink-400">Add your first module from the sidebar to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
