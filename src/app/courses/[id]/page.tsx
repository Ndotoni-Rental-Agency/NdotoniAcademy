import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock, BookOpen, Award, Users, CheckCircle2, Play, ArrowRight,
  FileText, HelpCircle, Video, Zap, TrendingUp, Star, Shield
} from 'lucide-react';
import { getCourse, courses } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import Avatar from '@/components/Avatar';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return courses.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) return {};

  return {
    title: course.title,
    description: course.shortDescription,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      type: 'website',
      url: `${SITE_URL}/courses/${course.id}`,
    },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) return notFound();

  const theme = getCategoryTheme(course.category);
  const totalQuizQuestions = course.modules.reduce((sum, m) => sum + m.quiz.length, 0);
  const videoModules = course.modules.filter(m => m.videoUrl);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.shortDescription,
    provider: {
      '@type': 'Organization',
      name: 'Ndotoni Academy',
      sameAs: SITE_URL,
    },
    instructor: {
      '@type': 'Person',
      name: course.instructor,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: course.rating,
      ratingCount: course.enrolledCount,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className={`relative ${theme.solidBg} text-white overflow-hidden`}>
        {/* Flat geometric accent shapes */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-white/10 rotate-45" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-white/10" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link href="/courses" className="text-sm text-white/70 hover:text-white font-medium mb-6 inline-flex items-center gap-1.5 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> All courses
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wide bg-white/20 text-white px-3 py-1 rounded-md">
                  {course.levelLabel}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wide bg-white/20 text-white px-3 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> {course.rating}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold leading-[1.05] tracking-tight mb-4">{course.title}</h1>
              <p className="text-white/85 leading-relaxed mb-6 text-lg">{course.shortDescription}</p>

              {/* Highlights bar */}
              <div className="flex flex-wrap gap-3 text-sm text-white/90 mb-6">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-md">
                  <Video className="w-4 h-4" /> {videoModules.length} videos
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-md">
                  <FileText className="w-4 h-4" /> {course.modules.length} readings
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-md">
                  <HelpCircle className="w-4 h-4" /> {totalQuizQuestions} quiz Qs
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-md">
                  <Clock className="w-4 h-4" /> {course.duration}
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <Avatar name={course.instructor} size="lg" className="!bg-white/20 !text-white" />
                <div>
                  <p className="text-sm font-semibold text-white">{course.instructor}</p>
                  <p className="text-xs text-white/70">Course instructor</p>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="lg:w-80 flex-shrink-0 bg-white rounded-2xl p-6 text-ink-900 shadow-2xl shadow-black/20">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.softBg} flex items-center justify-center`}>
                    <BookOpen className={`w-5 h-5 ${theme.solidText}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{course.modules.length} Modules</p>
                    <p className="text-xs text-ink-500">Video + text + quiz each</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.softBg} flex items-center justify-center`}>
                    <Award className={`w-5 h-5 ${theme.solidText}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{course.points} Points</p>
                    <p className="text-xs text-ink-500">Verified certificate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.softBg} flex items-center justify-center`}>
                    <Users className={`w-5 h-5 ${theme.solidText}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{course.enrolledCount}+ Enrolled</p>
                    <p className="text-xs text-ink-500">{course.completionRate}% completion</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/courses/${course.id}/modules/${course.modules[0].id}`}
                className={`flex items-center justify-center gap-2 w-full rounded-xl ${theme.solidBg} text-white font-bold py-3.5 ${theme.solidBgHover} transition-colors text-sm shadow-lg`}
              >
                <Play className="w-4 h-4" /> Start free module
              </Link>
              <p className="text-center text-xs text-ink-400 mt-2.5">No sign-up needed for Module 1</p>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="border-b border-ink-100 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-6">What you&apos;ll learn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {course.outcomes.map((outcome, i) => (
              <div key={i} className="flex items-start gap-3 bg-ink-50 rounded-xl p-4">
                <CheckCircle2 className={`w-5 h-5 ${theme.solidText} flex-shrink-0 mt-0.5`} />
                <span className="text-sm text-ink-700 leading-relaxed">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-ink-900">Course content</h2>
            <span className="text-sm text-ink-400 bg-ink-100 px-3 py-1 rounded-full">{course.modules.length} modules · {course.duration}</span>
          </div>

          <div className="space-y-4">
            {course.modules.map((mod) => (
              <div
                key={mod.id}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${
                  mod.isFree
                    ? `${theme.border} hover:shadow-md`
                    : 'border-ink-200'
                }`}
              >
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    {/* Number badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold ${
                      mod.isFree ? `${theme.solidBg} text-white` : 'bg-ink-100 text-ink-500'
                    }`}>
                      {mod.order}
                    </div>
                    <div>
                      <h3 className="font-bold text-ink-900">{mod.title}</h3>
                      <p className="text-xs text-ink-400 mt-0.5">{mod.duration}</p>
                    </div>
                  </div>
                  {mod.isFree ? (
                    <Link
                      href={`/courses/${course.id}/modules/${mod.id}`}
                      className={`flex items-center gap-1.5 text-sm font-bold text-white ${theme.solidBg} px-4 py-2 rounded-lg ${theme.solidBgHover} transition-colors`}
                    >
                      <Play className="w-3.5 h-3.5" /> Start
                    </Link>
                  ) : (
                    <span className="text-xs font-medium text-ink-400 bg-ink-100 px-3 py-1.5 rounded-lg">
                      Enrolled only
                    </span>
                  )}
                </div>

                {/* Content types */}
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  {mod.videoUrl && (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${theme.softText} ${theme.softBg} px-2.5 py-1 rounded-full`}>
                      <Play className="w-3 h-3" /> Video lesson
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 bg-ink-100 px-2.5 py-1 rounded-full">
                    <FileText className="w-3 h-3" /> Written guide
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 bg-ink-100 px-2.5 py-1 rounded-full">
                    <HelpCircle className="w-3 h-3" /> {mod.quiz.length} quiz questions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this course */}
      <section className="border-t border-ink-100 bg-ink-50 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-8 text-center">Why take this course</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, title: 'Learn fast', desc: 'Bite-sized modules you finish in one sitting' },
              { icon: TrendingUp, title: 'Track progress', desc: 'See exactly how far you have come' },
              { icon: Shield, title: 'Verified cert', desc: 'Shareable proof of your achievement' },
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

      {/* Skills */}
      <section className="border-t border-ink-100 py-12 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-5">Skills you&apos;ll build</h2>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-ink-100 text-sm font-semibold text-ink-700 hover:bg-ink-200 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-ink-100 py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-8">How each module works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Video, num: '1', title: 'Watch', desc: 'Short video lesson from the instructor covering key concepts.' },
              { icon: FileText, num: '2', title: 'Read & explore', desc: 'Detailed guide with examples and real-world case studies.' },
              { icon: HelpCircle, num: '3', title: 'Quiz & advance', desc: 'Test yourself. Score 70% or higher to unlock the next module.' },
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
      <section className={`${theme.solidBg} py-12 sm:py-14 relative overflow-hidden`}>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rotate-45" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">Ready to start?</h2>
          <p className="text-white/80 mb-6">Jump in. Your first module is free.</p>
          <Link
            href={`/courses/${course.id}/modules/${course.modules[0].id}`}
            className={`inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold ${theme.solidText} hover:bg-white/90 transition-colors shadow-lg`}
          >
            <Play className="w-4 h-4" /> Start free module
          </Link>
        </div>
      </section>
    </main>
  );
}
