'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Clock, Play, Lock, CheckCircle2, 
  ArrowRight, BookOpen, HelpCircle, ListChecks, FileText
} from 'lucide-react';
import { getCourse, getModule } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import Quiz from '@/components/Quiz';
import ModuleContent from '@/components/ModuleContent';
import VideoPlayer from '@/components/VideoPlayer';

export default function ModulePage() {
  const params = useParams();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;

  const course = getCourse(courseId);
  const mod = getModule(courseId, moduleId);
  const [activeSection, setActiveSection] = useState<'video' | 'content' | 'quiz'>('video');
  const [quizPassed, setQuizPassed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  function switchSection(section: 'video' | 'content' | 'quiz') {
    setActiveSection(section);
    // On mobile, scroll to the content area
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  if (!course || !mod) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-500 mb-3">Module not found.</p>
          <Link href="/courses" className="text-sm text-indigo-600 font-bold">Browse courses &rarr;</Link>
        </div>
      </main>
    );
  }

  const theme = getCategoryTheme(course.category);

  // Gated module
  if (!mod.isFree) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-ink-400" />
          </div>
          <h2 className="text-xl font-extrabold text-ink-900 mb-2">Sign up to continue</h2>
          <p className="text-sm text-ink-500 mb-6">
            Module 1 is free. Sign up to access the full course and earn your certificate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login?mode=signup" className={`inline-flex items-center justify-center rounded-xl ${theme.solidBg} px-5 py-2.5 text-sm font-bold text-white ${theme.solidBgHover} transition-colors`}>
              Sign up
            </Link>
            <Link href={`/courses/${courseId}`} className="inline-flex items-center justify-center rounded-xl border border-ink-200 px-5 py-2.5 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors">
              Back to course
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const currentModuleIndex = course.modules.findIndex((m) => m.id === mod.id);
  const nextModule = course.modules[currentModuleIndex + 1];
  const prevModule = currentModuleIndex > 0 ? course.modules[currentModuleIndex - 1] : null;

  function handleQuizComplete(score: number, total: number) {
    if (Math.round((score / total) * 100) >= 70) {
      setQuizPassed(true);
    }
  }

  const sections = [
    ...(mod.videoUrl ? [{ id: 'video' as const, label: 'Video', icon: Play }] : []),
    { id: 'content' as const, label: 'Reading', icon: FileText },
    { id: 'quiz' as const, label: 'Quiz', icon: HelpCircle },
  ];

  // Default to content if no video
  const currentSection = mod.videoUrl ? activeSection : (activeSection === 'video' ? 'content' : activeSection);

  return (
    <main className="min-h-screen bg-ink-50">
      {/* Top bar */}
      <div className="sticky top-[56px] z-40 bg-white border-b border-ink-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/courses/${courseId}`}
              className="w-8 h-8 rounded-lg border border-ink-200 flex items-center justify-center text-ink-500 hover:bg-ink-50 hover:text-ink-700 transition-all flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] text-ink-400 font-medium truncate">{course.title}</p>
              <p className="text-sm font-bold text-ink-900 truncate">{mod.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-ink-400 bg-ink-100 px-2.5 py-1 rounded-full font-medium hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3" /> {mod.duration}
            </span>
            <span className={`text-xs font-bold text-white ${theme.solidBg} px-2.5 py-1 rounded-full`}>
              {currentModuleIndex + 1} / {course.modules.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - module navigation */}
          <aside className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-[120px] space-y-4">
              {/* Section tabs */}
              <div className="bg-white rounded-xl border border-ink-200 p-3">
                <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide px-2 mb-2">This module</p>
                <div className="space-y-1">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => switchSection(s.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                        currentSection === s.id
                          ? `${theme.softBg} ${theme.softText}`
                          : 'text-ink-600 hover:bg-ink-50'
                      }`}
                    >
                      <s.icon className="w-4 h-4" />
                      {s.label}
                      {s.id === 'quiz' && quizPassed && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Module list */}
              <div className="bg-white rounded-xl border border-ink-200 p-3 hidden lg:block">
                <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide px-2 mb-2">All modules</p>
                <div className="space-y-0.5">
                  {course.modules.map((m, i) => {
                    const isCurrent = m.id === mod.id;
                    const isAccessible = m.isFree;
                    return (
                      <div key={m.id}>
                        {isAccessible ? (
                          <Link
                            href={`/courses/${courseId}/modules/${m.id}`}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                              isCurrent
                                ? `${theme.softBg} ${theme.softText} font-bold`
                                : 'text-ink-600 hover:bg-ink-50 font-medium'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                              isCurrent ? `${theme.solidBg} text-white` : 'bg-ink-100 text-ink-500'
                            }`}>
                              {m.order}
                            </span>
                            <span className="truncate">{m.title}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-ink-400">
                            <span className="w-5 h-5 rounded bg-ink-100 flex items-center justify-center flex-shrink-0">
                              <Lock className="w-2.5 h-2.5" />
                            </span>
                            <span className="truncate">{m.title}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 order-1 lg:order-2 min-w-0" ref={contentRef}>
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Video section */}
              {currentSection === 'video' && mod.videoUrl && (
                <div className="space-y-5">
                  <VideoPlayer videoUrl={mod.videoUrl} title={mod.videoTitle || mod.title} />
                  <div className="bg-white rounded-xl border border-ink-200 p-5">
                    <h2 className="font-bold text-ink-900 mb-1">{mod.videoTitle || mod.title}</h2>
                    <p className="text-sm text-ink-500">Watch the video lesson, then move to the reading for detailed notes and examples.</p>
                    <button
                      onClick={() => switchSection('content')}
                      className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${theme.solidText}`}
                    >
                      Continue to reading <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Content section */}
              {currentSection === 'content' && (
                <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
                  {/* Header */}
                  <div className="px-6 sm:px-8 py-5 border-b border-ink-100 bg-ink-50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-bold uppercase tracking-wide ${theme.solidText}`}>Module {mod.order}</span>
                      <span className="text-[11px] text-ink-400">· Reading</span>
                    </div>
                    <h1 className="text-xl font-extrabold text-ink-900">{mod.title}</h1>
                  </div>
                  {/* Body */}
                  <div className="px-6 sm:px-8 py-6 sm:py-8">
                    <ModuleContent module={mod} />
                  </div>
                  {/* Footer CTA */}
                  <div className="px-6 sm:px-8 py-5 border-t border-ink-100 bg-ink-50 flex items-center justify-between">
                    <p className="text-sm text-ink-500">Done reading?</p>
                    <button
                      onClick={() => switchSection('quiz')}
                      className={`inline-flex items-center gap-1.5 rounded-lg ${theme.solidBg} px-4 py-2 text-sm font-bold text-white ${theme.solidBgHover} transition-colors`}
                    >
                      Take the quiz <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Quiz section */}
              {currentSection === 'quiz' && (
                <div className="bg-white rounded-xl border border-ink-200 p-6 sm:p-8">
                  {!quizPassed && (
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`w-9 h-9 rounded-lg ${theme.softBg} flex items-center justify-center`}>
                          <HelpCircle className={`w-5 h-5 ${theme.solidText}`} />
                        </div>
                        <div>
                          <h2 className="text-lg font-extrabold text-ink-900">Module {mod.order} Quiz</h2>
                          <p className="text-xs text-ink-400">{mod.quiz.length} questions · 70% to pass</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <Quiz questions={mod.quiz} onComplete={handleQuizComplete} />
                </div>
              )}

              {/* Post-quiz success */}
              {quizPassed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 bg-white rounded-xl border-2 border-green-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-ink-900">Module complete!</p>
                      <p className="text-sm text-ink-500">
                        {nextModule
                          ? nextModule.isFree ? `Next: ${nextModule.title}` : 'Sign up for the full course'
                          : 'You finished all free modules!'}
                      </p>
                    </div>
                  </div>
                  {nextModule ? (
                    nextModule.isFree ? (
                      <Link href={`/courses/${courseId}/modules/${nextModule.id}`} className={`inline-flex items-center gap-1.5 rounded-xl ${theme.solidBg} px-5 py-2.5 text-sm font-bold text-white ${theme.solidBgHover} transition-colors whitespace-nowrap`}>
                        Next module <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link href="/login?mode=signup" className={`inline-flex items-center rounded-xl ${theme.solidBg} px-5 py-2.5 text-sm font-bold text-white ${theme.solidBgHover} transition-colors whitespace-nowrap`}>
                        Sign up to continue
                      </Link>
                    )
                  ) : (
                    <Link href={`/courses/${courseId}`} className="inline-flex items-center rounded-xl border border-ink-200 px-5 py-2.5 text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors whitespace-nowrap">
                      Back to course
                    </Link>
                  )}
                </motion.div>
              )}

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between">
                {prevModule ? (
                  <Link
                    href={`/courses/${courseId}/modules/${prevModule.id}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous module
                  </Link>
                ) : <div />}
                {nextModule && nextModule.isFree && (
                  <Link
                    href={`/courses/${courseId}/modules/${nextModule.id}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors"
                  >
                    Next module <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
