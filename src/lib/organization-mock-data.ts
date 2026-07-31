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
  /** Aggregate completion across assigned courses, 0-100. */
  trainingProgress: number;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: MembershipRole;
  invitedAt: string;
  status: InvitationStatus;
}

export const mockOrganization: Organization = {
  id: 'org-ndotoni-academy',
  name: 'Ndotoni Academy',
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
    trainingProgress: 33,
  },
  {
    id: 'tm-2',
    name: 'Halima Ndosi',
    email: 'halima.ndosi@ndotoni.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinedAt: '2026-04-10',
    assignedCourseIds: ['project-management', 'digital-marketing'],
    trainingProgress: 60,
  },
  {
    id: 'tm-3',
    name: 'Brian Mollel',
    email: 'brian.mollel@ndotoni.com',
    role: 'MEMBER',
    status: 'ACTIVE',
    joinedAt: '2026-05-01',
    assignedCourseIds: ['data-analytics'],
    trainingProgress: 45,
  },
  {
    id: 'tm-4',
    name: 'Faraja Sumari',
    email: 'faraja.sumari@ndotoni.com',
    role: 'MEMBER',
    status: 'ACTIVE',
    joinedAt: '2026-05-14',
    assignedCourseIds: [],
    trainingProgress: 0,
  },
  {
    id: 'tm-5',
    name: 'Ibrahim Chuma',
    email: 'ibrahim.chuma@ndotoni.com',
    role: 'INSTRUCTOR',
    status: 'ACTIVE',
    joinedAt: '2026-06-02',
    assignedCourseIds: ['ux-design'],
    trainingProgress: 80,
  },
];

export const mockPendingInvitations: PendingInvitation[] = [
  {
    id: 'inv-1',
    email: 'grace.mwanga@ndotoni.com',
    role: 'MEMBER',
    invitedAt: '2026-07-24',
    status: 'PENDING',
  },
  {
    id: 'inv-2',
    email: 'peter.laizer@ndotoni.com',
    role: 'ADMIN',
    invitedAt: '2026-07-27',
    status: 'PENDING',
  },
];

export function getAssignableCourses() {
  return courses.map((c) => ({ id: c.id, title: c.title }));
}

export interface TeamCourse {
  id: string;
  title: string;
  category: string;
  visibility: 'PRIVATE' | 'PUBLIC';
  assignedCount: number;
  isCustom: boolean;
}

/** Courses from the public catalog currently assigned to at least one team member. */
export function getTeamCourseUsage(): TeamCourse[] {
  return courses
    .map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      visibility: 'PUBLIC' as const,
      assignedCount: mockTeamMembers.filter((m) => m.assignedCourseIds.includes(c.id)).length,
      isCustom: false,
    }))
    .filter((c) => c.assignedCount > 0);
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
