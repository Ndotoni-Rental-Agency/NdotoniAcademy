import type { DashboardMode } from './auth-context';

/**
 * One accent hue per dashboard mode — indigo for learner, coral for
 * instructor, emerald (brand) for organization. Threaded through the
 * sidebar's active nav item, hero gradients/CTAs, and stat highlights, so
 * the whole shell reads as "which hat am I wearing" without a full
 * re-theme.
 */
export interface DashboardAccent {
  bg50: string;
  bg100: string;
  text700: string;
  bg600: string;
  bg600Hover: string;
  text600: string;
  /** Tailwind stroke-* utility, for Sparkline. */
  stroke600: string;
  gradientFrom: string;
}

export const accentByMode: Record<DashboardMode, DashboardAccent> = {
  learner: {
    bg50: 'bg-indigo-50',
    bg100: 'bg-indigo-100',
    text700: 'text-indigo-700',
    bg600: 'bg-indigo-600',
    bg600Hover: 'hover:bg-indigo-700',
    text600: 'text-indigo-600',
    stroke600: 'stroke-indigo-600',
    gradientFrom: 'from-indigo-50',
  },
  instructor: {
    bg50: 'bg-coral-50',
    bg100: 'bg-coral-100',
    text700: 'text-coral-700',
    bg600: 'bg-coral-600',
    bg600Hover: 'hover:bg-coral-700',
    text600: 'text-coral-600',
    stroke600: 'stroke-coral-600',
    gradientFrom: 'from-coral-50',
  },
  organization: {
    bg50: 'bg-brand-50',
    bg100: 'bg-brand-100',
    text700: 'text-brand-700',
    bg600: 'bg-brand-600',
    bg600Hover: 'hover:bg-brand-700',
    text600: 'text-brand-600',
    stroke600: 'stroke-brand-600',
    gradientFrom: 'from-brand-50',
  },
};
