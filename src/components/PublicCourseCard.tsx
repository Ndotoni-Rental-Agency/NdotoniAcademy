import Link from 'next/link';
import { User } from 'lucide-react';
import { getCategoryTheme } from '@/lib/category-theme';
import { instructorDisplayName } from '@/lib/course-display';
import type { PublicCoursesQuery } from '@/API';

export type PublicCourse = PublicCoursesQuery['publicCourses'][number];

export default function PublicCourseCard({ course }: { course: PublicCourse }) {
  const theme = getCategoryTheme(course.category ?? '');
  const Icon = theme.icon;
  const by = instructorDisplayName(course);

  return (
    <Link
      href={`/courses/${course.id}`}
      className="block bg-white rounded-2xl border-2 border-ink-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all group h-full"
    >
      <div className={`h-32 ${theme.solidBg} relative overflow-hidden`}>
        {course.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- CloudFront URLs aren't in next.config's image domains
          <img src={course.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rotate-45" />
            <div className="absolute -right-2 bottom-2 w-16 h-16 rounded-full bg-white/10" />
            <Icon className="absolute bottom-3 right-4 w-10 h-10 text-white/50" strokeWidth={1.75} />
          </>
        )}
        {course.category && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wide bg-white/20 text-white px-2.5 py-1 rounded-md drop-shadow">
              {course.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-extrabold text-ink-900 mb-1.5 group-hover:underline decoration-2 underline-offset-2 leading-snug">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-sm text-ink-500 line-clamp-2 mb-4">{course.description}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-ink-100">
          <span className="flex items-center gap-1.5 text-xs text-ink-500 min-w-0">
            {by ? (
              <>
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{by}</span>
              </>
            ) : (
              <span>&nbsp;</span>
            )}
          </span>
          <span className="text-sm font-bold text-ink-900 flex-shrink-0">TZS {course.priceTzs.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
