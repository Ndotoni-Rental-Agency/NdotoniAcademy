'use client';

import Link from 'next/link';
import { BookOpen, Award, Zap, Download } from 'lucide-react';
import { mockUser, courses, getCourse } from '@/lib/mock-data';
import { getCategoryTheme } from '@/lib/category-theme';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import CourseCard from '@/components/CourseCard';

export default function DashboardPage() {
  const user = mockUser;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-ink-900">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-500 mt-1">Pick up where you left off.</p>
      </div>

      {/* Bold stat tiles */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
        <div className="rounded-2xl bg-indigo-600 text-white p-4 sm:p-5">
          <BookOpen className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{user.enrolledCourses.length}</p>
          <p className="text-xs text-white/80 mt-1">Enrolled</p>
        </div>
        <div className="rounded-2xl bg-warm-600 text-white p-4 sm:p-5">
          <Award className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">{user.certificates.length}</p>
          <p className="text-xs text-white/80 mt-1">Certificates</p>
        </div>
        <div className="rounded-2xl bg-brand-600 text-white p-4 sm:p-5">
          <Zap className="w-5 h-5 text-white/70 mb-3" />
          <p className="text-2xl sm:text-3xl font-extrabold leading-none">
            {user.pointsEarned}<span className="text-sm font-semibold text-white/60">/{user.pointsTarget}</span>
          </p>
          <p className="text-xs text-white/80 mt-1">Points</p>
        </div>
      </div>

      {/* Continue learning: bold colored cards */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Continue learning</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {user.enrolledCourses.map((enrolled) => (
            <EnrolledCourseCard key={enrolled.courseId} enrolled={enrolled} course={getCourse(enrolled.courseId)} />
          ))}
        </div>
      </section>

      {/* Certificates: colored cards */}
      {user.certificates.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Certificates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {user.certificates.map((cert) => {
              const theme = getCategoryTheme(courses.find((c) => c.title === cert.courseTitle)?.category ?? '');
              return (
                <div key={cert.id} className={`flex items-center gap-4 rounded-2xl border-2 ${theme.border} p-4`}>
                  <div className={`w-12 h-12 rounded-xl ${theme.solidBg} flex items-center justify-center flex-shrink-0`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink-900 truncate">{cert.courseTitle}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      Score: {cert.score}% · {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/certificates"
                    className={`flex items-center gap-1 text-xs font-bold ${theme.solidText} flex-shrink-0`}
                  >
                    <Download className="w-3.5 h-3.5" /> View
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Explore: full CourseCard grid */}
      <section>
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
