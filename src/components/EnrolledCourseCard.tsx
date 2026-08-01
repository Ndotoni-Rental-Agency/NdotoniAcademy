import Link from 'next/link';
import { getCategoryTheme } from '@/lib/category-theme';
import type { EnrolledCourse, Course } from '@/lib/mock-data';

export default function EnrolledCourseCard({
  enrolled,
  course,
  assignedBy,
}: {
  enrolled: EnrolledCourse;
  course?: Course;
  /** Organization name, if this course was assigned rather than picked by the learner themselves. */
  assignedBy?: string;
}) {
  const theme = getCategoryTheme(course?.category ?? '');

  return (
    <Link
      href={`/courses/${enrolled.courseId}`}
      className="block rounded-xl border border-ink-200 bg-white p-3.5 hover:border-indigo-200 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${theme.solidBg}`} />
        <span className="text-[10px] font-bold uppercase tracking-wide text-ink-400 truncate">{course?.category ?? 'Course'}</span>
        {assignedBy && (
          <span className="ml-auto text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 flex-shrink-0">
            Assigned
          </span>
        )}
      </div>
      <h4 className="text-[13px] font-bold text-ink-900 mb-1.5 leading-snug truncate">{enrolled.courseTitle}</h4>
      <p className="text-[11.5px] text-ink-400 -mt-0.5 mb-2 truncate">
        {assignedBy ? `Assigned by ${assignedBy}` : 'Your own pick, from the catalog'}
      </p>
      <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden mb-2">
        <div className={`h-full rounded-full ${theme.solidBg}`} style={{ width: `${Math.max(enrolled.progress, 3)}%` }} />
      </div>
      <div className="flex items-center justify-between text-[11.5px] text-ink-500 pt-2 border-t border-ink-100">
        <span>Module {enrolled.currentModule}/{enrolled.totalModules}</span>
        <span>{enrolled.progress}%</span>
      </div>
    </Link>
  );
}
