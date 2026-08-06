import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, Zap } from 'lucide-react';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'About',
  description: 'Ndotoni Academy connects experts who want to teach with people who want to grow. Learn about our mission, our values, and what makes our courses different.',
};

const values = [
  { icon: BookOpen, title: 'Expert-led', desc: 'Courses built by working professionals with real experience.' },
  { icon: Zap, title: 'Bite-sized', desc: 'Short modules you can finish in one sitting. No marathon lectures.' },
  { icon: Award, title: 'Verified', desc: 'Certificates that are shareable and employer-recognized.' },
  { icon: Users, title: 'Open', desc: 'Module 1 is always free. No bait. No hidden costs.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal y={16} mode="mount">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink-900 leading-[1.1] tracking-tight mb-5">
              Education should be <span className="text-indigo-600">accessible</span> to everyone.
            </h1>
            <p className="text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed">
              Ndotoni Academy connects experts who want to teach with people who want to grow. One module at a time.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, i) => (
              <Reveal key={item.title} y={12} delay={i * 0.08} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-ink-900 mb-1">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-ink-50 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Reveal y={12}>
              <h2 className="text-2xl font-serif font-semibold text-ink-900 mb-3">Our mission</h2>
              <p className="text-ink-600 leading-relaxed">
                Make professional education accessible, practical, and recognized. We connect learners with expert instructors through short, focused courses that fit into real life.
              </p>
            </Reveal>
            <Reveal y={12} delay={0.1}>
              <h2 className="text-2xl font-serif font-semibold text-ink-900 mb-3">Our vision</h2>
              <p className="text-ink-600 leading-relaxed">
                A world where anyone can build skills, earn proof of their expertise, and open new doors. No matter where they started.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal y={12}>
            <h2 className="text-2xl font-serif font-semibold text-ink-900 mb-6">What makes us different</h2>
            <div className="space-y-4">
              {[
                'Courses are built by working professionals.',
                'Every module has video, reading, and a quiz.',
                'Certificates are verifiable and shareable.',
                'Module 1 is always free. No credit card needed.',
                'Instructors keep full control of their content.',
                'Built for working adults who value their time.',
              ].map((item, i) => (
                <Reveal key={i} x={-8} delay={i * 0.05} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-ink-700">{item}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-100 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-serif font-semibold text-ink-900 mb-5">Join us</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/courses" className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-7 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              Start learning
            </Link>
            <Link
              href="/instructors"
              className="inline-flex items-center gap-1.5 justify-center rounded-full border-2 border-ink-200 px-7 py-3 text-sm font-bold text-ink-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              Become an instructor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
