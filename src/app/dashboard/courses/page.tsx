'use client';

import { useState } from 'react';
import { Plus, Lock, Globe } from 'lucide-react';
import { mockUser, courses } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import { getTeamCourseUsage, type TeamCourse } from '@/lib/organization-mock-data';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import CourseCard from '@/components/CourseCard';

export default function CoursesPage() {
  return mockUser.organization ? <OrganizationCoursesPage /> : <IndividualCoursesPage />;
}

// ============================================================
// Organizations: courses currently in use by the team, plus the
// ability to create a course specific to the org.
// ============================================================
function OrganizationCoursesPage() {
  const [teamCourses, setTeamCourses] = useState<TeamCourse[]>(getTeamCourseUsage());
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseVisibility, setNewCourseVisibility] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE');

  function handleAddCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    setTeamCourses((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        title: newCourseTitle.trim(),
        category: 'Custom',
        visibility: newCourseVisibility,
        assignedCount: 0,
        isCustom: true,
      },
    ]);
    setNewCourseTitle('');
    setNewCourseVisibility('PRIVATE');
    setShowAddCourse(false);
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Courses</h1>
          <p className="text-sm text-ink-500">What your team is training on, and what you can create yourself.</p>
        </div>
        <button
          onClick={() => setShowAddCourse((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add a course
        </button>
      </div>

      {/* Team courses bar */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">In use by your team</h2>
        {teamCourses.length === 0 && (
          <p className="text-sm text-ink-400 bg-white rounded-2xl border-2 border-ink-100 px-4 py-5 text-center mb-3">
            Nothing assigned yet. Add a course above, or assign one from the catalog below in Team.
          </p>
        )}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {teamCourses.map((course) => {
            const theme = course.isCustom ? null : getCategoryTheme(course.category);
            return (
              <div
                key={course.id}
                className="flex items-center gap-2.5 flex-shrink-0 rounded-xl border-2 border-ink-100 bg-white px-3.5 py-2.5 min-w-[180px]"
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${theme ? theme.solidBg : 'bg-ink-400'}`} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink-900 truncate">{course.title}</p>
                  <p className="text-[10px] text-ink-400 flex items-center gap-1">
                    {course.visibility === 'PRIVATE' ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                    {course.assignedCount} assigned
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {showAddCourse && (
          <form onSubmit={handleAddCourse} className="mt-4 flex flex-col sm:flex-row gap-3 rounded-xl border-2 border-ink-100 p-4">
            <input
              type="text"
              required
              autoFocus
              placeholder="Course title, e.g. Warehouse Safety Fundamentals"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
            />
            <select
              value={newCourseVisibility}
              onChange={(e) => setNewCourseVisibility(e.target.value as 'PRIVATE' | 'PUBLIC')}
              className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            >
              <option value="PRIVATE">Private to org</option>
              <option value="PUBLIC">Public listing</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </form>
        )}
      </section>

      {/* Full catalog */}
      <section>
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Full catalog</h2>
        <p className="text-sm text-ink-500 mb-4">Browse everything available. Head to Team to assign a course to your people.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Individual learners: their enrolled courses, and more to browse.
// ============================================================
function IndividualCoursesPage() {
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
