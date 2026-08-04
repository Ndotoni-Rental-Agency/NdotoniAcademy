'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { toEmbeddableUrl } from '@/lib/embed-url';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

function needsIframe(videoUrl: string): boolean {
  try {
    const host = new URL(videoUrl).hostname.replace(/^www\./, '');
    return host === 'youtube.com' || host === 'youtu.be' || host === 'vimeo.com';
  } catch {
    return false;
  }
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying && needsIframe(videoUrl)) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-ink-900 border border-ink-200">
        <iframe
          src={`${toEmbeddableUrl(videoUrl)}?autoplay=1&rel=0&modestbranding=1`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title || 'Video lesson'}
        />
      </div>
    );
  }

  // A directly hosted file — our own upload, or any other direct link —
  // gets a native player instead of an iframe.
  if (isPlaying) {
    return (
      <video
        src={videoUrl}
        controls
        autoPlay
        aria-label={title || 'Video lesson'}
        className="w-full aspect-video rounded-2xl overflow-hidden bg-ink-900 border border-ink-200"
      />
    );
  }

  return (
    <button
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-ink-900 border border-ink-200 group cursor-pointer"
      onClick={() => setIsPlaying(true)}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-ink-900" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all">
          <Play className="w-7 h-7 text-white ml-1" />
        </div>
      </div>

      {/* Title */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-sm font-semibold text-white">{title}</p>
        </div>
      )}

      {/* Badge */}
      <div className="absolute top-3 left-3">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-1 rounded-lg">
          Video lesson
        </span>
      </div>
    </button>
  );
}
