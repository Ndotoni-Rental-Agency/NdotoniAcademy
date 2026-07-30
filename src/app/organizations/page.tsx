'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, BookOpen, BarChart3 } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import OrgPreviewPanel from '@/components/OrgPreviewPanel';
import { mockOrganization, mockTeamMembers, roleDescriptions } from '@/lib/organization-mock-data';
import { courses } from '@/lib/mock-data';

const halima = mockTeamMembers.find((m) => m.id === 'tm-2')!;
const halimaCourse = courses.find((c) => c.id === halima.assignedCourseIds[1]);

export default function OrganizationsPage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero: plain white, concrete visual instead of a color band */}
      <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3">For organizations</p>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-ink-900 leading-[1.05] tracking-tight mb-4">
                Training that scales with your team.
              </h1>
              <p className="text-lg text-ink-500 leading-relaxed mb-6 max-w-md">
                Invite employees, assign courses, and see exactly who&apos;s finished what, all from one dashboard.
              </p>
              <button
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 mb-10"
              >
                Create your organization <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-5">
                {[
                  { icon: Mail, title: 'Invite by email', desc: 'They show up as pending until they accept. No account setup on your end.' },
                  { icon: BookOpen, title: 'Assign in one action', desc: 'Pick a course and a person, or the whole team, and it is done.' },
                  { icon: BarChart3, title: 'See progress without asking', desc: 'Who is assigned, who has started, who has finished: always visible.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{item.title}</p>
                      <p className="text-sm text-ink-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-3 text-center lg:text-left">
                {mockOrganization.name}&apos;s actual team page
              </p>
              <OrgPreviewPanel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Concrete walkthrough using the same example org */}
      <section className="bg-ink-50 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 text-center mb-12">What a rollout actually looks like</h2>
          <div className="space-y-6">
            {[
              {
                num: '1',
                title: `Create ${mockOrganization.name}`,
                desc: `Register as a ${mockOrganization.type.toLowerCase()} and you're the owner, with full control over settings, billing, and roles from day one.`,
              },
              {
                num: '2',
                title: 'Invite Halima as an admin',
                desc: 'She can invite the rest of the team and assign training, without needing owner access to do it.',
              },
              {
                num: '3',
                title: `Assign ${halimaCourse?.title ?? 'a course'} to Halima`,
                desc: `Her dashboard shows it immediately. Yours shows her progress the moment she starts, with no status meeting required.`,
              },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start bg-white rounded-2xl border-2 border-ink-100 p-5"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-bold text-ink-900">{item.title}</h3>
                  <p className="text-sm text-ink-500 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role breakdown */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-8 text-center">Four roles. No ambiguity about who can do what.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {roleDescriptions.map((r) => (
              <div key={r.role} className="rounded-2xl border-2 border-ink-100 p-5">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md mb-2">
                  {r.label}
                </span>
                <p className="text-sm text-ink-600 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-100 py-14 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-ink-900 mb-5">Bring your team to Ndotoni Academy</h2>
          <button
            onClick={() => setAuthOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Create your organization <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode="signup" />
    </main>
  );
}
