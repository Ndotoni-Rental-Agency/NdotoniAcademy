'use client';

import { useCallback, useEffect, useState } from 'react';
import { GripVertical, Pencil, Plus, X, Loader2, XCircle } from 'lucide-react';
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
import { lessonsForModule } from '@/graphql/queries';
import {
  removeLessonFromModule, deleteLesson as deleteLessonMutation, reorderModuleLessons,
  setModuleLessonFree, setCourseModuleFree, removeModuleFromCourse, deleteModule as deleteModuleMutation,
} from '@/graphql/mutations';
import type {
  LessonsForModuleQuery, RemoveLessonFromModuleMutation, RemoveLessonFromModuleMutationVariables,
  DeleteLessonMutation, DeleteLessonMutationVariables, ReorderModuleLessonsMutation,
  ReorderModuleLessonsMutationVariables, SetModuleLessonFreeMutation, SetModuleLessonFreeMutationVariables,
  SetCourseModuleFreeMutation, SetCourseModuleFreeMutationVariables,
  RemoveModuleFromCourseMutation, RemoveModuleFromCourseMutationVariables,
  DeleteModuleMutation, DeleteModuleMutationVariables,
} from '@/API';
import { LESSON_TYPE_ICONS } from './LessonForm';
import LessonModal from './LessonModal';

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
  onModuleUpdated: (patch: Partial<CourseModuleData>) => void;
  onModuleDeleted: () => void;
}

function formatDuration(seconds?: number | null): string | null {
  if (!seconds) return null;
  return `${Math.round(seconds / 60)} min`;
}

function SortableLessonRow({
  lesson, busy, onToggleFree, onDelete, onEdit,
}: {
  lesson: LessonRowData;
  busy: boolean;
  onToggleFree: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.lessonId });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const Icon = LESSON_TYPE_ICONS[lesson.type];
  const duration = formatDuration(lesson.durationSeconds);

  return (
    <div ref={setNodeRef} style={style} className="group flex items-center gap-3 rounded-lg border border-ink-100 px-3 py-2.5">
      <button
        {...attributes}
        {...listeners}
        className="text-ink-300 hover:text-ink-500 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="w-8 h-8 rounded-lg bg-coral-50 text-coral-700 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <button type="button" onClick={onEdit} className="flex-1 min-w-0 text-left">
        <span className="text-sm font-semibold text-ink-900 truncate block hover:text-coral-700 transition-colors">{lesson.title}</span>
      </button>
      {duration && <span className="text-xs text-ink-400 flex-shrink-0">{duration}</span>}
      <button
        type="button"
        onClick={onToggleFree}
        disabled={busy}
        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 transition-colors disabled:opacity-60 ${
          lesson.isFree ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
        }`}
      >
        {lesson.isFree ? 'Free' : 'Paid'}
      </button>
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

export default function StudioLessonPane({ module: mod, onModuleUpdated, onModuleDeleted }: StudioLessonPaneProps) {
  const [lessons, setLessons] = useState<LessonRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
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
      const { lessonsForModule: fetched } = await GraphQLClient.execute<LessonsForModuleQuery>(lessonsForModule, { moduleId: mod.moduleId });
      setLessons([...fetched].sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('[StudioLessonPane] loadLessons failed ->', err);
      setError('Could not load lessons.');
    } finally {
      setLoading(false);
    }
  }, [mod.moduleId]);

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
        lessonIds: reordered.map((l) => l.lessonId),
      } satisfies ReorderModuleLessonsMutationVariables);
    } catch (err) {
      console.error('[StudioLessonPane] reorder failed ->', err);
      setError('Could not save the new order.');
    }
  }

  async function toggleLessonFree(lessonId: string) {
    const current = lessons.find((l) => l.lessonId === lessonId);
    if (!current) return;
    setBusyLessonId(lessonId);
    setError('');
    try {
      await GraphQLClient.execute<SetModuleLessonFreeMutation>(setModuleLessonFree, {
        moduleId: mod.moduleId,
        lessonId,
        isFree: !current.isFree,
      } satisfies SetModuleLessonFreeMutationVariables);
      setLessons((prev) => prev.map((l) => (l.lessonId === lessonId ? { ...l, isFree: !l.isFree } : l)));
    } catch (err) {
      console.error('[StudioLessonPane] toggleLessonFree failed ->', err);
      setError('Could not update this lesson.');
    } finally {
      setBusyLessonId(null);
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
    } catch (err) {
      console.error('[StudioLessonPane] deleteLesson failed ->', err);
      setError('Could not delete this lesson.');
    } finally {
      setBusyLessonId(null);
    }
  }

  async function toggleModuleFree() {
    setModuleBusy(true);
    setError('');
    try {
      await GraphQLClient.execute<SetCourseModuleFreeMutation>(setCourseModuleFree, {
        courseId: mod.courseId,
        moduleId: mod.moduleId,
        isFree: !mod.isFree,
      } satisfies SetCourseModuleFreeMutationVariables);
      onModuleUpdated({ isFree: !mod.isFree });
    } catch (err) {
      console.error('[StudioLessonPane] toggleModuleFree failed ->', err);
      setError('Could not update this module.');
    } finally {
      setModuleBusy(false);
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
      onModuleDeleted();
    } catch (err) {
      console.error('[StudioLessonPane] deleteModule failed ->', err);
      setError('Could not delete this module.');
      setModuleBusy(false);
    }
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="text-xl font-extrabold text-ink-900">{mod.title}</h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={toggleModuleFree}
            disabled={moduleBusy}
            className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full transition-colors disabled:opacity-60 ${
              mod.isFree ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
            }`}
          >
            {mod.isFree ? 'Free' : 'Paid'}
          </button>
          <button
            type="button"
            onClick={handleDeleteModule}
            disabled={moduleBusy}
            className="text-xs font-semibold text-ink-400 hover:text-red-600 transition-colors disabled:opacity-60"
          >
            {moduleBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Delete module'}
          </button>
        </div>
      </div>
      <p className="text-sm text-ink-500 mb-6">
        {mod.lessonCount} lesson{mod.lessonCount === 1 ? '' : 's'}
        {mod.totalDurationSeconds > 0 && ` · ${formatDuration(mod.totalDurationSeconds)}`}
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
            <p className="text-sm text-ink-400">No lessons in this module yet.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={lessons.map((l) => l.lessonId)} strategy={verticalListSortingStrategy}>
                {lessons.map((lesson) => (
                  <SortableLessonRow
                    key={lesson.lessonId}
                    lesson={lesson}
                    busy={busyLessonId === lesson.lessonId}
                    onToggleFree={() => toggleLessonFree(lesson.lessonId)}
                    onDelete={() => handleDeleteLesson(lesson.lessonId)}
                    onEdit={() => { setEditingLessonId(lesson.lessonId); setLessonModalOpen(true); }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          <button
            type="button"
            onClick={() => { setEditingLessonId(null); setLessonModalOpen(true); }}
            className="w-full rounded-xl border border-dashed border-ink-200 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-400 hover:border-coral-300 hover:text-coral-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add a lesson
          </button>
        </div>
      )}

      <LessonModal
        open={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        moduleId={mod.moduleId}
        editLessonId={editingLessonId ?? undefined}
        onSaved={() => {
          setLessonModalOpen(false);
          void loadLessons();
        }}
      />
    </div>
  );
}
