'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Music, Video, X } from 'lucide-react';
import { uploadMedia, mediaTypeFromContentType, MediaType } from '@/lib/upload-media';

const ACCEPTED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'video/webm',
  'audio/mpeg', 'audio/mp3', 'audio/wav',
];

export interface MediaValue {
  url: string;
  type: MediaType;
}

interface MediaFieldProps {
  value?: MediaValue | null;
  onChange: (value: MediaValue | null) => void;
  size?: 'sm' | 'md';
}

/**
 * Compact per-card media picker for the flashcard editor — a small square
 * slot, not the full-width dropzone ThumbnailUploader uses, since a card row
 * needs to stay scannable across a whole deck. Images preview as a
 * thumbnail; video/audio show a type badge instead of an inline player —
 * full playback belongs to the learner-facing viewer, not this tiny slot.
 */
export default function MediaField({ value, onChange, size = 'md' }: MediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const dimension = size === 'sm' ? 'w-12 h-12' : 'w-14 h-14';

  async function handleFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      onChange({ url, type: mediaTypeFromContentType(file.type) });
    } catch (err) {
      console.error('[MediaField] upload failed ->', err);
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative flex-shrink-0">
      {value ? (
        <div className={`relative ${dimension} rounded-lg overflow-hidden border border-ink-200 bg-ink-50 flex items-center justify-center`}>
          {value.type === MediaType.IMAGE ? (
            // eslint-disable-next-line @next/next/no-img-element -- CloudFront URLs aren't in next.config's image domains; not worth configuring for a tiny preview
            <img src={value.url} alt="" className="w-full h-full object-cover" />
          ) : value.type === MediaType.VIDEO ? (
            <Video className="w-5 h-5 text-ink-400" />
          ) : (
            <Music className="w-5 h-5 text-ink-400" />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-1 -top-1 rounded-full bg-ink-900/70 p-0.5 text-white hover:bg-ink-900 transition-colors"
            aria-label="Remove media"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          className={`${dimension} rounded-lg border border-dashed border-ink-200 flex items-center justify-center text-ink-300 hover:border-coral-300 hover:text-coral-500 transition-colors disabled:opacity-60`}
          disabled={uploading}
          aria-label="Add media"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = '';
        }}
        className="hidden"
      />
      {error && <p className="absolute top-full left-0 mt-1 w-24 text-[10px] text-red-600 whitespace-normal">{error}</p>}
    </div>
  );
}
