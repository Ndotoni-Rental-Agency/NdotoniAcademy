'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Award, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-indigo-600 text-white py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
              Education should be<br />accessible to everyone.
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Ndotoni Academy connects experts who want to teach with people who want to grow. One module at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, title: 'Expert-led', desc: 'Courses built by working professionals with real experience.' },
              { icon: Zap, title: 'Bite-sized', desc: 'Short modules you can finish in one sitting. No marathon lectures.' },
              { icon: Award, title: 'Verified', desc: 'Certificates that are shareable and employer-recognized.' },
              { icon: Users, title: 'Open', desc: 'Module 1 is always free. No bait. No hidden costs.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-ink-900 mb-1">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-ink-50 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-extrabold text-ink-900 mb-3">Our mission</h2>
              <p className="text-ink-600 leading-relaxed">
                Make professional education accessible, practical, and recognized. We connect learners with expert instructors through short, focused courses that fit into real life.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-extrabold text-ink-900 mb-3">Our vision</h2>
              <p className="text-ink-600 leading-relaxed">
                A world where anyone can build skills, earn proof of their expertise, and open new doors. No matter where they started.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-extrabold text-ink-900 mb-6">What makes us different</h2>
            <div className="space-y-4">
              {[
                'Courses are built by working professionals.',
                'Every module has video, reading, and a quiz.',
                'Certificates are verifiable and shareable.',
                'Module 1 is always free. No credit card needed.',
                'Instructors keep full control of their content.',
                'Built for working adults who value their time.',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-ink-700">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-100 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-5">Join us</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/courses" className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-7 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              Start learning
            </Link>
            <Link href="/login" className="inline-flex items-center gap-1.5 justify-center rounded-full border-2 border-ink-200 px-7 py-3 text-sm font-bold text-ink-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
              Become an instructor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
