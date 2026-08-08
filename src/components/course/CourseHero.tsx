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
    <section className={`relative bg-gradient-to-br ${theme.heroFrom} to-ink-900 text-white overflow-hidden`}>
      {/* A fine dot texture instead of a generic rotated square — reads
          closer to the certificate's printed-stock feel than a template's
          default "abstract shape" hero. */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            {course.category && (
              <div className="flex items-center gap-2 mb-5">
                <span className="w-6 h-px bg-white/40" />
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80">{course.category}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold leading-[1.08] tracking-tight mb-4">{course.title}</h1>
            {course.description && (
              <p className="text-white/80 leading-relaxed mb-6 text-base sm:text-lg line-clamp-2 sm:line-clamp-none">{course.description}</p>
            )}

            {instructorName && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{instructorName}</p>
                  <p className="text-xs text-white/60">Instructor</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA card */}
          <div className="lg:w-80 flex-shrink-0 bg-white rounded-2xl overflow-hidden text-ink-900 shadow-2xl shadow-black/30 border border-white/10">
            {course.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- CloudFront URLs aren't in next.config's image domains
              <img src={course.thumbnailUrl} alt="" className="w-full h-40 object-cover" />
            ) : (
              <div className={`h-1.5 ${theme.solidBg}`} />
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
