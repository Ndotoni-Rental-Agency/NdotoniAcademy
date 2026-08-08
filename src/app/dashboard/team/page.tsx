'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, X, RotateCw, UserPlus, BookOpen, Check, Upload, FileText, Loader2 } from 'lucide-react';
import { useAuth, dashboardModeFor } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import { GraphQLClient } from '@/lib/graphql-client';
import { organization as organizationQuery, invitationsForOrganization } from '@/graphql/queries';
import { inviteMember, revokeInvitation, changeMemberRole } from '@/graphql/mutations';
import {
  MembershipRole,
  type OrganizationQuery,
  type OrganizationQueryVariables,
  type InvitationsForOrganizationQuery,
  type InvitationsForOrganizationQueryVariables,
  type InviteMemberMutation,
  type InviteMemberMutationVariables,
  type RevokeInvitationMutation,
  type RevokeInvitationMutationVariables,
  type ChangeMemberRoleMutation,
  type ChangeMemberRoleMutationVariables,
} from '@/API';
import { getAssignableCourses } from '@/lib/organization-mock-data';
import Avatar from '@/components/Avatar';

const assignableCourses = getAssignableCourses();
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const ROLE_KEYWORDS: Record<string, MembershipRole> = {
  admin: MembershipRole.ADMIN,
  instructor: MembershipRole.INSTRUCTOR,
  member: MembershipRole.MEMBER,
};
// Excludes OWNER deliberately, same as the invite form always has —
// changeMemberRole has no ownership-transfer safeguards, so promoting
// someone to owner isn't offered as a plain role change here.
const assignableRoles: MembershipRole[] = [MembershipRole.MEMBER, MembershipRole.ADMIN, MembershipRole.INSTRUCTOR];
const roleBadgeClass: Record<string, string> = {
  OWNER: 'bg-indigo-100 text-indigo-700',
  ADMIN: 'bg-sky-100 text-sky-700',
  MEMBER: 'bg-ink-100 text-ink-600',
  INSTRUCTOR: 'bg-coral-100 text-coral-700',
};

interface ParsedInvite {
  email: string;
  role: MembershipRole | null;
}

interface RosterMember {
  userId: string;
  name: string;
  email: string;
  role: MembershipRole;
  // Real — a plain MEMBER asked to be promoted to INSTRUCTOR here.
  wantsToBeInstructor: boolean;
  // Local-only — there's no real backend concept of course assignment yet,
  // so this never persists past a reload. Real people, illustrative training data.
  assignedCourseIds: string[];
  trainingProgress: number;
}

interface PendingInvite {
  id: string;
  email: string;
  role: MembershipRole;
  createdAt: string;
}

function detectRole(line: string): MembershipRole | null {
  const lower = line.toLowerCase();
  for (const [keyword, role] of Object.entries(ROLE_KEYWORDS)) {
    if (new RegExp(`\\b${keyword}\\b`).test(lower)) return role;
  }
  return null;
}

