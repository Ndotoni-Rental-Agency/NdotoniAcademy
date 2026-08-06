'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Loader2, Lock, Trophy, XCircle, ArrowRight, ArrowLeft,
  ChevronLeft, ChevronRight, Check,
} from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { examToTake as examToTakeQuery, myExamAttempt as myExamAttemptQuery, myCourseProgress as myCourseProgressQuery } from '@/graphql/queries';
import { submitExamAttempt } from '@/graphql/mutations';
import type {
  ExamToTakeQuery, ExamToTakeQueryVariables,
  MyExamAttemptQuery, MyExamAttemptQueryVariables,
  MyCourseProgressQuery, MyCourseProgressQueryVariables,
  SubmitExamAttemptMutation, SubmitExamAttemptMutationVariables,
  ExamAttempt,
} from '@/API';
import ComingSoonTab from '@/components/course/ComingSoonTab';
import InlineMarkdown from '@/components/InlineMarkdown';

type ExamPreview = NonNullable<ExamToTakeQuery['examToTake']>;

function ResultCard({ attempt, onRetake }: { attempt: ExamAttempt; onRetake: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${attempt.passed ? 'bg-brand-100' : 'bg-ink-100'}`}>
        {attempt.passed ? <Trophy className="w-7 h-7 text-brand-600" /> : <XCircle className="w-7 h-7 text-ink-500" />}
      </div>
      <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-1">
        {attempt.passed ? 'You passed' : 'Not quite there'}
      </h2>
      <p className="text-ink-500 mb-1">
        Scored <span className="font-bold text-ink-900">{attempt.score}</span> of <span className="font-bold text-ink-900">{attempt.total}</span>
      </p>
      <p className="text-sm text-ink-400 mb-6">
        {attempt.passed ? 'Your certificate is ready on the dashboard.' : 'Review the material and try again when you\'re ready.'}
      </p>
      <button
        onClick={onRetake}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
      >
        {attempt.passed ? 'Retake exam' : 'Try again'} <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function ExamIntro({ exam, onStart }: { exam: ExamPreview; onStart: () => void }) {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-brand-100">
        <GraduationCap className="w-7 h-7 text-brand-600" />
      </div>
      <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-2">Final exam</h2>
      <p className="text-ink-500 max-w-sm mx-auto mb-1">
        {exam.questions.length} question{exam.questions.length === 1 ? '' : 's'} · pass with {exam.passingScorePercent}% or higher
      </p>
      <p className="text-sm text-ink-400 max-w-sm mx-auto mb-6">
        Answer each question once. You&apos;ll see your score after you submit, not before.
      </p>
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
      >
        Start exam <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ExamRunner({ exam, onSubmitted }: { exam: ExamPreview; onSubmitted: (attempt: ExamAttempt) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const current = exam.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === exam.questions.length;

  function select(optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const ordered = exam.questions.map((_, i) => answers[i]);
      const { submitExamAttempt: attempt } = await GraphQLClient.execute<SubmitExamAttemptMutation>(submitExamAttempt, {
        courseId: exam.courseId,
        answers: ordered,
      } satisfies SubmitExamAttemptMutationVariables);
      onSubmitted(attempt);
    } catch (err) {
      console.error('[ExamRunner] submit failed ->', err);
      setError(err instanceof Error ? err.message : 'Could not submit the exam.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-6 flex-wrap">
        {exam.questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
              i === currentIndex ? 'bg-indigo-600 text-white' : answers[i] !== undefined ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500 hover:bg-ink-200'
            }`}
          >
            {answers[i] !== undefined ? <Check className="w-4 h-4" /> : i + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          <p className="text-xs text-ink-400 font-semibold mb-2">Question {currentIndex + 1} of {exam.questions.length}</p>
          <h3 className="text-lg font-bold text-ink-900 mb-5"><InlineMarkdown content={current.question} /></h3>

          <div className="space-y-2.5">
            {current.options.map((option, i) => {
              const selected = answers[currentIndex] === i;
              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                    selected ? 'border-indigo-500 bg-indigo-50' : 'border-ink-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      selected ? 'border-indigo-500 text-indigo-600 bg-white' : 'border-ink-300 text-ink-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-ink-700"><InlineMarkdown content={option} /></span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600 mt-4">
          <XCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </p>
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink-100">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {currentIndex === exam.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit exam
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((i) => Math.min(exam.questions.length - 1, i + 1))}
            className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-center text-xs text-ink-400 mt-4">{answeredCount} of {exam.questions.length} answered</p>
    </div>
  );
}

export default function CourseExamPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<ExamPreview | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [locked, setLocked] = useState<{ done: number; total: number } | null>(null);
  const [taking, setTaking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [{ examToTake: fetchedExam }, { myCourseProgress: progress }] = await Promise.all([
        GraphQLClient.execute<ExamToTakeQuery>(examToTakeQuery, { courseId } satisfies ExamToTakeQueryVariables),
        GraphQLClient.execute<MyCourseProgressQuery>(myCourseProgressQuery, { courseId } satisfies MyCourseProgressQueryVariables),
      ]);
      setExam(fetchedExam ?? null);
      if (fetchedExam && progress.totalLessons > 0 && progress.completedLessonIds.length < progress.totalLessons) {
        setLocked({ done: progress.completedLessonIds.length, total: progress.totalLessons });
      } else {
        setLocked(null);
      }
      if (fetchedExam) {
        const { myExamAttempt: fetchedAttempt } = await GraphQLClient.execute<MyExamAttemptQuery>(myExamAttemptQuery, {
          courseId,
        } satisfies MyExamAttemptQueryVariables);
        setAttempt(fetchedAttempt ?? null);
      }
    } catch (err) {
      console.error('[CourseExamPage] load failed ->', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
      </div>
    );
  }

  if (!exam) {
    return (
      <ComingSoonTab
        icon={GraduationCap}
        title="There's no final exam for this course"
        description="Not every course has one — check the Modules tab to keep going."
      />
    );
  }

  const content = (() => {
    if (locked) {
      return (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-ink-100">
            <Lock className="w-7 h-7 text-ink-400" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-2">Finish the course first</h2>
          <p className="text-ink-500 max-w-sm mx-auto mb-6">
            {locked.done} of {locked.total} lessons complete. The final exam unlocks once every lesson is done.
          </p>
          <Link href={`/courses/${courseId}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="w-4 h-4" /> Back to modules
          </Link>
        </div>
      );
    }
    if (taking) {
      return <ExamRunner exam={exam} onSubmitted={(a) => { setAttempt(a); setTaking(false); }} />;
    }
    if (attempt) {
      return <ResultCard attempt={attempt} onRetake={() => setTaking(true)} />;
    }
    return <ExamIntro exam={exam} onStart={() => setTaking(true)} />;
  })();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {content}
    </div>
  );
}
