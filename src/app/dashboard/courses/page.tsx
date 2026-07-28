'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { mockUser, courses } from '@/lib/mock-data';

export default function MyCoursesPage() {
  const user = mockUser;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">My Courses</h1>
      <p className="text-sm text-ink-500 mb-8">Courses you are enrolled in.</p>

      {/* Enrolled */}
      {user.enrolledCourses.length > 0 ? (
        <div className="space-y-4 mb-12">
          {user.enrolledCourses.map((enrolled) => {
            const course = courses.find(c => c.id === enrolled.courseId);
            return (
              <Link
                key={enrolled.courseId}
                href={`/courses/${enrolled.courseId}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-ink-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
              >
                <div className="relative w-11 h-11 flex-shrink-0">
                  <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${enrolled.progress * 0.88} 88`} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink-700">{enrolled.progress}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-900 text-sm group-hover:text-indigo-600 transition-colors truncate">{enrolled.courseTitle}</h3>
                  <div className="flex items-center gap-3 text-xs text-ink-400 mt-0.5">
                    <span>Module {enrolled.currentModule} of {enrolled.totalModules}</span>
                    {course && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-ink-400 text-sm mb-12">You have not enrolled in any courses yet.</p>
      )}

      {/* Browse more */}
      <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Browse more</h2>
      <div className="divide-y divide-ink-100">
        {courses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`} className="flex items-center gap-3 py-4 group">
            <BookOpen className="w-5 h-5 text-ink-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-900 group-hover:text-indigo-600 transition-colors truncate">{course.title}</p>
              <p className="text-xs text-ink-400">{course.modules.length} modules · {course.duration}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
