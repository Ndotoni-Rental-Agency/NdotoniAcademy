import Link from 'next/link';
import { getCategoryTheme } from '@/lib/category-theme';
import type { CourseLearningSummary } from '@/API';

export default function EnrolledCourseCard({ learning }: { learning: CourseLearningSummary }) {
  const theme = getCategoryTheme(learning.category ?? '');
  const percent = learning.totalLessons > 0
    ? Math.max(Math.round((learning.completedLessonCount / learning.totalLessons) * 100), 3)
    : 0;
  // Deep-link straight to where the learner left off when we know it —
  // falls back to the course landing page only for the edge case where
  // every lesson placement behind the progress records has been deleted.
  const href = learning.resumeModuleId && learning.resumeLessonId
    ? `/courses/${learning.courseId}/modules/${learning.resumeModuleId}/lessons/${learning.resumeLessonId}`
    : `/courses/${learning.courseId}`;

  return (
    <Link
      href={href}
      className="block rounded-xl border border-ink-200 bg-white p-3.5 hover:border-indigo-200 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${theme.solidBg}`} />
        <span className="text-[10px] font-bold uppercase tracking-wide text-ink-400 truncate">{learning.category ?? 'Course'}</span>
      </div>
      <h4 className="text-[13px] font-bold text-ink-900 mb-1.5 leading-snug truncate">{learning.title}</h4>
      <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden mb-2">
        <div className={`h-full rounded-full ${theme.solidBg}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="flex items-center justify-between text-[11.5px] text-ink-500 pt-2 border-t border-ink-100">
        <span>{learning.completedLessonCount}/{learning.totalLessons} lessons</span>
        <span>{percent}%</span>
      </div>
    </Link>
  );
}
