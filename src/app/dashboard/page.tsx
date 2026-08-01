'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, Download, Building2, Loader2, Mail, Sparkles } from 'lucide-react';
import { courses, getCourse, demoEnrolledCourses, demoCertificates, demoPoints, demoStreakDays } from '@/lib/mock-data';
import { mockTeamMembers, mockPendingInvitations, roleBadgeClass, getTeamCourseUsage, getOrgRevenueEstimate } from '@/lib/organization-mock-data';
import { initialTeachingCourses, recentStudentActivity } from '@/lib/teaching-mock-data';
import { INSTRUCTOR_SHARE } from '@/lib/instructor-pricing';
import { useAuth, dashboardModeFor, type AuthUser } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import { GraphQLClient } from '@/lib/graphql-client';
import { requestInstructorRole } from '@/graphql/mutations';
import type { RequestInstructorRoleMutation, RequestInstructorRoleMutationVariables } from '@/API';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import CourseCard from '@/components/CourseCard';
import ProgressRing from '@/components/ProgressRing';
import DashboardStatCard from '@/components/DashboardStatCard';
import Sparkline from '@/components/Sparkline';
import Avatar from '@/components/Avatar';

export default function DashboardPage() {
  const { user, wantsToTeach } = useAuth();
  if (!user) return null; // DashboardLayout already redirects/loads before this can render

  switch (dashboardModeFor(user, wantsToTeach)) {
    case 'organization':
      return <OrganizationOverview user={user} />;
    case 'instructor':
      return <InstructorOverview user={user} />;
    default:
      return <LearnerOverview user={user} />;
  }
}

