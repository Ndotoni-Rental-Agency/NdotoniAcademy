'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, BookOpen, Clock, Users, ChevronRight,
  GraduationCap, Hash, Languages, FlaskConical,
} from 'lucide-react';
import { getCourseListItems, programs } from '@/lib/education-mock-data';

const categoryIcons: Record<string, React.ReactNode> = {
  mathematics:       <Hash className="w-5 h-5" />,
  language:          <Languages className="w-5 h-5" />,
  science:           <FlaskConical className="w-5 h-5" />,
  kiswahili:         <Languages className="w-5 h-5" />,
  english:           <Languages className="w-5 h-5" />,
  'primary-education': <GraduationCap className="w-5 h-5" />,
};

export default function LearnIndexPage() {
  const [query, setQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('all');

  const allItems = getCourseListItems();
  const filtered = allItems.filter(item => {
    const matchQ = !query ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(query.toLowerCase());
    const matchP = programFilter === 'all' || item.programId === programFilter;
    return matchQ && matchP;
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-700 to-indigo-500 text-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white/70 uppercase tracking-wide">Ndotoni Academy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Jifunze Tanzania</h1>
          <p className="text-indigo-200 mb-8 max-w-xl">
            Masomo ya msingi, sekondari, na zaidi — yamepangwa vizuri, na nyenzo za aina mbalimbali.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
            <input
              type="text"
              placeholder="Tafuta kozi..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Program filter */}
      <section className="border-b border-ink-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setProgramFilter('all')}
              className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                programFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              }`}
            >
              Wote
            </button>
            {programs.map(p => (
              <button
                key={p.id}
                onClick={() => setProgramFilter(p.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                  programFilter === p.id ? 'bg-indigo-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Course grid */}
      <section className="py-10 sm:py-14 bg-ink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-ink-400 mb-6">{filtered.length} kozi zinapatikana</p>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-ink-400">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>Hakuna kozi zinazolingana na utafutaji wako.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/learn/${item.id}`}
                    className="block bg-white rounded-2xl border border-ink-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all group h-full"
                  >
                    {/* Color band */}
                    <div
                      className="h-28 flex items-center justify-center relative"
                      style={{ background: item.color ?? '#4F46E5' }}
                    >
                      <div className="text-white/20">
                        {categoryIcons[item.tags[0]?.slug ?? ''] ?? <BookOpen className="w-10 h-10" />}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-white/20 text-white px-2.5 py-1 rounded-full">
                          {item.levelTitle}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-white/20 text-white px-2.5 py-1 rounded-full">
                          {item.tags[0]?.label ?? ''}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-[11px] text-ink-400 mb-1">{item.programTitle}</p>
                      <h3 className="font-bold text-ink-900 leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-ink-500 line-clamp-2 mb-4">{item.shortDescription}</p>

                      <div className="flex items-center gap-3 text-xs text-ink-400 mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> {item.moduleCount} moduli
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.estimatedDuration}
                        </span>
                        {item.enrolledCount && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {item.enrolledCount.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                        {item.instructor && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                              style={{ background: item.color ?? '#4F46E5' }}>
                              {item.instructor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="text-xs text-ink-500 truncate max-w-[100px]">{item.instructor.name}</span>
                          </div>
                        )}
                        <span className="ml-auto flex items-center gap-1 text-xs font-semibold"
                          style={{ color: item.color ?? '#4F46E5' }}>
                          Angalia <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
