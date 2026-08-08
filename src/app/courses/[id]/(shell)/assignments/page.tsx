'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ClipboardList, Loader2, CheckCircle2, Clock, Paperclip } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { assignmentsForCourse, mySubmissionsForCourse } from '@/graphql/queries';
import { submitAssignment } from '@/graphql/mutations';
import { MediaType, SubmissionStatus } from '@/API';
import type {
  AssignmentsForCourseQuery, AssignmentsForCourseQueryVariables,
  MySubmissionsForCourseQuery, MySubmissionsForCourseQueryVariables,
  SubmitAssignmentMutation, SubmitAssignmentMutationVariables,
  Assignment, AssignmentSubmission,
} from '@/API';
import ComingSoonTab from '@/components/course/ComingSoonTab';
import DocumentUploader from '@/components/DocumentUploader';
import { filenameFromUrl } from '@/lib/document-file';

function StatusBadge({ submission }: { submission: AssignmentSubmission | undefined }) {
  if (!submission) {
    return <span className="text-[10px] font-bold uppercase tracking-wide text-ink-400 bg-ink-100 px-2 py-0.5 rounded-full">Not submitted</span>;
  }
  if (submission.status === SubmissionStatus.GRADED) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> Graded: {submission.score}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" /> Submitted
    </span>
  );
}

function AssignmentCard({
  assignment, submission, courseId, onSubmitted,
}: {
  assignment: Assignment;
  submission: AssignmentSubmission | undefined;
  courseId: string;
  onSubmitted: (s: AssignmentSubmission) => void;
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!body.trim() && !attachmentUrl) {
      toast.error('Add some text or attach a file before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const { submitAssignment: created } = await GraphQLClient.execute<SubmitAssignmentMutation>(submitAssignment, {
        courseId,
        assignmentId: assignment.id,
        input: {
          body: body.trim() || undefined,
          attachment: attachmentUrl ? { url: attachmentUrl, type: MediaType.DOCUMENT } : undefined,
        },
      } satisfies SubmitAssignmentMutationVariables);
      onSubmitted(created);
      setOpen(false);
      setBody('');
      setAttachmentUrl('');
      toast.success('Assignment submitted.');
    } catch (err) {
      console.error('[AssignmentCard] submit failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not submit the assignment.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-100 p-5">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-serif text-lg font-semibold text-ink-900">{assignment.title}</h3>
        <StatusBadge submission={submission} />
      </div>
      {assignment.description && <p className="text-sm text-ink-500 leading-relaxed mb-3">{assignment.description}</p>}

      {submission?.status === SubmissionStatus.GRADED && submission.feedback && (
        <div className="rounded-lg bg-brand-50 border border-brand-100 px-3.5 py-2.5 mb-3">
          <p className="text-xs font-bold text-brand-700 mb-0.5">Feedback</p>
          <p className="text-sm text-ink-700">{submission.feedback}</p>
        </div>
      )}

      {open ? (
        <div className="mt-3 space-y-3">
          <textarea
            rows={4}
            placeholder="Write your submission..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={submitting}
            className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
          />
          <DocumentUploader value={attachmentUrl} onUploaded={setAttachmentUrl} disabled={submitting} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Submit assignment
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={submitting}
              className="text-xs font-semibold text-ink-400 hover:text-ink-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink-200 px-3.5 py-1.5 text-xs font-bold text-ink-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            {submission ? 'Resubmit' : 'Submit'}
          </button>
          {submission?.attachment && (
            <a
              href={submission.attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-indigo-600"
            >
              <Paperclip className="w-3.5 h-3.5" /> {filenameFromUrl(submission.attachment.url)}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseAssignmentsPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Sequential, not Promise.all — firing two concurrent authenticated
      // calls right on mount was intermittently racing Amplify's session/
      // token resolution (surfaced as "Cognito identity is missing an email
      // claim" from the one of the two whose resolver needs the caller's
      // identity). One at a time avoids it.
      const { assignmentsForCourse: fetchedAssignments } = await GraphQLClient.execute<AssignmentsForCourseQuery>(
        assignmentsForCourse,
        { courseId } satisfies AssignmentsForCourseQueryVariables
      );
      const { mySubmissionsForCourse: fetchedSubmissions } = await GraphQLClient.execute<MySubmissionsForCourseQuery>(
        mySubmissionsForCourse,
        { courseId } satisfies MySubmissionsForCourseQueryVariables
      );
      setAssignments(fetchedAssignments);
      setSubmissions(fetchedSubmissions);
    } catch (err) {
      console.error('[CourseAssignmentsPage] load failed ->', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleSubmitted(submission: AssignmentSubmission) {
    setSubmissions((prev) => [...prev.filter((s) => s.assignmentId !== submission.assignmentId), submission]);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <ComingSoonTab
        icon={ClipboardList}
        title="No assignments yet"
        description="Your instructor hasn't posted any assignments for this course."
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-4">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          submission={submissions.find((s) => s.assignmentId === assignment.id)}
          courseId={courseId}
          onSubmitted={handleSubmitted}
        />
      ))}
    </div>
  );
}
