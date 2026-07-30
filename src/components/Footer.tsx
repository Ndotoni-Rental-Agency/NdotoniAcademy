'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard')) return null;

  return (
    <footer className="bg-white border-t border-ink-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-xs">N</span>
              </div>
              <span className="font-extrabold text-ink-900">Ndotoni Academy</span>
            </div>
            <p className="text-sm text-ink-500 leading-relaxed">
              Learn from experts. Earn certificates. Grow your career.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-ink-900 mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="text-ink-500 hover:text-indigo-600 transition-colors">Courses</Link></li>
              <li><Link href="/knowledge" className="text-ink-500 hover:text-indigo-600 transition-colors">Knowledge</Link></li>
              <li><Link href="/events" className="text-ink-500 hover:text-indigo-600 transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-ink-900 mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-ink-500 hover:text-indigo-600 transition-colors">About</Link></li>
              <li><Link href="/organizations" className="text-ink-500 hover:text-indigo-600 transition-colors">For Organizations</Link></li>
              <li><Link href="/login?mode=signup" className="text-ink-500 hover:text-indigo-600 transition-colors">Teach on Ndotoni</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-ink-900 mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-ink-500">
              <li>Dar es Salaam, Tanzania</li>
              <li>info@ndotoni.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-200 mt-8 pt-6 text-xs text-ink-400 text-center sm:text-left">
          <p>&copy; 2026 Ndotoni Academy</p>
        </div>
      </div>
    </footer>
  );
}
