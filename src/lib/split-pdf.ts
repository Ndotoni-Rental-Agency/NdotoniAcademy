import { PDFDocument } from 'pdf-lib';

// Kept comfortably under the backend's own MAX_PAGES=15 backstop
// (packages/lambda/src/shared/transcribe.ts) — each chunk needs to finish
// OCR well within AppSync's non-negotiable 30s resolver timeout, and
// smaller margins leave less room for a slow page.
const PAGES_PER_CHUNK = 10;

/**
 * Splits a PDF File into multiple smaller PDFs of at most PAGES_PER_CHUNK
 * pages each, so a long document can be transcribed as several small
 * Textract jobs instead of one that would blow past AppSync's 30s resolver
 * timeout. Returns the original file unchanged (as a single-element array)
 * if it's already within the limit.
 */
export async function splitPdfIntoChunks(file: File): Promise<File[]> {
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes);
  const pageCount = source.getPageCount();

  if (pageCount <= PAGES_PER_CHUNK) return [file];

  const baseName = file.name.replace(/\.pdf$/i, '');
  const chunks: File[] = [];
  for (let start = 0; start < pageCount; start += PAGES_PER_CHUNK) {
    const end = Math.min(start + PAGES_PER_CHUNK, pageCount);
    const chunkDoc = await PDFDocument.create();
    const pageIndices = Array.from({ length: end - start }, (_, i) => start + i);
    const copiedPages = await chunkDoc.copyPages(source, pageIndices);
    copiedPages.forEach((page) => chunkDoc.addPage(page));
    const chunkBytes = await chunkDoc.save();
    const partNumber = chunks.length + 1;
    chunks.push(
      new File([chunkBytes as BlobPart], `${baseName}-part${partNumber}.pdf`, { type: 'application/pdf' })
    );
  }
  return chunks;
}
