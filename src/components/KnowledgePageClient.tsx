'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import FeaturedBanner from '@/components/FeaturedBanner';
import { articles } from '@/lib/knowledge-mock-data';

const categories = ['All', 'Productivity', 'Research', 'Career', 'Tips', 'Teaching'];

export default function KnowledgePageClient() {
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
            <Link href={`/knowledge/${featured.id}`} className="block">
              <FeaturedBanner
                eyebrow={featured.category}
                title={featured.title}
                description={featured.excerpt}
                meta={
                  <>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.readTime}</span>
                    <span>{featured.date}</span>
                  </>
                }
              />
            </Link>
          </div>
        </section>
      )}

      {/* Article list */}
      <section className="bg-ink-50 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(active === 'All' ? rest : filtered).map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/knowledge/${article.id}`}
                  className="block bg-white rounded-2xl border-2 border-ink-100 p-6 group hover:border-indigo-200 hover:shadow-sm transition-all h-full"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">{article.category}</span>
                    <span className="text-[11px] text-ink-400">{article.date}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-ink-900 mb-2 group-hover:underline transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-ink-500 line-clamp-2 mb-3">{article.excerpt}</p>
                  <span className="text-xs text-ink-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
