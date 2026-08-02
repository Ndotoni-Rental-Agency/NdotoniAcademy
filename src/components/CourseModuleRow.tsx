'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronRight, X, Plus, Loader2, XCircle } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { lessonsForModule } from '@/graphql/queries';
import {
  removeLessonFromModule, deleteLesson as deleteLessonMutation,
  reorderModuleLessons, setModuleLessonFree,
} from '@/graphql/mutations';
import type {
  LessonsForModuleQuery, RemoveLessonFromModuleMutation, RemoveLessonFromModuleMutationVariables,
  DeleteLessonMutation, DeleteLessonMutationVariables, ReorderModuleLessonsMutation,
  ReorderModuleLessonsMutationVariables, SetModuleLessonFreeMutation, SetModuleLessonFreeMutationVariables,
} from '@/API';
import CourseLessonRow, { type LessonRowData } from './CourseLessonRow';
import LessonForm from './LessonForm';

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

interface CourseModuleRowProps {
  module: CourseModuleData;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  onMove: (direction: -1 | 1) => void;
  onToggleFree: () => void;
  onDelete: () => void;
}

export default function CourseModuleRow({ module, isFirst, isLast, busy, onMove, onToggleFree, onDelete }: CourseModuleRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [lessons, setLessons] = useState<LessonRowData[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [lessonsLoaded, setLessonsLoaded] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [busyLessonId, setBusyLessonId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loadLessons() {
    setLoadingLessons(true);
    setError('');
    try {
      const { lessonsForModule: fetched } = await GraphQLClient.execute<LessonsForModuleQuery>(lessonsForModule, { moduleId: module.moduleId });
      setLessons([...fetched].sort((a, b) => a.order - b.order));
      setLessonsLoaded(true);
    } catch (err) {
      console.error('[CourseModuleRow] loadLessons failed ->', err);
      setError(err instanceof Error ? err.message : 'Could not load lessons.');
    } finally {
      setLoadingLessons(false);
    }
  }

  function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    if (next && !lessonsLoaded) void loadLessons();
  }

  async function moveLesson(lessonId: string, direction: -1 | 1) {
    const index = lessons.findIndex((l) => l.lessonId === lessonId);
    const targetIndex = index + direction;
    if (index === -1 || targetIndex < 0 || targetIndex >= lessons.length) return;
    const reordered = [...lessons];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setLessons(reordered);
    setBusyLessonId(lessonId);
    setError('');
    try {
      await GraphQLClient.execute<ReorderModuleLessonsMutation>(reorderModuleLessons, {
        moduleId: module.moduleId,
        lessonIds: reordered.map((l) => l.lessonId),
      } satisfies ReorderModuleLessonsMutationVariables);
    } catch (err) {
      console.error('[CourseModuleRow] moveLesson failed ->', err);
      setError(err instanceof Error ? err.message : 'Could not reorder lessons.');
      void loadLessons();
    } finally {
      setBusyLessonId(null);
    }
  }

  async function toggleLessonFree(lessonId: string) {
    const current = lessons.find((l) => l.lessonId === lessonId);
    if (!current) return;
    setBusyLessonId(lessonId);
    setError('');
    try {
      await GraphQLClient.execute<SetModuleLessonFreeMutation>(setModuleLessonFree, {
        moduleId: module.moduleId,
        lessonId,
        isFree: !current.isFree,
      } satisfies SetModuleLessonFreeMutationVariables);
      setLessons((prev) => prev.map((l) => (l.lessonId === lessonId ? { ...l, isFree: !l.isFree } : l)));
    } catch (err) {
      console.error('[CourseModuleRow] toggleLessonFree failed ->', err);
      setError(err instanceof Error ? err.message : 'Could not update this lesson.');
    } finally {
      setBusyLessonId(null);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    setBusyLessonId(lessonId);
    setError('');
    try {
      await GraphQLClient.execute<RemoveLessonFromModuleMutation>(removeLessonFromModule, {
        moduleId: module.moduleId,
        lessonId,
      } satisfies RemoveLessonFromModuleMutationVariables);
      await GraphQLClient.execute<DeleteLessonMutation>(deleteLessonMutation, {
        id: lessonId,
      } satisfies DeleteLessonMutationVariables);
      setLessons((prev) => prev.filter((l) => l.lessonId !== lessonId));
    } catch (err) {
      console.error('[CourseModuleRow] deleteLesson failed ->', err);
      setError(err instanceof Error ? err.message : 'Could not delete this lesson.');
    } finally {
      setBusyLessonId(null);
    }
  }

  return (
    <div className="rounded-2xl border-2 border-ink-100 bg-white p-5">
      <div className="flex items-center gap-3 mb-1">
        <button type="button" onClick={toggleExpanded} className="text-ink-400 hover:text-ink-700 transition-colors flex-shrink-0" aria-label={expanded ? 'Collapse module' : 'Expand module'}>
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-ink-900 truncate">{module.title}</p>
          <p className="text-xs text-ink-400">
            {module.lessonCount} lesson{module.lessonCount === 1 ? '' : 's'}
            {module.totalDurationSeconds > 0 && ` · ${Math.round(module.totalDurationSeconds / 60)} min`}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleFree}
          disabled={busy}
          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 transition-colors disabled:opacity-60 ${
            module.isFree ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
          }`}
        >
          {module.isFree ? 'Free' : 'Paid'}
        </button>
        <div className="flex items-center flex-shrink-0">
          <button onClick={() => onMove(-1)} disabled={busy || isFirst} className="text-ink-300 hover:text-ink-600 disabled:opacity-30 transition-colors p-0.5" aria-label="Move module up">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={() => onMove(1)} disabled={busy || isLast} className="text-ink-300 hover:text-ink-600 disabled:opacity-30 transition-colors p-0.5" aria-label="Move module down">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button onClick={onDelete} disabled={busy} className="text-ink-300 hover:text-red-500 disabled:opacity-30 transition-colors p-0.5 ml-1" aria-label="Delete module">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pl-7 space-y-2">
          {loadingLessons ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-4 h-4 text-ink-400 animate-spin" />
            </div>
          ) : (
            <>
              {lessons.map((lesson, i) => (
                <CourseLessonRow
                  key={lesson.lessonId}
                  lesson={lesson}
                  isFirst={i === 0}
                  isLast={i === lessons.length - 1}
                  busy={busyLessonId === lesson.lessonId}
                  onMove={(direction) => moveLesson(lesson.lessonId, direction)}
                  onToggleFree={() => toggleLessonFree(lesson.lessonId)}
                  onDelete={() => handleDeleteLesson(lesson.lessonId)}
                />
              ))}

              {error && (
                <p className="flex items-start gap-1.5 text-sm text-red-600">
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {error}
                </p>
              )}

              {showAddLesson ? (
                <LessonForm
                  moduleId={module.moduleId}
                  onCreated={() => {
                    setShowAddLesson(false);
                    void loadLessons();
                  }}
                  onCancel={() => setShowAddLesson(false)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddLesson(true)}
                  className="w-full rounded-lg border border-dashed border-ink-200 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-400 hover:border-coral-300 hover:text-coral-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add a lesson
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
