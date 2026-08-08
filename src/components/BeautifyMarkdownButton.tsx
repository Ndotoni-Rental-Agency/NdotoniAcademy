'use client';

import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { beautifyLessonMarkdown } from '@/graphql/mutations';
import type { BeautifyLessonMarkdownMutation, BeautifyLessonMarkdownMutationVariables } from '@/API';

/**
 * Runs whatever's currently in the lesson body — freshly transcribed,
 * manually typed, or already-saved text being edited — through Claude to
 * reformat it into cleaner Markdown (real headings/lists/tables, math
 * converted to LaTeX for KaTeX rendering) without changing its meaning. A
 * separate explicit action, not automatic on transcribe, since an
 * instructor may have already hand-edited the text and not want it touched
 * without asking.
 */
export default function BeautifyMarkdownButton({
  body, onBeautified, disabled,
}: {
  body: string;
  onBeautified: (text: string) => void;
  disabled?: boolean;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!body.trim() || busy) return;
    setBusy(true);
    try {
      const { beautifyLessonMarkdown: polished } = await GraphQLClient.execute<BeautifyLessonMarkdownMutation>(
        beautifyLessonMarkdown,
        { text: body } satisfies BeautifyLessonMarkdownMutationVariables
      );
      onBeautified(polished);
      toast.success('Formatting polished.');
    } catch (err) {
      console.error('[BeautifyMarkdownButton] beautify failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not polish this text.');
    } finally {
      setBusy(false);
    }
  }

  const isDisabled = disabled || busy || !body.trim();

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      title="Reformat with AI: real headings, lists, tables, and math converted to LaTeX — meaning left unchanged"
      className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors flex-shrink-0 ${
        isDisabled ? 'text-ink-300 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-700 cursor-pointer'
      }`}
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
      {busy ? 'Polishing...' : 'Polish formatting with AI'}
    </button>
  );
}
