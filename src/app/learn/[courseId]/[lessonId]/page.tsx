'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Play, FileText, Headphones,
  Image as ImageIcon, CreditCard, ClipboardList, CheckCircle2,
  XCircle, ChevronDown, ChevronUp, BookOpen, RotateCcw,
} from 'lucide-react';
import {
  getCourseDetail, getQuestions,
} from '@/lib/education-mock-data';
import type { ContentBlock, Assessment, Question } from '@/lib/education-model';

// ─── Types ────────────────────────────────────────────────────

type LessonEntry = {
  lesson: { id: string; title: string; isFree: boolean; moduleId: string };
  contentBlocks: ContentBlock[];
  assessments: Assessment[];
};

// ─── Content renderers ────────────────────────────────────────

function VideoBlock({ block }: { block: ContentBlock }) {
  const url = (block.data as { type: 'VIDEO'; url: string }).url;
  return (
    <div className="rounded-2xl overflow-hidden bg-black aspect-video">
      <iframe
        src={url}
        title={block.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

function TextBlock({ block }: { block: ContentBlock }) {
  const markdown = (block.data as { type: 'TEXT'; markdown: string }).markdown;
  const html = markdown
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-ink-900 mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-extrabold text-ink-900 mt-6 mb-3">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-indigo-300 pl-4 text-ink-600 italic my-3">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-ink-700">$1</li>')
    .replace(/^---$/gm, '<hr class="my-4 border-ink-200"/>')
    .replace(/\n\n/g, '</p><p class="mb-3 text-ink-700 leading-relaxed">');

  return (
    <div className="prose prose-sm max-w-none bg-white rounded-2xl border border-ink-100 p-6">
      <p className="mb-3 text-ink-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function AudioBlock({ block }: { block: ContentBlock }) {
  const url = (block.data as { type: 'AUDIO'; url: string }).url;
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-100">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-ink-900">{block.title}</p>
          {block.caption && <p className="text-sm text-ink-500">{block.caption}</p>}
        </div>
      </div>
      <audio controls className="w-full rounded-lg">
        <source src={url} />
        Kivinjari chako hakisaidii sauti.
      </audio>
    </div>
  );
}

function ImageBlock({ block }: { block: ContentBlock }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-ink-100">
      {/* In a real app this would be a Next/Image */}
      <div className="bg-ink-100 flex items-center justify-center h-48 text-ink-400 text-sm gap-2">
        <ImageIcon className="w-5 h-5" />
        <span>{block.title}</span>
      </div>
      {block.caption && (
        <p className="text-xs text-ink-500 text-center py-2 px-4 bg-ink-50">{block.caption}</p>
      )}
    </div>
  );
}

function FlashcardBlock({ block }: { block: ContentBlock }) {
  const cards = (block.data as { type: 'FLASHCARD'; cards: { id: string; front: string; back: string; hint?: string }[] }).cards;
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = cards[idx];
  const prev = () => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); };
  const next = () => { setIdx(i => Math.min(cards.length - 1, i + 1)); setFlipped(false); };

  return (
    <div className="bg-white rounded-2xl border border-ink-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-ink-500">{block.title}</p>
        <span className="text-xs text-ink-400">{idx + 1} / {cards.length}</span>
      </div>

      {/* Card */}
      <button
        onClick={() => setFlipped(f => !f)}
        className="w-full h-40 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 transition-colors"
      >
        <p className="text-3xl font-extrabold text-indigo-700">{flipped ? current.back : current.front}</p>
        {!flipped && current.hint && (
          <p className="text-xs text-ink-400">{current.hint}</p>
        )}
        <p className="text-[10px] text-ink-300 mt-2">Gonga kubadilisha ↩</p>
      </button>

      {/* Nav */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button onClick={prev} disabled={idx === 0}
          className="p-2 rounded-lg bg-ink-100 hover:bg-ink-200 disabled:opacity-30 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <button key={i} onClick={() => { setIdx(i); setFlipped(false); }}
              className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-indigo-600' : 'bg-ink-200'}`} />
          ))}
        </div>
        <button onClick={next} disabled={idx === cards.length - 1}
          className="p-2 rounded-lg bg-ink-100 hover:bg-ink-200 disabled:opacity-30 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function QuizBlock({ assessment }: { assessment: Assessment }) {
  const questions = getQuestions(assessment.id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) return null;

  const totalPoints = questions.reduce((s, q) => s + q.points, 0);
  const earnedPoints = submitted
    ? questions.reduce((s, q) => s + (answers[q.id] === q.answer ? q.points : 0), 0)
    : 0;
  const pct = submitted ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = pct >= assessment.passingScore;

  return (
    <div className="bg-white rounded-2xl border-2 border-sky-200 overflow-hidden">
      <div className="bg-sky-50 px-5 py-4 flex items-center justify-between border-b border-sky-200">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-sky-600" />
          <p className="font-bold text-ink-900 text-sm">{assessment.title}</p>
        </div>
        {submitted && (
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {pct}% — {passed ? 'Umepita ✓' : 'Jaribu tena'}
          </span>
        )}
      </div>

      <div className="p-5 space-y-5">
        {questions.map((q, qi) => (
          <QuestionItem
            key={q.id}
            question={q}
            index={qi}
            selected={answers[q.id]}
            submitted={submitted}
            onSelect={val => !submitted && setAnswers(a => ({ ...a, [q.id]: val }))}
          />
        ))}

        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < questions.length}
            className="w-full py-3 rounded-xl bg-sky-600 text-white font-bold text-sm hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Wasilisha Majibu
          </button>
        ) : (
          <button
            onClick={() => { setSubmitted(false); setAnswers({}); }}
            className="w-full py-3 rounded-xl border-2 border-ink-200 text-ink-700 font-bold text-sm hover:bg-ink-50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Jaribu Tena
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionItem({
  question, index, selected, submitted, onSelect,
}: {
  question: Question;
  index: number;
  selected: string | undefined;
  submitted: boolean;
  onSelect: (v: string) => void;
}) {
  const options: string[] = question.options.length > 0 ? question.options : ['Kweli', 'Si kweli'];

  return (
    <div>
      <p className="text-sm font-semibold text-ink-900 mb-2">
        {index + 1}. {question.questionText}
        <span className="ml-2 text-xs text-ink-400">({question.points} pt)</span>
      </p>

      {question.type === 'FILL_BLANK' ? (
        <input
          type="text"
          placeholder="Andika jibu hapa..."
          value={selected ?? ''}
          onChange={e => onSelect(e.target.value)}
          disabled={submitted}
          className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-ink-50"
        />
      ) : (
        <div className="space-y-2">
          {options.map((opt, oi) => {
            const val = String(oi);
            const isSelected = selected === val;
            const isCorrect = submitted && val === question.answer;
            const isWrong = submitted && isSelected && val !== question.answer;

            return (
              <button
                key={oi}
                onClick={() => onSelect(val)}
                disabled={submitted}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 text-left text-sm transition-all ${
                  isCorrect
                    ? 'border-green-400 bg-green-50 text-green-800'
                    : isWrong
                    ? 'border-red-400 bg-red-50 text-red-800'
                    : isSelected
                    ? 'border-sky-400 bg-sky-50 text-sky-800'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                  isCorrect ? 'border-green-500 bg-green-500 text-white' :
                  isWrong ? 'border-red-500 bg-red-500 text-white' :
                  isSelected ? 'border-sky-500 bg-sky-500 text-white' :
                  'border-ink-300'
                }`}>
                  {isCorrect ? <CheckCircle2 className="w-3 h-3" /> :
                   isWrong ? <XCircle className="w-3 h-3" /> :
                   isSelected ? '✓' : ''}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {submitted && question.explanation && (
        <p className="mt-2 text-xs text-ink-500 bg-ink-50 rounded-lg px-3 py-2">
          💡 {question.explanation}
        </p>
      )}
    </div>
  );
}

// ─── Content block dispatcher ─────────────────────────────────

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  return (
    <div>
      {block.type === 'VIDEO' && <VideoBlock block={block} />}
      {block.type === 'TEXT' && <TextBlock block={block} />}
      {block.type === 'AUDIO' && <AudioBlock block={block} />}
      {(block.type === 'IMAGE' || block.type === 'DIAGRAM') && <ImageBlock block={block} />}
      {block.type === 'FLASHCARD' && <FlashcardBlock block={block} />}
    </div>
  );
}

// ─── Sidebar module/lesson tree ───────────────────────────────

function CourseSidebar({
  allLessons,
  currentLessonId,
  courseId,
  courseColor,
}: {
  allLessons: { moduleTitle: string; moduleOrder: number; entries: LessonEntry[] }[];
  currentLessonId: string;
  courseId: string;
  courseColor?: string;
}) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  return (
    <nav className="w-72 flex-shrink-0 hidden lg:block border-r border-ink-100 overflow-y-auto max-h-[calc(100vh-64px)] sticky top-16">
      <div className="p-4 border-b border-ink-100">
        <Link href={`/learn/${courseId}`} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Rudi kwenye Kozi
        </Link>
      </div>
      {allLessons.map(({ moduleTitle, moduleOrder, entries }) => {
        const isCollapsed = collapsed[moduleOrder];
        return (
          <div key={moduleOrder}>
            <button
              onClick={() => setCollapsed(c => ({ ...c, [moduleOrder]: !c[moduleOrder] }))}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-500 hover:bg-ink-50 transition-colors"
            >
              <span>{moduleOrder}. {moduleTitle}</span>
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            {!isCollapsed && entries.map(({ lesson }) => (
              <Link
                key={lesson.id}
                href={lesson.isFree ? `/learn/${courseId}/${lesson.id}` : '#'}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  lesson.id === currentLessonId
                    ? 'font-semibold border-r-2 bg-indigo-50 text-indigo-700'
                    : 'text-ink-600 hover:bg-ink-50'
                } ${!lesson.isFree ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={lesson.id === currentLessonId ? { borderRightColor: courseColor ?? '#4F46E5' } : {}}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  lesson.id === currentLessonId ? 'bg-indigo-500' : 'bg-ink-200'
                }`} />
                {lesson.title}
              </Link>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = use(params);
  const detail = getCourseDetail(courseId);
  if (!detail) return <p className="p-8 text-ink-500">Kozi haipatikani.</p>;

  const { course, modules } = detail;

  // Build flat lesson list for navigation
  const allLessons = modules.map(({ module, lessons }) => ({
    moduleTitle: module.title,
    moduleOrder: module.order,
    entries: lessons,
  }));
  const flatLessons = allLessons.flatMap(m => m.entries);
  const currentIdx = flatLessons.findIndex(e => e.lesson.id === lessonId);
  const current = flatLessons[currentIdx];
  const prev = flatLessons[currentIdx - 1];
  const next = flatLessons[currentIdx + 1];

  if (!current) return <p className="p-8 text-ink-500">Somo halipatikani.</p>;

  const { lesson, contentBlocks, assessments } = current;
  const lessonQuiz = assessments.find(a => a.type === 'QUIZ' && a.scope === 'LESSON');
  const moduleAssessments = modules.find(m => m.module.id === lesson.moduleId)?.assessments ?? [];
  const moduleQuiz = moduleAssessments.find(a => a.type === 'QUIZ' && a.scope === 'MODULE');
  const moduleAssignment = moduleAssessments.find(a => a.type === 'ASSIGNMENT');
  const isLastInModule = !next || next.lesson.moduleId !== lesson.moduleId;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <CourseSidebar
        allLessons={allLessons}
        currentLessonId={lessonId}
        courseId={courseId}
        courseColor={course.color}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-ink-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={`/learn/${courseId}`}
              className="lg:hidden flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 transition-colors flex-shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-xs text-ink-400 truncate">{course.title}</p>
              <p className="text-sm font-bold text-ink-900 truncate">{lesson.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {prev && prev.lesson.isFree && (
              <Link href={`/learn/${courseId}/${prev.lesson.id}`}
                className="flex items-center gap-1 text-xs font-semibold text-ink-500 bg-ink-100 hover:bg-ink-200 px-3 py-1.5 rounded-lg transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" /> Nyuma
              </Link>
            )}
            {next && next.lesson.isFree && (
              <Link href={`/learn/${courseId}/${next.lesson.id}`}
                className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: course.color ?? '#4F46E5' }}>
                Mbele <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Lesson body */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Lesson header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-400">Somo {currentIdx + 1} / {flatLessons.length}</span>
              {lesson.isFree && (
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Bure</span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-ink-900">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-ink-500 mt-1 leading-relaxed">{lesson.description}</p>
            )}
            {lesson.objectiveIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {lesson.objectiveIds.map((obj: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                    <BookOpen className="w-3 h-3" /> {obj}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content blocks */}
          {contentBlocks.length > 0 ? (
            contentBlocks.map(block => (
              <ContentBlockRenderer key={block.id} block={block} />
            ))
          ) : (
            <div className="bg-ink-50 rounded-2xl p-8 text-center text-ink-400">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Maudhui yanakuja hivi karibuni.</p>
            </div>
          )}

          {/* Lesson quiz */}
          {lessonQuiz && <QuizBlock assessment={lessonQuiz} />}

          {/* Module-level assessment callouts (shown at last lesson of module) */}
          {isLastInModule && (moduleQuiz || moduleAssignment) && (
            <div className="rounded-2xl border border-ink-200 overflow-hidden">
              <div className="bg-ink-50 px-5 py-3 border-b border-ink-200">
                <p className="text-sm font-bold text-ink-700">Baada ya Moduli Hii</p>
              </div>
              <div className="divide-y divide-ink-100">
                {moduleQuiz && (
                  <div className="flex items-center gap-3 px-5 py-3.5">
                    <ClipboardList className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink-900">{moduleQuiz.title}</p>
                      <p className="text-xs text-ink-400">{moduleQuiz.timeLimit} dak · {moduleQuiz.passingScore}% kupita</p>
                    </div>
                    <span className="text-[11px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full uppercase">Quiz</span>
                  </div>
                )}
                {moduleAssignment && (
                  <div className="flex items-center gap-3 px-5 py-3.5">
                    <BookOpen className="w-4 h-4 text-violet-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink-900">{moduleAssignment.title}</p>
                      <p className="text-xs text-ink-400">Kazi ya nyumbani · pointi {moduleAssignment.weight}</p>
                    </div>
                    <span className="text-[11px] font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full uppercase">Kazi</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom nav */}
          <div className="flex items-center justify-between pt-4 border-t border-ink-100">
            {prev && prev.lesson.isFree ? (
              <Link href={`/learn/${courseId}/${prev.lesson.id}`}
                className="flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-ink-900 transition-colors">
                <ChevronLeft className="w-4 h-4" /> {prev.lesson.title}
              </Link>
            ) : <span />}
            {next ? (
              next.lesson.isFree ? (
                <Link href={`/learn/${courseId}/${next.lesson.id}`}
                  className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-colors hover:opacity-90"
                  style={{ background: course.color ?? '#4F46E5' }}>
                  {next.lesson.title} <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-sm text-ink-400 flex items-center gap-2">
                  {next.lesson.title} — Jiandikishe <ChevronRight className="w-4 h-4" />
                </span>
              )
            ) : (
              <Link href={`/learn/${courseId}`}
                className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl"
                style={{ background: course.color ?? '#4F46E5' }}>
                Maliza Kozi <CheckCircle2 className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
