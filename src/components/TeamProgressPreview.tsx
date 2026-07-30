import { TrendingUp } from 'lucide-react';
import { mockOrganization, mockTeamMembers } from '@/lib/organization-mock-data';
import Avatar from './Avatar';

export default function TeamProgressPreview() {
  const members = mockTeamMembers;
  const avgProgress = Math.round(members.reduce((sum, m) => sum + m.trainingProgress, 0) / members.length);

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

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-ink-900">{mockOrganization.name}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" /> {avgProgress}% team-wide
          </span>
        </div>

        <div className="space-y-3.5">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <Avatar name={m.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-ink-800 truncate">{m.name}</p>
                  <span className="text-xs font-bold text-ink-500 flex-shrink-0 ml-2">{m.trainingProgress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.trainingProgress > 0 ? 'bg-indigo-500' : 'bg-ink-200'}`}
                    style={{ width: `${Math.max(m.trainingProgress, 3)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
