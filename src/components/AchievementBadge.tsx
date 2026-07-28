'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Star, Zap, Target, BookOpen, Award, Rocket } from 'lucide-react';
import { Achievement } from '@/lib/mock-data';

const iconMap = {
  flame: Flame,
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  book: BookOpen,
  award: Award,
  rocket: Rocket,
};

const rarityColors = {
  common: {
    bg: 'bg-ink-400/10',
    border: 'border-ink-400/20',
    text: 'text-ink-300',
    icon: 'text-ink-400',
    glow: '',
    label: 'Common',
  },
  rare: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-300',
    icon: 'text-blue-400',
    glow: 'shadow-blue-500/10',
    label: 'Rare',
  },
  epic: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-300',
    icon: 'text-purple-400',
    glow: 'shadow-purple-500/10',
    label: 'Epic',
  },
  legendary: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-300',
    icon: 'text-yellow-400',
    glow: 'shadow-yellow-500/20',
    label: 'Legendary',
  },
};

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  delay?: number;
}

export default function AchievementBadge({ achievement, size = 'md', showProgress = true, delay = 0 }: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon];
  const rarity = rarityColors[achievement.rarity];

  const sizeClasses = {
    sm: { container: 'p-3', icon: 'w-8 h-8', iconSize: 'w-4 h-4', text: 'text-xs', desc: 'text-[10px]' },
    md: { container: 'p-4', icon: 'w-12 h-12', iconSize: 'w-5 h-5', text: 'text-sm', desc: 'text-xs' },
    lg: { container: 'p-5', icon: 'w-16 h-16', iconSize: 'w-7 h-7', text: 'text-base', desc: 'text-sm' },
  };

  const s = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className={`glass-card ${s.container} ${achievement.earned ? '' : 'opacity-60'} ${achievement.earned ? `shadow-lg ${rarity.glow}` : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${s.icon} rounded-xl ${rarity.bg} border ${rarity.border} flex items-center justify-center flex-shrink-0 ${
          achievement.earned ? 'animate-streak-pulse' : ''
        }`}>
          <Icon className={`${s.iconSize} ${achievement.earned ? rarity.icon : 'text-ink-500'}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className={`font-semibold ${achievement.earned ? 'text-white' : 'text-ink-400'} ${s.text} truncate`}>
              {achievement.title}
            </h4>
            {achievement.earned && (
              <span className={`text-[9px] font-bold uppercase tracking-wider ${rarity.text} ${rarity.bg} px-1.5 py-0.5 rounded border ${rarity.border}`}>
                {rarity.label}
              </span>
            )}
          </div>
          <p className={`${s.desc} text-ink-400 mb-1.5`}>{achievement.description}</p>

          {/* Progress bar for unearned */}
          {!achievement.earned && showProgress && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${rarity.bg.replace('/10', '/40')}`}
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-ink-500 font-medium">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
          )}

          {/* Earned date */}
          {achievement.earned && achievement.earnedAt && (
            <p className="text-[10px] text-ink-500">
              Earned {new Date(achievement.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
