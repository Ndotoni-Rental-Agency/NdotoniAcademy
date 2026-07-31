import { Video, Layers, FileText, HelpCircle, Plus, GripVertical } from 'lucide-react';

const blocks = [
  { icon: Video, label: 'Welcome & overview', meta: '6:20', color: 'text-sky-600 bg-sky-50' },
  { icon: Layers, label: 'Key terms', meta: '12 cards', color: 'text-brand-700 bg-brand-50' },
  { icon: FileText, label: 'Case study: Warehouse rollout', meta: '4 min read', color: 'text-warm-700 bg-warm-50' },
  { icon: HelpCircle, label: 'Check your understanding', meta: '5 questions', color: 'text-coral-600 bg-coral-50' },
];

export default function LessonBuilderPreview() {
  return (
    <div className="rounded-2xl border-2 border-ink-100 shadow-xl shadow-ink-900/5 overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-50 border-b border-ink-100">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-warm-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
        </div>
        <span className="ml-2 text-xs text-ink-400 font-mono">academy.ndotoni.com/instructor/lesson-builder</span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-1">Module 3</p>
        <p className="text-sm font-bold text-ink-900 mb-4">Scope, Time & Cost Planning</p>

        <div className="space-y-2">
          {blocks.map((block) => (
            <div key={block.label} className="flex items-center gap-3 rounded-xl border border-ink-100 px-3 py-2.5">
              <GripVertical className="w-3.5 h-3.5 text-ink-200 flex-shrink-0" />
              <div className={`w-8 h-8 rounded-lg ${block.color} flex items-center justify-center flex-shrink-0`}>
                <block.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-ink-900 flex-1 min-w-0 truncate">{block.label}</span>
              <span className="text-xs text-ink-400 flex-shrink-0">{block.meta}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full mt-3 rounded-xl border border-dashed border-ink-200 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-400"
        >
          <Plus className="w-3.5 h-3.5" /> Add a block
        </button>

        <p className="text-[10px] text-ink-400 mt-3 text-center">Drag to reorder. Mix video, flashcards, guides, and quizzes freely.</p>
      </div>
    </div>
  );
}
