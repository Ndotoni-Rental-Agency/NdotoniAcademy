'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, Building2, Download, Loader2, Sparkles } from 'lucide-react';
import { courses } from '@/lib/mock-data';
import { useAuth, type AuthUser } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import { GraphQLClient } from '@/lib/graphql-client';
import { requestInstructorRole } from '@/graphql/mutations';
import { myLearning as myLearningQuery, myCertificates as myCertificatesQuery } from '@/graphql/queries';
import type {
  RequestInstructorRoleMutation, RequestInstructorRoleMutationVariables,
  MyLearningQuery, MyCertificatesQuery,
} from '@/API';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import CourseCard from '@/components/CourseCard';
import ProgressRing from '@/components/ProgressRing';
import DashboardStatCard from '@/components/DashboardStatCard';

// ============================================================
// Learners: no organization, or a plain MEMBER inside one. Courses can be
// self-picked from the catalog or assigned by an org — same list either way.
// ============================================================
export default function LearnerOverview({ user }: { user: AuthUser }) {
  const { setWantsToTeach, refetch } = useAuth();
  const accent = accentByMode.learner;
  const membership = user.organizations[0];
  const org = membership?.organization;
  const isPlainMember = membership?.role === 'MEMBER';

  const [learning, setLearning] = useState<MyLearningQuery['myLearning']>([]);
  const [certificates, setCertificates] = useState<MyCertificatesQuery['myCertificates']>([]);
  const [loadingLearning, setLoadingLearning] = useState(true);

  const loadLearning = useCallback(async () => {
    setLoadingLearning(true);
    try {
      const [{ myLearning: fetchedLearning }, { myCertificates: fetchedCertificates }] = await Promise.all([
        GraphQLClient.execute<MyLearningQuery>(myLearningQuery),
        GraphQLClient.execute<MyCertificatesQuery>(myCertificatesQuery),
      ]);
      setLearning(fetchedLearning);
      setCertificates(fetchedCertificates);
    } catch (err) {
      console.error('[LearnerOverview] load failed ->', err);
    } finally {
      setLoadingLearning(false);
    }
  }, []);

  useEffect(() => {
    void loadLearning();
  }, [loadLearning]);

  // myLearning is sorted most-recently-active first — the natural "continue
  // this one" pick, same idea the old mock hero used.
  const primary = learning[0];
  const inProgressCount = learning.filter((l) => l.completedLessonCount < l.totalLessons).length;
  const lessonsCompleted = learning.reduce((sum, l) => sum + l.completedLessonCount, 0);
  const primaryHref = primary
    ? primary.resumeModuleId && primary.resumeLessonId
      ? `/courses/${primary.courseId}/modules/${primary.resumeModuleId}/lessons/${primary.resumeLessonId}`
      : `/courses/${primary.courseId}`
    : undefined;
  const primaryPercent = primary && primary.totalLessons > 0
    ? Math.max(Math.round((primary.completedLessonCount / primary.totalLessons) * 100), 3)
    : 0;

  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState('');

  async function handleRequestInstructor() {
    if (!membership) return;
    setRequesting(true);
    setRequestError('');
    try {
      await GraphQLClient.execute<RequestInstructorRoleMutation>(requestInstructorRole, {
        organizationId: membership.organizationId,
      } satisfies RequestInstructorRoleMutationVariables);
      await refetch();
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : String(err));
    } finally {
      setRequesting(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-1.5">Overview</p>

      {/* Hero: one obvious next action, not three equal-weight tiles */}
      {primary && (
        <div className={`flex items-center gap-4 rounded-2xl border border-ink-200 bg-gradient-to-br ${accent.gradientFrom} to-ink-50 p-5 mb-5`}>
          <ProgressRing progress={primaryPercent} colorClassName={accent.stroke600} size={56} strokeWidth={5} />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-ink-900 truncate">Continue &quot;{primary.title}&quot;</h2>
            <p className="text-xs text-ink-500 mt-0.5 truncate">
              {primary.completedLessonCount} of {primary.totalLessons} lessons complete
            </p>
          </div>
          <Link
            href={primaryHref!}
            className={`rounded-xl ${accent.bg600} ${accent.bg600Hover} px-5 py-2.5 text-sm font-bold text-white transition-colors flex-shrink-0`}
          >
            Resume
          </Link>
        </div>
      )}

      {/* Switch to instructor mode — only for someone with no organization
          at all. Clicking this re-renders this same page as
          InstructorOverview immediately — no navigation needed. Placed
          right under the hero, not buried at the bottom, so it's actually
          seen. */}
      {!org && (
        <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 sm:p-5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-coral-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink-900">Want to teach?</p>
            <p className="text-xs text-ink-500 mt-0.5">Switch to your instructor dashboard to build and publish courses.</p>
          </div>
          <button
            onClick={() => setWantsToTeach(true)}
            className="rounded-xl bg-coral-600 px-4 py-2 text-xs font-bold text-white hover:bg-coral-700 transition-colors flex-shrink-0"
          >
            Switch
          </button>
        </div>
      )}

      {/* A plain MEMBER's own path to teaching — entirely internal to this
          org, separate from the no-org toggle above. Only the OWNER can
          actually promote (via the Team page), so this just sends the ask —
          same request Settings' Teaching section offers, surfaced here too
          since this is the page a member actually lands on. */}
      {isPlainMember && (
        <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 sm:p-5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-coral-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink-900">
              {membership?.wantsToBeInstructor ? 'Request sent' : `Want to teach at ${org?.name ?? 'your organization'}?`}
            </p>
            <p className="text-xs text-ink-500 mt-0.5">
              {membership?.wantsToBeInstructor
                ? `Waiting on ${org?.name ?? 'your organization'}'s owner to approve.`
                : `Ask ${org?.name ?? 'your organization'}'s owner to make you an instructor there.`}
            </p>
            {requestError && <p className="text-xs text-coral-600 mt-1">{requestError}</p>}
          </div>
          {!membership?.wantsToBeInstructor && (
            <button
              onClick={handleRequestInstructor}
              disabled={requesting}
              className="rounded-xl bg-coral-600 px-4 py-2 text-xs font-bold text-white hover:bg-coral-700 transition-colors flex-shrink-0 disabled:opacity-60"
            >
              {requesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Request'}
            </button>
          )}
        </div>
      )}

      {/* Compact secondary stats — supporting, not the headline */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <DashboardStatCard value={inProgressCount} label="In progress" />
        <DashboardStatCard value={certificates.length} label="Certificates" />
        <DashboardStatCard value={lessonsCompleted} label="Lessons completed" />
      </div>

      {/* Continue learning */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2.5">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Continue learning</h2>
          <Link href="/dashboard/courses" className={`text-xs font-bold ${accent.text600} hover:underline`}>My courses</Link>
        </div>
        {loadingLearning ? (
          <div className="flex items-center justify-center rounded-xl border border-ink-200 bg-white py-8">
            <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {learning.map((item) => (
              <EnrolledCourseCard key={item.courseId} learning={item} />
            ))}
            <Link
              href="/courses"
              className="flex items-center justify-center rounded-xl border border-dashed border-ink-200 p-3.5 text-[12.5px] text-ink-400 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
            >
              Browse the catalog →
            </Link>
          </div>
        )}
      </section>

      {/* Certificates */}
      {certificates.length > 0 && (
        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-2.5">
            <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Certificates</h2>
            <Link href="/dashboard/certificates" className={`text-xs font-bold ${accent.text600} hover:underline`}>View all</Link>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-3 py-2.5 px-3.5">
                <div className="w-[30px] h-[30px] rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-3.5 h-3.5 text-warm-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{cert.courseTitle}</p>
                  <p className="text-[11.5px] text-ink-400">
                    Issued {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <Link href="/dashboard/certificates" className={`text-xs font-bold ${accent.text600} flex items-center gap-1 flex-shrink-0`}>
                  <Download className="w-3.5 h-3.5" /> Download
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Create an organization — only for someone with no organization at all */}
      {!org && (
        <section className="mb-6">
          <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink-900">Managing a team?</p>
              <p className="text-xs text-ink-500 mt-0.5">Create an organization to invite people and track their training.</p>
            </div>
            <Link
              href="/dashboard/create-organization"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors flex-shrink-0"
            >
              Create
            </Link>
          </div>
        </section>
      )}

      {/* Explore: full CourseCard grid */}
      <section>
        <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
