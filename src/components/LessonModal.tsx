'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { lesson as lessonQuery } from '@/graphql/queries';
import type { LessonQuery, LessonQueryVariables } from '@/API';
import Modal from './Modal';
import LessonForm, { type EditableLesson } from './LessonForm';

interface LessonModalProps {
  open: boolean;
  onClose: () => void;
  moduleId: string;
  onSaved: () => void;
  /** When present, fetches and edits this lesson's full content instead of creating a new one. */
  editLessonId?: string;
}

export default function LessonModal({ open, onClose, moduleId, onSaved, editLessonId }: LessonModalProps) {
  const [editLesson, setEditLesson] = useState<EditableLesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!open || !editLessonId) {
      setEditLesson(null);
      setLoadError('');
      return;
    }
    setLoading(true);
    setLoadError('');
    GraphQLClient.execute<LessonQuery>(lessonQuery, { lessonId: editLessonId, moduleId } satisfies LessonQueryVariables)
      .then(({ lesson }) => {
        if (!lesson) {
          setLoadError('Could not load this lesson.');
          return;
        }
        setEditLesson(lesson);
      })
      .catch((err) => {
        console.error('[LessonModal] load failed ->', err);
        setLoadError('Could not load this lesson.');
      })
      .finally(() => setLoading(false));
  }, [open, editLessonId, moduleId]);

  return (
    <Modal open={open} onClose={onClose} title={editLessonId ? 'Edit lesson' : 'Add a lesson'} maxWidth="2xl">
      {loading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
        </div>
      ) : loadError ? (
        <p className="px-6 py-8 text-sm text-red-600">{loadError}</p>
      ) : (
        <LessonForm
          moduleId={moduleId}
          editLesson={editLesson ?? undefined}
          onSaved={onSaved}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
