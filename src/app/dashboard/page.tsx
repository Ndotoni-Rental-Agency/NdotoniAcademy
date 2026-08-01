'use client';

import { useAuth, dashboardModeFor } from '@/lib/auth-context';
import OrganizationOverview from './overview/OrganizationOverview';
import InstructorOverview from './overview/InstructorOverview';
import LearnerOverview from './overview/LearnerOverview';

export default function DashboardPage() {
  const { user, wantsToTeach } = useAuth();
  if (!user) return null; // DashboardLayout already redirects/loads before this can render

  switch (dashboardModeFor(user, wantsToTeach)) {
    case 'organization':
      return <OrganizationOverview user={user} />;
    case 'instructor':
      return <InstructorOverview user={user} />;
    default:
      return <LearnerOverview user={user} />;
  }
}