// ============================================================
// Organizations manage a team; they don't take courses themselves.
// This is a fully separate experience from the learner dashboard below.
// ============================================================
function OrganizationOverview({ user }: { user: AuthUser }) {
  const accent = accentByMode.organization;
  const orgName = user.organizations[0]?.organization?.name ?? 'your organization';
  const avgProgress = Math.round(
    mockTeamMembers.reduce((sum, m) => sum + m.trainingProgress, 0) / mockTeamMembers.length
  );
  const topMembers = [...mockTeamMembers].sort((a, b) => b.trainingProgress - a.trainingProgress).slice(0, 4);
  const topInvitations = mockPendingInvitations.slice(0, 2);
  const teamCourses = getTeamCourseUsage();
  const revenue = getOrgRevenueEstimate();
  const stalled = mockTeamMembers.filter((m) => m.trainingProgress === 0 && m.assignedCourseIds.length > 0);
  const instructorCount = mockTeamMembers.filter((m) => m.role === 'INSTRUCTOR').length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-1.5">Overview</p>

      {/* Hero: the one thing that actually needs attention, not a wall of stats */}
      <div className={`flex items-center gap-4 rounded-2xl border border-ink-200 bg-gradient-to-br ${accent.gradientFrom} to-ink-50 p-5 mb-5`}>
        <div className="flex-shrink-0">
          <ProgressRing progress={avgProgress} colorClassName={accent.stroke600} size={56} strokeWidth={5} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-ink-900 truncate">
            {stalled.length > 0
              ? `${stalled.length === 1 ? stalled[0].name : `${stalled.length} members`} haven't started their assigned training`
              : `${orgName} is on track`}
          </h2>
          <p className="text-xs text-ink-500 mt-0.5 truncate">
            {stalled.length > 0
              ? `${stalled.map((m) => m.name).join(', ')} — assigned, but no progress yet`
              : 'Everyone with training assigned has made some progress.'}
          </p>
        </div>
        <Link href="/dashboard/team" className={`rounded-xl ${accent.bg600} ${accent.bg600Hover} px-4 py-2.5 text-sm font-bold text-white transition-colors flex-shrink-0`}>
          {stalled.length > 0 ? 'Nudge team' : 'Manage team'}
        </Link>
      </div>

      {/* Stat row, including what the org earns — same treatment as an instructor's earnings, not an afterthought */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <DashboardStatCard value={mockTeamMembers.length} label="Members" />
        <DashboardStatCard value={mockPendingInvitations.length} label="Pending invites" />
        <DashboardStatCard
          value={`${avgProgress}%`}
          label="Avg. completion"
          sparkline={<Sparkline points={[30, 33, 35, 38, 40, 42, avgProgress]} strokeClassName={accent.stroke600} />}
        />
        <DashboardStatCard value={instructorCount} label="Instructor on team" />
        <DashboardStatCard
          value={`TZS ${(revenue / 1000).toFixed(0)}K`}
          trend={{ text: '↑ 9% this month', direction: 'up' }}
          sparkline={<Sparkline points={[74, 81, 86, 90, 98, 112, revenue / 1000]} strokeClassName={accent.stroke600} />}
        />
      </div>

      {/* Revenue by course */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2.5">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Revenue by course</h2>
          <Link href="/dashboard/courses" className={`text-xs font-bold ${accent.text600} hover:underline`}>Full breakdown</Link>
        </div>
        <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
          {teamCourses.length > 0 ? (
            teamCourses.map((course) => {
              const isCustom = course.isCustom;
              const instructorName = !isCustom ? courses.find((c) => c.id === course.id)?.instructor : undefined;
              return (
                <div key={course.id} className="flex items-center gap-3 py-2.5 px-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-ink-900 truncate">{course.title}</p>
                    <p className="text-[11.5px] text-ink-400 truncate">
                      {isCustom ? `Custom course · ${course.assignedCount} assigned` : `Taught by ${instructorName} · Instructor`}
                    </p>
                  </div>
                  <div className="w-[90px] hidden sm:block">
                    <Sparkline points={[9, 11, 10, 13, 15, 17, course.assignedCount + 10]} strokeClassName="stroke-brand-600" />
                  </div>
                  <p className="text-[13.5px] font-bold text-ink-900 flex-shrink-0">
                    TZS {(course.assignedCount * 15000 / 1000).toFixed(0)}K
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-ink-400 py-6 text-center px-3.5">No courses generating revenue yet.</p>
          )}
        </div>
      </section>

      {/* Team snapshot */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2.5">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Team</h2>
          <Link href="/dashboard/team" className={`text-xs font-bold ${accent.text600} hover:underline`}>View all</Link>
        </div>
        <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
          {topMembers.map((member) => {
            const memberStalled = member.trainingProgress === 0 && member.assignedCourseIds.length > 0;
            return (
              <div key={member.id} className="flex items-center gap-3 py-2.5 px-3.5">
                <Avatar name={member.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{member.name}</p>
                  <p className="text-[11.5px] text-ink-400">
                    {member.assignedCourseIds.length} course{member.assignedCourseIds.length === 1 ? '' : 's'} assigned
                  </p>
                </div>
                <div className="w-[72px] h-[5px] rounded-full bg-ink-100 overflow-hidden flex-shrink-0">
                  <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.max(member.trainingProgress, 3)}%` }} />
                </div>
                {memberStalled && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 bg-coral-100 text-coral-700">
                    Stalled
                  </span>
                )}
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${roleBadgeClass[member.role]}`}>
                  {member.role}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pending invitations snapshot */}
      {topInvitations.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-2.5">
            <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Pending invitations</h2>
            <Link href="/dashboard/team" className={`text-xs font-bold ${accent.text600} hover:underline`}>Invite someone</Link>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
            {topInvitations.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 py-2.5 px-3.5">
                <div className="w-[30px] h-[30px] rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-warm-600" />
                </div>
                <p className="flex-1 text-[13.5px] font-semibold text-ink-900 truncate">{inv.email}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${roleBadgeClass[inv.role]}`}>
                  {inv.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================================
// Instructors teach — independently, or as an INSTRUCTOR-role member of an
// organization. Either way, teaching is the headline; any training the org
// has assigned them to complete personally shows up too, but last and small.
// ============================================================
function InstructorOverview({ user }: { user: AuthUser }) {
  const accent = accentByMode.instructor;
  const membership = user.organizations[0];
  const org = membership?.organization;
  const teachingCourses = initialTeachingCourses;
  const published = teachingCourses.filter((c) => c.status === 'published');
  const drafts = teachingCourses.filter((c) => c.status === 'draft');
  const totalEnrolled = teachingCourses.reduce((sum, c) => sum + c.enrolledCount, 0);
  const estimatedEarnings = Math.round(
    teachingCourses.reduce((sum, c) => sum + c.enrolledCount * c.priceTzs, 0) * INSTRUCTOR_SHARE
  );

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-1.5">Overview</p>

      {/* Hero action — honest about where things actually stand */}
      <div className={`flex items-center gap-4 rounded-2xl border border-ink-200 bg-gradient-to-br ${accent.gradientFrom} to-ink-50 p-5 mb-5`}>
        <div className="w-14 h-14 rounded-full bg-white border border-ink-200 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-coral-600" />
        </div>
        <div className="flex-1 min-w-0">
          {drafts.length > 0 ? (
            <>
              <h2 className="font-bold text-ink-900 truncate">Finish setting up &quot;{drafts[0].title}&quot;</h2>
              <p className="text-xs text-ink-500 mt-0.5">Published courses start showing up in the catalog immediately.</p>
            </>
          ) : (
            <>
              <h2 className="font-bold text-ink-900">Ready for your next course?</h2>
              <p className="text-xs text-ink-500 mt-0.5">Mix video, flashcards, guides, and quizzes into a new one.</p>
            </>
          )}
        </div>
        <Link href="/dashboard/courses" className={`rounded-xl ${accent.bg600} ${accent.bg600Hover} px-4 py-2.5 text-sm font-bold text-white transition-colors flex-shrink-0`}>
          {drafts.length > 0 ? 'Continue' : 'New course'}
        </Link>
      </div>

      {/* Independent instructor, not yet approved to publish — the approval
          request itself lives in Settings, but it needs to be visible from
          here too, since this is the page an independent instructor
          actually lands on. */}
      {!org && user.instructorStatus !== 'APPROVED' && (
        <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 mb-6">
          <p className="flex-1 text-xs text-ink-500">
            {user.instructorStatus === 'PENDING'
              ? 'Your application to publish independent public courses is pending Ndotoni review.'
              : user.instructorStatus === 'REJECTED'
              ? 'Your instructor application was declined.'
              : 'Publishing a public course under your own name needs a quick Ndotoni approval first.'}
          </p>
          <Link href="/dashboard/settings" className={`text-xs font-bold ${accent.text600} hover:underline flex-shrink-0`}>
            {user.instructorStatus ? 'View status' : 'Apply for approval'}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <DashboardStatCard
          value={totalEnrolled}
          label="Students enrolled"
          sparkline={<Sparkline points={[120, 140, 150, 165, 180, 198, totalEnrolled]} strokeClassName={accent.stroke600} />}
        />
        <DashboardStatCard
          value={`TZS ${(estimatedEarnings / 1000).toFixed(0)}K`}
          trend={{ text: '↑ 18% this month', direction: 'up' }}
        />
        <DashboardStatCard value={published.length} label="Published" />
        <DashboardStatCard value={drafts.length} label="Drafts" />
      </div>

      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2.5">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Your courses</h2>
          <Link href="/dashboard/courses" className={`text-xs font-bold ${accent.text600} hover:underline`}>Manage all</Link>
        </div>
        <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
          {teachingCourses.map((course) => {
            const courseEarnings = Math.round(course.enrolledCount * course.priceTzs * INSTRUCTOR_SHARE);
            return (
              <div key={course.id} className="flex items-center gap-3 py-2.5 px-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{course.title}</p>
                  <p className="text-[11.5px] text-ink-400">
                    {course.status === 'published' ? `${course.enrolledCount} students · ${course.category}` : 'Not published yet'}
                  </p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                  course.status === 'published' ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
                }`}>
                  {course.status}
                </span>
                {course.status === 'published' ? (
                  <>
                    <div className="w-[90px] hidden sm:block">
                      <Sparkline points={[4, 5, 6, 7, 8, 9, Math.max(course.enrolledCount / 15, 4)]} strokeClassName="stroke-brand-600" />
                    </div>
                    <p className="text-[13.5px] font-bold text-brand-600 flex-shrink-0">TZS {(courseEarnings / 1000).toFixed(0)}K</p>
                  </>
                ) : (
                  <Link href="/dashboard/courses" className={`text-xs font-bold ${accent.text600} flex-shrink-0`}>Finish setup</Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {recentStudentActivity.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Recent students</h2>
          <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
            {recentStudentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3.5">
                <Avatar name={activity.studentName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{activity.studentName}</p>
                  <p className="text-[11.5px] text-ink-400 truncate">
                    {activity.action === 'enrolled' ? 'Enrolled in' : 'Completed'} {activity.courseTitle} · {activity.when}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* An instructor is still a learner too — often was one first, and may
          have courses or certificates from before they ever started
          teaching. Present, but deliberately last and small, and in the
          learner accent color, not the instructor one — same mixed-sources
          "Assigned" tagging as the Learner view, not a separate mechanism. */}
      {demoEnrolledCourses.length > 0 && (
        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-2.5">
            <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Continue learning</h2>
            <Link href="/dashboard/courses" className="text-xs font-bold text-indigo-600 hover:underline">My learning</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {demoEnrolledCourses.map((enrolled, i) => (
              <EnrolledCourseCard
                key={enrolled.courseId}
                enrolled={enrolled}
                course={getCourse(enrolled.courseId)}
                assignedBy={i === 0 && org ? org.name : undefined}
              />
            ))}
          </div>
        </section>
      )}

      {demoCertificates.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Certificates</h2>
          <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
            {demoCertificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-3 py-2.5 px-3.5">
                <div className="w-[30px] h-[30px] rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-3.5 h-3.5 text-warm-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{cert.courseTitle}</p>
                  <p className="text-[11.5px] text-ink-400">
                    Score {cert.score}% · Issued {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <Link href="/dashboard/certificates" className="text-xs font-bold text-indigo-600 flex-shrink-0">Download</Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================================
// Learners: no organization, or a plain MEMBER inside one. Courses can be
// self-picked from the catalog or assigned by an org — same list either way.
// ============================================================
function LearnerOverview({ user }: { user: AuthUser }) {
  const { setWantsToTeach, refetch } = useAuth();
  const accent = accentByMode.learner;
  const membership = user.organizations[0];
  const org = membership?.organization;
  const isPlainMember = membership?.role === 'MEMBER';
  const [primary] = demoEnrolledCourses;
  const primaryCourse = primary ? getCourse(primary.courseId) : undefined;
  const currentModuleTitle = primaryCourse?.modules.find((m) => m.order === primary?.currentModule)?.title;

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
          <ProgressRing progress={primary.progress} colorClassName={accent.stroke600} size={56} strokeWidth={5} />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-ink-900 truncate">
              Continue &quot;{currentModuleTitle ?? primaryCourse?.title ?? primary.courseTitle}&quot;
            </h2>
            <p className="text-xs text-ink-500 mt-0.5 truncate">
              Module {primary.currentModule} of {primary.totalModules} · {primaryCourse?.title ?? primary.courseTitle}
            </p>
          </div>
          <Link
            href={`/courses/${primary.courseId}`}
            className={`rounded-xl ${accent.bg600} ${accent.bg600Hover} px-5 py-2.5 text-sm font-bold text-white transition-colors flex-shrink-0`}
          >
            Resume
          </Link>
        </div>
      )}

      {/* Compact secondary stats — supporting, not the headline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <DashboardStatCard value={demoEnrolledCourses.length} label="In progress" />
        <DashboardStatCard value={demoCertificates.length} label="Certificates" />
        <DashboardStatCard value={<>{demoPoints.earned}<span className="text-ink-400 font-semibold text-base">/{demoPoints.target}</span></>} label="Points this month" />
        <DashboardStatCard value={demoStreakDays} label="Day streak" />
      </div>

      {/* Continue learning: mixed sources, tagged, not separated into two lists */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2.5">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Continue learning</h2>
          <Link href="/dashboard/courses" className={`text-xs font-bold ${accent.text600} hover:underline`}>My courses</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {demoEnrolledCourses.map((enrolled, i) => (
            <EnrolledCourseCard
              key={enrolled.courseId}
              enrolled={enrolled}
              course={getCourse(enrolled.courseId)}
              assignedBy={i === 0 && org ? org.name : undefined}
            />
          ))}
          <Link
            href="/courses"
            className="flex items-center justify-center rounded-xl border border-dashed border-ink-200 p-3.5 text-[12.5px] text-ink-400 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
          >
            Browse the catalog →
          </Link>
        </div>
      </section>

      {/* Certificates */}
      {demoCertificates.length > 0 && (
        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-2.5">
            <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Certificates</h2>
            <Link href="/dashboard/certificates" className={`text-xs font-bold ${accent.text600} hover:underline`}>View all</Link>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
            {demoCertificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-3 py-2.5 px-3.5">
                <div className="w-[30px] h-[30px] rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-3.5 h-3.5 text-warm-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{cert.courseTitle}</p>
                  <p className="text-[11.5px] text-ink-400">
                    Score {cert.score}% · Issued {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

      {/* Switch to instructor mode — only for someone with no organization
          at all. Clicking this re-renders this same page as
          InstructorOverview immediately — no navigation needed. */}
      {!org && (
        <section className="mb-6">
          <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
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
        </section>
      )}

      {/* A plain MEMBER's own path to teaching — entirely internal to this
          org, separate from the no-org toggle above. Only the OWNER can
          actually promote (via the Team page), so this just sends the ask —
          same request Settings' Teaching section offers, surfaced here too
          since this is the page a member actually lands on. */}
      {isPlainMember && (
        <section className="mb-6">
          <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
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
