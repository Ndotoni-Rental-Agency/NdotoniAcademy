import { getCategoryTheme } from '@/lib/category-theme';
import CourseModuleRow from './CourseModuleRow';
import type { ModulesForCourseQuery, CourseProgress } from '@/API';

type CourseModule = ModulesForCourseQuery['modulesForCourse'][number];

export default function CourseModulesSection({
  courseId, modules, theme, progress, moduleCompletion,
}: {
  courseId: string;
  modules: CourseModule[];
  theme: ReturnType<typeof getCategoryTheme>;
  progress: CourseProgress | null;
  moduleCompletion: Record<string, { done: number; total: number }> | null;
}) {
  return (
    <section id="course-content" className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-ink-900">Course content</h2>
          <span className="text-sm text-ink-400 bg-ink-100 px-3 py-1 rounded-full">
            {modules.length} module{modules.length === 1 ? '' : 's'}
          </span>
        </div>

        {modules.length === 0 ? (
          <p className="text-sm text-ink-400">This course doesn&apos;t have any modules yet.</p>
        ) : (
          <div className="space-y-4">
            {modules.map((mod, i) => (
              <CourseModuleRow
                key={mod.moduleId}
                courseId={courseId}
                mod={mod}
                index={i + 1}
                theme={theme}
                completedLessonIds={progress ? new Set(progress.completedLessonIds) : undefined}
                completion={moduleCompletion?.[mod.moduleId]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
