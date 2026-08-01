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
  const Icon = theme.icon;

  return (
    <Link
      href={`/courses/${enrolled.courseId}`}
      className={`relative overflow-hidden rounded-2xl ${theme.solidBg} text-white p-5 flex flex-col justify-between h-36 hover:-translate-y-0.5 hover:shadow-lg transition-all`}
    >
      <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/10 rotate-45" />
      <div className="relative flex items-start justify-between gap-2">
        <Icon className="w-6 h-6 text-white/70" strokeWidth={1.75} />
        {assignedBy && (
          <span className="text-[9px] font-bold uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded-full flex-shrink-0">
            Assigned
          </span>
        )}
      </div>
      <div className="relative">
        <p className="text-3xl font-extrabold leading-none">{enrolled.progress}%</p>
        <p className="text-xs text-white/85 mt-2 truncate font-medium">{enrolled.courseTitle}</p>
        <p className="text-[11px] text-white/60 mt-0.5">
          {assignedBy ? `Assigned by ${assignedBy}` : `Module ${enrolled.currentModule} of ${enrolled.totalModules}`}
        </p>
      </div>
    </Link>
  );
}
