import { Star, Users, TrendingUp, Plus, Wallet } from 'lucide-react';
import { getCategoryTheme } from '@/lib/category-theme';
import Avatar from './Avatar';
import type { Course } from '@/lib/mock-data';

const HYPOTHETICAL_PRICE_TZS = 15000;
const INSTRUCTOR_SHARE = 0.8;

export default function InstructorPreview({ course }: { course: Course }) {
  const theme = getCategoryTheme(course.category);
  const Icon = theme.icon;
  const estimatedEarnings = Math.round(course.enrolledCount * HYPOTHETICAL_PRICE_TZS * INSTRUCTOR_SHARE);

  return (
    <div className="rounded-2xl border-2 border-ink-100 shadow-xl shadow-ink-900/5 overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-50 border-b border-ink-100">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-warm-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
        </div>
        <span className="ml-2 text-xs text-ink-400 font-mono">academy.ndotoni.com/instructor/dashboard</span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Avatar name={course.instructor} size="md" />
            <div>
              <p className="text-sm font-bold text-ink-900">{course.instructor}</p>
              <p className="text-xs text-ink-400">Instructor</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold px-3 py-1.5">
            <Plus className="w-3.5 h-3.5" /> New course
          </span>
        </div>

        <div className="rounded-xl border border-ink-100 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-9 h-9 rounded-lg ${theme.softBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${theme.solidText}`} strokeWidth={1.75} />
            </div>
            <p className="text-sm font-bold text-ink-900 truncate">{course.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="flex items-center gap-1 text-[11px] text-ink-400 mb-0.5"><Users className="w-3 h-3" /> Enrolled</p>
              <p className="text-lg font-extrabold text-ink-900">{course.enrolledCount}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] text-ink-400 mb-0.5"><TrendingUp className="w-3 h-3" /> Completion</p>
              <p className="text-lg font-extrabold text-ink-900">{course.completionRate}%</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] text-ink-400 mb-0.5"><Star className="w-3 h-3" /> Rating</p>
              <p className="text-lg font-extrabold text-ink-900">{course.rating}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[11px] text-ink-400 mb-0.5"><Wallet className="w-3 h-3" /> Est. earned</p>
              <p className="text-lg font-extrabold text-brand-700">TZS {estimatedEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-ink-400 mt-3 text-center">
          Estimate at TZS {HYPOTHETICAL_PRICE_TZS.toLocaleString()} per enrollment, {INSTRUCTOR_SHARE * 100}% instructor share
        </p>
      </div>
    </div>
  );
}
