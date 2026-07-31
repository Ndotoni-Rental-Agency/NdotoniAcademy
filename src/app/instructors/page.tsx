import type { Metadata } from 'next';
import {
  ArrowRight, Video, Layers, FileText, HelpCircle, MessageSquare,
  DollarSign, PiggyBank, CalendarClock,
} from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import Reveal from '@/components/Reveal';
import InstructorPreview from '@/components/InstructorPreview';
import { courses } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'For Instructors',
  description: 'Teach what you know and get paid for it. Mix video, flashcards, written guides, and quizzes, then earn every time a learner enrolls.',
};

const featuredCourse = courses.find((c) => c.id === 'project-management')!;

const payoutStats = [
  {
    icon: DollarSign,
    title: 'Set your own price',
    desc: 'Module 1 is always free to try. You set the price for the full course.',
  },
  {
    icon: PiggyBank,
    title: 'Keep the majority',
    desc: 'You keep the largest share of every enrollment. No hidden platform fees.',
  },
  {
    icon: CalendarClock,
    title: 'Paid out monthly',
    desc: 'Earnings are tallied automatically and paid out to you every month.',
  },
];

const lessonFormats = [
  {
    icon: Video,
    title: 'Video lessons',
    tip: 'Ten minutes beats sixty. Record one focused idea per video.',
  },
  {
    icon: Layers,
    title: 'Flashcards',
    tip: 'Best for vocabulary, definitions, and quick recall drills between lessons.',
  },
  {
    icon: FileText,
    title: 'Written guides',
    tip: 'Walk through a real example. Theory alone rarely sticks.',
  },
  {
    icon: HelpCircle,
    title: 'Quizzes',
    tip: 'Test what learners just watched or read, while it is still fresh.',
  },
  {
    icon: MessageSquare,
    title: 'Feedback',
    tip: 'Leave a note on a learner’s quiz attempt when they need a nudge.',
  },
];

export default function InstructorsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={16} mode="mount">
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">For instructors</p>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-ink-900 leading-[1.05] tracking-tight mb-4">
                Teach what you know. Get paid for it.
              </h1>
              <p className="text-lg text-ink-500 leading-relaxed mb-6 max-w-md">
                Build lessons your way, mix video, flashcards, and quizzes, then earn every time a learner enrolls.
              </p>
              <AuthButton
                mode="signup"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 mb-8"
              >
                Start teaching <ArrowRight className="w-4 h-4" />
              </AuthButton>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Video, label: 'Video lessons' },
                  { icon: Layers, label: 'Flashcards' },
                  { icon: HelpCircle, label: 'Auto-graded quizzes' },
                  { icon: DollarSign, label: 'Get paid monthly' },
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
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900">How you get paid</h2>
            <p className="text-ink-500 mt-2">Straightforward, and entirely automatic.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {payoutStats.map((item, i) => (
              <Reveal key={item.title} y={12} delay={i * 0.08} className="bg-white rounded-2xl border-2 border-ink-100 p-6 text-center">
                <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-ink-900 mb-1">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lesson formats and tools */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900">Every lesson format, one toolkit</h2>
            <p className="text-ink-500 mt-2">Mix and match to fit what you are teaching.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lessonFormats.map((item, i) => (
              <Reveal key={item.title} y={12} delay={i * 0.06} className="rounded-2xl border-2 border-ink-100 p-5 hover:border-brand-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-ink-900 mb-1">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.tip}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-100 py-14 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-5">Ready to teach on Ndotoni Academy?</h2>
          <AuthButton
            mode="signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Start teaching <ArrowRight className="w-4 h-4" />
          </AuthButton>
        </div>
      </section>
    </main>
  );
}
