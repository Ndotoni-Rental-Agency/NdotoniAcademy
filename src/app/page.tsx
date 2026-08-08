import Link from 'next/link';
import {
  ArrowRight, Clock, GraduationCap, Users, Presentation,
  Award, Zap, UserCheck, Layers, Briefcase,
} from 'lucide-react';
import { courses } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import AuthButton from '@/components/AuthButton';
import SignedOutOnly from '@/components/SignedOutOnly';
import Reveal from '@/components/Reveal';
import CourseExperiencePreview from '@/components/CourseExperiencePreview';
import CertificatePreview from '@/components/CertificatePreview';
import LearnerDashboardPreview from '@/components/LearnerDashboardPreview';
import HomepageCourseList from '@/components/HomepageCourseList';

export default function HomePage() {
  const featuredCourse = courses.find((c) => c.id === 'project-management');

  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="bg-white pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal y={20} mode="mount">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-ink-900 leading-[1.1] tracking-tight">
                Dream. Learn.{' '}
                <span className="text-indigo-600">Achieve.</span>
              </h1>
            </Reveal>

            <Reveal y={20} delay={0.1} mode="mount">
              <p className="mt-5 text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed">
                Build real-world skills, earn verified certificates, and unlock new opportunities.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Role picker ─── */}
      <section className="bg-white pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-ink-400 uppercase tracking-wide mb-6">Get started as a...</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Reveal y={12} delay={0.2} mode="mount">
              <Link
                href="/courses"
                className="block rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 p-5 text-center transition-all group"
              >
                <GraduationCap className="w-7 h-7 text-ink-400 mx-auto mb-2 group-hover:text-ink-700 transition-colors" />
                <h3 className="font-bold text-ink-900 mb-0.5">Learner</h3>
                <p className="text-xs text-ink-500">Discover courses and earn certificates</p>
              </Link>
            </Reveal>
            <Reveal y={12} delay={0.28} mode="mount">
              <Link
                href="/instructors"
                className="block rounded-2xl border-2 border-brand-200 hover:border-brand-400 hover:bg-brand-50 p-5 text-center transition-all group"
              >
                <Presentation className="w-7 h-7 text-ink-400 mx-auto mb-2 group-hover:text-ink-700 transition-colors" />
                <h3 className="font-bold text-ink-900 mb-0.5">Instructor</h3>
                <p className="text-xs text-ink-500">Create, teach, and inspire learners</p>
              </Link>
            </Reveal>
            <Reveal y={12} delay={0.36} mode="mount">
              <Link
                href="/organizations"
                className="block rounded-2xl border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50 p-5 text-center transition-all group"
              >
                <Users className="w-7 h-7 text-ink-400 mx-auto mb-2 group-hover:text-ink-700 transition-colors" />
                <h3 className="font-bold text-ink-900 mb-0.5">Organization</h3>
                <p className="text-xs text-ink-500">Upskill your team with scalable learning</p>
              </Link>
            </Reveal>
          </div>

          <SignedOutOnly>
            <p className="text-center mt-6 text-sm text-ink-400">
              Already have an account?{' '}
              <AuthButton mode="signin" className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
                Log in
              </AuthButton>
            </p>
          </SignedOutOnly>
        </div>
      </section>

      {/* ─── Your dashboard ─── */}
      <section className="border-t border-ink-100 bg-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={12}>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3">Your dashboard, from day one</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900 mb-4 leading-tight">
                One place to see everything you&apos;re working on
              </h2>
              <p className="text-ink-500 leading-relaxed max-w-md">
                Courses you picked yourself sit right alongside anything assigned by an organization
                you&apos;re part of, each one showing real progress, not just a checkmark.
              </p>
            </Reveal>
            <Reveal y={12} delay={0.1}>
              <LearnerDashboardPreview />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Courses: as a list, not cards ─── */}
      <section className="border-t border-ink-100 bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900">Explore courses</h2>
            <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-bold hidden sm:flex">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <HomepageCourseList />
        </div>
      </section>

      {/* ─── What you can learn ─── */}
      <section className="border-t border-ink-100 bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900">What you can learn</h2>
            <p className="text-ink-500 mt-2">Courses across disciplines. More added every month.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { label: 'Project Management', category: 'Project Management' },
              { label: 'Digital Marketing', category: 'Marketing' },
              { label: 'Data Analytics', category: 'Technology' },
              { label: 'UX Design', category: 'Design' },
              { label: 'Leadership', category: null },
              { label: 'Finance', category: null },
              { label: 'Software Development', category: null },
              { label: 'Communication', category: null },
            ].map((item, i) => {
              const theme = item.category ? getCategoryTheme(item.category) : null;
              return (
                <Reveal
                  key={item.label}
                  scale={0.95}
                  delay={i * 0.04}
                  className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold ${
                    theme ? `${theme.softBg} ${theme.softText} ${theme.border}` : 'bg-ink-50 text-ink-600 border-ink-100'
                  }`}
                >
                  {item.label}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Why Ndotoni ─── */}
      <section className="border-t border-ink-100 bg-ink-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900">Why Ndotoni Academy</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { icon: Clock, title: 'Learn at your pace', desc: 'No deadlines. No pressure. Learn when it suits you.' },
              { icon: Zap, title: 'Free to start', desc: 'Every course has a free first module. No card needed.' },
              { icon: Award, title: 'Verified certificates', desc: 'Credentials employers and peers recognize.' },
              { icon: UserCheck, title: 'Expert instructors', desc: 'Professionals with real-world experience.' },
              { icon: Layers, title: 'Bite-sized modules', desc: 'Short lessons you can finish in one sitting.' },
              { icon: Briefcase, title: 'Built for professionals', desc: 'Designed for working adults who value their time.' },
            ].map((item, i) => (
              <Reveal key={item.title} y={10} delay={i * 0.06} className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-ink-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-ink-500">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mission & Vision ─── */}
      <section className="border-t border-ink-100 bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Reveal y={12}>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2">Our mission</p>
              <p className="text-ink-700 leading-relaxed">
                Make quality education accessible to everyone. Knowledge shouldn&apos;t be locked behind expensive classrooms. It should be available wherever you are, whenever you&apos;re ready.
              </p>
            </Reveal>
            <Reveal y={12} delay={0.1}>
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-2">Our vision</p>
              <p className="text-ink-700 leading-relaxed">
                A world where anyone can build skills, prove their expertise, and advance their career. No matter where they started.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="border-t border-ink-100 bg-ink-50 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900">How it works</h2>
            <p className="text-ink-500 mt-2">Short modules, immediate feedback, real progress.</p>
          </div>

          <div className="space-y-6">
            {[
              { num: '1', title: 'Watch short lessons', desc: 'Video and text. Finish one in a single sitting.' },
              { num: '2', title: 'Practice with quizzes', desc: 'Instant feedback after every module.' },
              { num: '3', title: 'Earn your certificate', desc: 'Pass the assessment. Get certified.' },
            ].map((item, i) => (
              <Reveal key={item.num} x={-12} delay={i * 0.1} className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-bold text-ink-900">{item.title}</h3>
                  <p className="text-sm text-ink-500">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── See it in action ─── */}
      <section className="border-t border-ink-100 bg-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900">See it in action</h2>
            <p className="text-ink-500 mt-2">A real quiz question from the platform, and the certificate waiting at the end.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-4 items-center">
            <Reveal y={12}>
              <CourseExperiencePreview />
            </Reveal>

            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-ink-300" />
            </div>

            <Reveal y={12} delay={0.1}>
              {featuredCourse && (
                <CertificatePreview
                  courseTitle={featuredCourse.title}
                  instructor={featuredCourse.instructor}
                  score={92}
                  points={featuredCourse.points}
                />
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="border-t border-ink-100 bg-white py-14 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-ink-900 mb-5">
            Start learning for free
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <AuthButton
              mode="signup"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
            >
              Sign up free
            </AuthButton>
            <Link
              href="/instructors"
              className="inline-flex items-center justify-center rounded-full border-2 border-ink-200 px-7 py-3.5 text-sm font-bold text-ink-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              I&apos;m an instructor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
