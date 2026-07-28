import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/lib/mock-data';

const courseImages: Record<string, string> = {
  'land-management': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  'land-valuation': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
};

export default function CourseCard({ course }: { course: Course }) {
  const freeModules = course.modules.filter((m) => m.isFree).length;
  const imageUrl = courseImages[course.id] || courseImages['land-management'];

  return (
    <div className="rounded-2xl bg-white border border-ink-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-ink-200 transition-all duration-300">
      {/* Image header */}
      <div className="relative h-40">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="text-xs font-semibold text-white/90 bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-sm">
            {course.levelLabel}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-ink-900 text-lg leading-tight mb-2">
          {course.title}
        </h3>
        <p className="text-sm text-ink-500 leading-relaxed mb-5 line-clamp-2">
          {course.shortDescription}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-ink-400 mb-5">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            {course.cpdPoints} CPD
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            {course.modules.length} Modules
          </span>
        </div>

        {/* Free badge + CTA */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg font-semibold">
            {freeModules} module{freeModules > 1 ? 's' : ''} free
          </span>
          <Link
            href={`/courses/${course.id}`}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View Course &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
