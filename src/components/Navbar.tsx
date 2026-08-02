'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';
import Avatar from './Avatar';
import { useAuth, displayName } from '@/lib/auth-context';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname.startsWith('/dashboard');
  const isStudio = pathname.startsWith('/studio');
  const { user, signOut } = useAuth();

  // The studio is meant to feel like a focused editor, not a page within the
  // site — it has its own header, so the main nav is fully hidden rather
  // than reduced the way it is on /dashboard.
  if (isStudio) return null;

  async function handleSignOut() {
    // Navigate away first, then clear auth state — otherwise, if this fires
    // while a /dashboard/* page is still mounted, its guard effect can see
    // user go null before this push lands and bounce to /login instead
    // (which renders this same modal), rather than landing on home.
    setMobileOpen(false);
    router.push('/');
    await signOut();
  }

  const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/organizations', label: 'For Organizations' },
    { href: '/instructors', label: 'For Instructors' },
    { href: '/about', label: 'About' },
  ];

  function openAuth(mode: 'signin' | 'signup') {
    setAuthMode(mode);
    setAuthOpen(true);
    setMobileOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-ink-200">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5">
              <Image src="/ndotoni-academy-icon.png" alt="Ndotoni" width={36} height={36} priority className="object-contain" />
              <span className="text-lg font-bold text-ink-900">
                Ndotoni Academy
              </span>
            </Link>

            {/* Desktop Nav: only show on public pages */}
            {!isDashboard && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        isActive
                          ? 'text-indigo-600 bg-indigo-50'
                          : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold text-ink-600 hover:text-ink-900 px-3 py-2"
                  >
                    Dashboard
                  </Link>
                  <Link href="/dashboard" className="rounded-full ring-2 ring-transparent hover:ring-indigo-200 transition-all">
                    <Avatar name={displayName(user)} imageUrl={user.avatarUrl ?? undefined} size="md" />
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuth('signin')}
                    className="text-sm font-semibold text-ink-600 hover:text-ink-900 px-3 py-2"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => openAuth('signup')}
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
                  >
                    Get started
                  </button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-ink-600 hover:bg-ink-50"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-ink-200 bg-white animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-ink-700 hover:bg-ink-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="pt-3 space-y-1 border-t border-ink-200 mt-2">
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-ink-700 hover:bg-ink-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-3 space-y-2 border-t border-ink-200 mt-2">
                  <button
                    onClick={() => openAuth('signin')}
                    className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-ink-600"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => openAuth('signup')}
                    className="block w-full text-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white"
                  >
                    Get started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
