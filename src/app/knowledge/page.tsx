'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';

const articles = [
  { id: 1, title: 'How to Build a Learning Habit That Sticks', excerpt: 'Small consistent actions beat intense bursts. Here is how to make learning part of your routine.', category: 'Productivity', date: 'July 2026', readTime: '4 min' },
  { id: 2, title: 'The Case for Microlearning in Professional Development', excerpt: 'Why 15-minute modules outperform hour-long lectures for skill retention.', category: 'Research', date: 'June 2026', readTime: '6 min' },
  { id: 3, title: 'Certificates That Employers Actually Value', excerpt: 'What makes a credential worth putting on your CV and how to choose wisely.', category: 'Career', date: 'June 2026', readTime: '5 min' },
  { id: 4, title: 'From Passive Watching to Active Learning', excerpt: 'Techniques to get more out of video lessons and retain what you study.', category: 'Tips', date: 'May 2026', readTime: '3 min' },
  { id: 5, title: 'Teaching Online: What Great Instructors Do Differently', excerpt: 'Patterns from top-rated courses on engagement, structure, and clarity.', category: 'Teaching', date: 'May 2026', readTime: '5 min' },
];

const categories = ['All', 'Productivity', 'Research', 'Career', 'Tips', 'Teaching'];

export default function KnowledgePage() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? articles : articles.filter(a => a.category === active);
  const featured = articles[0];
  const rest = filtered.filter(a => a.id !== featured.id || active !== 'All');

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white pt-8 pb-6 sm:pt-12 sm:pb-8 border-b border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 mb-1">Knowledge</h1>
            <p className="text-ink-500">Ideas, research, and tips for learners and instructors.</p>
          </motion.div>

          <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all ${
                  active === cat ? 'bg-indigo-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured article */}
      {active === 'All' && (
        <section className="bg-white py-8 sm:py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-indigo-600 p-7 sm:p-9 text-white cursor-pointer group"
            >
              <span className="text-[11px] font-bold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">
                {featured.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-4 mb-2 leading-tight group-hover:underline decoration-2 underline-offset-4">
                {featured.title}
              </h2>
              <p className="text-indigo-100 mb-4 max-w-lg">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-indigo-200">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.readTime}</span>
                <span>{featured.date}</span>
              </div>
            </motion.article>
          </div>
        </section>
      )}

      {/* Article list */}
      <section className="bg-ink-50 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(active === 'All' ? rest : filtered).map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-ink-200 p-6 cursor-pointer group hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">{article.category}</span>
                  <span className="text-[11px] text-ink-400">{article.date}</span>
                </div>
                <h3 className="text-[15px] font-bold text-ink-900 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-ink-500 line-clamp-2 mb-3">{article.excerpt}</p>
                <span className="text-xs text-ink-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
