'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, MessageSquare, ClipboardList, GraduationCap } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { course as courseQuery } from '@/graphql/queries';
import type { CourseQuery } from '@/API';
import { getCategoryTheme } from '@/lib/category-theme';

type CourseHeader = NonNullable<CourseQuery['course']>;

// Route group only — doesn't affect the URL. Wraps every course tab (Modules
// at /courses/[id] itself, plus Discussion/Assignments/Exam) with a shared
// identity strip + tab bar, but deliberately does NOT wrap the lesson viewer
// (/courses/[id]/modules/.../lessons/...), which lives outside this group —
// that page is meant to stay an immersive, single-lesson focus, not nested
// inside course-wide tabs.
const TABS = [
  { label: 'Modules', suffix: '', icon: BookOpen },
  { label: 'Discussion', suffix: '/discussion', icon: MessageSquare },
  { label: 'Assignments', suffix: '/assignments', icon: ClipboardList },
  { label: 'Exam', suffix: '/exam', icon: GraduationCap },
];

export default function CourseShellLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const courseId = params.id as string;
  const [course, setCourse] = useState<CourseHeader | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { course: fetched } = await GraphQLClient.execute<CourseQuery>(courseQuery, { id: courseId });
        if (!cancelled) setCourse(fetched ?? null);
      } catch (err) {
        console.error('[CourseShellLayout] course load failed ->', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const theme = getCategoryTheme(course?.category ?? '');
  const basePath = `/courses/${courseId}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Sits below the site's own sticky nav (h-14), same top-14/z-30
          convention the lesson viewer's own sticky bar already uses. */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur border-b border-ink-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-2.5">
            <Link href="/courses" className="flex-shrink-0 text-ink-400 hover:text-indigo-600 transition-colors" aria-label="All courses">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <p className="text-sm font-bold text-ink-900 truncate">{course?.title ?? ' '}</p>
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const href = `${basePath}${tab.suffix}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={tab.suffix}
                  href={href}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2.5 text-xs font-bold border-b-2 transition-colors flex-shrink-0 ${
                    isActive ? `${theme.solidText} border-current` : 'text-ink-400 border-transparent hover:text-ink-700'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
