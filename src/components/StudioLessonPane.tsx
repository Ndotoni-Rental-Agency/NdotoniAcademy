'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GripVertical, Pencil, Plus, Trash2, X, Loader2, XCircle } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { lessonsForModule } from '@/graphql/queries';
import {
  removeLessonFromModule, deleteLesson as deleteLessonMutation, reorderModuleLessons,
  removeModuleFromCourse, deleteModule as deleteModuleMutation,
} from '@/graphql/mutations';
import type {
  LessonsForModuleQuery, RemoveLessonFromModuleMutation, RemoveLessonFromModuleMutationVariables,
  DeleteLessonMutation, DeleteLessonMutationVariables, ReorderModuleLessonsMutation,
  ReorderModuleLessonsMutationVariables,
  RemoveModuleFromCourseMutation, RemoveModuleFromCourseMutationVariables,
  DeleteModuleMutation, DeleteModuleMutationVariables,
} from '@/API';
import { LESSON_TYPE_ICONS, LESSON_TYPE_TINTS } from './LessonForm';

export interface CourseModuleData {
  moduleId: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  isFree: boolean;
  lessonCount: number;
  totalDurationSeconds: number;
}

interface LessonRowData {
  lessonId: string;
  moduleId: string;
  title: string;
  type: import('@/API').LessonType;
  order: number;
  isFree: boolean;
  durationSeconds?: number | null;
}

interface StudioLessonPaneProps {
  module: CourseModuleData;
  onModuleDeleted: () => void;
}

function formatDuration(seconds?: number | null): string | null {
  if (!seconds) return null;
  return `${Math.round(seconds / 60)} min`;
}

