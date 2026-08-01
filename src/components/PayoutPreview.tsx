import { Users, Percent, Wallet, CalendarCheck } from 'lucide-react';
import { HYPOTHETICAL_PRICE_TZS, INSTRUCTOR_SHARE } from '@/lib/instructor-pricing';

const NEW_ENROLLMENTS_THIS_MONTH = 42;

export default function PayoutPreview() {
  const gross = NEW_ENROLLMENTS_THIS_MONTH * HYPOTHETICAL_PRICE_TZS;
  const platformFeeRate = 1 - INSTRUCTOR_SHARE;
  const platformFee = Math.round(gross * platformFeeRate);
  const net = gross - platformFee;

  return (
    <div className="rounded-2xl border-2 border-ink-100 shadow-xl shadow-ink-900/5 overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-ink-50 border-b border-ink-100">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-warm-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
        </div>
        <span className="ml-2 text-xs text-ink-400 font-mono">academy.ndotoni.com/instructor/earnings</span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-1">This month</p>
        <div className="flex items-baseline gap-2 mb-5">
          <p className="text-3xl font-extrabold text-brand-700">TZS {net.toLocaleString()}</p>
          <span className="text-xs font-bold text-brand-600">↑ 18% vs. last month</span>
        </div>

        <div className="space-y-3 border-t border-ink-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-600">
              <Users className="w-3.5 h-3.5 text-ink-400" /> {NEW_ENROLLMENTS_THIS_MONTH} new enrollments
            </span>
            <span className="font-semibold text-ink-900">TZS {gross.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-600">
              <Percent className="w-3.5 h-3.5 text-ink-400" /> Platform fee ({Math.round(platformFeeRate * 100)}%)
            </span>
            <span className="font-semibold text-ink-400">&minus;TZS {platformFee.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-ink-100 pt-3">
            <span className="flex items-center gap-2 font-bold text-ink-900">
              <Wallet className="w-3.5 h-3.5 text-brand-600" /> Net payout
            </span>
            <span className="font-extrabold text-brand-700">TZS {net.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-brand-50 px-3.5 py-3 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-brand-700 flex-shrink-0" />
          <span className="text-xs text-brand-800">Next payout lands automatically on the 1st of next month.</span>
        </div>
      </div>
    </div>
  );
}
