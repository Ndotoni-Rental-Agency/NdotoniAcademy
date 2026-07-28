'use client';

import { useState } from 'react';
import { mockUser } from '@/lib/mock-data';

export default function SettingsPage() {
  const user = mockUser;
  const [firstName, setFirstName] = useState(user.name.split(' ')[0]);
  const [lastName, setLastName] = useState(user.name.split(' ').slice(1).join(' '));
  const [email, setEmail] = useState(user.email);

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Settings</h1>
      <p className="text-sm text-ink-500 mb-8">Manage your account.</p>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
          >
            Save changes
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-12 pt-8 border-t border-ink-100">
        <h2 className="text-sm font-bold text-ink-400 uppercase tracking-wide mb-3">Account</h2>
        <button className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
          Sign out
        </button>
      </div>
    </div>
  );
}
