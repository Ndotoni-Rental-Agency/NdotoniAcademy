import Link from 'next/link';
import { Mail } from 'lucide-react';
import { courses } from '@/lib/mock-data';
import { mockTeamMembers, mockPendingInvitations, roleBadgeClass, getTeamCourseUsage, getOrgRevenueEstimate } from '@/lib/organization-mock-data';
import { type AuthUser } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import DashboardStatCard from '@/components/DashboardStatCard';
import Sparkline from '@/components/Sparkline';
import ProgressRing from '@/components/ProgressRing';
import Avatar from '@/components/Avatar';

// ============================================================
// Organizations manage a team; they don't take courses themselves.
// This is a fully separate experience from the learner dashboard.
// ============================================================
export default function OrganizationOverview({ user }: { user: AuthUser }) {
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
