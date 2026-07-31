import type { Metadata } from 'next';
import { ArrowRight, Mail, BookOpen, BarChart3 } from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import Reveal from '@/components/Reveal';
import OrgPreviewPanel from '@/components/OrgPreviewPanel';
import TeamProgressPreview from '@/components/TeamProgressPreview';
import CertificatePreview from '@/components/CertificatePreview';
import CourseCreatorPreview from '@/components/CourseCreatorPreview';
import CourseCard from '@/components/CourseCard';
import { mockOrganization, mockTeamMembers, roleDescriptions } from '@/lib/organization-mock-data';
import { courses } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'For Organizations',
  description: 'Invite employees, assign courses, and track completion across your team, all from one dashboard. Build private training or publish courses to the public catalog.',
};

const halima = mockTeamMembers.find((m) => m.id === 'tm-2')!;
const halimaCourse = courses.find((c) => c.id === halima.assignedCourseIds[1]);
const featuredCourse = courses.find((c) => c.id === 'project-management')!;

export default function OrganizationsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero: plain white, concrete visual instead of a color band */}
      <section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={16} mode="mount">
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3">For organizations</p>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-ink-900 leading-[1.05] tracking-tight mb-4">
                Training that scales with your team.
              </h1>
              <p className="text-lg text-ink-500 leading-relaxed mb-6 max-w-md">
                Invite employees, assign courses, and see exactly who&apos;s finished what, all from one dashboard.
              </p>
              <AuthButton
                mode="signup"
                accountType="organization"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 mb-8"
              >
                Create your organization <ArrowRight className="w-4 h-4" />
              </AuthButton>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Mail, label: 'Email invites' },
                  { icon: BookOpen, label: 'One-click assign' },
                  { icon: BarChart3, label: 'Live progress' },
                ].map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5">
                    <item.icon className="w-3.5 h-3.5" /> {item.label}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal y={16} delay={0.1} mode="mount">
              <p className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-3 text-center lg:text-left">
                {mockOrganization.name}&apos;s actual team page
              </p>
              <OrgPreviewPanel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Course catalog */}
      <section className="border-t border-ink-100 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900">Training ready to assign today</h2>
            <p className="text-ink-500 mt-2">Real courses your team can start the moment they accept an invite.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course, i) => (
              <Reveal key={course.id} y={12} delay={i * 0.06}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Build your own courses */}
      <section className="border-t border-ink-100 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={12} className="order-first lg:order-last">
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3">Your training, your rules</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-4 leading-tight">
                Don&apos;t see what your team needs? Build it.
              </h2>
              <p className="text-ink-500 leading-relaxed max-w-md">
                Your instructors can create courses specific to your organization, kept completely private. Or publish them to the public catalog and set a price, so any learner on Ndotoni Academy can take it too.
              </p>
            </Reveal>
            <Reveal y={12} delay={0.1}>
              <CourseCreatorPreview />
            </Reveal>
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
                title: 'Register your organization',
                desc: `We'll use ${mockOrganization.name} as the example here. Register as a ${mockOrganization.type.toLowerCase()} and you're the owner, with full control over settings, billing, and roles from day one.`,
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
              <Reveal
                key={item.num}
                x={-12}
                delay={i * 0.1}
                className="flex gap-4 items-start bg-white rounded-2xl border-2 border-ink-100 p-5"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-bold text-ink-900">{item.title}</h3>
                  <p className="text-sm text-ink-500 mt-1">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team progress */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={12}>
              <TeamProgressPreview />
            </Reveal>
            <Reveal y={12} delay={0.1} className="order-first lg:order-last">
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3">Not just assigned. Finished.</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-4 leading-tight">
                See who&apos;s actually making progress
              </h2>
              <p className="text-ink-500 leading-relaxed max-w-md">
                Assigning training is easy. Knowing whether it happened is the part that usually requires chasing people down. Every member&apos;s progress updates live, so you always know where the team stands without asking.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Certificates for compliance */}
      <section className="bg-ink-50 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal y={12}>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3">Proof, not just progress</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-4 leading-tight">
                Every completion earns a real certificate
              </h2>
              <p className="text-ink-500 leading-relaxed max-w-md">
                When someone finishes a course, they get a certificate with their name, score, and a verifiable ID attached to it. Useful for your own training records, not just something to post online.
              </p>
            </Reveal>
            <Reveal y={12} delay={0.1}>
              <CertificatePreview
                courseTitle={featuredCourse.title}
                instructor={featuredCourse.instructor}
                score={88}
                points={featuredCourse.points}
              />
            </Reveal>
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
          <AuthButton
            mode="signup"
            accountType="organization"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Create your organization <ArrowRight className="w-4 h-4" />
          </AuthButton>
        </div>
      </section>
    </main>
  );
}
