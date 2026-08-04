'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { transcribeUploadedFile, TRANSCRIBABLE_TYPES } from '@/lib/transcribe-file';
import { generateFlashcardsFromText, generateQuizFromText } from '@/graphql/mutations';
import type {
  GenerateFlashcardsFromTextMutation, GenerateFlashcardsFromTextMutationVariables,
  GenerateQuizFromTextMutation, GenerateQuizFromTextMutationVariables,
} from '@/API';
import type { CardDraft } from './FlashcardEditor';
import type { QuestionDraft } from './QuizEditor';

type GenerateFromDocumentButtonProps =
  | { kind: 'flashcards'; onGenerated: (items: CardDraft[]) => void; disabled?: boolean }
  | { kind: 'quiz'; onGenerated: (items: QuestionDraft[]) => void; disabled?: boolean };

const LABELS: Record<'flashcards' | 'quiz', { noun: string; hint: string }> = {
  flashcards: {
    noun: 'flashcards',
    hint: 'Upload lecture notes or a syllabus — Claude drafts study flashcards from it that you review and edit before saving.',
  },
  quiz: {
    noun: 'quiz questions',
    hint: 'Upload lecture notes or a syllabus — Claude drafts multiple-choice questions from it that you review and edit before saving.',
  },
};

/**
 * Uploads a document, transcribes it (lib/transcribe-file.ts — same flow
 * the TEXT lesson's "upload to transcribe" button uses), then sends the
 * extracted text to generateFlashcardsFromText/generateQuizFromText and
 * hands the drafted items back. Purely additive — the caller appends onto
 * whatever cards/questions already exist, nothing is ever silently
 * replaced, and nothing is saved until the instructor hits Save like normal.
 */
export default function GenerateFromDocumentButton(props: GenerateFromDocumentButtonProps) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<'transcribing' | 'generating' | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const disabled = props.disabled || busy;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setBusy(true);
    setStage('transcribing');
    try {
      const text = await transcribeUploadedFile(file, (current, total) => {
        if (total > 1) setProgress({ current, total });
      });
      setStage('generating');
      setProgress(null);

      if (props.kind === 'flashcards') {
        const { generateFlashcardsFromText: items } = await GraphQLClient.execute<GenerateFlashcardsFromTextMutation>(
          generateFlashcardsFromText,
          { text } satisfies GenerateFlashcardsFromTextMutationVariables
        );
        props.onGenerated(items.map((item) => ({
          id: item.id, front: item.front, back: item.back, frontMedia: null, backMedia: null,
        })));
      } else {
        const { generateQuizFromText: items } = await GraphQLClient.execute<GenerateQuizFromTextMutation>(
          generateQuizFromText,
          { text } satisfies GenerateQuizFromTextMutationVariables
        );
        props.onGenerated(items.map((item) => ({
          id: item.id, question: item.question, options: item.options, correctIndex: item.correctIndex,
        })));
      }
      toast.success(`Generated ${LABELS[props.kind].noun}.`);
    } catch (err) {
      console.error('[GenerateFromDocumentButton] generate failed ->', err);
      const message = err instanceof Error ? err.message : 'Could not generate from that document.';
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
      setStage(null);
      setProgress(null);
    }
  }

  const label = busy
    ? stage === 'transcribing'
      ? progress ? `Reading part ${progress.current} of ${progress.total}...` : 'Reading document...'
      : `Generating ${LABELS[props.kind].noun}...`
    : `Generate ${LABELS[props.kind].noun} from a document`;

  return (
    <div className="mb-3">
      <label
        className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
          disabled ? 'text-ink-300 cursor-not-allowed' : 'text-coral-600 hover:text-coral-700 cursor-pointer'
        }`}
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
        {label}
        <input
          type="file"
          accept={TRANSCRIBABLE_TYPES.join(',')}
          disabled={disabled}
          onChange={handleFile}
          className="hidden"
        />
      </label>
      {error ? (
        <p className="mt-1 text-[11px] text-red-600">{error}</p>
      ) : (
        <p className="mt-1 text-[11px] text-ink-400">{LABELS[props.kind].hint}</p>
      )}
    </div>
  );
}
