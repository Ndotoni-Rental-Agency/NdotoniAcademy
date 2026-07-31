'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useAuth, displayName } from '@/lib/auth-context';
import { GraphQLClient } from '@/lib/graphql-client';
import { updateProfile } from '@/graphql/mutations';
import type { UpdateProfileMutation, UpdateProfileMutationVariables } from '@/API';
import Avatar from '@/components/Avatar';

export default function SettingsPage() {
  const { user, refetch, signOut } = useAuth();
  const router = useRouter();
  // DashboardLayout only renders this page once `user` is loaded, so these
  // initial values are never actually stale — but hooks must run
  // unconditionally, so the null case is handled after, not before, them.
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

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

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Settings</h1>
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
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
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

      {/* Danger zone */}
      <div className="mt-12 pt-8 border-t border-ink-100">
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-3">Account</h2>
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
