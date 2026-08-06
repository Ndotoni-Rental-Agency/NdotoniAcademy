import type { LucideIcon } from 'lucide-react';

/** Honest placeholder for a course tab that isn't built yet — same "say so plainly, don't fake it" pattern already used elsewhere in this app (e.g. InstructorOverview's "Enrollment & revenue — Coming soon"). */
export default function ComingSoonTab({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex flex-col items-center text-center rounded-2xl border-2 border-dashed border-ink-200 py-16 px-6">
        <div className="w-12 h-12 rounded-2xl bg-ink-100 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-ink-400" />
        </div>
        <p className="text-sm font-bold text-ink-700 mb-1">{title}</p>
        <p className="text-xs text-ink-400 max-w-xs">{description}</p>
      </div>
    </div>
  );
}
