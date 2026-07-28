'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Megaphone, ArrowRight } from 'lucide-react';

const positions = [
  { id: 1, title: 'Enhancing Public Awareness on Foreign Probate Resealing', summary: 'Resealing is not a secret court ritual — it is a public process that citizens deserve to understand.', status: 'Active' },
  { id: 2, title: 'Transparent Land Compensation Standards', summary: 'Advocating for standardized, fair, and prompt compensation methods during compulsory acquisition.', status: 'Active' },
  { id: 3, title: 'Digital Land Registry Modernization', summary: 'Supporting the transition from paper-based to digital land registration to reduce disputes and fraud.', status: 'Active' },
];

export default function AdvocacyPage() {
  return (
    <main className="min-h-screen pt-16">
      <section className="relative border-b border-white/5 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">Making a difference</p>
            <h1 className="text-3xl font-bold text-white mb-3">Advocacy & Policy</h1>
            <p className="text-ink-400 max-w-2xl">We advocate for transparent land governance, equitable access, and professional standards across Tanzania.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mission banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card !border-brand-500/20 bg-gradient-to-r from-brand-600/10 to-brand-500/5 p-8 mb-10"
        >
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-3">Our Advocacy Mission</h2>
            <p className="text-sm text-ink-300 leading-relaxed">
              We use evidence, dialogue, and collaboration to influence policy decisions that affect land rights and sustainable development in Tanzania. Our positions are informed by research, member expertise, and alignment with international best practices.
            </p>
          </div>
        </motion.div>

        {/* Positions */}
        <h2 className="text-lg font-bold text-white mb-4">Current Positions</h2>
        <div className="space-y-4 mb-10">
          {positions.map((pos, i) => (
            <motion.div
              key={pos.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card-hover p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-500/20">
                  <Megaphone className="w-5 h-5 text-brand-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded border border-brand-400/20">
                      {pos.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mb-1.5">{pos.title}</h3>
                  <p className="text-sm text-ink-400 leading-relaxed">{pos.summary}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card p-8 text-center">
          <h3 className="font-bold text-white mb-2">Want to contribute?</h3>
          <p className="text-sm text-ink-400 mb-5 max-w-md mx-auto">
            Members can propose advocacy positions, participate in working groups, and contribute research.
          </p>
          <Link href="/login" className="btn-primary inline-flex items-center gap-2">
            Join as a Member <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
