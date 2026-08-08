'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Search } from 'lucide-react';
import { useAuth, dashboardModeFor, type DashboardMode } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import { GraphQLClient } from '@/lib/graphql-client';
import { myCourses, coursesForOrganization, publicCourses as publicCoursesQuery, myLearning as myLearningQuery } from '@/graphql/queries';
import { CourseStatus } from '@/API';
import type { MyCoursesQuery, CoursesForOrganizationQuery, PublicCoursesQuery, MyLearningQuery } from '@/API';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import PublicCourseCard, { type PublicCourse } from '@/components/PublicCourseCard';
import InstructorCourseCard from '@/components/InstructorCourseCard';
import { CreateCourseModal } from '@/components/CreateCourseModal';

type StatusFilter = 'all' | 'published' | 'draft';
type SortKey = 'updated' | 'title';

/** Client-side search + status filter + sort over an already-fetched course list — small lists, no point round-tripping to the server. */
function useCourseFilters<T extends { title: string; status: CourseStatus; updatedAt: string }>(list: T[]) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortKey>('updated');

  const filtered = useMemo(() => {
    let next = list;
    if (status !== 'all') {
      next = next.filter((c) => c.status === (status === 'published' ? CourseStatus.PUBLISHED : CourseStatus.DRAFT));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      next = next.filter((c) => c.title.toLowerCase().includes(q));
    }
    return [...next].sort((a, b) =>
      sort === 'title' ? a.title.localeCompare(b.title) : +new Date(b.updatedAt) - +new Date(a.updatedAt)
    );
  }, [list, query, status, sort]);

  return { query, setQuery, status, setStatus, sort, setSort, filtered };
}

function CourseFilterBar({
  query, onQuery, status, onStatus, sort, onSort, accentText,
}: {
  query: string;
  onQuery: (v: string) => void;
  status: StatusFilter;
  onStatus: (v: StatusFilter) => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  accentText: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-4">
      <div className="relative flex-1 min-w-[160px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search your courses"
          className="w-full rounded-lg border border-ink-200 pl-8 pr-3 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-200"
        />
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-ink-200 p-0.5">
        {(['all', 'published', 'draft'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStatus(s)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-colors ${
              status === s ? `bg-ink-900 text-white` : 'text-ink-500 hover:bg-ink-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value as SortKey)}
        className={`rounded-lg border border-ink-200 px-2.5 py-1.5 text-[11px] font-bold text-ink-600 focus:outline-none focus:ring-2 focus:ring-ink-200 ${accentText}`}
      >
        <option value="updated">Recently updated</option>
        <option value="title">Title A&ndash;Z</option>
      </select>
    </div>
  );
}

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
  return <LearnerCoursesPage canTeach={canTeach} mode={mode} />;
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
        <h1 className="text-2xl font-semibold text-ink-900 mb-1">Courses</h1>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {orgCourses.map((course) => (
              <InstructorCourseCard key={course.id} course={course} manageable={false} />
            ))}
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
  mode,
}: {
  canTeach: boolean;
  mode: DashboardMode;
}) {
  // Same convention as the Overview: teaching uses the instructor accent only
  // when the viewer actually is one; an org-less learner who can still teach
  // stays in their own (learner) accent rather than borrowing coral.
  const teachAccent = mode === 'instructor' ? accentByMode.instructor : accentByMode.learner;

  const router = useRouter();
  const [teachingCourses, setTeachingCourses] = useState<MyCoursesQuery['myCourses']>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [catalog, setCatalog] = useState<PublicCourse[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [learning, setLearning] = useState<MyLearningQuery['myLearning']>([]);
  const [loadingLearning, setLoadingLearning] = useState(true);
  const teachingFilters = useCourseFilters(teachingCourses);

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
      setLoadingLearning(true);
      try {
        const { myLearning: fetched } = await GraphQLClient.execute<MyLearningQuery>(myLearningQuery);
        setLearning(fetched);
      } catch (err) {
        console.error('[CoursesPage] myLearning failed ->', err);
      } finally {
        setLoadingLearning(false);
      }
    })();
  }, []);

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

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-ink-900 mb-1">Courses</h1>
      <p className="text-sm text-ink-500 mb-8">
        {canTeach ? 'Courses you are taking, and courses you teach.' : 'Courses you are taking, self-picked or assigned.'}
      </p>

      {/* Learning */}
      <section className="mb-12">
        <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Learning</h2>
        {loadingLearning ? (
          <div className="flex items-center justify-center rounded-xl border border-ink-200 bg-white py-8">
            <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
          </div>
        ) : learning.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {learning.map((item) => (
              <EnrolledCourseCard key={item.courseId} learning={item} />
            ))}
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
            <>
              {teachingCourses.length > 4 && (
                <CourseFilterBar
                  query={teachingFilters.query}
                  onQuery={teachingFilters.setQuery}
                  status={teachingFilters.status}
                  onStatus={teachingFilters.setStatus}
                  sort={teachingFilters.sort}
                  onSort={teachingFilters.setSort}
                  accentText={teachAccent.text600}
                />
              )}
              {teachingFilters.filtered.length === 0 ? (
                <p className="text-ink-400 text-sm bg-white rounded-xl border border-ink-200 px-4 py-5 text-center">
                  No courses match that search.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {teachingFilters.filtered.map((course) => (
                    <InstructorCourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </>
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
