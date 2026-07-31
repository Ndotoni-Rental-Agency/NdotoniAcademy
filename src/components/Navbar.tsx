'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';
import Avatar from './Avatar';
import { mockUser } from '@/lib/mock-data';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

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
              {isDashboard ? (
                <Link href="/dashboard" className="rounded-full ring-2 ring-transparent hover:ring-indigo-200 transition-all">
                  <Avatar name={mockUser.name} size="md" />
                </Link>
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
              {!isDashboard && (
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
