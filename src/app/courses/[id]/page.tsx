import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock, BookOpen, Award, Users, CheckCircle2, Play, ArrowRight, 
  FileText, HelpCircle, Video, Zap, TrendingUp, Star, Shield
} from 'lucide-react';
import { getCourse, courses } from '@/lib/mock-data';

export function generateStaticParams() {
  return courses.map((c) => ({ id: c.id }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) return notFound();

  const totalQuizQuestions = course.modules.reduce((sum, m) => sum + m.quiz.length, 0);
  const videoModules = course.modules.filter(m => m.videoUrl);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-indigo-600 text-white overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link href="/courses" className="text-sm text-indigo-200 hover:text-white font-medium mb-6 inline-flex items-center gap-1.5 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> All courses
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wide bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                  {course.levelLabel}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wide bg-white/15 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> 4.8
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-tight mb-4">{course.title}</h1>
              <p className="text-indigo-100 leading-relaxed mb-6 text-lg">{course.shortDescription}</p>

              {/* Highlights bar */}
              <div className="flex flex-wrap gap-4 text-sm text-indigo-200 mb-6">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Video className="w-4 h-4" /> {videoModules.length} videos
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <FileText className="w-4 h-4" /> {course.modules.length} readings
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <HelpCircle className="w-4 h-4" /> {totalQuizQuestions} quiz Qs
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" /> {course.duration}
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold">
                  {course.instructor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{course.instructor}</p>
                  <p className="text-xs text-indigo-200">Course instructor</p>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="lg:w-80 flex-shrink-0 bg-white rounded-2xl p-6 text-ink-900 shadow-2xl shadow-black/20">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{course.modules.length} Modules</p>
                    <p className="text-xs text-ink-500">Video + text + quiz each</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{course.cpdPoints} CPD Points</p>
                    <p className="text-xs text-ink-500">Verified certificate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{course.enrolledCount}+ Enrolled</p>
                    <p className="text-xs text-ink-500">{course.completionRate}% completion</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/courses/${course.id}/modules/${course.modules[0].id}`}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 text-white font-bold py-3.5 hover:bg-indigo-700 transition-colors text-sm shadow-lg shadow-indigo-600/30"
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
                <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
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
            {course.modules.map((mod, idx) => (
              <div
                key={mod.id}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${
                  mod.isFree 
                    ? 'border-indigo-200 hover:border-indigo-300 hover:shadow-md' 
                    : 'border-ink-200'
                }`}
              >
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    {/* Number badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold ${
                      mod.isFree ? 'bg-indigo-600 text-white' : 'bg-ink-100 text-ink-500'
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
                      className="flex items-center gap-1.5 text-sm font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
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
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
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
      <section className="border-t border-ink-100 bg-gradient-to-b from-ink-50 to-white py-12 sm:py-16">
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
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
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
            {[...course.outcomes.map(o => o.split(' ').slice(0, 3).join(' ')), 'Professional Ethics', 'Critical Thinking', 'Research Methods'].map((skill, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-ink-100 text-sm font-semibold text-ink-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-default">
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
              { icon: FileText, num: '2', title: 'Read & explore', desc: 'Detailed guide with examples, case studies, and real legislation.' },
              { icon: HelpCircle, num: '3', title: 'Quiz & advance', desc: 'Test yourself. Score 70% or higher to unlock the next module.' },
            ].map((item) => (
              <div key={item.title} className="relative">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3">
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
      <section className="bg-indigo-600 py-12 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">Ready to start?</h2>
          <p className="text-indigo-200 mb-6">Jump in. Your first module is free.</p>
          <Link
            href={`/courses/${course.id}/modules/${course.modules[0].id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors shadow-lg"
          >
            <Play className="w-4 h-4" /> Start free module
          </Link>
        </div>
      </section>
    </main>
  );
}
