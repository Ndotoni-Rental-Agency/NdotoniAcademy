'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Play, BookOpen } from 'lucide-react';
import { Module } from '@/lib/mock-data';

interface LearningPathProps {
  modules: Module[];
  courseId: string;
  currentModuleId?: string;
  completedModules?: string[];
}

export default function LearningPath({ modules, courseId, currentModuleId, completedModules = [] }: LearningPathProps) {
  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-[23px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-white/5" />

      <div className="space-y-3">
        {modules.map((mod, i) => {
          const isCompleted = completedModules.includes(mod.id);
          const isCurrent = mod.id === currentModuleId;
          const isLocked = !mod.isFree && !isCompleted && !isCurrent;

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {mod.isFree || !isLocked ? (
                <Link
                  href={`/courses/${courseId}/modules/${mod.id}`}
                  className={`relative flex items-start gap-4 p-4 rounded-xl transition-all duration-200 group ${
                    isCurrent
                      ? 'glass-card !border-brand-500/30 bg-brand-500/5'
                      : 'hover:bg-white/3'
                  }`}
                >
                  {/* Step indicator */}
                  <div className="relative z-10 flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-[46px] h-[46px] rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                        <CheckCircle2 className="w-5 h-5 text-brand-400" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-[46px] h-[46px] rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-500/40 animate-pulse-glow">
                        <Play className="w-5 h-5 text-brand-400 ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-[46px] h-[46px] rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/8 group-hover:border-white/15 transition-all">
                        <BookOpen className="w-5 h-5 text-ink-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                        Module {mod.order}
                      </span>
                      {mod.isFree && !isCompleted && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-400 bg-brand-400/10 px-1.5 py-0.5 rounded">
                          Free
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-400 bg-brand-400/10 px-1.5 py-0.5 rounded">
                          Complete
                        </span>
                      )}
                    </div>
                    <h4 className={`text-sm font-semibold mb-1 transition-colors ${
                      isCurrent ? 'text-white' : 'text-ink-200 group-hover:text-white'
                    }`}>
                      {mod.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-ink-400">
                      <span>{mod.duration}</span>
                      <span>&middot;</span>
                      <span>{mod.quiz.length} questions</span>
                      {mod.videoUrl && (
                        <>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1">
                            <Play className="w-3 h-3" /> Video
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow / action */}
                  {isCurrent && (
                    <div className="flex-shrink-0 self-center">
                      <span className="text-xs font-semibold text-brand-400">Continue</span>
                    </div>
                  )}
                </Link>
              ) : (
                <div className="relative flex items-start gap-4 p-4 rounded-xl opacity-50">
                  {/* Locked indicator */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-[46px] h-[46px] rounded-xl bg-white/3 flex items-center justify-center border border-white/5">
                      <Lock className="w-4 h-4 text-ink-500" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
                        Module {mod.order}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-ink-500 bg-white/5 px-1.5 py-0.5 rounded">
                        Enrolled only
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-ink-400 mb-1">{mod.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-ink-500">
                      <span>{mod.duration}</span>
                      <span>&middot;</span>
                      <span>{mod.quiz.length} questions</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
