import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, Clock, Users, CheckCircle2, Play,
  ChevronRight, FileText, Headphones, Image, CreditCard,
  ClipboardList, Trophy, AlertCircle, BookMarked,
} from 'lucide-react';
import {
  getCourseDetail, getInstructor, courses,
} from '@/lib/education-mock-data';
import type { Assessment, ContentBlock, Lesson } from '@/lib/education-model';

// ─── Static params ────────────────────────────────────────────

export function generateStaticParams() {
  return courses.map(c => ({ courseId: c.id }));
}

// ─── Helpers ─────────────────────────────────────────────────

function contentTypeIcon(type: ContentBlock['type']) {
  const map: Record<ContentBlock['type'], React.ReactNode> = {
    VIDEO:       <Play className="w-3.5 h-3.5" />,
    TEXT:        <FileText className="w-3.5 h-3.5" />,
    AUDIO:       <Headphones className="w-3.5 h-3.5" />,
    IMAGE:       <Image className="w-3.5 h-3.5" />,
    PDF:         <FileText className="w-3.5 h-3.5" />,
    FLASHCARD:   <CreditCard className="w-3.5 h-3.5" />,
    DIAGRAM:     <Image className="w-3.5 h-3.5" />,
    INTERACTIVE: <Play className="w-3.5 h-3.5" />,
    AI_TUTOR:    <BookOpen className="w-3.5 h-3.5" />,
  };
  return map[type];
}

