import { BookOpen, Award, Zap } from 'lucide-react';
import { demoEnrolledCourses, demoCertificates, demoPoints, getCourse } from '@/lib/mock-data';

export default function LearnerDashboardPreview() {
  const [primary, secondary] = demoEnrolledCourses;

  return (
    <div className="rounded-2xl border-2 border-ink-100 shadow-xl shadow-ink-900/5 overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-50 border-b border-ink-100">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-warm-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
        </div>
        <span className="ml-2 text-xs text-ink-400 font-mono">academy.ndotoni.com/dashboard</span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-1">Welcome back</p>
        <h3 className="font-extrabold text-ink-900 mb-4">Pick up where you left off</h3>

        {/* Compact stat row — secondary to the course list below, not the headline */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-lg bg-ink-50 px-3 py-2 text-center">
            <p className="flex items-center justify-center gap-1 text-base font-extrabold text-ink-900 leading-none">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> {demoEnrolledCourses.length}
            </p>
            <p className="text-[10px] text-ink-400 mt-1">In progress</p>
          </div>
          <div className="rounded-lg bg-ink-50 px-3 py-2 text-center">
            <p className="flex items-center justify-center gap-1 text-base font-extrabold text-ink-900 leading-none">
              <Award className="w-3.5 h-3.5 text-warm-500" /> {demoCertificates.length}
            </p>
            <p className="text-[10px] text-ink-400 mt-1">Certificates</p>
          </div>
          <div className="rounded-lg bg-ink-50 px-3 py-2 text-center">
            <p className="flex items-center justify-center gap-1 text-base font-extrabold text-ink-900 leading-none">
              <Zap className="w-3.5 h-3.5 text-brand-500" /> {demoPoints.earned}
            </p>
            <p className="text-[10px] text-ink-400 mt-1">Points</p>
          </div>
        </div>

        {/* Two sources, one list: assigned by an org, or picked yourself */}
        <div className="space-y-2.5">
          {[primary, secondary].map((enrolled, i) => {
            if (!enrolled) return null;
            const course = getCourse(enrolled.courseId);
            const assigned = i === 0;
            return (
              <div key={enrolled.courseId} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-bold text-ink-900 truncate">{course?.title ?? enrolled.courseTitle}</p>
                  {assigned ? (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 flex-shrink-0">
                      Assigned
                    </span>
                  ) : (
                    <span className="text-[10px] text-ink-400 flex-shrink-0">Your pick</span>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full ${assigned ? 'bg-indigo-500' : 'bg-coral-500'}`}
                    style={{ width: `${Math.max(enrolled.progress, 4)}%` }}
                  />
                </div>
                <p className="text-[11px] text-ink-400">Module {enrolled.currentModule} of {enrolled.totalModules} · {enrolled.progress}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
