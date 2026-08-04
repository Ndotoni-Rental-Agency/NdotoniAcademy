import { GraphQLClient } from './graphql-client';
import { uploadMedia } from './upload-media';
import { splitPdfIntoChunks } from './split-pdf';
import { transcribeDocument } from '@/graphql/mutations';
import type { TranscribeDocumentMutation, TranscribeDocumentMutationVariables } from '@/API';

export const TRANSCRIBABLE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/**
 * Uploads a PDF/Word document and returns its transcribed text — shared by
 * the TEXT lesson's "transcribe into body" flow and the Flashcards/Quiz
 * "generate from document" flow (GenerateFromDocumentButton), so both go
 * through the same PDF-chunking + Textract-timeout-avoidance logic instead
 * of duplicating it.
 */
export async function transcribeUploadedFile(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<string> {
  if (!TRANSCRIBABLE_TYPES.includes(file.type)) {
    throw new Error('Only PDF or Word (.docx) documents can be transcribed.');
  }
  // A long PDF would blow past AppSync's fixed 30s resolver timeout as one
  // Textract job — split into page-range chunks first so each is its own
  // small job, transcribed one at a time and stitched back together. No-op
  // (returns the file unchanged) for anything already within the limit, and
  // for .docx (mammoth doesn't have this problem — no OCR job, no per-call
  // time ceiling to work around).
  const chunks = file.type === 'application/pdf' ? await splitPdfIntoChunks(file) : [file];
  const texts: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    onProgress?.(i + 1, chunks.length);
    const fileUrl = await uploadMedia(chunks[i]);
    const { transcribeDocument: text } = await GraphQLClient.execute<TranscribeDocumentMutation>(
      transcribeDocument,
      { fileUrl } satisfies TranscribeDocumentMutationVariables
    );
    texts.push(text);
  }
  return texts.join('\n\n');
}
