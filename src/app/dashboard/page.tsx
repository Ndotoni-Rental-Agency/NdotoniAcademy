'use client';

import Link from 'next/link';
import { BookOpen, Award, Zap, Download, Building2, UserPlus, Users, Mail, TrendingUp, ArrowRight } from 'lucide-react';
import { mockUser, courses, getCourse } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import { mockOrganization, mockTeamMembers, mockPendingInvitations, roleBadgeClass, getTeamCourseUsage } from '@/lib/organization-mock-data';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import CourseCard from '@/components/CourseCard';
import Avatar from '@/components/Avatar';

export default function DashboardPage() {
  return mockUser.organization ? <OrganizationOverview /> : <IndividualOverview />;
}

// ============================================================
// Organizations manage a team; they don't take courses themselves.
// This is a fully separate experience from the individual dashboard below.
// ============================================================
function OrganizationOverview() {
  const avgProgress = Math.round(
    mockTeamMembers.reduce((sum, m) => sum + m.trainingProgress, 0) / mockTeamMembers.length
  );
  const topMembers = [...mockTeamMembers].sort((a, b) => b.trainingProgress - a.trainingProgress).slice(0, 4);
  const topInvitations = mockPendingInvitations.slice(0, 2);
  const teamCourses = getTeamCourseUsage();

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-ink-900">
          Welcome back, {mockUser.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-500 mt-1">Here&apos;s how {mockOrganization.name} is doing.</p>
      </div>

      {/* Bold stat tiles */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="rounded-2xl bg-indigo-600 text-white p-4 sm:p-5">
          <Users className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{mockOrganization.memberCount}</p>
          <p className="text-xs text-white/80 mt-1">Members</p>
        </div>
        <div className="rounded-2xl bg-warm-600 text-white p-4 sm:p-5">
          <Mail className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{mockPendingInvitations.length}</p>
          <p className="text-xs text-white/80 mt-1">Pending invites</p>
        </div>
        <div className="rounded-2xl bg-brand-600 text-white p-4 sm:p-5">
          <TrendingUp className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{avgProgress}%</p>
          <p className="text-xs text-white/80 mt-1">Avg. completion</p>
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
          {topMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-3.5">
              <Avatar name={member.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">{member.name}</p>
                <p className="text-xs text-ink-400">
                  {member.assignedCourseIds.length} course{member.assignedCourseIds.length === 1 ? '' : 's'}
                  {member.assignedCourseIds.length > 0 && <> &middot; {member.trainingProgress}% complete</>}
                </p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${roleBadgeClass[member.role]}`}>
                {member.role}
              </span>
            </div>
          ))}
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
// Individual learners: personal courses, certificates, and points.
// ============================================================
function IndividualOverview() {
  const user = mockUser;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-ink-900">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-500 mt-1">Pick up where you left off.</p>
      </div>

      {/* Bold stat tiles */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
        <div className="rounded-2xl bg-indigo-600 text-white p-4 sm:p-5">
          <BookOpen className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{user.enrolledCourses.length}</p>
          <p className="text-xs text-white/80 mt-1">Enrolled</p>
        </div>
        <div className="rounded-2xl bg-warm-600 text-white p-4 sm:p-5">
          <Award className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{user.certificates.length}</p>
          <p className="text-xs text-white/80 mt-1">Certificates</p>
        </div>
        <div className="rounded-2xl bg-brand-600 text-white p-4 sm:p-5">
          <Zap className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">
            {user.pointsEarned}<span className="text-sm font-semibold text-white/60">/{user.pointsTarget}</span>
          </p>
          <p className="text-xs text-white/80 mt-1">Points</p>
        </div>
      </div>

      {/* Continue learning: bold colored cards */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Continue learning</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {user.enrolledCourses.map((enrolled) => (
            <EnrolledCourseCard key={enrolled.courseId} enrolled={enrolled} course={getCourse(enrolled.courseId)} />
          ))}
        </div>
      </section>

      {/* Certificates: colored cards */}
      {user.certificates.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Certificates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {user.certificates.map((cert) => {
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