function assessmentBadge(a: Assessment) {
  const config = {
    QUIZ:       { label: 'Quiz',       bg: 'bg-sky-50',    text: 'text-sky-700' },
    EXAM:       { label: 'Exam',       bg: 'bg-amber-50',  text: 'text-amber-700' },
    ASSIGNMENT: { label: 'Assignment', bg: 'bg-violet-50', text: 'text-violet-700' },
  }[a.type];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const detail = getCourseDetail(courseId);
  if (!detail) return notFound();

  const { course, level, program, modules, courseAssessment, instructor } = detail;

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const totalModuleTests = modules.filter(m =>
    m.assessments.some(a => a.type === 'QUIZ' && a.scope === 'MODULE'),
  ).length;
  const totalAssignments = modules.filter(m =>
    m.assessments.some(a => a.type === 'ASSIGNMENT'),
  ).length;

  // First free lesson for the CTA
  const firstFreeLesson = modules
    .flatMap(m => m.lessons)
    .find(l => l.lesson.isFree);

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        className="relative text-white overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${course.color ?? '#4F46E5'} 0%, ${course.color ?? '#4F46E5'}cc 100%)` }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Nyumbani</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/learn" className="hover:text-white transition-colors">{program.title}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{course.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">
                  {level.title}
                </span>
                {detail.tags.slice(0, 1).map(t => (
                  <span key={t.id} className="text-[11px] font-bold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">
                    {t.label}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
                {course.title}
                {course.titleSwahili && course.titleSwahili !== course.title && (
                  <span className="block text-xl font-semibold text-white/60 mt-1">
                    {course.titleSwahili}
                  </span>
                )}
              </h1>
              <p className="text-white/80 leading-relaxed mb-6 text-base max-w-xl">
                {course.shortDescription}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-3 text-sm text-white/70 mb-6">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <BookOpen className="w-4 h-4" /> {modules.length} moduli
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <FileText className="w-4 h-4" /> {totalLessons} masomo
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" /> {course.estimatedDuration}
                </span>
                {course.enrolledCount && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                    <Users className="w-4 h-4" /> {course.enrolledCount.toLocaleString()}+
                  </span>
                )}
              </div>

              {/* Instructor */}
              {instructor && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    {instructor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{instructor.name}</p>
                    <p className="text-xs text-white/60">{instructor.expertise.slice(0, 2).join(' · ')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Card */}
            <div className="lg:w-72 flex-shrink-0 bg-white rounded-2xl p-5 text-ink-900 shadow-2xl shadow-black/20">
              {/* Assessment summary */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{totalLessons} Masomo</p>
                    <p className="text-xs text-ink-400">{modules.length} moduli</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{totalModuleTests} Majaribio</p>
                    <p className="text-xs text-ink-400">mwishoni mwa kila moduli</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                    <BookMarked className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{totalAssignments} Kazi za Nyumbani</p>
                    <p className="text-xs text-ink-400">mazoezi ya vitendo</p>
                  </div>
                </div>
                {courseAssessment && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Mtihani wa Mwisho</p>
                      <p className="text-xs text-ink-400">{courseAssessment.timeLimit} dak · asilimia {courseAssessment.passingScore} kupita</p>
                    </div>
                  </div>
                )}
              </div>

              {firstFreeLesson ? (
                <Link
                  href={`/learn/${courseId}/${firstFreeLesson.lesson.id}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl text-white font-bold py-3 text-sm shadow-lg transition-colors hover:opacity-90"
                  style={{ background: course.color ?? '#4F46E5' }}
                >
                  <Play className="w-4 h-4" /> Anza Somo la Kwanza
                </Link>
              ) : (
                <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-ink-900 text-white font-bold py-3 text-sm">
                  Jiandikishe Sasa
                </button>
              )}
              <p className="text-center text-xs text-ink-400 mt-2">Somo la kwanza ni bure</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you'll learn ────────────────────────────────── */}
      <section className="border-b border-ink-100 py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-extrabold text-ink-900 mb-5">Utakachojifunza</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.outcomes.map((outcome, i) => (
              <div key={i} className="flex items-start gap-3 bg-ink-50 rounded-xl p-3.5">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-ink-700 leading-relaxed">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course structure ─────────────────────────────────── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-ink-900">Muundo wa Kozi</h2>
            <span className="text-sm text-ink-400 bg-ink-100 px-3 py-1 rounded-full">
              {modules.length} moduli · {totalLessons} masomo
            </span>
          </div>

          <div className="space-y-4">
            {modules.map(({ module, lessons, assessments: moduleAssessments }) => {
              const moduleQuiz = moduleAssessments.find(a => a.scope === 'MODULE' && a.type === 'QUIZ');
              const moduleAssignment = moduleAssessments.find(a => a.type === 'ASSIGNMENT');

              return (
                <div key={module.id} className="border border-ink-200 rounded-2xl overflow-hidden">
                  {/* Module header */}
                  <div className="flex items-center gap-4 bg-ink-50 px-5 py-4 border-b border-ink-200">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                      style={{ background: course.color ?? '#4F46E5' }}>
                      {module.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-ink-900 leading-snug">{module.title}</h3>
                      <p className="text-xs text-ink-400 mt-0.5">
                        {lessons.length} masomo · {module.estimatedDuration}
                      </p>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="divide-y divide-ink-100">
                    {lessons.map(({ lesson, contentBlocks, assessments: lessonAssessments }, idx) => {
                      const lessonQuiz = lessonAssessments.find(a => a.type === 'QUIZ');
                      return (
                        <LessonRow
                          key={lesson.id}
                          lesson={lesson}
                          contentBlocks={contentBlocks}
                          quiz={lessonQuiz}
                          courseId={courseId}
                          courseColor={course.color}
                          isFirst={idx === 0 && module.order === 1}
                        />
                      );
                    })}

                    {/* Module test row */}
                    {moduleQuiz && (
                      <AssessmentRow assessment={moduleQuiz} icon={<ClipboardList className="w-4 h-4" />} color="sky" />
                    )}

                    {/* Assignment row */}
                    {moduleAssignment && (
                      <AssessmentRow assessment={moduleAssignment} icon={<BookMarked className="w-4 h-4" />} color="violet" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Final exam */}
            {courseAssessment && (
              <div className="border-2 border-amber-200 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-4 bg-amber-50 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-ink-900">{courseAssessment.title}</h3>
                    <p className="text-xs text-ink-500 mt-0.5">
                      {courseAssessment.timeLimit} dak · Asilimia {courseAssessment.passingScore} kupita · {courseAssessment.maxAttempts} jaribio
                    </p>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                    Mtihani wa Mwisho
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Instructor ───────────────────────────────────────── */}
      {instructor && (
        <section className="border-t border-ink-100 py-10 sm:py-12 bg-ink-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-extrabold text-ink-900 mb-5">Mwalimu</h2>
            <div className="flex items-start gap-5 bg-white rounded-2xl p-6 border border-ink-100">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-extrabold text-white flex-shrink-0"
                style={{ background: course.color ?? '#4F46E5' }}>
                {instructor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-ink-900">{instructor.name}</p>
                <div className="flex flex-wrap gap-1.5 my-2">
                  {instructor.expertise.map(e => (
                    <span key={e} className="text-xs bg-ink-100 text-ink-600 px-2.5 py-0.5 rounded-full font-medium">{e}</span>
                  ))}
                </div>
                <p className="text-sm text-ink-500 leading-relaxed">{instructor.bio}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="py-10 sm:py-12" style={{ background: course.color ?? '#4F46E5' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">Uko tayari kuanza?</h2>
          <p className="text-white/70 mb-6 text-sm">Somo la kwanza ni bure — hakuna usajili unaohitajika.</p>
          {firstFreeLesson && (
            <Link
              href={`/learn/${courseId}/${firstFreeLesson.lesson.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold hover:bg-white/90 transition-colors shadow-lg"
              style={{ color: course.color ?? '#4F46E5' }}
            >
              <Play className="w-4 h-4" /> Anza Sasa
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function LessonRow({
  lesson,
  contentBlocks,
  quiz,
  courseId,
  courseColor,
  isFirst,
}: {
  lesson: Lesson;
  contentBlocks: ContentBlock[];
  quiz: Assessment | undefined;
  courseId: string;
  courseColor?: string;
  isFirst: boolean;
}) {
  const contentTypeLabel: Record<ContentBlock['type'], string> = {
    VIDEO: 'Video', TEXT: 'Maandishi', AUDIO: 'Sauti', IMAGE: 'Picha',
    PDF: 'PDF', FLASHCARD: 'Kadi', DIAGRAM: 'Mchoro', INTERACTIVE: 'Maingiliano', AI_TUTOR: 'AI Tutor',
  };

  return (
    <div className="flex items-start gap-4 px-5 py-4 hover:bg-ink-50 transition-colors group">
      {/* Icon */}
      <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        lesson.isFree ? 'text-white' : 'bg-ink-100 text-ink-400'
      }`} style={lesson.isFree ? { background: courseColor ?? '#4F46E5' } : {}}>
        {lesson.isFree ? <Play className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {lesson.isFree ? (
          <Link href={`/learn/${courseId}/${lesson.id}`}
            className="text-sm font-semibold text-ink-900 group-hover:text-indigo-600 transition-colors leading-snug block">
            {lesson.title}
          </Link>
        ) : (
          <p className="text-sm font-semibold text-ink-900 leading-snug">{lesson.title}</p>
        )}

        {/* Content type chips */}
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {contentBlocks.map(cb => (
            <span key={cb.id}
              className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-500 bg-ink-100 px-2 py-0.5 rounded-full">
              {contentTypeIcon(cb.type)} {contentTypeLabel[cb.type]}
            </span>
          ))}
          {quiz && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
              <ClipboardList className="w-3 h-3" /> Quiz
            </span>
          )}
        </div>
      </div>

      {/* Duration + lock */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs text-ink-400">{lesson.estimatedDuration}</span>
        {!lesson.isFree && (
          <span className="text-[10px] font-medium text-ink-400 bg-ink-100 px-2 py-0.5 rounded-full">Jiandikishe</span>
        )}
        {lesson.isFree && (
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Bure</span>
        )}
      </div>
    </div>
  );
}

function AssessmentRow({
  assessment,
  icon,
  color,
}: {
  assessment: Assessment;
  icon: React.ReactNode;
  color: 'sky' | 'violet' | 'amber';
}) {
  const bg = { sky: 'bg-sky-50', violet: 'bg-violet-50', amber: 'bg-amber-50' }[color];
  const text = { sky: 'text-sky-700', violet: 'text-violet-700', amber: 'text-amber-700' }[color];
  const iconBg = { sky: 'bg-sky-100 text-sky-600', violet: 'bg-violet-100 text-violet-600', amber: 'bg-amber-100 text-amber-600' }[color];

  return (
    <div className={`flex items-center gap-4 px-5 py-3.5 ${bg}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${text} leading-snug`}>{assessment.title}</p>
        <p className="text-xs text-ink-400 mt-0.5">
          {assessment.timeLimit ? `${assessment.timeLimit} dak · ` : ''}
          Kupita: asilimia {assessment.passingScore}
          {assessment.weight ? ` · Uzito: ${assessment.weight}%` : ''}
        </p>
      </div>
      <div className="flex-shrink-0">
        {assessmentBadge(assessment)}
      </div>
    </div>
  );
}
