'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Zap, Trophy, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { QuizQuestion } from '@/lib/mock-data';
import InlineMarkdown from './InlineMarkdown';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

interface AnswerRecord {
  selected: number;
  correct: boolean;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const quizRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerRecord>>({});
  const [finished, setFinished] = useState(false);
  const [wrongPick, setWrongPick] = useState<number | null>(null);

  const current = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isLocked = currentAnswer !== undefined;

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(a => a.correct).length;

  // Longest streak
  let bestStreak = 0;
  let currentStreak = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i]?.correct) { currentStreak++; bestStreak = Math.max(bestStreak, currentStreak); }
    else { currentStreak = 0; }
  }

  function scrollToTop() {
    setTimeout(() => {
      const el = quizRef.current;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  }

  function handleSelect(optionIndex: number) {
    if (isLocked) return;

    const correct = optionIndex === current.correctIndex;

    if (correct) {
      // Lock only on correct answer
      setAnswers(prev => ({
        ...prev,
        [currentIndex]: { selected: optionIndex, correct: true }
      }));

      // Auto-advance after short delay
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          scrollToTop();
        } else {
          const newAnsweredCount = answeredCount + 1;
          if (newAnsweredCount === questions.length) {
            setFinished(true);
            onComplete(newAnsweredCount, questions.length);
            scrollToTop();
          }
        }
      }, 800);
    } else {
      // Wrong answer: briefly flash red, then reset so they can try again
      setWrongPick(optionIndex);
      setTimeout(() => setWrongPick(null), 600);
    }
  }

  function goTo(index: number) {
    setCurrentIndex(index);
    scrollToTop();
  }

  function handleFinish() {
    setFinished(true);
    onComplete(questions.length, questions.length);
    scrollToTop();
  }

  if (finished) {
    return (
      <div ref={quizRef}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-indigo-100">
            <Trophy className="w-7 h-7 text-indigo-600" />
          </div>

          <h3 className="text-2xl font-extrabold text-ink-900 mb-1">Quiz complete!</h3>
          <p className="text-ink-500 mb-1">
            All <span className="font-bold text-ink-900">{questions.length}</span> questions answered correctly.
          </p>

          {bestStreak > 1 && (
            <p className="text-sm text-indigo-600 font-semibold mb-4">
              <Zap className="w-3.5 h-3.5 inline" /> Best streak: {bestStreak} in a row
            </p>
          )}

          <p className="text-sm text-ink-400 mb-6">Nice work. You can move to the next module.</p>

          <button onClick={() => onComplete(questions.length, questions.length)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={quizRef}>
      {/* Question dots / navigation */}
      <div className="flex items-center gap-1.5 mb-6">
        {questions.map((_, i) => {
          const ans = answers[i];
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                i === currentIndex
                  ? 'bg-indigo-600 text-white'
                  : ans
                  ? 'bg-green-100 text-green-700'
                  : 'bg-ink-100 text-ink-500 hover:bg-ink-200'
              }`}
            >
              {ans ? <Check className="w-4 h-4" /> : i + 1}
            </button>
          );
        })}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          <p className="text-xs text-ink-400 font-semibold mb-2">Question {currentIndex + 1} of {questions.length}</p>
          <h3 className="text-lg font-bold text-ink-900 mb-5"><InlineMarkdown content={current.question} /></h3>

          <div className="space-y-2.5">
            {current.options.map((option, i) => {
              let style = 'border-ink-200 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer';

              if (isLocked && i === currentAnswer.selected) {
                // Correct answer locked in
                style = 'border-green-500 bg-green-50 cursor-default';
              } else if (isLocked) {
                style = 'border-ink-100 cursor-default opacity-60';
              } else if (wrongPick === i) {
                // Flash wrong
                style = 'border-red-400 bg-red-50 cursor-pointer';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isLocked}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${style}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isLocked && i === currentAnswer.selected ? 'border-green-500 text-green-600 bg-green-50' :
                      wrongPick === i ? 'border-red-400 text-red-500 bg-red-50' :
                      'border-ink-300 text-ink-500'
                    }`}>
                      {isLocked && i === currentAnswer.selected ? <CheckCircle2 className="w-4 h-4" /> :
                       wrongPick === i ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-ink-700"><InlineMarkdown content={option} /></span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isLocked && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-xl text-sm font-medium flex items-center gap-2 bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 className="w-4 h-4" /> Correct!
            </motion.div>
          )}
          {wrongPick !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-xl text-sm font-medium flex items-center gap-2 bg-red-50 text-red-700 border border-red-200">
              <XCircle className="w-4 h-4" /> Not quite. Try again!
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink-100">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Show finish button when all answered */}
        {answeredCount === questions.length ? (
          <button
            onClick={handleFinish}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            See results <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress text */}
      <p className="text-center text-xs text-ink-400 mt-4">
        {answeredCount} of {questions.length} answered
      </p>
    </div>
  );
}
