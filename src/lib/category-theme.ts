import { Briefcase, Megaphone, BarChart3, Palette, type LucideIcon } from 'lucide-react';

export interface CategoryTheme {
  icon: LucideIcon;
  solidBg: string;
  solidBgHover: string;
  solidText: string;
  softBg: string;
  softBgHover: string;
  softText: string;
  border: string;
  borderHover: string;
  ring: string;
  stroke: string;
  /** Gradient start for dark hero treatments — pairs with a shared `to-ink-900`
   * so every category still reads as "the same brand, a different subject,"
   * rather than four unrelated color schemes. */
  heroFrom: string;
}

const projectManagement: CategoryTheme = {
  icon: Briefcase,
  solidBg: 'bg-indigo-600',
  solidBgHover: 'hover:bg-indigo-700',
  solidText: 'text-indigo-600',
  softBg: 'bg-indigo-50',
  softBgHover: 'hover:bg-indigo-50',
  softText: 'text-indigo-700',
  border: 'border-indigo-200',
  borderHover: 'hover:border-indigo-300',
  ring: 'ring-indigo-500/20',
  stroke: 'stroke-indigo-600',
  heroFrom: 'from-indigo-600',
};

const marketing: CategoryTheme = {
  icon: Megaphone,
  solidBg: 'bg-coral-600',
  solidBgHover: 'hover:bg-coral-700',
  solidText: 'text-coral-600',
  softBg: 'bg-coral-50',
  softBgHover: 'hover:bg-coral-50',
  softText: 'text-coral-700',
  border: 'border-coral-200',
  borderHover: 'hover:border-coral-300',
  ring: 'ring-coral-500/20',
  stroke: 'stroke-coral-600',
  heroFrom: 'from-coral-600',
};

const technology: CategoryTheme = {
  icon: BarChart3,
  solidBg: 'bg-sky-600',
  solidBgHover: 'hover:bg-sky-700',
  solidText: 'text-sky-600',
  softBg: 'bg-sky-50',
  softBgHover: 'hover:bg-sky-50',
  softText: 'text-sky-700',
  border: 'border-sky-200',
  borderHover: 'hover:border-sky-300',
  ring: 'ring-sky-500/20',
  stroke: 'stroke-sky-600',
  heroFrom: 'from-sky-600',
};

const design: CategoryTheme = {
  icon: Palette,
  solidBg: 'bg-warm-600',
  solidBgHover: 'hover:bg-warm-700',
  solidText: 'text-warm-600',
  softBg: 'bg-warm-50',
  softBgHover: 'hover:bg-warm-50',
  softText: 'text-warm-700',
  border: 'border-warm-200',
  borderHover: 'hover:border-warm-300',
  ring: 'ring-warm-500/20',
  stroke: 'stroke-warm-600',
  heroFrom: 'from-warm-600',
};

export const categoryThemes: Record<string, CategoryTheme> = {
  'Project Management': projectManagement,
  Marketing: marketing,
  Technology: technology,
  Design: design,
};

export function getCategoryTheme(category: string): CategoryTheme {
  return categoryThemes[category] ?? projectManagement;
}
