'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, CheckCircle2, Loader2, Sparkles, XCircle } from 'lucide-react';
import { useAuth, displayName, dashboardModeFor } from '@/lib/auth-context';
import { accentByMode } from '@/lib/dashboard-accent';
import { GraphQLClient } from '@/lib/graphql-client';
import { applyToBeInstructor, requestInstructorRole, updateProfile } from '@/graphql/mutations';
import type {
  ApplyToBeInstructorMutation,
  RequestInstructorRoleMutation,
  RequestInstructorRoleMutationVariables,
  UpdateProfileMutation,
  UpdateProfileMutationVariables,
} from '@/API';
import Avatar from '@/components/Avatar';

export default function SettingsPage() {
  const { user, refetch, signOut, wantsToTeach, setWantsToTeach } = useAuth();
  const router = useRouter();
  const accent = accentByMode[user ? dashboardModeFor(user, wantsToTeach) : 'learner'];
  // DashboardLayout only renders this page once `user` is loaded, so these
  // initial values are never actually stale — but hooks must run
  // unconditionally, so the null case is handled after, not before, them.
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState('');

  if (!user) return null;

  const membership = user.organizations[0];
  const orgName = membership?.organization?.name ?? 'your organization';
  // OWNER/ADMIN manage this directly via Team; an existing INSTRUCTOR
  // already has the role — only a plain MEMBER has anything to request.
  const isPlainMember = membership?.role === 'MEMBER';

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await GraphQLClient.execute<UpdateProfileMutation>(updateProfile, {
        input: { firstName: firstName.trim() || null, lastName: lastName.trim() || null },
      } satisfies UpdateProfileMutationVariables);
      await refetch();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  function handleToggleTeaching() {
    // Purely a dashboard-shell preference — never fires the real
    // instructor-application flow on its own (see handleApply), so
    // toggling back and forth doesn't spam admins with duplicate emails.
    // Deliberately does NOT navigate away: switching on reveals the "Apply
    // for approval" panel right below, on this same page — redirecting
    // immediately (as this used to) meant nobody ever saw it.
    setWantsToTeach(!wantsToTeach);
  }

  async function handleApply() {
    setApplying(true);
    setApplyError('');
    try {
      await GraphQLClient.execute<ApplyToBeInstructorMutation>(applyToBeInstructor);
      await refetch();
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : String(err));
    } finally {
      setApplying(false);
    }
  }

  async function handleRequestInstructor() {
    if (!membership) return;
    setRequesting(true);
    setRequestError('');
    try {
      await GraphQLClient.execute<RequestInstructorRoleMutation>(requestInstructorRole, {
        organizationId: membership.organizationId,
      } satisfies RequestInstructorRoleMutationVariables);
      await refetch();
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : String(err));
    } finally {
      setRequesting(false);
    }
  }

  async function handleSignOut() {
    // Navigate first, then clear auth state — DashboardLayout's own guard
    // effect reacts to `user` going null, so clearing it before we've
    // started leaving /dashboard would redirect to /login instead of home.
    router.push('/');
    await signOut();
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-semibold text-ink-900 mb-1">Settings</h1>
      <p className="text-sm text-ink-500 mb-6">Manage your account.</p>

      <div className="flex items-center gap-3 mb-8">
        <Avatar name={displayName(user)} imageUrl={user.avatarUrl ?? undefined} size="lg" />
        <div>
          <p className="text-sm font-semibold text-ink-900">{displayName(user)}</p>
          <p className="text-xs text-ink-400">{user.email}</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSave}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink-700 mb-1.5">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full rounded-xl border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm text-ink-500 cursor-not-allowed"
          />
          <p className="text-xs text-ink-400 mt-1.5">Email can&apos;t be changed here.</p>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className={`rounded-xl ${accent.bg600} px-5 py-2.5 text-sm font-bold text-white ${accent.bg600Hover} transition-colors disabled:opacity-60`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save changes'}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
              <XCircle className="w-4 h-4" /> {error}
            </span>
          )}
        </div>
      </form>

      {/* Organization */}
      {user.organizations.length === 0 && (
        <div className="mt-12 pt-8 border-t border-ink-100">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Organization</h2>
          <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink-900">Managing a team?</p>
              <p className="text-xs text-ink-500 mt-0.5">
                Create an organization to invite people, assign training, and track their progress. Your individual account stays as it is.
              </p>
            </div>
            <Link
              href="/dashboard/create-organization"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors flex-shrink-0"
            >
              Create
            </Link>
          </div>
        </div>
      )}

      {/* Teaching — two entirely separate paths that deliberately never
          touch each other. No organization: instructor mode is a local
          dashboard preference, and publishing your own public course needs
          Ndotoni's platform-level approval. Inside an organization: only a
          plain MEMBER has anything to request here, and it's purely
          internal to that org — the OWNER decides, and it has nothing to
          do with independent/public-course approval. */}
      {(user.organizations.length === 0 || isPlainMember) && (
        <div className="mt-12 pt-8 border-t border-ink-100">
          <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Teaching</h2>
          {isPlainMember ? (
            <>
              <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4">
                <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-coral-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink-900">
                    {membership?.wantsToBeInstructor ? 'Request sent' : `Want to teach at ${orgName}?`}
                  </p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {membership?.wantsToBeInstructor
                      ? `Waiting on ${orgName}'s owner to approve.`
                      : `Ask ${orgName}'s owner to make you an instructor there — separate from publishing your own independent courses.`}
                  </p>
                </div>
                {!membership?.wantsToBeInstructor && (
                  <button
                    onClick={handleRequestInstructor}
                    disabled={requesting}
                    className="rounded-xl bg-coral-600 px-4 py-2 text-xs font-bold text-white hover:bg-coral-700 transition-colors flex-shrink-0 disabled:opacity-60"
                  >
                    {requesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Request'}
                  </button>
                )}
              </div>
              {requestError && <p className="text-xs text-coral-600 mt-2">{requestError}</p>}
            </>
          ) : wantsToTeach ? (
            <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4">
              <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-coral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink-900">You&apos;re in instructor mode</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  Your dashboard is set up for building and publishing courses. Switch back anytime — your learning history stays exactly as it is.
                </p>
              </div>
              <button
                onClick={handleToggleTeaching}
                className="rounded-xl border border-ink-200 px-4 py-2 text-xs font-bold text-ink-700 hover:bg-ink-50 transition-colors flex-shrink-0"
              >
                Switch back
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4">
              <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-coral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink-900">Want to teach?</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  Switch to your instructor dashboard to build and publish courses. Your learning history stays exactly as it is.
                </p>
              </div>
              <button
                onClick={handleToggleTeaching}
                className="rounded-xl bg-coral-600 px-4 py-2 text-xs font-bold text-white hover:bg-coral-700 transition-colors flex-shrink-0"
              >
                Switch
              </button>
            </div>
          )}

          {/* Publishing an independent (no-organization) course needs a
              one-time Ndotoni approval — a course for an org you actually
              instruct at doesn't need this, since the org's own membership
              already vouches for you. Never shown for an org MEMBER, whose
              path above is entirely about that org, not independent status. */}
          {!isPlainMember && wantsToTeach && (
            <div className="mt-3 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-ink-700">
                  {user.instructorStatus === 'APPROVED' && 'Approved to publish independent public courses'}
                  {user.instructorStatus === 'PENDING' && 'Application pending — Ndotoni reviews these manually'}
                  {user.instructorStatus === 'REJECTED' && 'Application declined'}
                  {!user.instructorStatus && 'Publishing your own public course needs a quick approval first'}
                </p>
                <p className="text-[11px] text-ink-400 mt-0.5">
                  Only applies to courses you publish independently — courses for an organization you instruct at don&apos;t need this.
                </p>
              </div>
              {(!user.instructorStatus || user.instructorStatus === 'REJECTED') && (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="rounded-lg bg-ink-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-ink-800 transition-colors flex-shrink-0 disabled:opacity-60"
                >
                  {applying ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : user.instructorStatus === 'REJECTED' ? (
                    'Apply again'
                  ) : (
                    'Apply for approval'
                  )}
                </button>
              )}
            </div>
          )}
          {applyError && <p className="text-xs text-coral-600 mt-2">{applyError}</p>}
        </div>
      )}

      {/* Danger zone */}
      <div className="mt-12 pt-8 border-t border-ink-100">
        <h2 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-2.5">Account</h2>
        <button
          onClick={handleSignOut}
          className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
