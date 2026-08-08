import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function FeaturedBanner({
  eyebrow,
  eyebrowSecondary,
  title,
  description,
  meta,
  action,
}: {
  eyebrow: string;
  eyebrowSecondary?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl bg-indigo-600 overflow-hidden"
    >
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rotate-45" />
      <div className="relative p-7 sm:p-9 text-white">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-md">
            {eyebrow}
          </span>
          {eyebrowSecondary && (
            <span className="text-[11px] font-bold uppercase tracking-wide bg-white/10 px-3 py-1 rounded-md">
              {eyebrowSecondary}
            </span>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 leading-tight tracking-tight">{title}</h2>
        {description && <p className="text-white/85 mb-5 max-w-lg">{description}</p>}
        {meta && <div className="flex flex-wrap gap-5 text-sm text-white/85 mb-6">{meta}</div>}
        {action}
      </div>
    </motion.div>
  );
}
