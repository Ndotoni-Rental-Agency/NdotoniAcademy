import type { Metadata } from 'next';
import { ArrowRight, Video, HelpCircle, BarChart3, Gift } from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import Reveal from '@/components/Reveal';
import InstructorPreview from '@/components/InstructorPreview';
import CertificatePreview from '@/components/CertificatePreview';
import { courses } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'For Instructors',
  description: 'Create courses and reach learners. The platform handles quizzes, progress tracking, and certificates for you. Free to publish.',
};

const featuredCourse = courses.find((c) => c.id === 'project-management')!;

const steps = [
  {
    num: '1',
    title: 'Build your course',
    desc: 'Add video lessons, written guides, and a quiz for every module. No design or development skills needed.',
  },
  {
    num: '2',
    title: 'Publish it',
    desc: 'Free to list. Module 1 is always free for learners, so people can try your course before they commit.',
  },
  {
    num: '3',
    title: 'Track results',
    desc: 'Enrollment, completion rate, and ratings update live as learners work through your course.',
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
                Teach what you know. Reach learners everywhere.
              </h1>
              <p className="text-lg text-ink-500 leading-relaxed mb-6 max-w-md">
                Create a course once. The platform handles quizzes, progress tracking, and certificates for you.
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
                  { icon: HelpCircle, label: 'Auto quizzes & certificates' },
                  { icon: BarChart3, label: 'Live analytics' },
                  { icon: Gift, label: 'Free to publish' },
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

      {/* How it works */}
      <section className="border-t border-ink-100 bg-ink-50 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 text-center mb-12">From idea to published course</h2>
          <div className="space-y-6">
            {steps.map((item, i) => (
              <Reveal
                key={item.num}
                x={-12}
                delay={i * 0.1}
                className="flex gap-4 items-start bg-white rounded-2xl border-2 border-ink-100 p-5"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-bold text-ink-900">{item.title}</h3>
                  <p className="text-sm text-ink-500 mt-1">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates carry your name */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={12}>
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Proof, with your name on it</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-4 leading-tight">
                Every completion earns a certificate signed by you
              </h2>
              <p className="text-ink-500 leading-relaxed max-w-md">
                When a learner finishes your course, they get a certificate with your name as instructor, their score, and a verifiable ID. It is proof of your teaching, not just theirs.
              </p>
            </Reveal>
            <Reveal y={12} delay={0.1}>
              <CertificatePreview
                courseTitle={featuredCourse.title}
                instructor={featuredCourse.instructor}
                score={92}
                points={featuredCourse.points}
              />
            </Reveal>
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
