import { Star, Users, TrendingUp, Plus, Wallet } from 'lucide-react';
import { getCategoryTheme, type CategoryTheme } from '@/lib/category-theme';
import Avatar from './Avatar';
import type { Course } from '@/lib/mock-data';
import { HYPOTHETICAL_PRICE_TZS, INSTRUCTOR_SHARE } from '@/lib/instructor-pricing';

/** Illustrative last-7-weeks enrollment shape — an upward trend is the point, not the exact numbers. */
function EnrollmentSpark({ theme }: { theme: CategoryTheme }) {
  const points = [58, 64, 63, 71, 78, 88, 100];
  const w = 100, h = 24;
  const max = Math.max(...points), min = Math.min(...points);
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / (max - min || 1)) * (h - 4) - 2;
    return [x, y] as const;
  });
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const [lastX, lastY] = coords[coords.length - 1];
  const fillClass = theme.stroke.replace('stroke-', 'fill-');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-6">
      <path d={area} className={fillClass} opacity={0.12} />
      <path d={line} fill="none" className={theme.stroke} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
      <circle cx={lastX} cy={lastY} r={2.2} className={fillClass} />
    </svg>
  );
}

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
              <EnrollmentSpark theme={theme} />
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
              <p className="text-[10px] font-bold text-brand-600 mt-0.5">↑ 18% this month</p>
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
