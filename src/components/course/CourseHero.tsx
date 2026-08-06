import Link from 'next/link';
import { Award, User, Play, Video } from 'lucide-react';
import { getCategoryTheme } from '@/lib/category-theme';
import type { CourseQuery, ModulesForCourseQuery, CourseProgress } from '@/API';
import type { ResumeTarget } from './types';

type PublicCourse = NonNullable<CourseQuery['course']>;
type CourseModule = ModulesForCourseQuery['modulesForCourse'][number];

export default function CourseHero({
  course, modules, theme, instructorName, progress, resumeTarget,
}: {
  course: PublicCourse;
  modules: CourseModule[];
  theme: ReturnType<typeof getCategoryTheme>;
  instructorName: string | null;
  progress: CourseProgress | null;
  resumeTarget: ResumeTarget | null;
}) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessonCount, 0);

  return (
    <section className={`relative ${theme.solidBg} text-white overflow-hidden`}>
      <div className="absolute -right-10 -top-10 w-72 h-72 bg-white/10 rotate-45" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-white/10" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            {course.category && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-white/20 text-white px-3 py-1 rounded-md mb-4">
                {course.category}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold leading-[1.05] tracking-tight mb-4">{course.title}</h1>
            {course.description && (
              <p className="text-white/85 leading-relaxed mb-6 text-base sm:text-lg line-clamp-2 sm:line-clamp-none">{course.description}</p>
            )}

            {instructorName && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{instructorName}</p>
                  <p className="text-xs text-white/70">Instructor</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA card */}
          <div className="lg:w-80 flex-shrink-0 bg-white rounded-2xl overflow-hidden text-ink-900 shadow-2xl shadow-black/20">
            {course.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- CloudFront URLs aren't in next.config's image domains
              <img src={course.thumbnailUrl} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.softBg} flex items-center justify-center`}>
                    <Video className={`w-5 h-5 ${theme.solidText}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{modules.length} Module{modules.length === 1 ? '' : 's'}</p>
                    <p className="text-xs text-ink-500">{totalLessons} lesson{totalLessons === 1 ? '' : 's'} total</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.softBg} flex items-center justify-center`}>
                    <Award className={`w-5 h-5 ${theme.solidText}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">TZS {course.priceTzs.toLocaleString()}</p>
                    <p className="text-xs text-ink-500">One-time</p>
                  </div>
                </div>
              </div>

              {/* Only shown once the learner has actually started — a "0%"
                  bar before anyone's begun would just be noise. */}
              {progress && progress.completedLessonIds.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-ink-500 mb-1.5">
                    <span>Your progress</span>
                    <span>{progress.completedLessonIds.length}/{progress.totalLessons}</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${theme.solidBg}`}
                      style={{ width: `${Math.min(100, Math.round((progress.completedLessonIds.length / Math.max(progress.totalLessons, 1)) * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {resumeTarget ? (
                <Link
                  href={`/courses/${course.id}/modules/${resumeTarget.moduleId}/lessons/${resumeTarget.lessonId}`}
                  className={`flex items-center justify-center gap-2 w-full rounded-xl ${theme.solidBg} text-white font-bold py-3.5 ${theme.solidBgHover} transition-colors text-sm shadow-lg`}
                >
                  <Play className="w-4 h-4" /> Resume: {resumeTarget.title}
                </Link>
              ) : (
                <a
                  href="#course-content"
                  className={`flex items-center justify-center gap-2 w-full rounded-xl ${theme.solidBg} text-white font-bold py-3.5 ${theme.solidBgHover} transition-colors text-sm shadow-lg`}
                >
                  <Play className="w-4 h-4" /> View course content
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
