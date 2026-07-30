// ============================================================
// Mock Data: Organizations & Team Management
//
// Shapes mirror the backend's actual model (ndotoniAcademyBackend:
// packages/lambda/src/models/{organization,membership,invitation}.ts)
// so this stays consistent with where the real API is headed.
// ============================================================

import { courses } from './mock-data';

export type OrganizationType = 'COMPANY' | 'NGO' | 'SCHOOL' | 'GOVERNMENT' | 'OTHER';
export type MembershipRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'INSTRUCTOR';
export type MembershipStatus = 'INVITED' | 'ACTIVE' | 'REMOVED';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  memberCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MembershipRole;
  status: MembershipStatus;
  joinedAt?: string;
  assignedCourseIds: string[];
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: MembershipRole;
  invitedAt: string;
  status: InvitationStatus;
}

export const mockOrganization: Organization = {
  id: 'org-acme-logistics',
  name: 'Acme Logistics Ltd',
  type: 'COMPANY',
  memberCount: 5,
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Emmanuel Makoye',
    email: 'makoye224@gmail.com',
    role: 'OWNER',
    status: 'ACTIVE',
    joinedAt: '2026-04-02',
    assignedCourseIds: ['project-management'],
  },
  {
    id: 'tm-2',
    name: 'Halima Ndosi',
    email: 'halima.ndosi@acmelogistics.co.tz',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinedAt: '2026-04-10',
    assignedCourseIds: ['project-management', 'digital-marketing'],
  },
  {
    id: 'tm-3',
    name: 'Brian Mollel',
    email: 'brian.mollel@acmelogistics.co.tz',
    role: 'MEMBER',
    status: 'ACTIVE',
    joinedAt: '2026-05-01',
    assignedCourseIds: ['data-analytics'],
  },
  {
    id: 'tm-4',
    name: 'Faraja Sumari',
    email: 'faraja.sumari@acmelogistics.co.tz',
    role: 'MEMBER',
    status: 'ACTIVE',
    joinedAt: '2026-05-14',
    assignedCourseIds: [],
  },
  {
    id: 'tm-5',
    name: 'Ibrahim Chuma',
    email: 'ibrahim.chuma@acmelogistics.co.tz',
    role: 'INSTRUCTOR',
    status: 'ACTIVE',
    joinedAt: '2026-06-02',
    assignedCourseIds: ['ux-design'],
  },
];

export const mockPendingInvitations: PendingInvitation[] = [
  {
    id: 'inv-1',
    email: 'grace.mwanga@acmelogistics.co.tz',
    role: 'MEMBER',
    invitedAt: '2026-07-24',
    status: 'PENDING',
  },
  {
    id: 'inv-2',
    email: 'peter.laizer@acmelogistics.co.tz',
    role: 'ADMIN',
    invitedAt: '2026-07-27',
    status: 'PENDING',
  },
];

export function getAssignableCourses() {
  return courses.map((c) => ({ id: c.id, title: c.title }));
}

export const roleBadgeClass: Record<MembershipRole, string> = {
  OWNER: 'bg-indigo-100 text-indigo-700',
  ADMIN: 'bg-sky-100 text-sky-700',
  MEMBER: 'bg-ink-100 text-ink-600',
  INSTRUCTOR: 'bg-violet-100 text-violet-700',
};

export const roleDescriptions: { role: MembershipRole; label: string; desc: string }[] = [
  { role: 'OWNER', label: 'Owner', desc: 'Full control: billing, organization settings, and every permission below.' },
  { role: 'ADMIN', label: 'Admin', desc: 'Invite and remove members, assign training, and manage roles.' },
  { role: 'MEMBER', label: 'Member', desc: 'Complete assigned courses and earn certificates. Nothing else to manage.' },
  { role: 'INSTRUCTOR', label: 'Instructor', desc: 'Everything a member can do, plus build and publish courses for the org.' },
];
