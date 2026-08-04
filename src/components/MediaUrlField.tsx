'use client';

import { useRef, useState } from 'react';
import { Loader2, Upload, XCircle } from 'lucide-react';
import { uploadMedia } from '@/lib/upload-media';
import VideoPlayer from './VideoPlayer';

// Must match the backend's upload allowlist exactly (CONTENT_TYPE_EXTENSIONS
// in ndotoniAcademyBackend/packages/lambda/src/shared/media.ts) — no
// transcoding pipeline exists, so only what the backend will actually accept
// belongs here. Catching an unsupported file client-side is instant;
// letting the backend reject it means a round trip for the same message.
const ACCEPTED_TYPES: Record<'video' | 'audio', string[]> = {
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
};

const UNSUPPORTED_MESSAGE: Record<'video' | 'audio', string> = {
  video: 'Unsupported file type. MP4 or WebM only.',
  audio: 'Unsupported file type. MP3 or WAV only.',
};

const inputClass = 'w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60';

/** Reads playback duration straight off the file — no manual entry, and no risk of it drifting from what was actually uploaded. */
function readDuration(file: File, kind: 'video' | 'audio'): Promise<number | null> {
  return new Promise((resolve) => {
    const el = document.createElement(kind);
    const objectUrl = URL.createObjectURL(file);
    const finish = (seconds: number | null) => {
      URL.revokeObjectURL(objectUrl);
      resolve(seconds);
    };
    el.preload = 'metadata';
    el.onloadedmetadata = () => finish(Number.isFinite(el.duration) ? Math.round(el.duration) : null);
    el.onerror = () => finish(null);
    el.src = objectUrl;
  });
}

interface MediaUrlFieldProps {
  kind: 'video' | 'audio';
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Called with the detected duration right after a successful upload, and with null when the value is cleared. Link mode doesn't report a duration — there's no reliable way to read one without fetching the remote file. */
  onDurationDetected?: (seconds: number | null) => void;
  linkPlaceholder: string;
  linkHint?: string;
  disabled?: boolean;
}

/**
 * Video/audio source for a lesson: either upload the file directly (same
 * presigned-S3-PUT flow as DocumentUploader/ThumbnailUploader) or paste an
 * already-hosted link (YouTube, Vimeo, a podcast host, etc.) — both write to
 * the same URL field, only the entry method differs. Upload is the default
 * tab since most instructors are recording their own content, not linking
 * out; Link stays one click away for anyone with an existing host.
 */
export default function MediaUrlField({ kind, label, value, onChange, onDurationDetected, linkPlaceholder, linkHint, disabled }: MediaUrlFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'link'>('upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const accept = ACCEPTED_TYPES[kind];

  async function upload(file: File) {
    if (!accept.includes(file.type)) {
      setError(UNSUPPORTED_MESSAGE[kind]);
      return;
    }
    setError('');
    setUploading(true);
    try {
      const [fileUrl, duration] = await Promise.all([uploadMedia(file), readDuration(file, kind)]);
      onChange(fileUrl);
      onDurationDetected?.(duration);
    } catch (err) {
      console.error('[MediaUrlField] upload failed ->', err);
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
      <div className="mb-1 flex items-center justify-between gap-3">
        <label className="block text-[11px] font-bold uppercase tracking-wide text-ink-400">{label}</label>
        <div className="inline-flex rounded-lg border border-ink-200 p-0.5">
          <button
            type="button"
            onClick={() => setMode('upload')}
            disabled={disabled}
            className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold transition-colors disabled:opacity-60 ${
              mode === 'upload' ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('link')}
            disabled={disabled}
            className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold transition-colors disabled:opacity-60 ${
              mode === 'link' ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            Link
          </button>
        </div>
      </div>

      {mode === 'link' ? (
        <input
          type="url"
          placeholder={linkPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputClass}
        />
      ) : value ? (
        <div className="space-y-2">
          {kind === 'video' ? (
            <VideoPlayer videoUrl={value} />
          ) : (
            <audio controls src={value} className="w-full" />
          )}
          <div className="flex items-center gap-2">
            <p className="flex-1 min-w-0 text-[11px] text-ink-400 truncate">{value}</p>
            <button
              type="button"
              onClick={() => { onChange(''); onDurationDetected?.(null); }}
              disabled={disabled}
              className="text-xs font-bold text-ink-400 hover:text-red-600 transition-colors flex-shrink-0 disabled:opacity-60"
              aria-label={`Remove ${kind}`}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && !disabled && inputRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-5 transition-colors ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          } ${
            dragOver ? 'border-coral-300 bg-coral-50 text-coral-600' : 'border-ink-200 text-ink-500 hover:border-coral-300 hover:text-coral-600'
          }`}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span className="text-xs font-bold">
            {uploading ? 'Uploading...' : `Drag ${kind === 'video' ? 'a video' : 'an audio file'} here, or click to browse`}
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = '';
        }}
        className="hidden"
      />
      {linkHint && mode === 'link' && (
        <p className="mt-1 text-[11px] text-ink-400">{linkHint}</p>
      )}
      {error && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
          <XCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
