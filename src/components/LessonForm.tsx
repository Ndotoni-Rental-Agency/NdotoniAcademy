'use client';

import { useState } from 'react';
import { Check, Loader2, Plus, X, XCircle, Video, Music, Link2, Sparkles, FileText, Layers, HelpCircle } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { createLessonForModule, updateLesson } from '@/graphql/mutations';
import { LessonType } from '@/API';
import type {
  CreateLessonForModuleMutation, CreateLessonForModuleMutationVariables, CreateLessonInput,
  UpdateLessonMutation, UpdateLessonMutationVariables, UpdateLessonInput, LessonQuery,
} from '@/API';
import FlashcardEditor, { type CardDraft } from './FlashcardEditor';

export type EditableLesson = NonNullable<LessonQuery['lesson']>;

export const LESSON_TYPE_ICONS: Record<LessonType, typeof Video> = {
  [LessonType.VIDEO]: Video,
  [LessonType.AUDIO]: Music,
  [LessonType.EMBED]: Link2,
  [LessonType.ANIMATION]: Sparkles,
  [LessonType.TEXT]: FileText,
  [LessonType.FLASHCARDS]: Layers,
  [LessonType.QUIZ]: HelpCircle,
};

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  [LessonType.VIDEO]: 'Video',
  [LessonType.AUDIO]: 'Audio',
  [LessonType.EMBED]: 'Embed',
  [LessonType.ANIMATION]: 'Animation',
  [LessonType.TEXT]: 'Text',
  [LessonType.FLASHCARDS]: 'Flashcards',
  [LessonType.QUIZ]: 'Quiz',
};

const LESSON_TYPES = Object.values(LessonType);

