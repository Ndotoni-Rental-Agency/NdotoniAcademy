'use client';

import { useCallback, useEffect, useState } from 'react';
import { GraduationCap, Loader2, Trash2, XCircle } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { courseExam as courseExamQuery } from '@/graphql/queries';
import { setCourseExam, deleteCourseExam } from '@/graphql/mutations';
import type {
  CourseExamQuery, CourseExamQueryVariables,
  SetCourseExamMutation, SetCourseExamMutationVariables,
  DeleteCourseExamMutation, DeleteCourseExamMutationVariables,
} from '@/API';
import QuizEditor, { type QuestionDraft } from './QuizEditor';

function newQuestion(): QuestionDraft {
  return { id: crypto.randomUUID(), question: '', options: ['', ''], correctIndex: 0 };
}

export default function StudioExamPane({ courseId }: { courseId: string }) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [hasExam, setHasExam] = useState(false);
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [passingScorePercent, setPassingScorePercent] = useState(70);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { courseExam } = await GraphQLClient.execute<CourseExamQuery>(courseExamQuery, {
        courseId,
      } satisfies CourseExamQueryVariables);
      if (courseExam) {
        setHasExam(true);
        setQuestions(courseExam.questions.map((q) => ({ id: q.id, question: q.question, options: [...q.options], correctIndex: q.correctIndex })));
        setPassingScorePercent(courseExam.passingScorePercent);
      } else {
        setHasExam(false);
        setQuestions([newQuestion()]);
        setPassingScorePercent(70);
      }
    } catch (err) {
      console.error('[StudioExamPane] load failed ->', err);
      setError('Could not load the exam.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  const validQuestions = questions.filter((q) => q.question.trim() && q.options.every((o) => o.trim()));
  const canSave = validQuestions.length > 0 && validQuestions.length === questions.length;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setError('');
    try {
      await GraphQLClient.execute<SetCourseExamMutation>(setCourseExam, {
        courseId,
        input: {
          passingScorePercent,
          questions: questions.map(({ id, question, options, correctIndex }) => ({ id, question, options, correctIndex })),
        },
      } satisfies SetCourseExamMutationVariables);
      setHasExam(true);
      toast.success('Exam saved.');
    } catch (err) {
      console.error('[StudioExamPane] save failed ->', err);
      const message = err instanceof Error ? err.message : 'Could not save the exam.';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      await GraphQLClient.execute<DeleteCourseExamMutation>(deleteCourseExam, {
        courseId,
      } satisfies DeleteCourseExamMutationVariables);
      toast.success('Exam removed.');
      setHasExam(false);
      setQuestions([newQuestion()]);
      setPassingScorePercent(70);
    } catch (err) {
      console.error('[StudioExamPane] delete failed ->', err);
      const message = err instanceof Error ? err.message : 'Could not remove the exam.';
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
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
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="font-serif text-xl font-semibold text-ink-900 truncate min-w-0 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-600 flex-shrink-0" /> Final exam
        </h2>
        {hasExam && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-60 flex-shrink-0"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Remove exam
          </button>
        )}
      </div>
      <p className="text-sm text-ink-500 mb-6">
        Unlocks once every lesson is complete. Scored honestly, no answer key shown while taking it, and passing earns the course certificate.
      </p>

      {error && (
        <p className="flex items-start gap-1.5 text-sm text-red-600 mb-4">
          <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
        </p>
      )}

      <div className="mb-5 flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3">
        <label htmlFor="passing-score" className="text-sm font-semibold text-ink-700 flex-shrink-0">Passing score</label>
        <input
          id="passing-score"
          type="number"
          min={1}
          max={100}
          value={passingScorePercent}
          onChange={(e) => setPassingScorePercent(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
          disabled={saving}
          className="w-20 rounded-lg border border-ink-200 px-2.5 py-1.5 text-sm text-ink-900 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60"
        />
        <span className="text-sm text-ink-500">%</span>
      </div>

      <QuizEditor questions={questions} onChange={setQuestions} disabled={saving} />

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !canSave}
          className="inline-flex items-center gap-1.5 rounded-lg bg-coral-600 px-4 py-2 text-xs font-bold text-white hover:bg-coral-700 transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {hasExam ? 'Save changes' : 'Publish exam'}
        </button>
        {!canSave && (
          <span className="text-xs text-ink-400">Every question needs text and every option filled in.</span>
        )}
      </div>
    </div>
  );
}
