'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { getCategoryTheme } from '@/lib/category-theme';
import { instructorDisplayName } from '@/lib/course-display';
import { GraphQLClient } from '@/lib/graphql-client';
import { useAuth } from '@/lib/auth-context';
import { course as courseQuery, modulesForCourse, lessonsForModule, myCourseProgress as myCourseProgressQuery } from '@/graphql/queries';
import type { CourseQuery, ModulesForCourseQuery, LessonsForModuleQuery, CourseProgress, MyCourseProgressQuery, MyCourseProgressQueryVariables } from '@/API';
import CourseHero from '@/components/course/CourseHero';
import CourseModulesSection from '@/components/course/CourseModulesSection';
import CourseMarketingSections from '@/components/course/CourseMarketingSections';
import type { ResumeTarget } from '@/components/course/types';

type PublicCourse = NonNullable<CourseQuery['course']>;
type CourseModule = ModulesForCourseQuery['modulesForCourse'][number];

export default function CourseDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const courseId = params.id as string;

  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [resumeTarget, setResumeTarget] = useState<ResumeTarget | null>(null);
  const [moduleCompletion, setModuleCompletion] = useState<Record<string, { done: number; total: number }> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [{ course: fetchedCourse }, { modulesForCourse: fetchedModules }] = await Promise.all([
        GraphQLClient.execute<CourseQuery>(courseQuery, { id: courseId }),
        GraphQLClient.execute<ModulesForCourseQuery>(modulesForCourse, { courseId }),
      ]);
      if (!fetchedCourse) {
        setError('not-found');
      } else {
        setCourse(fetchedCourse);
        setModules([...fetchedModules].sort((a, b) => a.order - b.order));
      }
    } catch (err) {
      console.error('[CourseDetailPage] load failed ->', err);
      setError(err instanceof Error ? err.message : 'Something went wrong loading this course.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Best-effort, separate from the main load — an unauthenticated visitor
  // (browsing is public, unlike this query) just never gets progress, no
  // error shown for that expected case.
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { myCourseProgress: fetched } = await GraphQLClient.execute<MyCourseProgressQuery>(
          myCourseProgressQuery,
          { courseId } satisfies MyCourseProgressQueryVariables
        );
        setProgress(fetched);
      } catch (err) {
        console.error('[CourseDetailPage] progress load failed ->', err);
      }
    })();
  }, [user, courseId]);

  // Only for a learner who has actually started — walks every module's
  // lessons in order (same per-module fetches the studio/lesson-viewer
  // already make) to find the first not-yet-completed one, or the last
  // lesson if the course is fully done, plus a per-module completion count.
  // Skipped entirely for anonymous visitors and fresh learners so their page
  // load doesn't pay for N extra queries they get no benefit from — that
  // same "has started" condition is also what gates the marketing sections
  // below, so a learner still deciding whether to enroll never pays for it.
  const hasStarted = !!progress && progress.completedLessonIds.length > 0;
  useEffect(() => {
    if (!hasStarted || modules.length === 0 || !progress) return;
    let cancelled = false;
    (async () => {
      try {
        const completed = new Set(progress.completedLessonIds);
        const withLessons = await Promise.all(
          modules.map(async (mod) => {
            const { lessonsForModule: lessons } = await GraphQLClient.execute<LessonsForModuleQuery>(
              lessonsForModule,
              { moduleId: mod.moduleId, courseId }
            );
            return { moduleId: mod.moduleId, lessons: [...lessons].sort((a, b) => a.order - b.order) };
          })
        );
        if (cancelled) return;
        let target: ResumeTarget | null = null;
        let foundIncomplete = false;
        const completionMap: Record<string, { done: number; total: number }> = {};
        for (const mod of withLessons) {
          const done = mod.lessons.filter((l) => completed.has(l.lessonId)).length;
          completionMap[mod.moduleId] = { done, total: mod.lessons.length };

          if (foundIncomplete) continue;
          const nextIncomplete = mod.lessons.find((l) => !completed.has(l.lessonId));
          if (nextIncomplete) {
            target = { moduleId: mod.moduleId, lessonId: nextIncomplete.lessonId, title: nextIncomplete.title };
            foundIncomplete = true;
            continue;
          }
          const last = mod.lessons[mod.lessons.length - 1];
          if (last) target = { moduleId: mod.moduleId, lessonId: last.lessonId, title: last.title };
        }
        setResumeTarget(target);
        setModuleCompletion(completionMap);
      } catch (err) {
        console.error('[CourseDetailPage] resume target load failed ->', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasStarted, progress, modules, courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-500 mb-3">
            {error === 'not-found' ? "This course doesn't exist, or isn't published." : error || 'Something went wrong.'}
          </p>
          <Link href="/courses" className="text-sm text-indigo-600 font-bold">Browse courses &rarr;</Link>
        </div>
      </main>
    );
  }

  const theme = getCategoryTheme(course.category ?? '');
  const instructorName = instructorDisplayName(course);

  return (
    <main className="bg-white">
      <CourseHero
        course={course}
        modules={modules}
        theme={theme}
        instructorName={instructorName}
        progress={progress}
        resumeTarget={resumeTarget}
      />
      <CourseModulesSection
        courseId={course.id}
        modules={modules}
        theme={theme}
        progress={progress}
        moduleCompletion={moduleCompletion}
      />
      {!hasStarted && (
        <CourseMarketingSections courseId={course.id} theme={theme} resumeTarget={resumeTarget} />
      )}
    </main>
  );
}
