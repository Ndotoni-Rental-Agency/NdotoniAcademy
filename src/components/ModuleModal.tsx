'use client';

import { useEffect, useState } from 'react';
import { Loader2, XCircle } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { createModuleForCourse, updateModule } from '@/graphql/mutations';
import type {
  CreateModuleForCourseMutation,
  CreateModuleForCourseMutationVariables,
  UpdateModuleMutation,
  UpdateModuleMutationVariables,
} from '@/API';
import Modal from './Modal';

export interface EditableModule {
  id: string;
  title: string;
  description?: string | null;
}

interface ModuleModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  onSaved: () => void;
  /** When present, edits this module (updateModule) instead of creating a new one. */
  editModule?: EditableModule;
}

export default function ModuleModal({ open, onClose, courseId, onSaved, editModule }: ModuleModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(editModule?.title ?? '');
    setDescription(editModule?.description ?? '');
    setError('');
  }, [open, editModule]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Give this module a title first.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      if (editModule) {
        await GraphQLClient.execute<UpdateModuleMutation>(updateModule, {
          id: editModule.id,
          input: { title: title.trim(), description: description.trim() || undefined },
        } satisfies UpdateModuleMutationVariables);
      } else {
        await GraphQLClient.execute<CreateModuleForCourseMutation>(createModuleForCourse, {
          courseId,
          input: { title: title.trim(), description: description.trim() || undefined },
        } satisfies CreateModuleForCourseMutationVariables);
      }
      onSaved();
    } catch (err) {
      console.error('[ModuleModal] save failed ->', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} closeDisabled={submitting} title={editModule ? 'Edit module' : 'Add a module'}>
      <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700">Title</label>
          <input
            type="text"
            required
            autoFocus
            placeholder="e.g. Getting Started"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-all focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700">Description</label>
          <textarea
            rows={3}
            placeholder="What does this module cover? (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-all focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
          />
        </div>

        {error && (
          <p className="flex items-start gap-1.5 text-sm text-red-600">
            <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-coral-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-coral-700 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editModule ? 'Save changes' : 'Add module'}
        </button>
      </form>
    </Modal>
  );
}
