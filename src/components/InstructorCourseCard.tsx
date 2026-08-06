import Link from 'next/link';
import { getCategoryTheme } from '@/lib/category-theme';
import { CourseStatus } from '@/API';

export interface InstructorCourse {
  id: string;
  title: string;
  category?: string | null;
  priceTzs: number;
  thumbnailUrl?: string | null;
  status: CourseStatus;
  updatedAt?: string;
}

function formatUpdated(iso?: string): string | null {
  if (!iso) return null;
  return `Updated ${new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

/**
 * Instructor-facing course card — same header pattern as PublicCourseCard
 * (category-color band, thumbnail or icon placeholder, category badge) plus
 * a status pill and a manage affordance, since instructors need to see
 * draft/published state and price at a glance across Overview and the
 * Courses management grid.
 */
export default function InstructorCourseCard({
  course,
  manageable = true,
}: {
  course: InstructorCourse;
  /** False for an org's read-only "published by your team" list, where the viewer isn't the course owner. */
  manageable?: boolean;
}) {
  const theme = getCategoryTheme(course.category ?? '');
  const Icon = theme.icon;
  const published = course.status === CourseStatus.PUBLISHED;
  const updated = formatUpdated(course.updatedAt);

  return (
    <Link
      href={manageable ? `/studio/${course.id}` : `/courses/${course.id}`}
      className="flex flex-col h-full bg-white rounded-2xl border-2 border-ink-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all group"
    >
      <div className={`h-28 ${theme.solidBg} relative overflow-hidden flex-shrink-0`}>
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
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          {course.category ? (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-white/20 text-white px-2.5 py-1 rounded-md drop-shadow truncate">
              {course.category}
            </span>
          ) : <span />}
          <span
            className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full drop-shadow ${
              published ? 'bg-white text-brand-700' : 'bg-white/90 text-ink-600'
            }`}
          >
            {published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-serif font-semibold text-ink-900 mb-1 leading-snug line-clamp-2 group-hover:underline decoration-2 underline-offset-2">
          {course.title}
        </h3>

        <div className="mt-auto pt-3 border-t border-ink-100 flex items-center justify-between gap-2">
          <span className="text-[11px] text-ink-400 truncate">{updated ?? ' '}</span>
          <span className="text-sm font-bold text-ink-900 flex-shrink-0">
            {course.priceTzs > 0 ? `TZS ${course.priceTzs.toLocaleString()}` : 'Free'}
          </span>
        </div>
        {manageable && (
          <span className="mt-2 text-xs font-bold text-coral-600 group-hover:underline">Manage course &rarr;</span>
        )}
      </div>
    </Link>
  );
}
