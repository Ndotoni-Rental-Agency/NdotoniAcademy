'use client';

import { useRef, useState } from 'react';
import { Loader2, Upload, X, XCircle } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { getCourseMediaUploadUrl } from '@/graphql/mutations';
import type {
  GetCourseMediaUploadUrlMutation,
  GetCourseMediaUploadUrlMutationVariables,
} from '@/API';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ThumbnailUploaderProps {
  value?: string;
  onUploaded: (fileUrl: string) => void;
  label?: string;
}

/**
 * Drag-and-drop or click-to-browse thumbnail uploader, shared by course and
 * module creation. Uploads go straight from the browser to S3 via a
 * presigned PUT (getCourseMediaUploadUrl) — this component never sends the
 * file itself through GraphQL.
 */
export function ThumbnailUploader({ value, onUploaded, label = 'Thumbnail' }: ThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  async function upload(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, or WebP images are supported.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const { getCourseMediaUploadUrl: media } = await GraphQLClient.execute<GetCourseMediaUploadUrlMutation>(
        getCourseMediaUploadUrl,
        { fileName: file.name, contentType: file.type } satisfies GetCourseMediaUploadUrlMutationVariables
      );
      const putResponse = await fetch(media.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!putResponse.ok) throw new Error('Upload to storage failed. Please try again.');
      onUploaded(media.fileUrl);
    } catch (err) {
      console.error('[ThumbnailUploader] upload failed ->', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-ink-700">{label}</label>
      {value ? (
        <div className="relative w-full overflow-hidden rounded-xl border border-ink-200">
          {/* eslint-disable-next-line @next/next/no-img-element -- CloudFront thumbnail URLs aren't in next.config's image domains; not worth configuring for a small preview */}
          <img src={value} alt="" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={() => onUploaded('')}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors ${
            dragOver
              ? 'border-coral-300 bg-coral-50 text-coral-600'
              : 'border-ink-200 text-ink-500 hover:border-coral-300 hover:text-coral-600'
          }`}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span className="text-sm font-bold">
            {uploading ? 'Uploading...' : 'Drag an image here, or click to browse'}
          </span>
          <span className="text-xs text-ink-400">JPEG, PNG, or WebP</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
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
