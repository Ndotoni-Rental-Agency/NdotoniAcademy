'use client';

import { useState } from 'react';
import { Building2, Mail, X, RotateCw, UserPlus, BookOpen, Check } from 'lucide-react';
import { mockUser } from '@/lib/mock-data';
import {
  mockOrganization,
  mockTeamMembers,
  mockPendingInvitations,
  getAssignableCourses,
  roleBadgeClass,
  type TeamMember,
  type PendingInvitation,
  type MembershipRole,
} from '@/lib/organization-mock-data';
import Avatar from '@/components/Avatar';

const assignableCourses = getAssignableCourses();

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [invitations, setInvitations] = useState<PendingInvitation[]>(mockPendingInvitations);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MembershipRole>('MEMBER');
  const [resentId, setResentId] = useState<string | null>(null);

  const [assignCourseId, setAssignCourseId] = useState(assignableCourses[0]?.id ?? '');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [assignConfirmed, setAssignConfirmed] = useState(false);

  if (!mockUser.organization) return null;

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInvitations((prev) => [
      ...prev,
      {
        id: `inv-${Date.now()}`,
        email: inviteEmail.trim(),
        role: inviteRole,
        invitedAt: new Date().toISOString().slice(0, 10),
        status: 'PENDING',
      },
    ]);
    setInviteEmail('');
    setInviteRole('MEMBER');
  }

  function revokeInvitation(id: string) {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  }

  function resendInvitation(id: string) {
    setResentId(id);
    setTimeout(() => setResentId(null), 2000);
  }

  function toggleMemberSelection(id: string) {
    setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  }

  function handleAssign() {
    if (!assignCourseId || selectedMemberIds.length === 0) return;
    setMembers((prev) =>
      prev.map((m) =>
        selectedMemberIds.includes(m.id) && !m.assignedCourseIds.includes(assignCourseId)
          ? { ...m, assignedCourseIds: [...m.assignedCourseIds, assignCourseId] }
          : m
      )
    );
    setSelectedMemberIds([]);
    setAssignConfirmed(true);
    setTimeout(() => setAssignConfirmed(false), 2500);
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-ink-900">{mockOrganization.name}</h1>
      </div>
      <p className="text-sm text-ink-500 mb-8">
        Manage your team, invite employees, and assign training. {mockOrganization.memberCount} members.
      </p>

      {/* Invite form */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Invite a member</h2>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="email"
              required
              placeholder="colleague@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
            />
          </div>
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as MembershipRole)}
            className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Invite
          </button>
        </form>
      </section>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Pending invitations</h2>
          <div className="divide-y divide-ink-100">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{inv.email}</p>
                  <p className="text-xs text-ink-400">Invited {new Date(inv.invitedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${roleBadgeClass[inv.role]}`}>
                  {inv.role}
                </span>
                <button
                  onClick={() => resendInvitation(inv.id)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 px-2 py-1"
                >
                  <RotateCw className="w-3.5 h-3.5" /> {resentId === inv.id ? 'Sent!' : 'Resend'}
                </button>
                <button
                  onClick={() => revokeInvitation(inv.id)}
                  className="flex items-center gap-1 text-xs font-bold text-ink-400 hover:text-red-600 px-2 py-1"
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
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Members</h2>
        <div className="divide-y divide-ink-100">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-3">
              <input
                type="checkbox"
                checked={selectedMemberIds.includes(member.id)}
                onChange={() => toggleMemberSelection(member.id)}
                className="w-4 h-4 rounded border-ink-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Avatar name={member.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">{member.name}</p>
                <p className="text-xs text-ink-400 truncate">{member.email}</p>
              </div>
              <span className="hidden sm:block text-xs text-ink-400">
                {member.assignedCourseIds.length} course{member.assignedCourseIds.length === 1 ? '' : 's'} assigned
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${roleBadgeClass[member.role]}`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Assign training */}
      <section>
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Assign training</h2>
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
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
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
    </div>
  );
}
