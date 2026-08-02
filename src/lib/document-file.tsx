import { File, FileSpreadsheet, FileText, Presentation } from 'lucide-react';

export function extensionFromUrl(url: string): string {
  return url.split('.').pop()?.toLowerCase() ?? '';
}

// Upload keys look like `media/{userId}/{12-char-nanoid}-{sanitized-original-filename}`
// — strip the nanoid prefix back off so the learner/instructor sees the real filename.
export function filenameFromUrl(url: string): string {
  const segment = decodeURIComponent(url.split('/').pop() ?? '');
  const match = segment.match(/^[A-Za-z0-9_-]{12}-(.+)$/);
  return match ? match[1] : segment;
}

export function DocumentIcon({ extension, className = 'w-5 h-5' }: { extension: string; className?: string }) {
  if (extension === 'pdf') return <FileText className={`${className} text-red-500`} />;
  if (extension === 'xls' || extension === 'xlsx') return <FileSpreadsheet className={`${className} text-green-600`} />;
  if (extension === 'ppt' || extension === 'pptx') return <Presentation className={`${className} text-orange-500`} />;
  if (extension === 'doc' || extension === 'docx') return <FileText className={`${className} text-blue-600`} />;
  return <File className={`${className} text-ink-400`} />;
}
