'use client';

import { useEffect, useState } from 'react';
import { Loader2, X, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GraphQLClient } from '@/lib/graphql-client';
import { createCourse, updateCourse } from '@/graphql/mutations';
import type {
  CreateCourseMutation,
  CreateCourseMutationVariables,
  UpdateCourseMutation,
  UpdateCourseMutationVariables,
} from '@/API';
import { ThumbnailUploader } from './ThumbnailUploader';

const CATEGORIES = ['Project Management', 'Marketing', 'Technology', 'Design'];

export interface EditableCourse {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  priceTzs: number;
  thumbnailUrl?: string | null;
}

interface CreateCourseModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (courseId: string) => void;
  /** When present, edits this course (updateCourse) instead of creating a new one. */
  editCourse?: EditableCourse;
}

/**
 * Course details + thumbnail only — the common "create a brand-new course"
 * case, and (via editCourse) editing an existing course's own details from
 * the builder page. Modules and lessons are added afterward in the builder,
 * not crammed into this same form.
 */
export function CreateCourseModal({ open, onClose, onSaved, editCourse }: CreateCourseModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priceTzs, setPriceTzs] = useState(15000);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (editCourse) {
      setTitle(editCourse.title);
      setDescription(editCourse.description ?? '');
      setCategory(editCourse.category ?? CATEGORIES[0]);
      setPriceTzs(editCourse.priceTzs);
      setThumbnailUrl(editCourse.thumbnailUrl ?? '');
    } else {
      setTitle('');
      setDescription('');
      setCategory(CATEGORIES[0]);
      setPriceTzs(15000);
      setThumbnailUrl('');
    }
    setError('');
  }, [open, editCourse]);

  if (!open) return null;

  function handleClose() {
    if (submitting) return;
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Give your course a title first.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      let courseId: string;
      if (editCourse) {
        const { updateCourse: course } = await GraphQLClient.execute<UpdateCourseMutation>(updateCourse, {
          id: editCourse.id,
          input: {
            title: title.trim(),
            description: description.trim() || undefined,
            category,
            thumbnailUrl: thumbnailUrl || undefined,
            priceTzs,
          },
        } satisfies UpdateCourseMutationVariables);
        courseId = course.id;
      } else {
        // An org's INSTRUCTOR creates an org-scoped course; an independent
        // instructor (no org, or an org member in another role who's opted
        // into wantsToTeach) creates a public one — organizationId omitted.
        const membership = user?.organizations[0];
        const organizationId = membership?.role === 'INSTRUCTOR' ? membership.organization?.id : undefined;
        const { createCourse: course } = await GraphQLClient.execute<CreateCourseMutation>(createCourse, {
          input: {
            title: title.trim(),
            description: description.trim() || undefined,
            category,
            thumbnailUrl: thumbnailUrl || undefined,
            priceTzs,
            organizationId,
          },
        } satisfies CreateCourseMutationVariables);
        courseId = course.id;
      }
      onSaved(courseId);
    } catch (err) {
      console.error('[CreateCourseModal] save failed ->', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={handleClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-extrabold text-ink-900">{editCourse ? 'Edit course details' : 'Create a course'}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink-700">Title</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Warehouse Safety Fundamentals"
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
              placeholder="What will learners be able to do after this course?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-all focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-bold text-ink-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={submitting}
                className="w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="mb-1.5 block text-sm font-bold text-ink-700">Price (TZS)</label>
              <input
                type="number"
                min={0}
                step={1000}
                aria-label="Price in TZS"
                value={priceTzs}
                onChange={(e) => setPriceTzs(Number(e.target.value))}
                disabled={submitting}
                className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 transition-all focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
              />
            </div>
          </div>

          <ThumbnailUploader value={thumbnailUrl} onUploaded={setThumbnailUrl} />

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
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editCourse ? 'Save changes' : 'Create course'}
          </button>
        </form>
      </div>
    </div>
  );
}
