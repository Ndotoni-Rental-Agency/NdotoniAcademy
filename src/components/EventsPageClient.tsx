'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Check } from 'lucide-react';
import FeaturedBanner from '@/components/FeaturedBanner';

const events = [
  { id: 1, title: 'Building Effective Online Courses', type: 'Webinar', date: 'August 5, 2026', time: '2:00 PM EAT', month: 'Aug', day: '5', featured: true },
  { id: 2, title: 'Microlearning Workshop for Instructors', type: 'Workshop', date: 'August 18, 2026', time: '10:00 AM EAT', month: 'Aug', day: '18', featured: false },
  { id: 3, title: 'Q&A: Making the Most of Your Certificate', type: 'Live Q&A', date: 'September 2, 2026', time: '3:00 PM EAT', month: 'Sep', day: '2', featured: false },
  { id: 4, title: 'Instructor Meet & Greet', type: 'Networking', date: 'September 15, 2026', time: '5:00 PM EAT', month: 'Sep', day: '15', featured: false },
];

export default function EventsPageClient() {
  const featured = events.find(e => e.featured);
  const upcoming = events.filter(e => !e.featured);
  const [registered, setRegistered] = useState<number[]>([]);

  function register(id: number) {
    setRegistered((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white pt-8 pb-6 sm:pt-12 sm:pb-8 border-b border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-semibold text-ink-900 mb-1">Events</h1>
            <p className="text-ink-500">Webinars, workshops, and live sessions for the community.</p>
          </motion.div>
        </div>
      </section>

      {/* Featured event */}
      {featured && (
        <section className="bg-white py-8 sm:py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedBanner
              eyebrow="Next event"
              eyebrowSecondary={featured.type}
              title={featured.title}
              meta={
                <>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {featured.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {featured.time}</span>
                  <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> Online</span>
                </>
              }
              action={
                <button
                  onClick={() => register(featured.id)}
                  disabled={registered.includes(featured.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-indigo-700 hover:bg-white/90 transition-colors disabled:opacity-70 disabled:cursor-default"
                >
                  {registered.includes(featured.id) ? (<><Check className="w-4 h-4" /> Registered</>) : 'Register free'}
                </button>
              }
            />
          </div>
        </section>
      )}

      {/* Upcoming list */}
      <section className="bg-ink-50 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-ink-900 mb-6">Upcoming</h2>

          <div className="space-y-4">
            {upcoming.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-5 bg-white rounded-2xl border-2 border-ink-100 p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                {/* Date block */}
                <div className="w-14 h-14 rounded-xl bg-indigo-50 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase text-indigo-700">{event.month}</span>
                  <span className="text-xl font-extrabold leading-none text-indigo-700">{event.day}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-ink-900 text-sm">{event.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ink-400">
                    <span>{event.type}</span>
                    <span>{event.time}</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => register(event.id)}
                  disabled={registered.includes(event.id)}
                  className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors flex-shrink-0 disabled:text-green-600 disabled:hover:bg-transparent"
                >
                  {registered.includes(event.id) ? (<><Check className="w-4 h-4" /> Registered</>) : 'Register'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
