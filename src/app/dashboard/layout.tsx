'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, Award, Settings, LogOut, Users, Loader2 } from 'lucide-react';
import { useAuth, displayName, dashboardModeFor, type DashboardMode } from '@/lib/auth-context';
import { accentByMode, type DashboardAccent } from '@/lib/dashboard-accent';

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard };

// Pure navigation destinations only — one-off actions like creating a course
// or an organization live as buttons on the pages that need them (Overview's
// hero, the Courses page's "New course" button, Settings), not as sidebar
// nav rows.
const navItemsByMode: Record<DashboardMode, NavItem[]> = {
  learner: [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
  ],
  instructor: [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
    // An instructor is still a learner too — often was one first, and may
    // already hold certificates from before they started teaching.
    { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
  ],
  organization: [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { label: 'Team', href: '/dashboard/team', icon: Users },
  ],
};

function isNavItemActive(pathname: string, href: string) {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
}

function NavLink({
  item,
  isActive,
  accent,
  compact = false,
}: {
  item: NavItem;
  isActive: boolean;
  accent: DashboardAccent;
  compact?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-2.5 rounded-lg font-bold transition-colors ${
        compact ? 'px-3 py-2 text-xs whitespace-nowrap' : 'px-3 py-2 text-sm'
      } ${
        isActive
          ? `${accent.bg50} ${accent.text700} shadow-sm`
          : `text-ink-600 ${compact ? '' : 'font-medium'} hover:bg-ink-50 hover:text-ink-900`
      }`}
    >
      {isActive && !compact && (
        <span className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full ${accent.bg600}`} />
      )}
      <item.icon className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isActive ? accent.text700 : 'text-ink-400'}`} />
      {item.label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut, wantsToTeach } = useAuth();

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
      <div className="flex h-[calc(100dvh-56px)] items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const membership = user.organizations[0];
  const org = membership?.organization;
  const mode = dashboardModeFor(user, wantsToTeach);
  const navItems = navItemsByMode[mode];
  const accent = accentByMode[mode];
  // A plain MEMBER still sees the learner shell (mode === 'learner'), but
  // this is what tells the sidebar identity block to show their org instead
  // of "Individual account" — mode alone can't distinguish the two.
  const isOrgMember = mode !== 'organization' && Boolean(org);

  return (
    <>
      {/* Fixed sidebar + independently-scrolling content only at lg+, where
          the sidebar needs to stay put — below that, the sidebar is hidden
          entirely and this just flows as a normal, whole-page-scrolling
          block. Combining a fixed-vh shell with a nested scroll pane on
          mobile causes visible jank as the browser chrome shows/hides. */}
      <div className="lg:flex lg:h-[calc(100dvh-56px)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-56 border-r border-ink-200 bg-white flex-shrink-0">
          {mode === 'organization' && org ? (
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-3 border-b border-ink-100 mb-2">
              <span className={`flex-shrink-0 w-8 h-8 rounded-full ${accent.bg100} ${accent.text700} flex items-center justify-center text-xs font-extrabold`}>
                {org.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-ink-900 truncate">{org.name}</p>
                <p className="text-[10px] text-ink-400 capitalize">{membership.role.toLowerCase()} account</p>
              </div>
            </div>
          ) : isOrgMember && org ? (
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-3 border-b border-ink-100 mb-2">
              <span className={`flex-shrink-0 w-8 h-8 rounded-full ${accent.bg100} ${accent.text700} flex items-center justify-center text-xs font-extrabold`}>
                {displayName(user).charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-ink-900 truncate">{displayName(user)}</p>
                <p className="text-[10px] text-ink-400 truncate">
                  {mode === 'instructor' ? 'Instructor at' : 'Member at'} {org.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-3 border-b border-ink-100 mb-2">
              <span className={`flex-shrink-0 w-8 h-8 rounded-full ${accent.bg100} ${accent.text700} flex items-center justify-center text-xs font-extrabold`}>
                {displayName(user).charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-ink-900 truncate">{displayName(user)}</p>
                <p className="text-[10px] text-ink-400">
                  {mode === 'instructor' ? 'Independent instructor' : 'Individual account'}
                </p>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-2 py-2 space-y-0.5">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} isActive={isNavItemActive(pathname, item.href)} accent={accent} />
            ))}
          </nav>

          {/* Settings + Sign out */}
          <div className="px-2 py-3 border-t border-ink-100 space-y-0.5">
            <NavLink item={{ label: 'Settings', href: '/dashboard/settings', icon: Settings }} isActive={pathname === '/dashboard/settings'} accent={accent} />
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
        <div className="lg:flex-1 lg:overflow-y-auto bg-ink-50">
          {/* Mobile nav */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-ink-200 px-4 py-2 overflow-x-auto no-scrollbar">
            <div className="flex gap-1 min-w-max">
              {[
                ...navItems,
                { label: 'Settings', href: '/dashboard/settings', icon: Settings },
              ].map((item) => (
                <NavLink key={item.href} item={item} isActive={isNavItemActive(pathname, item.href)} accent={accent} compact />
              ))}
            </div>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
