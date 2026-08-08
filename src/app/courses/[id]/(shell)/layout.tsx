'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, MessageSquare, ClipboardList, GraduationCap } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { course as courseQuery } from '@/graphql/queries';
import type { CourseQuery } from '@/API';
import { getCategoryTheme } from '@/lib/category-theme';
import { useAuth } from '@/lib/auth-context';
import CourseGuestPrompt from '@/components/CourseGuestPrompt';

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
  const { user, loading: authLoading } = useAuth();
  // Reset per course visited, not per tab switch — this layout stays
  // mounted across Modules/Discussion/Assignments/Exam, so a plain dismissed
  // flag would otherwise survive a jump to a different course entirely.
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);

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
          convention the lesson viewer's own sticky bar already uses. One
          integrated strip — identity + tabs together, not two competing
          rows — with the course title in the serif face this app otherwise
          only spends on certificates, so a course you're actively taking
          reads with the same "this is something earned" register as the
          credential at the end of it. */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur border-b border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 pt-3 pb-2.5">
            <Link
              href="/courses"
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-colors"
              aria-label="All courses"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            {course?.category && (
              <span className={`hidden sm:inline-flex flex-shrink-0 w-1.5 h-1.5 rounded-full ${theme.solidBg}`} />
            )}
            <p className="text-[17px] font-semibold text-ink-900 truncate">{course?.title ?? ' '}</p>
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2.5">
            {TABS.map((tab) => {
              const href = `${basePath}${tab.suffix}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={tab.suffix}
                  href={href}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors flex-shrink-0 ${
                    isActive ? `${theme.softBg} ${theme.solidText}` : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
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
      {course && (
        <CourseGuestPrompt
          open={!authLoading && !user && dismissedFor !== courseId}
          onDismiss={() => setDismissedFor(courseId)}
          courseTitle={course.title}
          priceTzs={course.priceTzs}
          next={basePath}
        />
      )}
    </div>
  );
}
