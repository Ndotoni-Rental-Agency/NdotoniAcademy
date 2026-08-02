'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus, XCircle } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { course as courseQuery, modulesForCourse } from '@/graphql/queries';
import {
  updateCourse, removeModuleFromCourse,
  deleteModule as deleteModuleMutation, reorderCourseModules, setCourseModuleFree,
} from '@/graphql/mutations';
import { CourseStatus } from '@/API';
import type {
  CourseQuery, ModulesForCourseQuery, UpdateCourseMutation, UpdateCourseMutationVariables,
  RemoveModuleFromCourseMutation, RemoveModuleFromCourseMutationVariables,
  DeleteModuleMutation, DeleteModuleMutationVariables, ReorderCourseModulesMutation,
  ReorderCourseModulesMutationVariables, SetCourseModuleFreeMutation, SetCourseModuleFreeMutationVariables,
} from '@/API';
import { CreateCourseModal, type EditableCourse } from '@/components/CreateCourseModal';
import CourseModuleRow, { type CourseModuleData } from '@/components/CourseModuleRow';
import ModuleForm from '@/components/ModuleForm';

type CourseData = NonNullable<CourseQuery['course']>;

export default function CourseBuilderPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [modules, setModules] = useState<CourseModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);
  const [busyModuleId, setBusyModuleId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [publishing, setPublishing] = useState(false);

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
        setCourse(fetchedCourse);
        setModules([...fetchedModules].sort((a, b) => a.order - b.order));
      }
    } catch (err) {
      console.error('[CourseBuilderPage] load failed ->', err);
      setLoadError(err instanceof Error ? err.message : 'Something went wrong loading this course.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function moveModule(moduleId: string, direction: -1 | 1) {
    const index = modules.findIndex((m) => m.moduleId === moduleId);
    const targetIndex = index + direction;
    if (index === -1 || targetIndex < 0 || targetIndex >= modules.length) return;
    const reordered = [...modules];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setModules(reordered);
    setBusyModuleId(moduleId);
    setActionError('');
    try {
      await GraphQLClient.execute<ReorderCourseModulesMutation>(reorderCourseModules, {
        courseId,
        moduleIds: reordered.map((m) => m.moduleId),
      } satisfies ReorderCourseModulesMutationVariables);
    } catch (err) {
      console.error('[CourseBuilderPage] moveModule failed ->', err);
      setActionError(err instanceof Error ? err.message : 'Could not reorder modules.');
      void load();
    } finally {
      setBusyModuleId(null);
    }
  }

  async function toggleModuleFree(moduleId: string) {
    const current = modules.find((m) => m.moduleId === moduleId);
    if (!current) return;
    setBusyModuleId(moduleId);
    setActionError('');
    try {
      await GraphQLClient.execute<SetCourseModuleFreeMutation>(setCourseModuleFree, {
        courseId,
        moduleId,
        isFree: !current.isFree,
      } satisfies SetCourseModuleFreeMutationVariables);
      setModules((prev) => prev.map((m) => (m.moduleId === moduleId ? { ...m, isFree: !m.isFree } : m)));
    } catch (err) {
      console.error('[CourseBuilderPage] toggleModuleFree failed ->', err);
      setActionError(err instanceof Error ? err.message : 'Could not update this module.');
    } finally {
      setBusyModuleId(null);
    }
  }

  async function handleDeleteModule(moduleId: string) {
    setBusyModuleId(moduleId);
    setActionError('');
    try {
      await GraphQLClient.execute<RemoveModuleFromCourseMutation>(removeModuleFromCourse, {
        courseId,
        moduleId,
      } satisfies RemoveModuleFromCourseMutationVariables);
      await GraphQLClient.execute<DeleteModuleMutation>(deleteModuleMutation, {
        id: moduleId,
      } satisfies DeleteModuleMutationVariables);
      setModules((prev) => prev.filter((m) => m.moduleId !== moduleId));
    } catch (err) {
      console.error('[CourseBuilderPage] deleteModule failed ->', err);
      setActionError(err instanceof Error ? err.message : 'Could not delete this module.');
    } finally {
      setBusyModuleId(null);
    }
  }

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
    } catch (err) {
      console.error('[CourseBuilderPage] togglePublish failed ->', err);
      setActionError(err instanceof Error ? err.message : 'Could not update publish status.');
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
      </div>
    );
  }

  if (loadError || !course) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl">
        <Link href="/dashboard/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-coral-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
        <p className="text-sm text-ink-400 bg-white rounded-2xl border-2 border-ink-100 px-4 py-10 text-center">
          {loadError === 'not-found'
            ? "This course doesn't exist, or you don't have access to it."
            : loadError || 'Something went wrong.'}
        </p>
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

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link href="/dashboard/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-coral-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2 ${
            course.status === CourseStatus.PUBLISHED ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
          }`}>
            {course.status.toLowerCase()}
          </span>
          <h1 className="text-2xl font-extrabold text-ink-900">{course.title}</h1>
          {course.description && <p className="text-sm text-ink-500 mt-1">{course.description}</p>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setShowEditModal(true)}
            className="rounded-xl border-2 border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 hover:border-coral-200 hover:bg-coral-50 hover:text-coral-700 transition-colors"
          >
            Edit details
          </button>
          <button
            onClick={togglePublish}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 rounded-xl bg-coral-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-coral-700 transition-colors disabled:opacity-60"
          >
            {publishing && <Loader2 className="w-4 h-4 animate-spin" />}
            {course.status === CourseStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      <CreateCourseModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        editCourse={editableCourse}
        onSaved={() => {
          setShowEditModal(false);
          void load();
        }}
      />

      {actionError && (
        <p className="flex items-start gap-1.5 text-sm text-red-600 mb-4">
          <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {actionError}
        </p>
      )}

      <div className="space-y-5">
        {modules.map((mod, i) => (
          <CourseModuleRow
            key={mod.moduleId}
            module={mod}
            isFirst={i === 0}
            isLast={i === modules.length - 1}
            busy={busyModuleId === mod.moduleId}
            onMove={(direction) => moveModule(mod.moduleId, direction)}
            onToggleFree={() => toggleModuleFree(mod.moduleId)}
            onDelete={() => handleDeleteModule(mod.moduleId)}
          />
        ))}
      </div>

      <div className="mt-5">
        {showAddModule ? (
          <ModuleForm
            courseId={courseId}
            onCreated={() => {
              setShowAddModule(false);
              void load();
            }}
            onCancel={() => setShowAddModule(false)}
          />
        ) : (
          <button
            onClick={() => setShowAddModule(true)}
            className="w-full rounded-2xl border-2 border-dashed border-ink-200 py-4 flex items-center justify-center gap-1.5 text-sm font-bold text-ink-400 hover:border-coral-300 hover:text-coral-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add a module
          </button>
        )}
      </div>
    </div>
  );
}
