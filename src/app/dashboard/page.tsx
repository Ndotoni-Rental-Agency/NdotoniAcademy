'use client';

import Link from 'next/link';
import { BookOpen, Award, Zap, Download, Building2, UserPlus, Users, Mail, TrendingUp, ArrowRight, Wallet, Sparkles } from 'lucide-react';
import { courses, getCourse, demoEnrolledCourses, demoCertificates, demoPoints } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import { mockTeamMembers, mockPendingInvitations, roleBadgeClass, getTeamCourseUsage, getOrgRevenueEstimate } from '@/lib/organization-mock-data';
import { initialTeachingCourses } from '@/lib/teaching-mock-data';
import { INSTRUCTOR_SHARE } from '@/lib/instructor-pricing';
import { useAuth, displayName, dashboardModeFor, type AuthUser } from '@/lib/auth-context';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import CourseCard from '@/components/CourseCard';
import ProgressRing from '@/components/ProgressRing';
import Avatar from '@/components/Avatar';

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null; // DashboardLayout already redirects/loads before this can render

  switch (dashboardModeFor(user)) {
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
  const orgName = user.organizations[0]?.organization?.name ?? 'your organization';
  const avgProgress = Math.round(
    mockTeamMembers.reduce((sum, m) => sum + m.trainingProgress, 0) / mockTeamMembers.length
  );
  const topMembers = [...mockTeamMembers].sort((a, b) => b.trainingProgress - a.trainingProgress).slice(0, 4);
  const topInvitations = mockPendingInvitations.slice(0, 2);
  const teamCourses = getTeamCourseUsage();
  const revenue = getOrgRevenueEstimate();
  const stalled = mockTeamMembers.filter((m) => m.trainingProgress === 0 && m.assignedCourseIds.length > 0);

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink-900">
          Welcome back, {(user.firstName || displayName(user)).split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-500 mt-1">Here&apos;s how {orgName} is doing.</p>
      </div>

      {/* Hero: the one thing that actually needs attention, not a wall of stats */}
      {stalled.length > 0 && (
        <div className="flex items-center gap-4 rounded-2xl border-2 border-ink-100 bg-gradient-to-br from-coral-50 to-white p-5 mb-6">
          <div className="w-11 h-11 rounded-xl bg-coral-100 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-coral-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-ink-900">
              {stalled.length === 1 ? `${stalled[0].name} hasn't` : `${stalled.length} members haven't`} started their assigned training
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              {stalled.map((m) => m.name).join(', ')} — assigned, but no progress yet
            </p>
          </div>
          <Link href="/dashboard/team" className="rounded-xl bg-coral-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-coral-700 transition-colors flex-shrink-0">
            Nudge team
          </Link>
        </div>
      )}

      {/* Stat row, including what the org earns — same treatment as an instructor's earnings, not an afterthought */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="rounded-2xl bg-indigo-600 text-white p-4 sm:p-5">
          <Users className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{mockTeamMembers.length}</p>
          <p className="text-xs text-white/80 mt-1">Members</p>
        </div>
        <div className="rounded-2xl bg-warm-600 text-white p-4 sm:p-5">
          <Mail className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{mockPendingInvitations.length}</p>
          <p className="text-xs text-white/80 mt-1">Pending invites</p>
        </div>
        <div className="rounded-2xl bg-sky-600 text-white p-4 sm:p-5">
          <TrendingUp className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{avgProgress}%</p>
          <p className="text-xs text-white/80 mt-1">Avg. completion</p>
        </div>
        <div className="rounded-2xl bg-brand-600 text-white p-4 sm:p-5">
          <Wallet className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">TZS {(revenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-white/80 mt-1">Revenue this month</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/dashboard/team" className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
          <UserPlus className="w-4 h-4" /> Invite member
        </Link>
        <Link href="/dashboard/team" className="flex items-center gap-1.5 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors">
          <BookOpen className="w-4 h-4" /> Assign training
        </Link>
        <Link href="/dashboard/team" className="flex items-center gap-1.5 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors">
          <Building2 className="w-4 h-4" /> Manage team
        </Link>
      </div>

      {/* Team snapshot */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide">Team</h2>
          <Link href="/dashboard/team" className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-ink-100 bg-white rounded-2xl border-2 border-ink-100 px-4">
          {topMembers.map((member) => {
            const memberStalled = member.trainingProgress === 0 && member.assignedCourseIds.length > 0;
            return (
              <div key={member.id} className="flex items-center gap-3 py-3.5">
                <Avatar name={member.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{member.name}</p>
                  <p className="text-xs text-ink-400">
                    {member.assignedCourseIds.length} course{member.assignedCourseIds.length === 1 ? '' : 's'}
                    {member.assignedCourseIds.length > 0 && <> &middot; {member.trainingProgress}% complete</>}
                  </p>
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
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide">Pending invitations</h2>
            <Link href="/dashboard/team" className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-ink-100 bg-white rounded-2xl border-2 border-ink-100 px-4">
            {topInvitations.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 py-3.5">
                <div className="w-8 h-8 rounded-full bg-warm-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-warm-600" />
                </div>
                <p className="flex-1 text-sm font-semibold text-ink-900 truncate">{inv.email}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${roleBadgeClass[inv.role]}`}>
                  {inv.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Team courses snapshot */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide">Team courses</h2>
          <Link href="/dashboard/courses" className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700">
            Add a course <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {teamCourses.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {teamCourses.map((course) => {
              const theme = getCategoryTheme(course.category);
              return (
                <div
                  key={course.id}
                  className="flex items-center gap-2.5 flex-shrink-0 rounded-xl border-2 border-ink-100 bg-white px-3.5 py-2.5 min-w-[180px]"
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${theme.solidBg}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink-900 truncate">{course.title}</p>
                    <p className="text-[10px] text-ink-400">{course.assignedCount} assigned</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-ink-400 bg-white rounded-2xl border-2 border-ink-100 px-4 py-5 text-center">
            No courses assigned yet. Head to Courses to create your own, or Team to assign one.
          </p>
        )}
      </section>
    </div>
  );
}

// ============================================================
// Instructors teach — independently, or as an INSTRUCTOR-role member of an
// organization. Either way, teaching is the headline; any training the org
// has assigned them to complete personally shows up too, but last and small.
// ============================================================
function InstructorOverview({ user }: { user: AuthUser }) {
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
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink-900">
          Welcome back, {(user.firstName || displayName(user)).split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-500 mt-1">
          {org ? `Teaching for ${org.name}.` : 'Here’s how your courses are doing.'}
        </p>
      </div>

      {/* Hero action — honest about where things actually stand */}
      <div className="flex items-center gap-4 rounded-2xl border-2 border-ink-100 bg-gradient-to-br from-coral-50 to-white p-5 mb-6">
        <div className="w-11 h-11 rounded-xl bg-coral-100 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-coral-600" />
        </div>
        <div className="flex-1 min-w-0">
          {drafts.length > 0 ? (
            <>
              <h2 className="font-bold text-ink-900">Finish setting up &quot;{drafts[0].title}&quot;</h2>
              <p className="text-xs text-ink-500 mt-0.5">Published courses start showing up in the catalog immediately.</p>
            </>
          ) : (
            <>
              <h2 className="font-bold text-ink-900">Ready for your next course?</h2>
              <p className="text-xs text-ink-500 mt-0.5">Mix video, flashcards, guides, and quizzes into a new one.</p>
            </>
          )}
        </div>
        <Link href="/dashboard/courses" className="rounded-xl bg-coral-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-coral-700 transition-colors flex-shrink-0">
          {drafts.length > 0 ? 'Continue' : 'New course'}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <div className="rounded-2xl bg-coral-600 text-white p-4 sm:p-5">
          <Users className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{totalEnrolled}</p>
          <p className="text-xs text-white/80 mt-1">Students enrolled</p>
        </div>
        <div className="rounded-2xl bg-brand-600 text-white p-4 sm:p-5">
          <Wallet className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">TZS {(estimatedEarnings / 1000).toFixed(0)}K</p>
          <p className="text-xs text-white/80 mt-1">Est. earned</p>
        </div>
        <div className="rounded-2xl bg-sky-600 text-white p-4 sm:p-5">
          <BookOpen className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{published.length}</p>
          <p className="text-xs text-white/80 mt-1">Published</p>
        </div>
        <div className="rounded-2xl bg-warm-600 text-white p-4 sm:p-5">
          <BookOpen className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{drafts.length}</p>
          <p className="text-xs text-white/80 mt-1">Drafts</p>
        </div>
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide">Your courses</h2>
          <Link href="/dashboard/courses" className="flex items-center gap-1 text-xs font-bold text-coral-600 hover:text-coral-700">
            Manage all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-ink-100 bg-white rounded-2xl border-2 border-ink-100 px-4">
          {teachingCourses.map((course) => (
            <div key={course.id} className="flex items-center gap-3 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">{course.title}</p>
                <p className="text-xs text-ink-400">{course.enrolledCount} enrolled &middot; {course.category}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                course.status === 'published' ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
              }`}>
                {course.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Assigned to you — present, but deliberately last and small, and in the learner accent, not the instructor one */}
      {org && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide">Assigned to you</h2>
            <Link href="/dashboard/courses" className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              My learning <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {demoEnrolledCourses.slice(0, 1).map((enrolled) => (
              <EnrolledCourseCard key={enrolled.courseId} enrolled={enrolled} course={getCourse(enrolled.courseId)} assignedBy={org.name} />
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
  const membership = user.organizations[0];
  const org = membership?.organization;
  const [primary] = demoEnrolledCourses;
  const primaryCourse = primary ? getCourse(primary.courseId) : undefined;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink-900">
          Welcome back, {(user.firstName || displayName(user)).split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-500 mt-1">Pick up where you left off.</p>
      </div>

      {/* Hero: one obvious next action, not three equal-weight tiles */}
      {primary && (
        <div className="flex items-center gap-4 rounded-2xl border-2 border-ink-100 bg-gradient-to-br from-indigo-50 to-white p-5 mb-6">
          <ProgressRing progress={primary.progress} colorClassName="stroke-indigo-600" size={56} strokeWidth={5} />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-ink-900 truncate">
              Continue &quot;{primaryCourse?.title ?? primary.courseTitle}&quot;
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">Module {primary.currentModule} of {primary.totalModules}</p>
          </div>
          <Link
            href={`/courses/${primary.courseId}`}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors flex-shrink-0"
          >
            Resume
          </Link>
        </div>
      )}

      {/* Compact secondary stats — supporting, not the headline */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="rounded-xl border border-ink-100 px-4 py-3">
          <p className="flex items-center gap-1.5 text-lg font-extrabold text-ink-900"><BookOpen className="w-4 h-4 text-indigo-500" /> {demoEnrolledCourses.length}</p>
          <p className="text-[11px] text-ink-400 mt-0.5">In progress</p>
        </div>
        <div className="rounded-xl border border-ink-100 px-4 py-3">
          <p className="flex items-center gap-1.5 text-lg font-extrabold text-ink-900"><Award className="w-4 h-4 text-warm-500" /> {demoCertificates.length}</p>
          <p className="text-[11px] text-ink-400 mt-0.5">Certificates</p>
        </div>
        <div className="rounded-xl border border-ink-100 px-4 py-3">
          <p className="flex items-center gap-1.5 text-lg font-extrabold text-ink-900">
            <Zap className="w-4 h-4 text-brand-500" /> {demoPoints.earned}<span className="text-ink-400 font-semibold text-sm">/{demoPoints.target}</span>
          </p>
          <p className="text-[11px] text-ink-400 mt-0.5">Points this month</p>
        </div>
      </div>

      {/* Continue learning: mixed sources, tagged, not separated into two lists */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Continue learning</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
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

      {/* Certificates: colored cards */}
      {demoCertificates.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Certificates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {demoCertificates.map((cert) => {
              const theme = getCategoryTheme(courses.find((c) => c.title === cert.courseTitle)?.category ?? '');
              return (
                <div key={cert.id} className={`flex items-center gap-4 rounded-2xl border-2 ${theme.border} p-4`}>
                  <div className={`w-12 h-12 rounded-xl ${theme.solidBg} flex items-center justify-center flex-shrink-0`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink-900 truncate">{cert.courseTitle}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      Score: {cert.score}% · {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/certificates"
                    className={`flex items-center gap-1 text-xs font-bold ${theme.solidText} flex-shrink-0`}
                  >
                    <Download className="w-3.5 h-3.5" /> View
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Create an organization — only for someone with no organization at all */}
      {!org && (
        <section className="mb-10">
          <div className="flex items-center gap-4 rounded-2xl border-2 border-ink-100 p-4 sm:p-5">
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
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
