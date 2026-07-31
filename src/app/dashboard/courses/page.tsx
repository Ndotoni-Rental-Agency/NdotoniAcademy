'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Lock, Globe, Users, Wallet } from 'lucide-react';
import { courses, demoEnrolledCourses } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import { getTeamCourseUsage, type TeamCourse } from '@/lib/organization-mock-data';
import { INSTRUCTOR_SHARE } from '@/lib/instructor-pricing';
import { initialTeachingCourses, type TeachingCourse } from '@/lib/teaching-mock-data';
import { useAuth } from '@/lib/auth-context';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import CourseCard from '@/components/CourseCard';

const teachingCategories = ['Project Management', 'Marketing', 'Technology', 'Design'];

export default function CoursesPage() {
  const { user } = useAuth();
  if (!user) return null; // DashboardLayout redirects/loads before this can render
  return user.organizations[0]?.organization ? <OrganizationCoursesPage /> : <IndividualCoursesPage />;
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
// Individual accounts: courses they're enrolled in, courses they
// teach, and more to browse.
// ============================================================
function IndividualCoursesPage() {
  const enrolledIds = new Set(demoEnrolledCourses.map((e) => e.courseId));
  const moreCourses = courses.filter((c) => !enrolledIds.has(c.id));

  const [teachingCourses, setTeachingCourses] = useState<TeachingCourse[]>(initialTeachingCourses);
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState(teachingCategories[0]);
  const [newCoursePrice, setNewCoursePrice] = useState(15000);

  function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    const id = `custom-${Date.now()}`;
    setTeachingCourses((prev) => [
      ...prev,
      {
        id,
        title: newCourseTitle.trim(),
        shortDescription: 'No description yet.',
        category: newCourseCategory,
        priceTzs: newCoursePrice,
        status: 'draft',
        enrolledCount: 0,
        modules: [{ id: `${id}-m1`, title: 'Module 1', blocks: [] }],
      },
    ]);
    setNewCourseTitle('');
    setNewCourseCategory(teachingCategories[0]);
    setNewCoursePrice(15000);
    setShowNewCourse(false);
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Courses</h1>
      <p className="text-sm text-ink-500 mb-8">Courses you are taking, and courses you teach.</p>

      {/* Learning */}
      <section className="mb-12">
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Learning</h2>
        {demoEnrolledCourses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {demoEnrolledCourses.map((enrolled) => {
              const course = courses.find(c => c.id === enrolled.courseId);
              return <EnrolledCourseCard key={enrolled.courseId} enrolled={enrolled} course={course} />;
            })}
          </div>
        ) : (
          <p className="text-ink-400 text-sm">You have not enrolled in any courses yet.</p>
        )}
      </section>

      {/* Teaching */}
      <section className="mb-12">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide">Teaching</h2>
          <button
            onClick={() => setShowNewCourse((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> New course
          </button>
        </div>

        {showNewCourse && (
          <form onSubmit={handleCreateCourse} className="mb-4 flex flex-col sm:flex-row gap-3 rounded-xl border-2 border-ink-100 p-4">
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
              value={newCourseCategory}
              onChange={(e) => setNewCourseCategory(e.target.value)}
              className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            >
              {teachingCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              min={0}
              step={1000}
              aria-label="Price in TZS"
              value={newCoursePrice}
              onChange={(e) => setNewCoursePrice(Number(e.target.value))}
              className="w-full sm:w-32 rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </form>
        )}

        {teachingCourses.length === 0 ? (
          <p className="text-ink-400 text-sm">You have not built a course yet. Add one above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachingCourses.map((course) => {
              const theme = getCategoryTheme(course.category);
              const estimatedEarnings = Math.round(course.enrolledCount * course.priceTzs * INSTRUCTOR_SHARE);
              return (
                <Link
                  key={course.id}
                  href={`/dashboard/courses/teaching/${course.id}`}
                  className="rounded-2xl border-2 border-ink-100 bg-white p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${theme.solidBg}`} />
                    <span className="text-[11px] font-bold uppercase tracking-wide text-ink-400 truncate">{course.category}</span>
                    <span className={`ml-auto text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                      course.status === 'published' ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-ink-900 text-sm mb-3 truncate">{course.title}</h3>
                  <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                    <span className="flex items-center gap-1.5 text-xs text-ink-500">
                      <Users className="w-3.5 h-3.5" /> {course.enrolledCount}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700">
                      <Wallet className="w-3.5 h-3.5" /> TZS {estimatedEarnings.toLocaleString()}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Browse more */}
      {moreCourses.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Browse more</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {moreCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
