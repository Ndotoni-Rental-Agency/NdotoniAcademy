'use client';

import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Award } from 'lucide-react';
import { mockUser, courses } from '@/lib/mock-data';

export default function DashboardPage() {
  const user = mockUser;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-ink-900">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-500 mt-1">Pick up where you left off.</p>
      </div>

      {/* Quick stats — inline, no cards */}
      <div className="flex items-center gap-8 mb-10 pb-8 border-b border-ink-100">
        <div>
          <p className="text-3xl font-extrabold text-ink-900">{user.enrolledCourses.length}</p>
          <p className="text-xs text-ink-500 mt-0.5">Enrolled</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-ink-900">{user.certificates.length}</p>
          <p className="text-xs text-ink-500 mt-0.5">Certificates</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-indigo-600">{user.cpdPointsEarned}</p>
          <p className="text-xs text-ink-500 mt-0.5">CPD Points</p>
        </div>
      </div>

      {/* Continue Learning — these get cards because they're interactive */}
      <section className="mb-10">
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Continue learning</h2>
        <div className="space-y-3">
          {user.enrolledCourses.map((enrolled) => (
            <Link
              key={enrolled.courseId}
              href={`/courses/${enrolled.courseId}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-ink-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
            >
              {/* Progress ring */}
              <div className="relative w-11 h-11 flex-shrink-0">
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="14" fill="none"
                    stroke="#4f46e5" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${enrolled.progress * 0.88} 88`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink-700">
                  {enrolled.progress}%
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                  {enrolled.courseTitle}
                </h3>
                <p className="text-xs text-ink-400 mt-0.5">
                  Module {enrolled.currentModule} of {enrolled.totalModules}
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* Certificates — simple rows, no card wrapping */}
      {user.certificates.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Certificates</h2>
          {user.certificates.map((cert) => (
            <div key={cert.id} className="flex items-center gap-3 py-3">
              <Award className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">{cert.courseTitle}</p>
                <p className="text-xs text-ink-400">
                  Score: {cert.score}% · {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
              <button className="text-xs font-bold text-indigo-600">View</button>
            </div>
          ))}
        </section>
      )}

      {/* Explore — flat list, no cards */}
      <section>
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-4">Explore</h2>
        <div className="divide-y divide-ink-100">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="flex items-center gap-4 py-4 group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-ink-900 group-hover:text-indigo-600 transition-colors truncate">{course.title}</h3>
                <p className="text-xs text-ink-400">{course.modules.length} modules · {course.duration}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