function SortableLessonRow({
  lesson, busy, onDelete, onEdit,
}: {
  lesson: LessonRowData;
  busy: boolean;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.lessonId });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const Icon = LESSON_TYPE_ICONS[lesson.type];
  const tint = LESSON_TYPE_TINTS[lesson.type];
  const duration = formatDuration(lesson.durationSeconds);

  return (
    <div ref={setNodeRef} style={style} className="group flex items-center gap-3 rounded-lg border border-ink-100 px-3 py-2.5 hover:border-ink-200 transition-colors">
      <button
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        className="text-ink-300 hover:text-ink-500 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className={`w-8 h-8 rounded-lg ${tint.bg} ${tint.text} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <button type="button" onClick={onEdit} className="flex-1 min-w-0 text-left">
        <span className="text-sm font-semibold text-ink-900 truncate block hover:text-coral-700 transition-colors">{lesson.title}</span>
      </button>
      {duration && <span className="text-xs text-ink-400 flex-shrink-0">{duration}</span>}
      {lesson.isFree && (
        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 bg-brand-100 text-brand-700">
          Free preview
        </span>
      )}
      <button
        type="button"
        onClick={onEdit}
        className="text-ink-300 hover:text-coral-600 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 p-0.5"
        aria-label="Edit lesson"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} disabled={busy} className="text-ink-300 hover:text-red-500 disabled:opacity-30 transition-colors p-0.5" aria-label="Delete lesson">
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default function StudioLessonPane({ module: mod, onModuleDeleted }: StudioLessonPaneProps) {
  const router = useRouter();
  const toast = useToast();
  const [lessons, setLessons] = useState<LessonRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyLessonId, setBusyLessonId] = useState<string | null>(null);
  const [moduleBusy, setModuleBusy] = useState(false);
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadLessons = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { lessonsForModule: fetched } = await GraphQLClient.execute<LessonsForModuleQuery>(lessonsForModule, {
        moduleId: mod.moduleId,
        courseId: mod.courseId,
      });
      setLessons([...fetched].sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('[StudioLessonPane] loadLessons failed ->', err);
      setError('Could not load lessons.');
    } finally {
      setLoading(false);
    }
  }, [mod.moduleId, mod.courseId]);

  useEffect(() => {
    void loadLessons();
  }, [loadLessons]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessons.findIndex((l) => l.lessonId === active.id);
    const newIndex = lessons.findIndex((l) => l.lessonId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(lessons, oldIndex, newIndex);
    setLessons(reordered);
    setError('');
    try {
      await GraphQLClient.execute<ReorderModuleLessonsMutation>(reorderModuleLessons, {
        moduleId: mod.moduleId,
        courseId: mod.courseId,
        lessonIds: reordered.map((l) => l.lessonId),
      } satisfies ReorderModuleLessonsMutationVariables);
      // Reordering can change which lesson is "first" in the module, which
      // can change which one is the free preview — refetch rather than
      // patch isFree locally.
      void loadLessons();
    } catch (err) {
      console.error('[StudioLessonPane] reorder failed ->', err);
      setError('Could not save the new order.');
      toast.error('Could not save the new order.');
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    setBusyLessonId(lessonId);
    setError('');
    try {
      await GraphQLClient.execute<RemoveLessonFromModuleMutation>(removeLessonFromModule, {
        moduleId: mod.moduleId,
        lessonId,
      } satisfies RemoveLessonFromModuleMutationVariables);
      await GraphQLClient.execute<DeleteLessonMutation>(deleteLessonMutation, {
        id: lessonId,
      } satisfies DeleteLessonMutationVariables);
      setLessons((prev) => prev.filter((l) => l.lessonId !== lessonId));
      toast.success('Lesson deleted.');
    } catch (err) {
      console.error('[StudioLessonPane] deleteLesson failed ->', err);
      setError('Could not delete this lesson.');
      toast.error('Could not delete this lesson.');
    } finally {
      setBusyLessonId(null);
    }
  }

  async function handleDeleteModule() {
    setModuleBusy(true);
    setError('');
    try {
      await GraphQLClient.execute<RemoveModuleFromCourseMutation>(removeModuleFromCourse, {
        courseId: mod.courseId,
        moduleId: mod.moduleId,
      } satisfies RemoveModuleFromCourseMutationVariables);
      await GraphQLClient.execute<DeleteModuleMutation>(deleteModuleMutation, {
        id: mod.moduleId,
      } satisfies DeleteModuleMutationVariables);
      toast.success('Module deleted.');
      onModuleDeleted();
    } catch (err) {
      console.error('[StudioLessonPane] deleteModule failed ->', err);
      setError('Could not delete this module.');
      toast.error('Could not delete this module.');
      setModuleBusy(false);
    }
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="text-xl font-extrabold text-ink-900 truncate min-w-0">{mod.title}</h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleDeleteModule}
            disabled={moduleBusy}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-60"
          >
            {moduleBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete module
          </button>
        </div>
      </div>
      <p className="text-sm text-ink-500 mb-6 flex items-center gap-3">
        <span>
          {mod.lessonCount} lesson{mod.lessonCount === 1 ? '' : 's'}
          {mod.totalDurationSeconds > 0 && ` · ${formatDuration(mod.totalDurationSeconds)}`}
        </span>
        {lessons.length > 1 && (
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <GripVertical className="w-3.5 h-3.5" /> Drag to reorder
          </span>
        )}
      </p>

      {error && (
        <p className="flex items-start gap-1.5 text-sm text-red-600 mb-4">
          <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {lessons.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-200 px-4 py-6 text-center">
              <p className="text-sm font-semibold text-ink-700">No lessons in this module yet</p>
              <p className="text-xs text-ink-400 mt-1">Add video, text, flashcards, a quiz, or a document below.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={lessons.map((l) => l.lessonId)} strategy={verticalListSortingStrategy}>
                {lessons.map((lesson) => (
                  <SortableLessonRow
                    key={lesson.lessonId}
                    lesson={lesson}
                    busy={busyLessonId === lesson.lessonId}
                    onDelete={() => handleDeleteLesson(lesson.lessonId)}
                    onEdit={() => router.push(`/studio/${mod.courseId}/modules/${mod.moduleId}/lessons/${lesson.lessonId}`)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          <button
            type="button"
            onClick={() => router.push(`/studio/${mod.courseId}/modules/${mod.moduleId}/lessons/new`)}
            className="w-full rounded-xl border border-dashed border-ink-200 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-400 hover:border-coral-300 hover:text-coral-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add a lesson
          </button>
        </div>
      )}
    </div>
  );
}
