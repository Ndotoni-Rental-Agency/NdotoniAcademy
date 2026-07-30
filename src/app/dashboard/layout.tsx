'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Award, Settings, LogOut, Building2 } from 'lucide-react';
import { mockUser } from '@/lib/mock-data';

const baseNavItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = mockUser.organization
    ? [...baseNavItems, { label: 'Team', href: '/dashboard/team', icon: Building2 }]
    : baseNavItems;

  return (
    <>
      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-56 border-r border-ink-200 bg-white flex-shrink-0">
          {/* Nav */}
          <nav className="flex-1 px-2 py-4 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-ink-600 font-medium hover:bg-ink-50 hover:text-ink-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-ink-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="px-2 pb-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-ink-500 hover:bg-ink-50 hover:text-ink-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Link>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-y-auto bg-ink-50">
          {/* Mobile nav */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-ink-200 px-4 py-2 overflow-x-auto no-scrollbar">
            <div className="flex gap-1 min-w-max">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      isActive ? 'bg-indigo-600 text-white' : 'text-ink-500 hover:bg-ink-50'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
