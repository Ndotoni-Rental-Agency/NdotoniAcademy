'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Users } from 'lucide-react';

const events = [
  { id: 1, title: 'Building Effective Online Courses', type: 'Webinar', date: 'August 5, 2026', time: '2:00 PM EAT', month: 'Aug', day: '5', featured: true },
  { id: 2, title: 'Microlearning Workshop for Instructors', type: 'Workshop', date: 'August 18, 2026', time: '10:00 AM EAT', month: 'Aug', day: '18', featured: false },
  { id: 3, title: 'Q&A: Making the Most of Your Certificate', type: 'Live Q&A', date: 'September 2, 2026', time: '3:00 PM EAT', month: 'Sep', day: '2', featured: false },
  { id: 4, title: 'Instructor Meet & Greet', type: 'Networking', date: 'September 15, 2026', time: '5:00 PM EAT', month: 'Sep', day: '15', featured: false },
];

export default function EventsPage() {
  const featured = events.find(e => e.featured);
  const upcoming = events.filter(e => !e.featured);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-white pt-8 pb-6 sm:pt-12 sm:pb-8 border-b border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 mb-1">Events</h1>
            <p className="text-ink-500">Webinars, workshops, and live sessions for the community.</p>
          </motion.div>
        </div>
      </section>

      {/* Featured event */}
      {featured && (
        <section className="bg-white py-8 sm:py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-indigo-600 overflow-hidden"
            >
              <div className="p-7 sm:p-9 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">
                    Next event
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wide bg-white/10 px-3 py-1 rounded-full">
                    {featured.type}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-tight">{featured.title}</h2>
                <div className="flex flex-wrap gap-5 text-sm text-indigo-200 mb-6">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {featured.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {featured.time}</span>
                  <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> Online</span>
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors">
                  Register free
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Upcoming list */}
      <section className="bg-ink-50 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-extrabold text-ink-900 mb-6">Upcoming</h2>

          <div className="space-y-4">
            {upcoming.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-5 bg-white rounded-2xl border border-ink-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                {/* Date block */}
                <div className="w-14 h-14 rounded-xl bg-indigo-50 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">{event.month}</span>
                  <span className="text-xl font-extrabold text-indigo-700 leading-none">{event.day}</span>
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
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors flex-shrink-0">
                  Register
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
