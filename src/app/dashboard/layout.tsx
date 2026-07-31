'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, Award, Settings, LogOut, Users, Loader2 } from 'lucide-react';
import { useAuth, displayName } from '@/lib/auth-context';

const individualNavItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
];

const organizationNavItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Team', href: '/dashboard/team', icon: Users },
];

function isNavItemActive(pathname: string, href: string) {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
}

function NavLink({ item, isActive, compact = false }: { item: { label: string; href: string; icon: typeof LayoutDashboard }; isActive: boolean; compact?: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 rounded-lg font-bold transition-colors ${
        compact ? 'px-3 py-2 text-xs whitespace-nowrap' : 'px-3 py-2 text-sm'
      } ${
        isActive
          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
          : `text-ink-600 ${compact ? '' : 'font-medium'} hover:bg-ink-50 hover:text-ink-900`
      }`}
    >
      <item.icon className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isActive ? 'text-white' : 'text-ink-400'}`} />
      {item.label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  async function handleSignOut() {
    // Navigate first, then clear auth state — this component's own guard
    // effect above reacts to `user` going null, so clearing it before we've
    // started leaving /dashboard would redirect to /login instead of home.
    router.push('/');
    await signOut();
  }

  if (loading || !user) {
    return (
      <div className="flex h-[calc(100vh-56px)] items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const membership = user.organizations[0];
  const org = membership?.organization;
  const navItems = org ? organizationNavItems : individualNavItems;

  return (
    <>
      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-56 border-r border-ink-200 bg-white flex-shrink-0">
          {org ? (
            <div className="px-4 pt-4 pb-3 border-b border-ink-100 mb-2">
              <p className="text-xs font-extrabold text-ink-900 truncate">{org.name}</p>
              <p className="text-[10px] text-ink-400 capitalize">{membership.role.toLowerCase()} account</p>
            </div>
          ) : (
            <div className="px-4 pt-4 pb-3 border-b border-ink-100 mb-2">
              <p className="text-xs font-extrabold text-ink-900 truncate">{displayName(user)}</p>
              <p className="text-[10px] text-ink-400">Individual account</p>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-2 py-2 space-y-0.5">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} isActive={isNavItemActive(pathname, item.href)} />
            ))}
          </nav>

          {/* Settings + Sign out */}
          <div className="px-2 py-3 border-t border-ink-100 space-y-0.5">
            <NavLink item={{ label: 'Settings', href: '/dashboard/settings', icon: Settings }} isActive={pathname === '/dashboard/settings'} />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-ink-500 hover:bg-ink-50 hover:text-ink-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-y-auto bg-ink-50">
          {/* Mobile nav */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-ink-200 px-4 py-2 overflow-x-auto no-scrollbar">
            <div className="flex gap-1 min-w-max">
              {[...navItems, { label: 'Settings', href: '/dashboard/settings', icon: Settings }].map((item) => (
                <NavLink key={item.href} item={item} isActive={isNavItemActive(pathname, item.href)} compact />
              ))}
            </div>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
