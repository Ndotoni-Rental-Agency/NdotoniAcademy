import { Lock, Globe, ImageIcon } from 'lucide-react';

export default function CourseCreatorPreview() {
  return (
    <div className="rounded-2xl border-2 border-ink-100 shadow-xl shadow-ink-900/5 overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-50 border-b border-ink-100">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-warm-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
        </div>
        <span className="ml-2 text-xs text-ink-400 font-mono">app.ndotoni.com/instructor/new-course</span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-1.5">Course title</p>
        <div className="rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm font-semibold text-ink-900 mb-4">
          Warehouse Safety Fundamentals
        </div>

        <div className="rounded-xl border border-dashed border-ink-200 h-20 flex items-center justify-center gap-2 text-ink-300 mb-5">
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs font-medium">Cover image</span>
        </div>

        <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-2">Visibility</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="rounded-xl border-2 border-indigo-500 bg-indigo-50 px-3 py-2.5 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700">Private to org</span>
          </div>
          <div className="rounded-xl border-2 border-ink-100 px-3 py-2.5 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-ink-400" />
            <span className="text-xs font-semibold text-ink-500">Public listing</span>
          </div>
        </div>

        <div className="rounded-xl bg-ink-50 px-3.5 py-3 flex items-center justify-between">
          <span className="text-xs text-ink-500">Switch to public to set a price and open it to every learner on Ndotoni Academy.</span>
        </div>
      </div>
    </div>
  );
}
