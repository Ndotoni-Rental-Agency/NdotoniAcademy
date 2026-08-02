import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Sparkles } from 'lucide-react';
import { getCourse, demoEnrolledCourses, demoCertificates } from '@/lib/mock-data';
import { initialTeachingCourses, recentStudentActivity } from '@/lib/teaching-mock-data';
import { INSTRUCTOR_SHARE } from '@/lib/instructor-pricing';
import { type AuthUser } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import EnrolledCourseCard from '@/components/EnrolledCourseCard';
import DashboardStatCard from '@/components/DashboardStatCard';
import Sparkline from '@/components/Sparkline';
import Avatar from '@/components/Avatar';
import { CreateCourseModal } from '@/components/CreateCourseModal';

// ============================================================
// Instructors teach — independently, or as an INSTRUCTOR-role member of an
// organization. Either way, teaching is the headline; any training the org
// has assigned them to complete personally shows up too, but last and small.
// ============================================================
export default function InstructorOverview({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const accent = accentByMode.instructor;
  const membership = user.organizations[0];
  const org = membership?.organization;
  const teachingCourses = initialTeachingCourses;
  const published = teachingCourses.filter((c) => c.status === 'published');
  const drafts = teachingCourses.filter((c) => c.status === 'draft');
  const totalEnrolled = teachingCourses.reduce((sum, c) => sum + c.enrolledCount, 0);
  const estimatedEarnings = Math.round(
    teachingCourses.reduce((sum, c) => sum + c.enrolledCount * c.priceTzs, 0) * INSTRUCTOR_SHARE
  );

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-1.5">Overview</p>

      {/* Hero action — honest about where things actually stand */}
      <div className={`flex items-center gap-4 rounded-2xl border border-ink-200 bg-gradient-to-br ${accent.gradientFrom} to-ink-50 p-5 mb-5`}>
        <div className="w-14 h-14 rounded-full bg-white border border-ink-200 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-coral-600" />
        </div>
        <div className="flex-1 min-w-0">
          {drafts.length > 0 ? (
            <>
              <h2 className="font-bold text-ink-900 truncate">Finish setting up &quot;{drafts[0].title}&quot;</h2>
              <p className="text-xs text-ink-500 mt-0.5">Published courses start showing up in the catalog immediately.</p>
            </>
          ) : (
            <>
              <h2 className="font-bold text-ink-900">Ready for your next course?</h2>
              <p className="text-xs text-ink-500 mt-0.5">Mix video, flashcards, guides, and quizzes into a new one.</p>
            </>
          )}
        </div>
        {drafts.length > 0 ? (
          <Link href="/dashboard/courses" className={`rounded-xl ${accent.bg600} ${accent.bg600Hover} px-4 py-2.5 text-sm font-bold text-white transition-colors flex-shrink-0`}>
            Continue
          </Link>
        ) : (
          <button
            onClick={() => setShowCreateModal(true)}
            className={`rounded-xl ${accent.bg600} ${accent.bg600Hover} px-4 py-2.5 text-sm font-bold text-white transition-colors flex-shrink-0`}
          >
            New course
          </button>
        )}
      </div>

      <CreateCourseModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSaved={(courseId) => {
          setShowCreateModal(false);
          router.push(`/dashboard/courses/${courseId}`);
        }}
      />

      {/* Independent instructor, not yet approved to publish — the approval
          request itself lives in Settings, but it needs to be visible from
          here too, since this is the page an independent instructor
          actually lands on. */}
      {!org && user.instructorStatus !== 'APPROVED' && (
        <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 mb-6">
          <p className="flex-1 text-xs text-ink-500">
            {user.instructorStatus === 'PENDING'
              ? 'Your application to publish independent public courses is pending Ndotoni review.'
              : user.instructorStatus === 'REJECTED'
              ? 'Your instructor application was declined.'
              : 'Publishing a public course under your own name needs a quick Ndotoni approval first.'}
          </p>
          <Link href="/dashboard/settings" className={`text-xs font-bold ${accent.text600} hover:underline flex-shrink-0`}>
            {user.instructorStatus ? 'View status' : 'Apply for approval'}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <DashboardStatCard
          value={totalEnrolled}
          label="Students enrolled"
          sparkline={<Sparkline points={[120, 140, 150, 165, 180, 198, totalEnrolled]} strokeClassName={accent.stroke600} />}
        />
        <DashboardStatCard
          value={`TZS ${(estimatedEarnings / 1000).toFixed(0)}K`}
          trend={{ text: '↑ 18% this month', direction: 'up' }}
        />
        <DashboardStatCard value={published.length} label="Published" />
        <DashboardStatCard value={drafts.length} label="Drafts" />
      </div>

      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2.5">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Your courses</h2>
          <Link href="/dashboard/courses" className={`text-xs font-bold ${accent.text600} hover:underline`}>Manage all</Link>
        </div>
        <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
          {teachingCourses.map((course) => {
            const courseEarnings = Math.round(course.enrolledCount * course.priceTzs * INSTRUCTOR_SHARE);
            return (
              <div key={course.id} className="flex items-center gap-3 py-2.5 px-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{course.title}</p>
                  <p className="text-[11.5px] text-ink-400">
                    {course.status === 'published' ? `${course.enrolledCount} students · ${course.category}` : 'Not published yet'}
                  </p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                  course.status === 'published' ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
                }`}>
                  {course.status}
                </span>
                {course.status === 'published' ? (
                  <>
                    <div className="w-[90px] hidden sm:block">
                      <Sparkline points={[4, 5, 6, 7, 8, 9, Math.max(course.enrolledCount / 15, 4)]} strokeClassName="stroke-brand-600" />
                    </div>
                    <p className="text-[13.5px] font-bold text-brand-600 flex-shrink-0">TZS {(courseEarnings / 1000).toFixed(0)}K</p>
                  </>
                ) : (
                  <Link href="/dashboard/courses" className={`text-xs font-bold ${accent.text600} flex-shrink-0`}>Finish setup</Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {recentStudentActivity.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Recent students</h2>
          <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
            {recentStudentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3.5">
                <Avatar name={activity.studentName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{activity.studentName}</p>
                  <p className="text-[11.5px] text-ink-400 truncate">
                    {activity.action === 'enrolled' ? 'Enrolled in' : 'Completed'} {activity.courseTitle} · {activity.when}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* An instructor is still a learner too — often was one first, and may
          have courses or certificates from before they ever started
          teaching. Present, but deliberately last and small, and in the
          learner accent color, not the instructor one — same mixed-sources
          "Assigned" tagging as the Learner view, not a separate mechanism. */}
      {demoEnrolledCourses.length > 0 && (
        <section className="mb-6">
          <div className="flex items-baseline justify-between mb-2.5">
            <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide">Continue learning</h2>
            <Link href="/dashboard/courses" className="text-xs font-bold text-indigo-600 hover:underline">My learning</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {demoEnrolledCourses.map((enrolled, i) => (
              <EnrolledCourseCard
                key={enrolled.courseId}
                enrolled={enrolled}
                course={getCourse(enrolled.courseId)}
                assignedBy={i === 0 && org ? org.name : undefined}
              />
            ))}
          </div>
        </section>
      )}

      {demoCertificates.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Certificates</h2>
          <div className="rounded-xl border border-ink-200 bg-white divide-y divide-ink-100">
            {demoCertificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-3 py-2.5 px-3.5">
                <div className="w-[30px] h-[30px] rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-3.5 h-3.5 text-warm-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{cert.courseTitle}</p>
                  <p className="text-[11.5px] text-ink-400">
                    Score {cert.score}% · Issued {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <Link href="/dashboard/certificates" className="text-xs font-bold text-indigo-600 flex-shrink-0">Download</Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
