'use client';

import { useRef, useState } from 'react';
import { Loader2, Upload, X, XCircle } from 'lucide-react';
import { uploadMedia } from '@/lib/upload-media';
import { DocumentIcon, extensionFromUrl, filenameFromUrl } from '@/lib/document-file';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

interface DocumentUploaderProps {
  value?: string;
  onUploaded: (fileUrl: string) => void;
  disabled?: boolean;
}

/**
 * Drag-and-drop or click-to-browse document uploader for DOCUMENT lessons —
 * PDF, Word, Excel, or PowerPoint. Same presigned-S3-PUT flow as
 * ThumbnailUploader/MediaField, just with a file card instead of an image
 * preview once uploaded (documents aren't previewable as a thumbnail).
 */
export default function DocumentUploader({ value, onUploaded, disabled }: DocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  async function upload(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. PDF, Word, Excel, or PowerPoint only.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const fileUrl = await uploadMedia(file);
      onUploaded(fileUrl);
    } catch (err) {
      console.error('[DocumentUploader] upload failed ->', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-ink-200 px-4 py-3">
          <div className="w-11 h-11 rounded-lg bg-ink-50 flex items-center justify-center flex-shrink-0">
            <DocumentIcon extension={extensionFromUrl(value)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink-900 truncate">{filenameFromUrl(value)}</p>
            <p className="text-[11px] text-ink-400 uppercase tracking-wide">{extensionFromUrl(value)}</p>
          </div>
          <button
            type="button"
            onClick={() => onUploaded('')}
            disabled={disabled}
            className="text-ink-300 hover:text-red-500 transition-colors flex-shrink-0 disabled:opacity-60"
            aria-label="Remove document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && !disabled && inputRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          } ${
            dragOver
              ? 'border-coral-300 bg-coral-50 text-coral-600'
              : 'border-ink-200 text-ink-500 hover:border-coral-300 hover:text-coral-600'
          }`}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span className="text-sm font-bold">
            {uploading ? 'Uploading...' : 'Drag a document here, or click to browse'}
          </span>
          <span className="text-xs text-ink-400">PDF, Word, Excel, or PowerPoint</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = '';
        }}
        className="hidden"
      />
      {error && (
        <p className="mt-1.5 flex items-start gap-1.5 text-sm text-red-600">
          <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
