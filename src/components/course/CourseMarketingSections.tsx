import Link from 'next/link';
import { Play, Zap, TrendingUp, Shield, Star, Video, FileText, HelpCircle } from 'lucide-react';
import { getCategoryTheme } from '@/lib/category-theme';
import type { ResumeTarget } from './types';

/**
 * Discovery/sales content — only shown to a visitor who hasn't started the
 * course yet (anonymous, or signed in with zero progress). Someone actively
 * learning doesn't need to be sold on it again; they see the tabbed course
 * hub (Modules/Discussion/Assignments/Exam) instead. See the page for the
 * gating condition.
 */
export default function CourseMarketingSections({
  courseId, theme, resumeTarget,
}: {
  courseId: string;
  theme: ReturnType<typeof getCategoryTheme>;
  resumeTarget: ResumeTarget | null;
}) {
  return (
    <>
      {/* Why this course */}
      <section className="border-t border-ink-100 bg-ink-50 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-8 text-center">Why take this course</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, title: 'Learn fast', desc: 'Bite-sized modules you finish in one sitting' },
              { icon: TrendingUp, title: 'Track progress', desc: 'See exactly how far you have come' },
              { icon: Shield, title: 'Verified content', desc: 'Built and published by a real instructor' },
              { icon: Star, title: 'Expert-led', desc: 'Created by working professionals' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className={`w-12 h-12 rounded-2xl ${theme.softBg} ${theme.solidText} flex items-center justify-center mx-auto mb-3`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-ink-900 text-sm mb-0.5">{item.title}</h3>
                <p className="text-xs text-ink-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-ink-100 py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-8">How each lesson works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Video, title: 'Watch or read', desc: 'Video, text, flashcards, or audio, whatever fits the topic.' },
              { icon: FileText, title: 'Go at your pace', desc: 'No deadlines. Come back to a lesson anytime.' },
              { icon: HelpCircle, title: 'Check yourself', desc: 'Quizzes at the end of a lesson confirm what stuck.' },
            ].map((item) => (
              <div key={item.title} className="relative">
                <div className={`w-11 h-11 rounded-xl ${theme.solidBg} text-white flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-ink-900 mb-1">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`bg-gradient-to-br ${theme.heroFrom} to-ink-900 py-12 sm:py-14 relative overflow-hidden`}>
        <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-2">{resumeTarget ? 'Keep going' : 'Ready to start?'}</h2>
          <p className="text-white/80 mb-6">
            {resumeTarget ? `Next up: ${resumeTarget.title}` : 'Jump into the course content above.'}
          </p>
          {resumeTarget ? (
            <Link
              href={`/courses/${courseId}/modules/${resumeTarget.moduleId}/lessons/${resumeTarget.lessonId}`}
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold ${theme.solidText} hover:bg-white/90 transition-colors shadow-lg`}
            >
              <Play className="w-4 h-4" /> Resume course
            </Link>
          ) : (
            <a
              href="#course-content"
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold ${theme.solidText} hover:bg-white/90 transition-colors shadow-lg`}
            >
              <Play className="w-4 h-4" /> View course content
            </a>
          )}
        </div>
      </section>
    </>
  );
}
