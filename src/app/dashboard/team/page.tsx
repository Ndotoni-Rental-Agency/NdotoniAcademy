'use client';

import { useState, useRef } from 'react';
import { Mail, X, RotateCw, UserPlus, BookOpen, Check, Upload, FileText } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
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
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const ROLE_KEYWORDS: Record<string, MembershipRole> = {
  admin: 'ADMIN',
  instructor: 'INSTRUCTOR',
  member: 'MEMBER',
};

interface ParsedInvite {
  email: string;
  role: MembershipRole | null;
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
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [invitations, setInvitations] = useState<PendingInvitation[]>(mockPendingInvitations);
  const [inviteMode, setInviteMode] = useState<'single' | 'bulk'>('single');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MembershipRole>('MEMBER');
  const [resentId, setResentId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkFileName, setBulkFileName] = useState<string | null>(null);
  const [bulkInvites, setBulkInvites] = useState<ParsedInvite[]>([]);
  const [bulkSkipped, setBulkSkipped] = useState(0);
  const [bulkDefaultRole, setBulkDefaultRole] = useState<MembershipRole>('MEMBER');
  const [bulkSentCount, setBulkSentCount] = useState<number | null>(null);

  const [assignCourseId, setAssignCourseId] = useState(assignableCourses[0]?.id ?? '');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [assignConfirmed, setAssignConfirmed] = useState(false);

  if (!user?.organizations[0]?.organization) return null;

  const existingEmails = new Set([
    ...members.map((m) => m.email.toLowerCase()),
    ...invitations.map((i) => i.email.toLowerCase()),
  ]);

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

  function handleBulkInvite() {
    if (bulkInvites.length === 0) return;
    const now = Date.now();
    setInvitations((prev) => [
      ...prev,
      ...bulkInvites.map((invite, i) => ({
        id: `inv-${now}-${i}`,
        email: invite.email,
        role: invite.role ?? bulkDefaultRole,
        invitedAt: new Date().toISOString().slice(0, 10),
        status: 'PENDING' as const,
      })),
    ]);
    setBulkSentCount(bulkInvites.length);
    setBulkInvites([]);
    setBulkFileName(null);
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
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Team</h1>
      <p className="text-sm text-ink-500 mb-8">
        Invite employees, manage roles, and assign training.
      </p>

      {/* Invite */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide">Invite members</h2>
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
              <div className="rounded-xl border-2 border-ink-100 p-4">
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
                        className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm text-ink-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                      >
                        <option value="MEMBER">Default: Member</option>
                        <option value="ADMIN">Default: Admin</option>
                        <option value="INSTRUCTOR">Default: Instructor</option>
                      </select>
                      <button
                        onClick={handleBulkInvite}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" /> Send {bulkInvites.length} invite{bulkInvites.length === 1 ? '' : 's'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
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
                {member.assignedCourseIds.length} course{member.assignedCourseIds.length === 1 ? '' : 's'}
                {member.assignedCourseIds.length > 0 && <> &middot; {member.trainingProgress}% complete</>}
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
