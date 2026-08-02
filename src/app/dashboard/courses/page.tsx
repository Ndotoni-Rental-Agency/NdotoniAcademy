'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Plus, Lock, Globe } from 'lucide-react';
import { courses, demoEnrolledCourses } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import { getTeamCourseUsage, type TeamCourse } from '@/lib/organization-mock-data';
import { useAuth, dashboardModeFor, type DashboardMode } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import { GraphQLClient } from '@/lib/graphql-client';
import { myCourses } from '@/graphql/queries';
import type { MyCoursesQuery } from '@/API';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import CourseCard from '@/components/CourseCard';
import { CreateCourseModal } from '@/components/CreateCourseModal';

export default function CoursesPage() {
  const { user, wantsToTeach } = useAuth();
  if (!user) return null; // DashboardLayout redirects/loads before this can render

  const mode = dashboardModeFor(user, wantsToTeach);
  if (mode === 'organization') return <OrganizationCoursesPage />;

  const org = user.organizations[0]?.organization;
  // A plain MEMBER (learner mode, but still belongs to an org) has no
  // instructor permission and shouldn't see course-creation UI — an
  // independent learner (no org at all) or a real INSTRUCTOR does.
  const canTeach = mode === 'instructor' || !org;
  return <LearnerCoursesPage canTeach={canTeach} orgName={org?.name} mode={mode} />;
}

// ============================================================
// Organizations: courses currently in use by the team, plus the
// ability to create a course specific to the org.
// ============================================================
function OrganizationCoursesPage() {
  const accent = accentByMode.organization;
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
          className={`flex items-center gap-1.5 rounded-xl ${accent.bg600} px-4 py-2.5 text-sm font-bold text-white ${accent.bg600Hover} transition-colors flex-shrink-0`}
        >
          <Plus className="w-4 h-4" /> Add a course
        </button>
      </div>

      {/* Team courses bar */}
      <section className="mb-10">
        <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">In use by your team</h2>
        {teamCourses.length === 0 && (
          <p className="text-sm text-ink-400 bg-white rounded-xl border border-ink-200 px-4 py-5 text-center mb-3">
            Nothing assigned yet. Add a course above, or assign one from the catalog below in Team.
          </p>
        )}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {teamCourses.map((course) => {
            const theme = course.isCustom ? null : getCategoryTheme(course.category);
            return (
              <div
                key={course.id}
                className="flex items-center gap-2.5 flex-shrink-0 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 min-w-[180px]"
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
          <form onSubmit={handleAddCourse} className="mt-4 flex flex-col sm:flex-row gap-3 rounded-xl border border-ink-200 bg-white p-4">
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
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl ${accent.bg600} px-5 py-2.5 text-sm font-bold text-white ${accent.bg600Hover} transition-colors whitespace-nowrap`}
            >
              <Plus className="w-4 h-4" /> Create
            </button>
          </form>
        )}
      </section>

      {/* Full catalog */}
      <section>
        <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Full catalog</h2>
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
// Learners: courses they're enrolled in (self-picked, or assigned by an
// org they belong to), courses they teach if they can, and more to browse.
// ============================================================
function LearnerCoursesPage({
  canTeach,
  orgName,
  mode,
}: {
  canTeach: boolean;
  orgName?: string;
  mode: DashboardMode;
}) {
  // Same convention as the Overview: teaching uses the instructor accent only
  // when the viewer actually is one; an org-less learner who can still teach
  // stays in their own (learner) accent rather than borrowing coral.
  const teachAccent = mode === 'instructor' ? accentByMode.instructor : accentByMode.learner;
  const enrolledIds = new Set(demoEnrolledCourses.map((e) => e.courseId));
  const moreCourses = courses.filter((c) => !enrolledIds.has(c.id));

  const router = useRouter();
  const searchParams = useSearchParams();
  const [teachingCourses, setTeachingCourses] = useState<MyCoursesQuery['myCourses']>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const { myCourses: fetched } = await GraphQLClient.execute<MyCoursesQuery>(myCourses);
      setTeachingCourses(fetched);
    } catch (err) {
      console.error('[CoursesPage] myCourses failed ->', err);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    if (canTeach) void loadCourses();
  }, [canTeach, loadCourses]);

  // The sidebar's "Create Course" nav item and the Overview hero CTA both
  // deep-link here with ?new=1 so the modal opens immediately, wherever the
  // instructor was — clean the param off the URL so refreshing doesn't
  // reopen it.
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setShowCreateModal(true);
      router.replace('/dashboard/courses');
    }
  }, [searchParams, router]);

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Courses</h1>
      <p className="text-sm text-ink-500 mb-8">
        {canTeach ? 'Courses you are taking, and courses you teach.' : 'Courses you are taking, self-picked or assigned.'}
      </p>

      {/* Learning */}
      <section className="mb-12">
        <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Learning</h2>
        {demoEnrolledCourses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {demoEnrolledCourses.map((enrolled, i) => {
              const course = courses.find(c => c.id === enrolled.courseId);
              return (
                <EnrolledCourseCard
                  key={enrolled.courseId}
                  enrolled={enrolled}
                  course={course}
                  assignedBy={i === 0 && orgName ? orgName : undefined}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-ink-400 text-sm">You have not enrolled in any courses yet.</p>
        )}
      </section>

      {/* Teaching — only for someone who can actually teach: an independent
          learner (no org), or a real INSTRUCTOR. A plain org MEMBER has no
          instructor permission and shouldn't see course-creation UI. */}
      {canTeach && (
        <section className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-2.5">
            <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Teaching</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-1.5 rounded-xl ${teachAccent.bg600} px-3.5 py-2 text-xs font-bold text-white ${teachAccent.bg600Hover} transition-colors flex-shrink-0`}
            >
              <Plus className="w-3.5 h-3.5" /> New course
            </button>
          </div>

          {loadingCourses ? (
            <div className="flex items-center justify-center rounded-xl border border-ink-200 bg-white py-8">
              <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
            </div>
          ) : teachingCourses.length === 0 ? (
            <p className="text-ink-400 text-sm">You have not built a course yet. Add one above.</p>
          ) : (
            <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
              {teachingCourses.map((course) => {
                const theme = getCategoryTheme(course.category ?? '');
                return (
                  <Link
                    key={course.id}
                    href={`/dashboard/courses/${course.id}`}
                    className="flex items-center gap-3 py-2.5 px-3.5 hover:bg-ink-50 transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${theme.solidBg}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-ink-900 truncate">{course.title}</p>
                      <p className="text-[11.5px] text-ink-400 truncate">{course.category ?? 'Uncategorized'}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                      course.status === 'PUBLISHED' ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
                    }`}>
                      {course.status.toLowerCase()}
                    </span>
                    <span className="text-xs font-bold text-ink-700 flex-shrink-0">
                      TZS {course.priceTzs.toLocaleString()}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      <CreateCourseModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSaved={(courseId) => router.push(`/dashboard/courses/${courseId}`)}
      />

      {/* Browse more */}
      {moreCourses.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Browse more</h2>
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
