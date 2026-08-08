import type { Metadata } from 'next';
import { ArrowRight, Video, Layers, FileText, HelpCircle, DollarSign } from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import Reveal from '@/components/Reveal';
import InstructorPreview from '@/components/InstructorPreview';
import PayoutPreview from '@/components/PayoutPreview';
import LessonBuilderPreview from '@/components/LessonBuilderPreview';
import { courses } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'For Instructors',
  description: 'Teach what you know and get paid for it. Mix video, flashcards, written guides, and quizzes, then earn every time a learner enrolls.',
};

const featuredCourse = courses.find((c) => c.id === 'project-management')!;

export default function InstructorsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={16} mode="mount">
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">For instructors</p>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-ink-900 leading-[1.05] tracking-tight mb-4">
                Teach what you know. Get paid for it.
              </h1>
              <p className="text-base sm:text-lg text-ink-500 leading-relaxed mb-6 max-w-md">
                Build lessons your way, mix video, flashcards, and quizzes, then earn every time a learner enrolls.
              </p>
              <AuthButton
                mode="signup"
                next="/dashboard/courses"
                asInstructor
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 mb-8"
              >
                Start teaching <ArrowRight className="w-4 h-4" />
              </AuthButton>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Video, label: 'Video' },
                  { icon: Layers, label: 'Flashcards' },
                  { icon: HelpCircle, label: 'Quizzes' },
                  { icon: DollarSign, label: 'Get paid' },
                ].map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5">
                    <item.icon className="w-3.5 h-3.5" /> {item.label}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal y={16} delay={0.1} mode="mount">
              <InstructorPreview course={featuredCourse} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* How you get paid */}
      <section className="border-t border-ink-100 bg-brand-50/40 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={12}>
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Straightforward, automatic</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900 mb-4 leading-tight">
                How you get paid
              </h2>
              <p className="text-ink-500 leading-relaxed max-w-md">
                Set your price. Keep the majority of every enrollment. Paid out automatically every month, no invoices to chase.
              </p>
            </Reveal>
            <Reveal y={12} delay={0.1}>
              <PayoutPreview />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Lesson formats and tools */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={12} delay={0.1} className="order-first lg:order-last">
              <LessonBuilderPreview />
            </Reveal>
            <Reveal y={12}>
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Mix and match</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900 mb-4 leading-tight">
                Every lesson format, one toolkit
              </h2>
              <p className="text-ink-500 leading-relaxed max-w-md mb-5">
                Video, flashcards, a written guide, or a quiz. Mix whatever teaches it best, and leave feedback right where a learner needs it.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Video, label: 'Video' },
                  { icon: Layers, label: 'Flashcards' },
                  { icon: FileText, label: 'Written guides' },
                  { icon: HelpCircle, label: 'Quizzes' },
                ].map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5">
                    <item.icon className="w-3.5 h-3.5" /> {item.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-100 py-14 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-ink-900 mb-5">Ready to teach on Ndotoni Academy?</h2>
          <AuthButton
            mode="signup"
            next="/dashboard/courses"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Start teaching <ArrowRight className="w-4 h-4" />
          </AuthButton>
        </div>
      </section>
    </main>
  );
}
