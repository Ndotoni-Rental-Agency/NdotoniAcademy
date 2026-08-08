'use client';

import { useCallback, useEffect, useState } from 'react';
import { ClipboardList, Loader2, Trash2, Pencil, Plus, ArrowLeft, Paperclip, CheckCircle2 } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { assignmentsForCourse, submissionsForAssignment } from '@/graphql/queries';
import { createAssignment, updateAssignment, deleteAssignment, gradeAssignment } from '@/graphql/mutations';
import { SubmissionStatus } from '@/API';
import type {
  AssignmentsForCourseQuery, AssignmentsForCourseQueryVariables,
  SubmissionsForAssignmentQuery, SubmissionsForAssignmentQueryVariables,
  CreateAssignmentMutation, CreateAssignmentMutationVariables,
  UpdateAssignmentMutation, UpdateAssignmentMutationVariables,
  DeleteAssignmentMutation, DeleteAssignmentMutationVariables,
  GradeAssignmentMutation, GradeAssignmentMutationVariables,
  Assignment, AssignmentSubmission,
} from '@/API';
import { filenameFromUrl } from '@/lib/document-file';

const inputClass = 'w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60';

function AssignmentForm({
  initialTitle = '', initialDescription = '', onCancel, onSave, saving,
}: {
  initialTitle?: string;
  initialDescription?: string;
  onCancel: () => void;
  onSave: (title: string, description: string) => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  return (
    <div className="rounded-xl border border-ink-200 p-3.5 space-y-2.5">
      <input
        type="text"
        placeholder="Assignment title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={saving}
        className={inputClass}
      />
      <textarea
        rows={3}
        placeholder="Instructions (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={saving}
        className={inputClass}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSave(title, description)}
          disabled={saving || !title.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-coral-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-coral-700 transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="text-xs font-semibold text-ink-400 hover:text-ink-600">
          Cancel
        </button>
      </div>
    </div>
  );
}

function GradingView({ courseId, assignment, onBack }: { courseId: string; assignment: Assignment; onBack: () => void }) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, string>>({});
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { submissionsForAssignment: fetched } = await GraphQLClient.execute<SubmissionsForAssignmentQuery>(
        submissionsForAssignment,
        { courseId, assignmentId: assignment.id } satisfies SubmissionsForAssignmentQueryVariables
      );
      setSubmissions(fetched);
      const scores: Record<string, string> = {};
      const feedback: Record<string, string> = {};
      for (const s of fetched) {
        scores[s.userId] = s.score != null ? String(s.score) : '';
        feedback[s.userId] = s.feedback ?? '';
      }
      setScoreDrafts(scores);
      setFeedbackDrafts(feedback);
    } catch (err) {
      console.error('[GradingView] load failed ->', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, assignment.id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleGrade(userId: string) {
    const score = Number(scoreDrafts[userId]);
    if (!Number.isFinite(score)) {
      toast.error('Enter a numeric score.');
      return;
    }
    setSavingUserId(userId);
    try {
      const { gradeAssignment: graded } = await GraphQLClient.execute<GradeAssignmentMutation>(gradeAssignment, {
        courseId,
        assignmentId: assignment.id,
        userId,
        input: { score, feedback: feedbackDrafts[userId]?.trim() || undefined },
      } satisfies GradeAssignmentMutationVariables);
      setSubmissions((prev) => prev.map((s) => (s.userId === userId ? graded : s)));
      toast.success('Grade saved.');
    } catch (err) {
      console.error('[GradingView] grade failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not save the grade.');
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-500 hover:text-ink-800 transition-colors mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Assignments
      </button>
      <h2 className="font-serif text-xl font-semibold text-ink-900 mb-1">{assignment.title}</h2>
      <p className="text-sm text-ink-500 mb-6">Grading submissions</p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-ink-400">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div key={s.userId} className="rounded-xl border border-ink-100 p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-bold text-ink-900">{s.submitterName}</span>
                {s.status === SubmissionStatus.GRADED && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Graded
                  </span>
                )}
              </div>
              {s.body && <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line mb-2">{s.body}</p>}
              {s.attachment && (
                <a
                  href={s.attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-2"
                >
                  <Paperclip className="w-3.5 h-3.5" /> {filenameFromUrl(s.attachment.url)}
                </a>
              )}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  placeholder="Score"
                  value={scoreDrafts[s.userId] ?? ''}
                  onChange={(e) => setScoreDrafts((prev) => ({ ...prev, [s.userId]: e.target.value }))}
                  disabled={savingUserId === s.userId}
                  className="w-24 rounded-lg border border-ink-200 px-2.5 py-1.5 text-sm text-ink-900 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
                />
                <input
                  type="text"
                  placeholder="Feedback (optional)"
                  value={feedbackDrafts[s.userId] ?? ''}
                  onChange={(e) => setFeedbackDrafts((prev) => ({ ...prev, [s.userId]: e.target.value }))}
                  disabled={savingUserId === s.userId}
                  className="flex-1 rounded-lg border border-ink-200 px-2.5 py-1.5 text-sm text-ink-900 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => void handleGrade(s.userId)}
                  disabled={savingUserId === s.userId || !scoreDrafts[s.userId]?.trim()}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-coral-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-coral-700 transition-colors disabled:opacity-50"
                >
                  {savingUserId === s.userId && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {s.status === SubmissionStatus.GRADED ? 'Update' : 'Grade'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudioAssignmentsPane({ courseId }: { courseId: string }) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [creating, setCreating] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingEditId, setSavingEditId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { assignmentsForCourse: fetched } = await GraphQLClient.execute<AssignmentsForCourseQuery>(
        assignmentsForCourse,
        { courseId } satisfies AssignmentsForCourseQueryVariables
      );
      setAssignments(fetched);
    } catch (err) {
      console.error('[StudioAssignmentsPane] load failed ->', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(title: string, description: string) {
    if (!title.trim()) return;
    setSavingCreate(true);
    try {
      const { createAssignment: created } = await GraphQLClient.execute<CreateAssignmentMutation>(createAssignment, {
        courseId,
        input: { title: title.trim(), description: description.trim() || undefined },
      } satisfies CreateAssignmentMutationVariables);
      setAssignments((prev) => [...prev, created]);
      setCreating(false);
      toast.success('Assignment created.');
    } catch (err) {
      console.error('[StudioAssignmentsPane] create failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not create the assignment.');
    } finally {
      setSavingCreate(false);
    }
  }

  async function handleUpdate(id: string, title: string, description: string) {
    if (!title.trim()) return;
    setSavingEditId(id);
    try {
      const { updateAssignment: updated } = await GraphQLClient.execute<UpdateAssignmentMutation>(updateAssignment, {
        courseId,
        id,
        input: { title: title.trim(), description: description.trim() || undefined },
      } satisfies UpdateAssignmentMutationVariables);
      setAssignments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setEditingId(null);
      toast.success('Assignment updated.');
    } catch (err) {
      console.error('[StudioAssignmentsPane] update failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not update the assignment.');
    } finally {
      setSavingEditId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await GraphQLClient.execute<DeleteAssignmentMutation>(deleteAssignment, {
        courseId,
        id,
      } satisfies DeleteAssignmentMutationVariables);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      toast.success('Assignment deleted.');
    } catch (err) {
      console.error('[StudioAssignmentsPane] delete failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not delete the assignment.');
    } finally {
      setDeletingId(null);
    }
  }

  if (gradingAssignment) {
    return <GradingView courseId={courseId} assignment={gradingAssignment} onBack={() => setGradingAssignment(null)} />;
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">
      <h2 className="font-serif text-xl font-semibold text-ink-900 flex items-center gap-2 mb-1">
        <ClipboardList className="w-5 h-5 text-indigo-600 flex-shrink-0" /> Assignments
      </h2>
      <p className="text-sm text-ink-500 mb-6">Post work for learners to submit and grade it here.</p>

      <div className="space-y-3 mb-4">
        {assignments.map((a) => (
          editingId === a.id ? (
            <AssignmentForm
              key={a.id}
              initialTitle={a.title}
              initialDescription={a.description ?? ''}
              saving={savingEditId === a.id}
              onCancel={() => setEditingId(null)}
              onSave={(title, description) => void handleUpdate(a.id, title, description)}
            />
          ) : (
            <div key={a.id} className="flex items-start gap-3 rounded-xl border border-ink-100 p-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink-900">{a.title}</p>
                {a.description && <p className="text-xs text-ink-500 mt-0.5 line-clamp-2">{a.description}</p>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setGradingAssignment(a)}
                  className="rounded-lg border border-ink-200 px-2.5 py-1 text-xs font-bold text-ink-600 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                >
                  Grade
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(a.id)}
                  className="text-ink-300 hover:text-coral-600 transition-colors p-1.5"
                  aria-label="Edit assignment"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(a.id)}
                  disabled={deletingId === a.id}
                  className="text-ink-300 hover:text-red-600 transition-colors p-1.5 disabled:opacity-50"
                  aria-label="Delete assignment"
                >
                  {deletingId === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {creating ? (
        <AssignmentForm saving={savingCreate} onCancel={() => setCreating(false)} onSave={(title, description) => void handleCreate(title, description)} />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-200 py-2.5 text-xs font-semibold text-ink-400 hover:border-coral-300 hover:text-coral-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add assignment
        </button>
      )}
    </div>
  );
}
