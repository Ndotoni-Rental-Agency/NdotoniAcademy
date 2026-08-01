import type { ReactNode } from 'react';

export default function DashboardStatCard({
  value,
  label,
  trend,
  sparkline,
}: {
  value: ReactNode;
  /** Shown when there's no trend — a stat has one or the other, not both. */
  label?: string;
  trend?: { text: string; direction: 'up' | 'down' };
  sparkline?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white px-3.5 py-3">
      <p className="text-xl font-extrabold text-ink-900 tabular-nums leading-none">{value}</p>
      {trend ? (
        <p className={`text-[10.5px] font-bold mt-1.5 ${trend.direction === 'up' ? 'text-brand-600' : 'text-coral-600'}`}>
          {trend.text}
        </p>
      ) : label ? (
        <p className="text-[11px] text-ink-400 mt-1.5">{label}</p>
      ) : null}
      {sparkline}
    </div>
  );
}