interface QuestionDraft {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface LessonFormProps {
  moduleId: string;
  /** When present, edits this lesson (updateLesson) instead of creating a new one. Lesson type can't change once set, so the type-picker step is skipped. */
  editLesson?: EditableLesson;
  onSaved: () => void;
  onCancel: () => void;
}

export default function LessonForm({ moduleId, editLesson, onSaved, onCancel }: LessonFormProps) {
  const [type, setType] = useState<LessonType | null>(editLesson?.type ?? null);
  const [title, setTitle] = useState(editLesson?.title ?? '');
  const [videoUrl, setVideoUrl] = useState(editLesson?.videoUrl ?? '');
  const [audioUrl, setAudioUrl] = useState(editLesson?.audioUrl ?? '');
  const [embedUrl, setEmbedUrl] = useState(editLesson?.embedUrl ?? '');
  const [animationRef, setAnimationRef] = useState(editLesson?.animationRef ?? '');
  const [body, setBody] = useState(editLesson?.body ?? '');
  const [durationMinutes, setDurationMinutes] = useState(
    editLesson?.durationSeconds ? Math.round(editLesson.durationSeconds / 60) : 5
  );
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    editLesson?.questions?.map((q) => ({ id: q.id, question: q.question, options: q.options, correctIndex: q.correctIndex })) ?? []
  );
  const [cards, setCards] = useState<CardDraft[]>(
    editLesson?.cards?.map((c) => ({
      id: c.id, front: c.front, back: c.back,
      frontMedia: c.frontMedia ?? null, backMedia: c.backMedia ?? null,
    })) ?? []
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function pickType(next: LessonType) {
    setType(next);
    setError('');
    if (next === LessonType.QUIZ && questions.length === 0) {
      setQuestions([{ id: crypto.randomUUID(), question: '', options: ['', ''], correctIndex: 0 }]);
    }
    if (next === LessonType.FLASHCARDS && cards.length === 0) {
      setCards([{ id: crypto.randomUUID(), front: '', back: '', frontMedia: null, backMedia: null }]);
    }
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, { id: crypto.randomUUID(), question: '', options: ['', ''], correctIndex: 0 }]);
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(id: string, patch: Partial<QuestionDraft>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function addOption(questionId: string) {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, options: [...q.options, ''] } : q)));
  }

  function updateOption(questionId: string, index: number, value: string) {
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== questionId) return q;
      const options = [...q.options];
      options[index] = value;
      return { ...q, options };
    }));
  }

  function validate(): string {
    if (!title.trim()) return 'Give this lesson a title first.';
    switch (type) {
      case LessonType.VIDEO:
        if (!videoUrl.trim()) return 'Add a video URL.';
        break;
      case LessonType.AUDIO:
        if (!audioUrl.trim()) return 'Add an audio URL.';
        break;
      case LessonType.EMBED:
        if (!embedUrl.trim()) return 'Add an embed URL.';
        break;
      case LessonType.ANIMATION:
        if (!animationRef.trim()) return 'Add an animation reference.';
        break;
      case LessonType.TEXT:
        if (!body.trim()) return 'Add the lesson text.';
        break;
      case LessonType.QUIZ:
        if (questions.length === 0) return 'Add at least one question.';
        for (const q of questions) {
          if (!q.question.trim()) return 'Every question needs its text filled in.';
          const filled = q.options.filter((o) => o.trim());
          if (filled.length < 2) return 'Every question needs at least two options.';
        }
        break;
      case LessonType.FLASHCARDS:
        if (cards.length === 0) return 'Add at least one card.';
        for (const c of cards) {
          if (!c.front.trim() || !c.back.trim()) return 'Every card needs both a front and a back.';
        }
        break;
    }
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!type) return;
    setError('');
    setSubmitting(true);
    try {
      const contentFields: Partial<CreateLessonInput> = {};
      if (type === LessonType.VIDEO) {
        contentFields.videoUrl = videoUrl.trim();
        contentFields.durationSeconds = durationMinutes * 60;
      } else if (type === LessonType.AUDIO) {
        contentFields.audioUrl = audioUrl.trim();
        contentFields.durationSeconds = durationMinutes * 60;
      } else if (type === LessonType.EMBED) {
        contentFields.embedUrl = embedUrl.trim();
      } else if (type === LessonType.ANIMATION) {
        contentFields.animationRef = animationRef.trim();
      } else if (type === LessonType.TEXT) {
        contentFields.body = body.trim();
      } else if (type === LessonType.QUIZ) {
        contentFields.questions = questions.map((q) => ({
          id: q.id,
          question: q.question.trim(),
          options: q.options.map((o) => o.trim()).filter(Boolean),
          correctIndex: q.correctIndex,
        }));
      } else if (type === LessonType.FLASHCARDS) {
        contentFields.cards = cards.map((c) => ({
          id: c.id,
          front: c.front.trim(),
          back: c.back.trim(),
          ...(c.frontMedia ? { frontMedia: c.frontMedia } : {}),
          ...(c.backMedia ? { backMedia: c.backMedia } : {}),
        }));
      }

      if (editLesson) {
        const input: UpdateLessonInput = { title: title.trim(), ...contentFields };
        await GraphQLClient.execute<UpdateLessonMutation>(updateLesson, {
          id: editLesson.lessonId,
          input,
        } satisfies UpdateLessonMutationVariables);
      } else {
        const input: CreateLessonInput = { title: title.trim(), type, ...contentFields };
        await GraphQLClient.execute<CreateLessonForModuleMutation>(createLessonForModule, {
          moduleId,
          input,
          isFree: false,
        } satisfies CreateLessonForModuleMutationVariables);
      }
      onSaved();
    } catch (err) {
      console.error('[LessonForm] save failed ->', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = 'w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60';

  if (!type) {
    return (
      <div className="px-6 py-5">
        <p className="text-xs font-bold text-ink-500 mb-3">What kind of lesson?</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {LESSON_TYPES.map((t) => {
            const Icon = LESSON_TYPE_ICONS[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => pickType(t)}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-100 px-3 py-1.5 text-xs font-bold text-ink-700 hover:border-coral-200 hover:bg-coral-50 hover:text-coral-700 transition-colors"
              >
                <Icon className="w-3.5 h-3.5" /> {LESSON_TYPE_LABELS[t]}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={onCancel} className="text-xs font-semibold text-ink-400 hover:text-ink-600 transition-colors">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
      <div className="flex items-center gap-1.5 text-xs font-bold text-coral-700">
        {(() => { const Icon = LESSON_TYPE_ICONS[type]; return <Icon className="w-3.5 h-3.5" />; })()}
        {LESSON_TYPE_LABELS[type]}
      </div>

      <input
        type="text"
        required
        autoFocus
        placeholder="Lesson title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={submitting}
        className={inputClass}
      />

      {type === LessonType.VIDEO && (
        <div className="flex gap-3">
          <input type="url" placeholder="Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} disabled={submitting} className={`${inputClass} flex-1`} />
          <input type="number" min={0} aria-label="Duration in minutes" placeholder="Min" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} disabled={submitting} className={`${inputClass} w-20`} />
        </div>
      )}

      {type === LessonType.AUDIO && (
        <div className="flex gap-3">
          <input type="url" placeholder="Audio URL" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} disabled={submitting} className={`${inputClass} flex-1`} />
          <input type="number" min={0} aria-label="Duration in minutes" placeholder="Min" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} disabled={submitting} className={`${inputClass} w-20`} />
        </div>
      )}

      {type === LessonType.EMBED && (
        <div>
          <input type="url" placeholder="Embed URL" value={embedUrl} onChange={(e) => setEmbedUrl(e.target.value)} disabled={submitting} className={inputClass} />
          <p className="mt-1 text-[11px] text-ink-400">A YouTube or Vimeo link works as-is. Other sites need their own &quot;Embed&quot; share link.</p>
        </div>
      )}

      {type === LessonType.ANIMATION && (
        <input type="text" placeholder="Animation reference" value={animationRef} onChange={(e) => setAnimationRef(e.target.value)} disabled={submitting} className={inputClass} />
      )}

      {type === LessonType.TEXT && (
        <textarea rows={4} placeholder="Lesson text" value={body} onChange={(e) => setBody(e.target.value)} disabled={submitting} className={inputClass} />
      )}

      {type === LessonType.QUIZ && (
        <div className="space-y-3">
          {questions.map((q, qi) => (
            <div key={q.id} className="rounded-lg border border-ink-100 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Question ${qi + 1}`}
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                  disabled={submitting}
                  className={`${inputClass} flex-1`}
                />
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(q.id)} className="text-ink-300 hover:text-red-500 transition-colors flex-shrink-0" aria-label="Remove question">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2 pl-2">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(q.id, { correctIndex: oi })}
                    disabled={submitting}
                    aria-label={`Option ${oi + 1} is correct`}
                  />
                  <input
                    type="text"
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(q.id, oi, e.target.value)}
                    disabled={submitting}
                    className={`${inputClass} flex-1`}
                  />
                </div>
              ))}
              <button type="button" onClick={() => addOption(q.id)} className="text-xs font-semibold text-coral-600 hover:text-coral-700 transition-colors pl-2">
                + Add option
              </button>
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="text-xs font-bold text-coral-600 hover:text-coral-700 transition-colors">
            + Add question
          </button>
        </div>
      )}

      {type === LessonType.FLASHCARDS && (
        <FlashcardEditor cards={cards} onChange={setCards} disabled={submitting} />
      )}

      {error && (
        <p className="flex items-start gap-1.5 text-sm text-red-600">
          <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-coral-600 px-4 py-2 text-xs font-bold text-white hover:bg-coral-700 transition-colors disabled:opacity-60"
        >
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : editLesson ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {editLesson ? 'Save changes' : 'Add lesson'}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting} className="text-xs font-semibold text-ink-400 hover:text-ink-600 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
