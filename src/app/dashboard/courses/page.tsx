'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { courses, demoEnrolledCourses } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import { useAuth, dashboardModeFor, type DashboardMode } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import { GraphQLClient } from '@/lib/graphql-client';
import { myCourses, coursesForOrganization, publicCourses as publicCoursesQuery } from '@/graphql/queries';
import { CourseStatus } from '@/API';
import type { MyCoursesQuery, CoursesForOrganizationQuery, PublicCoursesQuery } from '@/API';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import PublicCourseCard, { type PublicCourse } from '@/components/PublicCourseCard';
import { CreateCourseModal } from '@/components/CreateCourseModal';

export default function CoursesPage() {
  const { user, wantsToTeach } = useAuth();
  if (!user) return null; // DashboardLayout redirects/loads before this can render

  const mode = dashboardModeFor(user, wantsToTeach);
  const org = user.organizations[0]?.organization;
  if (mode === 'organization' && org) return <OrganizationCoursesPage organizationId={org.id} />;

  // A plain MEMBER (learner mode, but still belongs to an org) has no
  // instructor permission and shouldn't see course-creation UI — an
  // independent learner (no org at all) or a real INSTRUCTOR does.
  const canTeach = mode === 'instructor' || !org;
  return <LearnerCoursesPage canTeach={canTeach} orgName={org?.name} mode={mode} />;
}

// ============================================================
// Organizations: courses their instructors have published. Course creation
// itself only happens via an org member with the INSTRUCTOR role, from their
// own Teaching section — an OWNER/ADMIN doesn't have that permission, so
// there's no "add a course" action here, just a read-only list.
// ============================================================
function OrganizationCoursesPage({ organizationId }: { organizationId: string }) {
  const [orgCourses, setOrgCourses] = useState<CoursesForOrganizationQuery['coursesForOrganization']>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [catalog, setCatalog] = useState<PublicCourse[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const { coursesForOrganization: fetched } = await GraphQLClient.execute<CoursesForOrganizationQuery>(
        coursesForOrganization,
        { organizationId }
      );
      setOrgCourses(fetched);
    } catch (err) {
      console.error('[OrganizationCoursesPage] coursesForOrganization failed ->', err);
    } finally {
      setLoadingCourses(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    (async () => {
      try {
        const { publicCourses } = await GraphQLClient.execute<PublicCoursesQuery>(publicCoursesQuery);
        setCatalog(publicCourses);
      } catch (err) {
        console.error('[OrganizationCoursesPage] fetchPublicCourses failed ->', err);
      } finally {
        setLoadingCatalog(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Courses</h1>
        <p className="text-sm text-ink-500">Courses your instructors have published.</p>
      </div>

      {/* Org's own courses */}
      <section className="mb-10">
        <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Published by your team</h2>
        {loadingCourses ? (
          <div className="flex items-center justify-center rounded-xl border border-ink-200 bg-white py-8">
            <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
          </div>
        ) : orgCourses.length === 0 ? (
          <p className="text-sm text-ink-400 bg-white rounded-xl border border-ink-200 px-4 py-5 text-center">
            No courses yet. An org member with the Instructor role can create one from their own Courses page.
          </p>
        ) : (
          <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
            {orgCourses.map((course) => {
              const theme = getCategoryTheme(course.category ?? '');
              return (
                <div key={course.id} className="flex items-center gap-3 py-2.5 px-3.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${theme.solidBg}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-ink-900 truncate">{course.title}</p>
                    <p className="text-[11.5px] text-ink-400 truncate">{course.category ?? 'Uncategorized'}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                    course.status === CourseStatus.PUBLISHED ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
                  }`}>
                    {course.status.toLowerCase()}
                  </span>
                  <span className="text-xs font-bold text-ink-700 flex-shrink-0">TZS {course.priceTzs.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Full catalog */}
      <section>
        <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Full catalog</h2>
        <p className="text-sm text-ink-500 mb-4">Browse everything published on Ndotoni Academy.</p>
        {loadingCatalog ? (
          <div className="flex items-center justify-center rounded-xl border border-ink-200 bg-white py-8">
            <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map((course) => (
              <PublicCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const [teachingCourses, setTeachingCourses] = useState<MyCoursesQuery['myCourses']>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [catalog, setCatalog] = useState<PublicCourse[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

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

  useEffect(() => {
    (async () => {
      try {
        const { publicCourses } = await GraphQLClient.execute<PublicCoursesQuery>(publicCoursesQuery);
        setCatalog(publicCourses);
      } catch (err) {
        console.error('[LearnerCoursesPage] fetchPublicCourses failed ->', err);
      } finally {
        setLoadingCatalog(false);
      }
    })();
  }, []);

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
                    href={`/studio/${course.id}`}
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
        onSaved={(courseId) => router.push(`/studio/${courseId}`)}
      />

      {/* Browse more */}
      <section>
        <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Browse more</h2>
        {loadingCatalog ? (
          <div className="flex items-center justify-center rounded-xl border border-ink-200 bg-white py-8">
            <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
          </div>
        ) : catalog.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map((course) => (
              <PublicCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-ink-400 text-sm">No courses published yet.</p>
        )}
      </section>
    </div>
  );
}
