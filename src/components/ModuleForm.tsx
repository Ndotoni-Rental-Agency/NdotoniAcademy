'use client';

import { useState } from 'react';
import { Loader2, Plus, XCircle } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { createModuleForCourse } from '@/graphql/mutations';
import type { CreateModuleForCourseMutation, CreateModuleForCourseMutationVariables } from '@/API';

interface ModuleFormProps {
  courseId: string;
  onCreated: () => void;
  onCancel: () => void;
}

export default function ModuleForm({ courseId, onCreated, onCancel }: ModuleFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Give this module a title first.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await GraphQLClient.execute<CreateModuleForCourseMutation>(createModuleForCourse, {
        courseId,
        input: { title: title.trim(), description: description.trim() || undefined },
        isFree: false,
      } satisfies CreateModuleForCourseMutationVariables);
      onCreated();
    } catch (err) {
      console.error('[ModuleForm] create failed ->', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border-2 border-dashed border-ink-200 p-4 space-y-3">
      <input
        type="text"
        required
        autoFocus
        placeholder="Module title, e.g. Getting Started"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={submitting}
        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={submitting}
        className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
      />

      {error && (
        <p className="flex items-start gap-1.5 text-sm text-red-600">
          <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-coral-600 px-4 py-2 text-xs font-bold text-white hover:bg-coral-700 transition-colors disabled:opacity-60"
        >
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Add module
        </button>
        <button type="button" onClick={onCancel} disabled={submitting} className="text-xs font-semibold text-ink-400 hover:text-ink-600 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
