'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, BookOpen, ArrowRight, Award, Loader2, User } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { publicCourses as publicCoursesQuery } from '@/graphql/queries';
import { instructorDisplayName } from '@/lib/course-display';
import type { PublicCoursesQuery } from '@/API';
import PublicCourseCard, { type PublicCourse } from '@/components/PublicCourseCard';

const categories = ['All', 'Project Management', 'Marketing', 'Design', 'Technology'];

export default function CoursesPageClient() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const { publicCourses } = await GraphQLClient.execute<PublicCoursesQuery>(publicCoursesQuery);
        setCourses(publicCourses);
      } catch (err) {
        console.error('[CoursesPageClient] fetchPublicCourses failed ->', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featuredCourse = courses[0];
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero header */}
      <section className="bg-white pt-8 pb-6 sm:pt-12 sm:pb-8 border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900 mb-1">Explore courses</h1>
            <p className="text-ink-500">Find your next skill.</p>
          </motion.div>

          {/* Search + filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-ink-200 text-sm text-ink-900 placeholder:text-ink-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Featured course */}
          {featuredCourse && (
            <section className="bg-white py-8 sm:py-10">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href={`/courses/${featuredCourse.id}`}
                    className="block rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Left content */}
                      <div className="flex-1 p-7 sm:p-10 text-white">
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full mb-4">
                          Featured
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-3 leading-tight">{featuredCourse.title}</h2>
                        {featuredCourse.description && (
                          <p className="text-indigo-100 mb-5 leading-relaxed line-clamp-2">{featuredCourse.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-200 mb-6">
                          {instructorDisplayName(featuredCourse) && (
                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {instructorDisplayName(featuredCourse)}</span>
                          )}
                          <span className="font-bold text-white">TZS {featuredCourse.priceTzs.toLocaleString()}</span>
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                          View course <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                      {/* Right visual */}
                      <div className="hidden md:flex items-center justify-center w-72 bg-white/10">
                        <BookOpen className="w-16 h-16 text-white/30" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </section>
          )}

          {/* All courses grid */}
          <section className="bg-ink-50 py-10 sm:py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-serif font-semibold text-ink-900 mb-6">All courses</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <PublicCourseCard course={course} />
                  </motion.div>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <p className="text-center text-ink-400 py-16">
                  {courses.length === 0 ? 'No courses published yet.' : 'No courses match your search.'}
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Bottom CTA */}
      <section className="bg-white border-t border-ink-100 py-12 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-ink-900">Want to teach?</h2>
          </div>
          <p className="text-ink-500 mb-6 max-w-md mx-auto">Share your expertise. Create a course, reach learners, and earn from your knowledge.</p>
          <Link
            href="/instructors"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            Become an instructor <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
