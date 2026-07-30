import { Mail, UserPlus } from 'lucide-react';
import { mockOrganization, mockTeamMembers, mockPendingInvitations, roleBadgeClass } from '@/lib/organization-mock-data';
import Avatar from './Avatar';

export default function OrgPreviewPanel() {
  const members = mockTeamMembers.slice(0, 4);
  const invite = mockPendingInvitations[0];

  return (
    <div className="rounded-2xl border-2 border-ink-100 shadow-xl shadow-ink-900/5 overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-50 border-b border-ink-100">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-warm-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
        </div>
        <span className="ml-2 text-xs text-ink-400 font-mono">app.ndotoni.com/dashboard/team</span>
      </div>

      {/* Panel body */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-bold text-ink-400 uppercase tracking-wide">{mockOrganization.type}</p>
            <h3 className="font-extrabold text-ink-900">{mockOrganization.name}</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold px-3 py-1.5">
            <UserPlus className="w-3.5 h-3.5" /> Invite
          </span>
        </div>

        <div className="space-y-2 mb-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-1.5">
              <Avatar name={m.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">{m.name}</p>
                <p className="text-xs text-ink-400 truncate">{m.assignedCourseIds.length} course{m.assignedCourseIds.length === 1 ? '' : 's'} assigned</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${roleBadgeClass[m.role]}`}>
                {m.role}
              </span>
            </div>
          ))}
        </div>

        {/* Pending invitation row */}
        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-indigo-50 border border-indigo-100">
          <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <p className="text-xs text-indigo-700 flex-1 min-w-0 truncate">
            <span className="font-semibold">{invite.email}</span> · invited, awaiting response
          </p>
        </div>
      </div>
    </div>
  );
}