export default function TeamPage() {
  const { user } = useAuth();
  // Team management is an OWNER/ADMIN surface — an INSTRUCTOR or plain
  // MEMBER also belongs to an organization, but has no permission to
  // invite/remove people or change roles, so they don't get this page even
  // by navigating here directly.
  const isOrgManager = Boolean(user) && dashboardModeFor(user) === 'organization';
  const organizationId = user?.organizations[0]?.organizationId;
  const accent = accentByMode.organization;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [members, setMembers] = useState<RosterMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvite[]>([]);

  const [inviteMode, setInviteMode] = useState<'single' | 'bulk'>('single');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MembershipRole>(MembershipRole.MEMBER);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [resentId, setResentId] = useState<string | null>(null);
  const [revokingEmail, setRevokingEmail] = useState<string | null>(null);
  const [changingRoleUserId, setChangingRoleUserId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkFileName, setBulkFileName] = useState<string | null>(null);
  const [bulkInvites, setBulkInvites] = useState<ParsedInvite[]>([]);
  const [bulkSkipped, setBulkSkipped] = useState(0);
  const [bulkDefaultRole, setBulkDefaultRole] = useState<MembershipRole>(MembershipRole.MEMBER);
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkSentCount, setBulkSentCount] = useState<number | null>(null);

  const [assignCourseId, setAssignCourseId] = useState(assignableCourses[0]?.id ?? '');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [assignConfirmed, setAssignConfirmed] = useState(false);

  useEffect(() => {
    if (!organizationId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadError('');
      try {
        // Sequential, not Promise.all — two concurrent authenticated calls
        // right on mount intermittently raced Amplify's session/token
        // resolution (surfaced as "Cognito identity is missing an email
        // claim"). One at a time avoids it — see the same fix on the course
        // Exam/Assignments tabs and the dashboard Overview pages.
        const orgData = await GraphQLClient.execute<OrganizationQuery>(organizationQuery, {
          id: organizationId,
        } satisfies OrganizationQueryVariables);
        const invitesData = await GraphQLClient.execute<InvitationsForOrganizationQuery>(invitationsForOrganization, {
          organizationId,
        } satisfies InvitationsForOrganizationQueryVariables);
        if (cancelled) return;

        const roster: RosterMember[] = (orgData.organization?.members ?? [])
          .filter((m) => m.status === 'ACTIVE')
          .map((m) => ({
            userId: m.userId,
            name: [m.user?.firstName, m.user?.lastName].filter(Boolean).join(' ') || m.user?.email || 'Unknown',
            email: m.user?.email ?? '',
            role: m.role,
            wantsToBeInstructor: m.wantsToBeInstructor,
            assignedCourseIds: [],
            trainingProgress: 0,
          }));
        setMembers(roster);
        setInvitations(
          (invitesData.invitationsForOrganization ?? [])
            .filter((inv) => inv.status === 'PENDING')
            .map((inv) => ({ id: inv.id, email: inv.email, role: inv.role, createdAt: inv.createdAt }))
        );
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  if (!user || !isOrgManager) return null;

  const existingEmails = new Set([
    ...members.map((m) => m.email.toLowerCase()),
    ...invitations.map((i) => i.email.toLowerCase()),
  ]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim() || !organizationId) return;
    setInviting(true);
    setInviteError('');
    try {
      const data = await GraphQLClient.execute<InviteMemberMutation>(inviteMember, {
        email: inviteEmail.trim(),
        organizationId,
        role: inviteRole,
      } satisfies InviteMemberMutationVariables);
      const inv = data.inviteMember;
      if (inv) {
        setInvitations((prev) => [
          ...prev.filter((p) => p.email !== inv.email),
          { id: inv.id, email: inv.email, role: inv.role, createdAt: inv.createdAt },
        ]);
      }
      setInviteEmail('');
      setInviteRole(MembershipRole.MEMBER);
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : String(err));
    } finally {
      setInviting(false);
    }
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const lines = text.split(/\r?\n/);
      const seen = new Set<string>();
      const parsed: ParsedInvite[] = [];
      let skipped = 0;

      for (const line of lines) {
        const match = line.match(EMAIL_PATTERN);
        if (!match) continue;
        const email = match[0].toLowerCase();
        if (seen.has(email) || existingEmails.has(email)) {
          skipped++;
          continue;
        }
        seen.add(email);
        parsed.push({ email, role: detectRole(line) });
      }

      setBulkFileName(file.name);
      setBulkInvites(parsed);
      setBulkSkipped(skipped);
      setBulkSentCount(null);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function clearBulkFile() {
    setBulkFileName(null);
    setBulkInvites([]);
    setBulkSkipped(0);
    setBulkSentCount(null);
  }

  async function handleBulkInvite() {
    if (bulkInvites.length === 0 || !organizationId) return;
    setBulkSending(true);
    const sent: PendingInvite[] = [];
    for (const invite of bulkInvites) {
      try {
        const data = await GraphQLClient.execute<InviteMemberMutation>(inviteMember, {
          email: invite.email,
          organizationId,
          role: invite.role ?? bulkDefaultRole,
        } satisfies InviteMemberMutationVariables);
        if (data.inviteMember) {
          const inv = data.inviteMember;
          sent.push({ id: inv.id, email: inv.email, role: inv.role, createdAt: inv.createdAt });
        }
      } catch (err) {
        // One bad email in a batch shouldn't stop the rest.
        console.error('[team] bulk invite failed for', invite.email, err);
      }
    }
    setInvitations((prev) => [...prev.filter((p) => !sent.some((s) => s.email === p.email)), ...sent]);
    setBulkSentCount(sent.length);
    setBulkInvites([]);
    setBulkFileName(null);
    setBulkSending(false);
  }

  async function handleRevoke(email: string) {
    if (!organizationId) return;
    setRevokingEmail(email);
    try {
      await GraphQLClient.execute<RevokeInvitationMutation>(revokeInvitation, {
        email,
        organizationId,
      } satisfies RevokeInvitationMutationVariables);
      setInvitations((prev) => prev.filter((inv) => inv.email !== email));
    } catch (err) {
      console.error('[team] revokeInvitation failed ->', err);
    } finally {
      setRevokingEmail(null);
    }
  }

  async function handleResend(invite: PendingInvite) {
    if (!organizationId) return;
    setResentId(invite.id);
    try {
      // Backend replaces any existing pending invite for the same email,
      // invalidating the old token — a real resend, not just a UI reset.
      const data = await GraphQLClient.execute<InviteMemberMutation>(inviteMember, {
        email: invite.email,
        organizationId,
        role: invite.role,
      } satisfies InviteMemberMutationVariables);
      if (data.inviteMember) {
        const inv = data.inviteMember;
        setInvitations((prev) =>
          prev.map((p) => (p.email === inv.email ? { id: inv.id, email: inv.email, role: inv.role, createdAt: inv.createdAt } : p))
        );
      }
    } catch (err) {
      console.error('[team] resend failed ->', err);
    } finally {
      setTimeout(() => setResentId(null), 2000);
    }
  }

  async function handleChangeRole(member: RosterMember, role: MembershipRole) {
    if (!organizationId || role === member.role) return;
    setChangingRoleUserId(member.userId);
    try {
      await GraphQLClient.execute<ChangeMemberRoleMutation>(changeMemberRole, {
        organizationId,
        userId: member.userId,
        role,
      } satisfies ChangeMemberRoleMutationVariables);
      // Backend clears wantsToBeInstructor on any role change — any
      // promotion/demotion is a decision on a pending request either way.
      setMembers((prev) => prev.map((m) => (m.userId === member.userId ? { ...m, role, wantsToBeInstructor: false } : m)));
    } catch (err) {
      console.error('[team] changeMemberRole failed ->', err);
    } finally {
      setChangingRoleUserId(null);
    }
  }

  // No separate "dismiss" mutation on the backend — changeMemberRole with
  // the member's current (unchanged) role clears wantsToBeInstructor as a
  // side effect, so this reuses it directly rather than a same-role guard
  // in handleChangeRole (which the <select>'s onChange wouldn't even fire for).
  async function handleDismissInstructorRequest(member: RosterMember) {
    if (!organizationId) return;
    setChangingRoleUserId(member.userId);
    try {
      await GraphQLClient.execute<ChangeMemberRoleMutation>(changeMemberRole, {
        organizationId,
        userId: member.userId,
        role: member.role,
      } satisfies ChangeMemberRoleMutationVariables);
      setMembers((prev) => prev.map((m) => (m.userId === member.userId ? { ...m, wantsToBeInstructor: false } : m)));
    } catch (err) {
      console.error('[team] dismiss instructor request failed ->', err);
    } finally {
      setChangingRoleUserId(null);
    }
  }

  function toggleMemberSelection(id: string) {
    setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  }

  function handleAssign() {
    if (!assignCourseId || selectedMemberIds.length === 0) return;
    setMembers((prev) =>
      prev.map((m) =>
        selectedMemberIds.includes(m.userId) && !m.assignedCourseIds.includes(assignCourseId)
          ? { ...m, assignedCourseIds: [...m.assignedCourseIds, assignCourseId] }
          : m
      )
    );
    setSelectedMemberIds([]);
    setAssignConfirmed(true);
    setTimeout(() => setAssignConfirmed(false), 2500);
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="font-serif text-2xl font-semibold text-ink-900 mb-1">Team</h1>
      <p className="text-sm text-ink-500 mb-8">
        Invite employees, manage roles, and assign training.
      </p>

      {loadError && (
        <div className="mb-6 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-700">
          Couldn&apos;t load your team: {loadError}
        </div>
      )}

      {/* Invite */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Invite members</h2>
          <div className="flex gap-1 p-1 bg-ink-100 rounded-lg">
            <button
              onClick={() => setInviteMode('single')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                inviteMode === 'single' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setInviteMode('bulk')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                inviteMode === 'bulk' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
              }`}
            >
              Bulk (CSV)
            </button>
          </div>
        </div>

        {inviteMode === 'single' ? (
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={inviting}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
              />
            </div>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as MembershipRole)}
              disabled={inviting}
              className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            >
              <option value={MembershipRole.MEMBER}>Member</option>
              <option value={MembershipRole.ADMIN}>Admin</option>
              <option value={MembershipRole.INSTRUCTOR}>Instructor</option>
            </select>
            <button
              type="submit"
              disabled={inviting}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl ${accent.bg600} px-5 py-2.5 text-sm font-bold text-white ${accent.bg600Hover} transition-colors disabled:opacity-60`}
            >
              {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Invite</>}
            </button>
          </form>
        ) : (
          <div>
            {!bulkFileName ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileSelected}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 py-8 text-ink-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-sm font-bold">Upload a CSV file</span>
                  <span className="text-xs text-ink-400">One person per line. Add a role (MEMBER, ADMIN, INSTRUCTOR) anywhere on the line, or leave it out to default to Member.</span>
                </button>
                {bulkSentCount !== null && (
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-green-600 mt-3">
                    <Check className="w-4 h-4" /> Sent {bulkSentCount} invitation{bulkSentCount === 1 ? '' : 's'}
                  </p>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-ink-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-ink-400 flex-shrink-0" />
                    <p className="text-sm font-semibold text-ink-900 truncate">{bulkFileName}</p>
                  </div>
                  <button onClick={clearBulkFile} className="text-ink-400 hover:text-red-500 flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-ink-700 mb-1">
                  <strong>{bulkInvites.length}</strong> email{bulkInvites.length === 1 ? '' : 's'} ready to invite
                  {bulkSkipped > 0 && <span className="text-ink-400"> &middot; {bulkSkipped} skipped (already invited or duplicate)</span>}
                </p>

                {bulkInvites.length > 0 && (
                  <>
                    <p className="text-xs text-ink-400 mb-2">
                      Role read from each line where present (MEMBER, ADMIN, or INSTRUCTOR). Rows without one use the default below.
                    </p>
                    <div className="max-h-40 overflow-y-auto rounded-lg bg-ink-50 px-3 py-2 mb-3 space-y-1">
                      {bulkInvites.map((invite) => (
                        <div key={invite.email} className="flex items-center justify-between gap-2">
                          <p className="text-xs text-ink-600 truncate">{invite.email}</p>
                          <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0 ${roleBadgeClass[invite.role ?? bulkDefaultRole]}`}>
                            {invite.role ?? `${bulkDefaultRole} (default)`}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={bulkDefaultRole}
                        onChange={(e) => setBulkDefaultRole(e.target.value as MembershipRole)}
                        disabled={bulkSending}
                        className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                      >
                        <option value={MembershipRole.MEMBER}>Default: Member</option>
                        <option value={MembershipRole.ADMIN}>Default: Admin</option>
                        <option value={MembershipRole.INSTRUCTOR}>Default: Instructor</option>
                      </select>
                      <button
                        onClick={handleBulkInvite}
                        disabled={bulkSending}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl ${accent.bg600} px-5 py-2.5 text-sm font-bold text-white ${accent.bg600Hover} transition-colors disabled:opacity-60`}
                      >
                        {bulkSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Send {bulkInvites.length} invite{bulkInvites.length === 1 ? '' : 's'}</>}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {inviteError && <p className="text-sm text-coral-600 mt-2">{inviteError}</p>}
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className={`w-6 h-6 ${accent.text600} animate-spin`} />
        </div>
      ) : (
        <>
          {/* Pending invitations */}
          {invitations.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Pending invitations</h2>
              <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
                {invitations.map((inv) => (
                  <div key={inv.id} className="flex items-center gap-3 py-2.5 px-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{inv.email}</p>
                      <p className="text-xs text-ink-400">Invited {new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${roleBadgeClass[inv.role]}`}>
                      {inv.role}
                    </span>
                    <button
                      onClick={() => handleResend(inv)}
                      disabled={resentId === inv.id}
                      className={`flex items-center gap-1 text-xs font-bold ${accent.text600} hover:opacity-80 px-2 py-1 disabled:opacity-60`}
                    >
                      <RotateCw className="w-3.5 h-3.5" /> {resentId === inv.id ? 'Sent!' : 'Resend'}
                    </button>
                    <button
                      onClick={() => handleRevoke(inv.email)}
                      disabled={revokingEmail === inv.email}
                      className="flex items-center gap-1 text-xs font-bold text-ink-400 hover:text-red-600 px-2 py-1 disabled:opacity-60"
                    >
                      <X className="w-3.5 h-3.5" /> Revoke
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Members */}
          <section className="mb-10">
            <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Members</h2>
            <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
              {members.map((member) => {
                const isSelf = member.userId === user.id;
                return (
                  <div key={member.userId} className="flex items-center gap-3 py-2.5 px-3.5">
                    <input
                      type="checkbox"
                      checked={selectedMemberIds.includes(member.userId)}
                      onChange={() => toggleMemberSelection(member.userId)}
                      className="w-4 h-4 rounded border-ink-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Avatar name={member.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">
                        {member.name}{isSelf && <span className="text-ink-400 font-normal"> (you)</span>}
                      </p>
                      <p className="text-xs text-ink-400 truncate">{member.email}</p>
                    </div>
                    <span className="hidden sm:block text-xs text-ink-400">
                      {member.assignedCourseIds.length} course{member.assignedCourseIds.length === 1 ? '' : 's'}
                      {member.assignedCourseIds.length > 0 && <> &middot; {member.trainingProgress}% complete</>}
                    </span>
                    {member.wantsToBeInstructor && (
                      <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-coral-700 bg-coral-50 px-2.5 py-1 rounded-full flex-shrink-0">
                        Wants to teach
                        <button
                          onClick={() => handleDismissInstructorRequest(member)}
                          disabled={changingRoleUserId === member.userId}
                          title="Dismiss request"
                          className="text-coral-400 hover:text-coral-600 disabled:opacity-60"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {member.role === 'OWNER' || isSelf ? (
                      <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${roleBadgeClass[member.role]}`}>
                        {member.role}
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member, e.target.value as MembershipRole)}
                        disabled={changingRoleUserId === member.userId}
                        className={`text-[11px] font-bold uppercase tracking-wide pl-2.5 pr-1 py-1 rounded-full border-0 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60 ${roleBadgeClass[member.role]}`}
                      >
                        {assignableRoles.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
              {members.length === 0 && (
                <p className="text-sm text-ink-400 py-6 text-center">No other members yet — invite someone above.</p>
              )}
            </div>
          </section>

          {/* Assign training — illustrative only; there's no real course-assignment
              backend yet, so this never persists past a reload. */}
          <section>
            <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Assign training</h2>
            <p className="text-sm text-ink-500 mb-4">Select members above, choose a course, and assign it to their learning path.</p>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 w-full sm:w-auto">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <select
                  value={assignCourseId}
                  onChange={(e) => setAssignCourseId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 text-sm text-ink-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                >
                  {assignableCourses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAssign}
                disabled={selectedMemberIds.length === 0}
                className={`rounded-xl ${accent.bg600} px-5 py-2.5 text-sm font-bold text-white ${accent.bg600Hover} transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap`}
              >
                Assign to {selectedMemberIds.length || ''} selected
              </button>
            </div>
            {assignConfirmed && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-green-600 mt-3">
                <Check className="w-4 h-4" /> Training assigned
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
