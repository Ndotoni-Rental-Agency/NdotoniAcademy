import Image from 'next/image';
import { Award } from 'lucide-react';

export default function CertificatePreview({
  courseTitle,
  instructor,
  score,
  points,
}: {
  courseTitle: string;
  instructor: string;
  score: number;
  points: number;
}) {
  return (
    <div className="relative rounded-2xl bg-white shadow-2xl shadow-ink-900/10 overflow-hidden">
      {/* Verified corner ribbon */}
      <div className="absolute top-0 right-0 w-36 h-36 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-[22px] right-[-38px] w-[170px] rotate-45 bg-indigo-600 text-white text-[10px] font-bold tracking-[0.15em] text-center py-1.5 shadow-md">
          VERIFIED
        </div>
      </div>

      {/* Outer frame */}
      <div className="border-[3px] border-indigo-900/90 m-3 rounded-xl">
        {/* Inner frame */}
        <div className="border border-warm-400 m-1.5 rounded-lg px-6 py-9 sm:px-12 sm:py-12 text-center">
          {/* Brand mark */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <Image src="/ndotoni-academy-icon.png" alt="" width={22} height={22} className="object-contain" />
            <span className="text-xs font-bold tracking-[0.15em] text-ink-500 uppercase">Ndotoni Academy</span>
          </div>

          {/* Seal */}
          <div className="relative inline-block mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warm-300 via-warm-500 to-warm-600 flex items-center justify-center mx-auto shadow-md ring-4 ring-warm-100">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div
              className="absolute left-1/2 -translate-x-[13px] top-[54px] w-4 h-6 bg-warm-600"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)' }}
            />
            <div
              className="absolute left-1/2 translate-x-[-3px] top-[54px] w-4 h-6 bg-warm-500"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)' }}
            />
          </div>

          <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-indigo-700 mb-6">
            Certificate of Completion
          </p>

          <p className="text-sm text-ink-400 mb-2">This certifies that</p>
          <p className="text-2xl sm:text-3xl font-bold text-ink-900 mb-2 pb-3 border-b-2 border-ink-100 inline-block px-8">
            Your Name
          </p>

          <p className="text-sm text-ink-400 mt-5 mb-1.5">has successfully completed</p>
          <p className="text-lg sm:text-xl font-bold text-ink-900 mb-6">{courseTitle}</p>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-warm-400 to-transparent mx-auto mb-6" />

          <div className="flex items-center justify-center gap-4 text-xs text-ink-400 mb-8">
            <span>Score: <strong className="text-ink-700">{score}%</strong></span>
            <span className="w-1 h-1 rounded-full bg-ink-200" />
            <span><strong className="text-ink-700">{points}</strong> points</span>
          </div>

          {/* Signature + serial row */}
          <div className="flex items-end justify-between gap-4 text-left">
            <div>
              <p className="italic text-sm text-ink-800 mb-1 border-b border-ink-200 pb-1 min-w-[110px]">
                {instructor}
              </p>
              <p className="text-[10px] text-ink-400 uppercase tracking-wide">Instructor</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-ink-400 uppercase tracking-wide">Certificate ID</p>
              <p className="text-xs font-mono text-ink-600">NDT-2026-000842</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
