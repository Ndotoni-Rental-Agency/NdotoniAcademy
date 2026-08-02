'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, User } from 'lucide-react';
import { fetchPublicCourses, instructorDisplayName, type PublicCourse } from '@/graphql/public-course-queries';
import { getCategoryTheme } from '@/lib/category-theme';
import Reveal from './Reveal';

export default function HomepageCourseList() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setCourses((await fetchPublicCourses()).slice(0, 6));
      } catch (err) {
        console.error('[HomepageCourseList] fetchPublicCourses failed ->', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
      </div>
    );
  }

  if (courses.length === 0) {
    return <p className="text-sm text-ink-400 py-10">No courses published yet.</p>;
  }

  return (
    <div className="divide-y divide-ink-100">
      {courses.map((course, i) => {
        const theme = getCategoryTheme(course.category ?? '');
        const by = instructorDisplayName(course);
        return (
          <Reveal key={course.id} delay={i * 0.08}>
            <Link href={`/courses/${course.id}`} className="flex items-center gap-5 py-5 group">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${theme.solidBg}`} />

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-ink-900 group-hover:text-indigo-600 transition-colors truncate">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-sm text-ink-500 mt-0.5 hidden sm:block truncate">{course.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-400">
                  {by && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {by}</span>}
                  <span className="font-medium text-ink-700">TZS {course.priceTzs.toLocaleString()}</span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
