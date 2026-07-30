'use client';

import { mockUser, courses } from '@/lib/mock-data';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import CourseCard from '@/components/CourseCard';

export default function MyCoursesPage() {
  const user = mockUser;
  const enrolledIds = new Set(user.enrolledCourses.map((e) => e.courseId));
  const moreCourses = courses.filter((c) => !enrolledIds.has(c.id));

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">My Courses</h1>
      <p className="text-sm text-ink-500 mb-8">Courses you are enrolled in.</p>

      {/* Enrolled */}
      {user.enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-12">
          {user.enrolledCourses.map((enrolled) => {
            const course = courses.find(c => c.id === enrolled.courseId);
            return <EnrolledCourseCard key={enrolled.courseId} enrolled={enrolled} course={course} />;
          })}
        </div>
      ) : (
        <p className="text-ink-400 text-sm mb-12">You have not enrolled in any courses yet.</p>
      )}

      {/* Browse more */}
      {moreCourses.length > 0 && (
        <>
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Browse more</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {moreCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
