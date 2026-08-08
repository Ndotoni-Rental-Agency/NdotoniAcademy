import Link from 'next/link';
import { BookOpen, Clock, Star, Award } from 'lucide-react';
import { Course } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import Avatar from './Avatar';

export default function CourseCard({ course }: { course: Course }) {
  const freeModules = course.modules.filter((m) => m.isFree).length;
  const theme = getCategoryTheme(course.category);
  const Icon = theme.icon;

  return (
    <Link
      href={`/courses/${course.id}`}
      className={`block bg-white rounded-2xl border-2 border-ink-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all group h-full`}
    >
      {/* Visual header: flat color block with geometric accent, no gradient */}
      <div className={`h-32 ${theme.solidBg} relative overflow-hidden`}>
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rotate-45" />
        <div className="absolute -right-2 bottom-2 w-16 h-16 rounded-full bg-white/10" />
        <Icon className="absolute bottom-3 right-4 w-10 h-10 text-white/50" strokeWidth={1.75} />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold uppercase tracking-wide bg-white/20 text-white px-2.5 py-1 rounded-md">
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-ink-900 mb-1.5 group-hover:underline decoration-2 underline-offset-2 leading-snug">
          {course.title}
        </h3>
        <p className="text-sm text-ink-500 line-clamp-2 mb-4">{course.shortDescription}</p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-ink-400 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> {course.modules.length} Modules
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> {course.points} pts
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-ink-100">
          <div className="flex items-center gap-2">
            <Avatar name={course.instructor} size="sm" />
            <span className="text-xs text-ink-500">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-ink-700">{course.rating}</span>
          </div>
        </div>

        <div className="mt-3">
          <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${theme.softBg} ${theme.softText}`}>
            {freeModules} module{freeModules > 1 ? 's' : ''} free
          </span>
        </div>
      </div>
    </Link>
  );
}
