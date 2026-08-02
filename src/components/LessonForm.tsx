'use client';

import { useState } from 'react';
import { Check, Loader2, Plus, XCircle, Video, Music, Link2, Sparkles, FileText, Layers, HelpCircle, Paperclip, Upload } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { uploadMedia } from '@/lib/upload-media';
import { transcribeDocument } from '@/lib/transcribe';
import { createLessonForModule, updateLesson } from '@/graphql/mutations';
import { LessonType, MediaType } from '@/API';
import type {
  CreateLessonForModuleMutation, CreateLessonForModuleMutationVariables, CreateLessonInput,
  UpdateLessonMutation, UpdateLessonMutationVariables, UpdateLessonInput, LessonQuery,
} from '@/API';
import FlashcardEditor, { type CardDraft } from './FlashcardEditor';
import QuizEditor, { type QuestionDraft } from './QuizEditor';
import DocumentUploader from './DocumentUploader';
import type { MediaValue } from './MediaField';

const TRANSCRIBABLE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export type EditableLesson = NonNullable<LessonQuery['lesson']>;

export const LESSON_TYPE_ICONS: Record<LessonType, typeof Video> = {
  [LessonType.VIDEO]: Video,
  [LessonType.AUDIO]: Music,
  [LessonType.EMBED]: Link2,
  [LessonType.ANIMATION]: Sparkles,
  [LessonType.TEXT]: FileText,
  [LessonType.FLASHCARDS]: Layers,
  [LessonType.QUIZ]: HelpCircle,
  [LessonType.DOCUMENT]: Paperclip,
};

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  [LessonType.VIDEO]: 'Video',
  [LessonType.AUDIO]: 'Audio',
  [LessonType.EMBED]: 'Embed',
  [LessonType.ANIMATION]: 'Animation',
  [LessonType.TEXT]: 'Text',
  [LessonType.FLASHCARDS]: 'Flashcards',
  [LessonType.QUIZ]: 'Quiz',
  [LessonType.DOCUMENT]: 'Document',
};

const LESSON_TYPES = Object.values(LessonType);

interface LessonFormProps {
  moduleId: string;
  /** Only needed to create a new lesson (isFree is resolved from the course's price + placement order). Not required when editing. */
  courseId?: string;
  /** When present, edits this lesson (updateLesson) instead of creating a new one. Lesson type can't change once set, so the type-picker step is skipped. */
  editLesson?: EditableLesson;
  onSaved: () => void;
  onCancel: () => void;
}

export default function LessonForm({ moduleId, courseId, editLesson, onSaved, onCancel }: LessonFormProps) {
  const toast = useToast();
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
  const [documentMedia, setDocumentMedia] = useState<MediaValue | null>(editLesson?.document ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState('');

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

  async function handleTranscribeFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!TRANSCRIBABLE_TYPES.includes(file.type)) {
      setTranscribeError('Only PDF or Word (.docx) documents can be transcribed.');
      return;
    }
    setTranscribeError('');
    setTranscribing(true);
    try {
      const fileUrl = await uploadMedia(file);
      const text = await transcribeDocument(fileUrl);
      setBody((prev) => (prev.trim() ? `${prev.trim()}\n\n${text}` : text));
      toast.success('Document transcribed.');
    } catch (err) {
      console.error('[LessonForm] transcribe failed ->', err);
      const message = err instanceof Error ? err.message : 'Could not transcribe that document.';
      setTranscribeError(message);
      toast.error(message);
    } finally {
      setTranscribing(false);
    }
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
      case LessonType.DOCUMENT:
        if (!documentMedia) return 'Upload a document.';
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
      } else if (type === LessonType.DOCUMENT) {
        contentFields.document = documentMedia ?? undefined;
      }

      if (editLesson) {
        const input: UpdateLessonInput = { title: title.trim(), ...contentFields };
        await GraphQLClient.execute<UpdateLessonMutation>(updateLesson, {
          id: editLesson.lessonId,
          input,
        } satisfies UpdateLessonMutationVariables);
      } else {
        if (!courseId) throw new Error('Missing courseId for a new lesson.');
        const input: CreateLessonInput = { title: title.trim(), type, ...contentFields };
        await GraphQLClient.execute<CreateLessonForModuleMutation>(createLessonForModule, {
          moduleId,
          courseId,
          input,
        } satisfies CreateLessonForModuleMutationVariables);
      }
      toast.success(editLesson ? 'Lesson updated.' : 'Lesson added.');
      onSaved();
    } catch (err) {
      console.error('[LessonForm] save failed ->', err);
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
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
          <div className="flex-1">
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">Video URL</label>
            <input type="url" placeholder="https://youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} disabled={submitting} className={inputClass} />
          </div>
          <div className="w-20">
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">Minutes</label>
            <input type="number" min={0} aria-label="Duration in minutes" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} disabled={submitting} className={inputClass} />
          </div>
        </div>
      )}

      {type === LessonType.AUDIO && (
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">Audio URL</label>
            <input type="url" placeholder="https://..." value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} disabled={submitting} className={inputClass} />
          </div>
          <div className="w-20">
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">Minutes</label>
            <input type="number" min={0} aria-label="Duration in minutes" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} disabled={submitting} className={inputClass} />
          </div>
        </div>
      )}

      {type === LessonType.EMBED && (
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">Embed URL</label>
          <input type="url" placeholder="https://youtube.com/watch?v=..." value={embedUrl} onChange={(e) => setEmbedUrl(e.target.value)} disabled={submitting} className={inputClass} />
          <p className="mt-1 text-[11px] text-ink-400">A YouTube or Vimeo link works as-is. Other sites need their own &quot;Embed&quot; share link.</p>
        </div>
      )}

      {type === LessonType.ANIMATION && (
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">Animation reference</label>
          <input type="text" placeholder="e.g. a Lottie file key" value={animationRef} onChange={(e) => setAnimationRef(e.target.value)} disabled={submitting} className={inputClass} />
        </div>
      )}

      {type === LessonType.TEXT && (
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase tracking-wide text-ink-400">Lesson text</label>
            <label
              className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                transcribing || submitting ? 'text-ink-300 cursor-not-allowed' : 'text-coral-600 hover:text-coral-700 cursor-pointer'
              }`}
            >
              {transcribing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {transcribing ? 'Transcribing...' : 'Upload a document to transcribe'}
              <input
                type="file"
                accept={TRANSCRIBABLE_TYPES.join(',')}
                disabled={transcribing || submitting}
                onChange={handleTranscribeFile}
                className="hidden"
              />
            </label>
          </div>
          <textarea rows={6} placeholder="Write the lesson content here, or upload a document above to auto-fill it..." value={body} onChange={(e) => setBody(e.target.value)} disabled={submitting} className={inputClass} />
          {transcribeError && <p className="mt-1 text-[11px] text-red-600">{transcribeError}</p>}
          <p className="mt-1 text-[11px] text-ink-400">PDF or Word (.docx) only — extracted text is appended below anything already here, so you can review and edit it.</p>
        </div>
      )}

      {type === LessonType.QUIZ && (
        <QuizEditor questions={questions} onChange={setQuestions} disabled={submitting} />
      )}

      {type === LessonType.FLASHCARDS && (
        <FlashcardEditor cards={cards} onChange={setCards} disabled={submitting} />
      )}

      {type === LessonType.DOCUMENT && (
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ink-400">Document</label>
          <DocumentUploader
            value={documentMedia?.url}
            onUploaded={(fileUrl) => setDocumentMedia(fileUrl ? { url: fileUrl, type: MediaType.DOCUMENT } : null)}
            disabled={submitting}
          />
        </div>
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
