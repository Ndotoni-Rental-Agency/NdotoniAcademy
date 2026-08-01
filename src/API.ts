/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type OrganizationMembership = {
  __typename: "OrganizationMembership",
  id: string,
  joinedAt?: string | null,
  organization?: Organization | null,
  organizationId: string,
  permissions: Array< string >,
  role: MembershipRole,
  status: MembershipStatus,
  user?: User | null,
  userId: string,
};

export type Organization = {
  __typename: "Organization",
  createdAt: string,
  id: string,
  members:  Array<OrganizationMembership >,
  name: string,
  slug: string,
  status: OrganizationStatus,
  type: OrganizationType,
};

export enum OrganizationStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
}


export enum OrganizationType {
  COMPANY = "COMPANY",
  GOVERNMENT = "GOVERNMENT",
  NGO = "NGO",
  OTHER = "OTHER",
  SCHOOL = "SCHOOL",
}


export enum MembershipRole {
  ADMIN = "ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  MEMBER = "MEMBER",
  OWNER = "OWNER",
}


export enum MembershipStatus {
  ACTIVE = "ACTIVE",
  INVITED = "INVITED",
  REMOVED = "REMOVED",
}


export type User = {
  __typename: "User",
  avatarUrl?: string | null,
  createdAt: string,
  email: string,
  firstName?: string | null,
  id: string,
  instructorStatus?: InstructorStatus | null,
  lastName?: string | null,
  organizations:  Array<OrganizationMembership >,
  status: UserStatus,
  updatedAt: string,
};

// Null on User means never applied. Only gates publishing an independent
// (no-organization) course — an org-scoped course needs no platform
// approval, since the organization's own INSTRUCTOR membership vouches for it.
export enum InstructorStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}


export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}


export type CreateOrganizationInput = {
  name: string,
  slug: string,
  type: OrganizationType,
};

export type OrganizationInvitation = {
  __typename: "OrganizationInvitation",
  createdAt: string,
  email: string,
  expiresAt: string,
  id: string,
  organization?: Organization | null,
  organizationId: string,
  role: MembershipRole,
  status: InvitationStatus,
};

export enum InvitationStatus {
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
}


export type UpdateUserProfileInput = {
  avatarUrl?: string | null,
  firstName?: string | null,
  lastName?: string | null,
};

export type AcceptInvitationMutationVariables = {
  token: string,
};

export type AcceptInvitationMutation = {
  acceptInvitation?:  {
    __typename: "OrganizationMembership",
    id: string,
    joinedAt?: string | null,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members:  Array< {
        __typename: "OrganizationMembership",
        id: string,
        joinedAt?: string | null,
        organization?:  {
          __typename: "Organization",
          createdAt: string,
          id: string,
          name: string,
          slug: string,
          status: OrganizationStatus,
          type: OrganizationType,
        } | null,
        organizationId: string,
        permissions: Array< string >,
        role: MembershipRole,
        status: MembershipStatus,
        user?:  {
          __typename: "User",
          avatarUrl?: string | null,
          createdAt: string,
          email: string,
          firstName?: string | null,
          id: string,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
      } >,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId: string,
    permissions: Array< string >,
    role: MembershipRole,
    status: MembershipStatus,
    user?:  {
      __typename: "User",
      avatarUrl?: string | null,
      createdAt: string,
      email: string,
      firstName?: string | null,
      id: string,
      lastName?: string | null,
      organizations:  Array< {
        __typename: "OrganizationMembership",
        id: string,
        joinedAt?: string | null,
        organization?:  {
          __typename: "Organization",
          createdAt: string,
          id: string,
          name: string,
          slug: string,
          status: OrganizationStatus,
          type: OrganizationType,
        } | null,
        organizationId: string,
        permissions: Array< string >,
        role: MembershipRole,
        status: MembershipStatus,
        user?:  {
          __typename: "User",
          avatarUrl?: string | null,
          createdAt: string,
          email: string,
          firstName?: string | null,
          id: string,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    userId: string,
  } | null,
};

export type ApplyToBeInstructorMutationVariables = {
};

export type ApplyToBeInstructorMutation = {
  applyToBeInstructor?:  {
    __typename: "User",
    id: string,
    instructorStatus?: InstructorStatus | null,
  } | null,
};

export type ChangeMemberRoleMutationVariables = {
  organizationId: string,
  role: MembershipRole,
  userId: string,
};

export type ChangeMemberRoleMutation = {
  changeMemberRole?:  {
    __typename: "OrganizationMembership",
    id: string,
    joinedAt?: string | null,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members:  Array< {
        __typename: "OrganizationMembership",
        id: string,
        joinedAt?: string | null,
        organization?:  {
          __typename: "Organization",
          createdAt: string,
          id: string,
          name: string,
          slug: string,
          status: OrganizationStatus,
          type: OrganizationType,
        } | null,
        organizationId: string,
        permissions: Array< string >,
        role: MembershipRole,
        status: MembershipStatus,
        user?:  {
          __typename: "User",
          avatarUrl?: string | null,
          createdAt: string,
          email: string,
          firstName?: string | null,
          id: string,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
      } >,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId: string,
    permissions: Array< string >,
    role: MembershipRole,
    status: MembershipStatus,
    user?:  {
      __typename: "User",
      avatarUrl?: string | null,
      createdAt: string,
      email: string,
      firstName?: string | null,
      id: string,
      lastName?: string | null,
      organizations:  Array< {
        __typename: "OrganizationMembership",
        id: string,
        joinedAt?: string | null,
        organization?:  {
          __typename: "Organization",
          createdAt: string,
          id: string,
          name: string,
          slug: string,
          status: OrganizationStatus,
          type: OrganizationType,
        } | null,
        organizationId: string,
        permissions: Array< string >,
        role: MembershipRole,
        status: MembershipStatus,
        user?:  {
          __typename: "User",
          avatarUrl?: string | null,
          createdAt: string,
          email: string,
          firstName?: string | null,
          id: string,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    userId: string,
  } | null,
};

export type RequestInstructorRoleMutationVariables = {
  organizationId: string,
};

export type RequestInstructorRoleMutation = {
  requestInstructorRole?:  {
    __typename: "OrganizationMembership",
    id: string,
    userId: string,
    organizationId: string,
    role: MembershipRole,
    wantsToBeInstructor: boolean,
  } | null,
};

export type CreateOrganizationMutationVariables = {
  input: CreateOrganizationInput,
};

export type CreateOrganizationMutation = {
  createOrganization?:  {
    __typename: "Organization",
    createdAt: string,
    id: string,
    members:  Array< {
      __typename: "OrganizationMembership",
      id: string,
      joinedAt?: string | null,
      organization?:  {
        __typename: "Organization",
        createdAt: string,
        id: string,
        members:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        name: string,
        slug: string,
        status: OrganizationStatus,
        type: OrganizationType,
      } | null,
      organizationId: string,
      permissions: Array< string >,
      role: MembershipRole,
      status: MembershipStatus,
      user?:  {
        __typename: "User",
        avatarUrl?: string | null,
        createdAt: string,
        email: string,
        firstName?: string | null,
        id: string,
        lastName?: string | null,
        organizations:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
    } >,
    name: string,
    slug: string,
    status: OrganizationStatus,
    type: OrganizationType,
  } | null,
};

export type InviteMemberMutationVariables = {
  email: string,
  organizationId: string,
  role: MembershipRole,
};

export type InviteMemberMutation = {
  inviteMember?:  {
    __typename: "OrganizationInvitation",
    createdAt: string,
    email: string,
    expiresAt: string,
    id: string,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members:  Array< {
        __typename: "OrganizationMembership",
        id: string,
        joinedAt?: string | null,
        organization?:  {
          __typename: "Organization",
          createdAt: string,
          id: string,
          name: string,
          slug: string,
          status: OrganizationStatus,
          type: OrganizationType,
        } | null,
        organizationId: string,
        permissions: Array< string >,
        role: MembershipRole,
        status: MembershipStatus,
        user?:  {
          __typename: "User",
          avatarUrl?: string | null,
          createdAt: string,
          email: string,
          firstName?: string | null,
          id: string,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
      } >,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId: string,
    role: MembershipRole,
    status: InvitationStatus,
  } | null,
};

export type RemoveMemberMutationVariables = {
  organizationId: string,
  userId: string,
};

export type RemoveMemberMutation = {
  removeMember?: boolean | null,
};

export type RevokeInvitationMutationVariables = {
  email: string,
  organizationId: string,
};

export type RevokeInvitationMutation = {
  revokeInvitation?: boolean | null,
};

export type UpdateProfileMutationVariables = {
  input: UpdateUserProfileInput,
};

export type UpdateProfileMutation = {
  updateProfile?:  {
    __typename: "User",
    avatarUrl?: string | null,
    createdAt: string,
    email: string,
    firstName?: string | null,
    id: string,
    lastName?: string | null,
    organizations:  Array< {
      __typename: "OrganizationMembership",
      id: string,
      joinedAt?: string | null,
      organization?:  {
        __typename: "Organization",
        createdAt: string,
        id: string,
        members:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        name: string,
        slug: string,
        status: OrganizationStatus,
        type: OrganizationType,
      } | null,
      organizationId: string,
      permissions: Array< string >,
      role: MembershipRole,
      status: MembershipStatus,
      user?:  {
        __typename: "User",
        avatarUrl?: string | null,
        createdAt: string,
        email: string,
        firstName?: string | null,
        id: string,
        lastName?: string | null,
        organizations:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
    } >,
    status: UserStatus,
    updatedAt: string,
  } | null,
};

export type InvitationsForOrganizationQueryVariables = {
  organizationId: string,
};

export type InvitationsForOrganizationQuery = {
  invitationsForOrganization:  Array< {
    __typename: "OrganizationInvitation",
    createdAt: string,
    email: string,
    expiresAt: string,
    id: string,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members:  Array< {
        __typename: "OrganizationMembership",
        id: string,
        joinedAt?: string | null,
        organization?:  {
          __typename: "Organization",
          createdAt: string,
          id: string,
          name: string,
          slug: string,
          status: OrganizationStatus,
          type: OrganizationType,
        } | null,
        organizationId: string,
        permissions: Array< string >,
        role: MembershipRole,
        status: MembershipStatus,
        user?:  {
          __typename: "User",
          avatarUrl?: string | null,
          createdAt: string,
          email: string,
          firstName?: string | null,
          id: string,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
      } >,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId: string,
    role: MembershipRole,
    status: InvitationStatus,
  } >,
};

export type MeQueryVariables = {
};

export type MeQuery = {
  me?:  {
    __typename: "User",
    avatarUrl?: string | null,
    createdAt: string,
    email: string,
    firstName?: string | null,
    id: string,
    instructorStatus?: InstructorStatus | null,
    lastName?: string | null,
    organizations:  Array< {
      __typename: "OrganizationMembership",
      id: string,
      joinedAt?: string | null,
      organization?:  {
        __typename: "Organization",
        createdAt: string,
        id: string,
        members:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        name: string,
        slug: string,
        status: OrganizationStatus,
        type: OrganizationType,
      } | null,
      organizationId: string,
      permissions: Array< string >,
      role: MembershipRole,
      status: MembershipStatus,
      wantsToBeInstructor: boolean,
      user?:  {
        __typename: "User",
        avatarUrl?: string | null,
        createdAt: string,
        email: string,
        firstName?: string | null,
        id: string,
        lastName?: string | null,
        organizations:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
    } >,
    status: UserStatus,
    updatedAt: string,
  } | null,
};

export type OrganizationQueryVariables = {
  id: string,
};

export type OrganizationQuery = {
  organization?:  {
    __typename: "Organization",
    createdAt: string,
    id: string,
    members:  Array< {
      __typename: "OrganizationMembership",
      id: string,
      joinedAt?: string | null,
      organization?:  {
        __typename: "Organization",
        createdAt: string,
        id: string,
        members:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        name: string,
        slug: string,
        status: OrganizationStatus,
        type: OrganizationType,
      } | null,
      organizationId: string,
      permissions: Array< string >,
      role: MembershipRole,
      status: MembershipStatus,
      wantsToBeInstructor: boolean,
      user?:  {
        __typename: "User",
        avatarUrl?: string | null,
        createdAt: string,
        email: string,
        firstName?: string | null,
        id: string,
        lastName?: string | null,
        organizations:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
    } >,
    name: string,
    slug: string,
    status: OrganizationStatus,
    type: OrganizationType,
  } | null,
};

export type OrganizationBySlugQueryVariables = {
  slug: string,
};

export type OrganizationBySlugQuery = {
  organizationBySlug?:  {
    __typename: "Organization",
    createdAt: string,
    id: string,
    members:  Array< {
      __typename: "OrganizationMembership",
      id: string,
      joinedAt?: string | null,
      organization?:  {
        __typename: "Organization",
        createdAt: string,
        id: string,
        members:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        name: string,
        slug: string,
        status: OrganizationStatus,
        type: OrganizationType,
      } | null,
      organizationId: string,
      permissions: Array< string >,
      role: MembershipRole,
      status: MembershipStatus,
      wantsToBeInstructor: boolean,
      user?:  {
        __typename: "User",
        avatarUrl?: string | null,
        createdAt: string,
        email: string,
        firstName?: string | null,
        id: string,
        lastName?: string | null,
        organizations:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
    } >,
    name: string,
    slug: string,
    status: OrganizationStatus,
    type: OrganizationType,
  } | null,
};

export type OrganizationMemberJoinedSubscriptionVariables = {
  organizationId: string,
};

export type OrganizationMemberJoinedSubscription = {
  organizationMemberJoined?:  {
    __typename: "OrganizationMembership",
    id: string,
    joinedAt?: string | null,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members:  Array< {
        __typename: "OrganizationMembership",
        id: string,
        joinedAt?: string | null,
        organization?:  {
          __typename: "Organization",
          createdAt: string,
          id: string,
          name: string,
          slug: string,
          status: OrganizationStatus,
          type: OrganizationType,
        } | null,
        organizationId: string,
        permissions: Array< string >,
        role: MembershipRole,
        status: MembershipStatus,
        user?:  {
          __typename: "User",
          avatarUrl?: string | null,
          createdAt: string,
          email: string,
          firstName?: string | null,
          id: string,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
      } >,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId: string,
    permissions: Array< string >,
    role: MembershipRole,
    status: MembershipStatus,
    user?:  {
      __typename: "User",
      avatarUrl?: string | null,
      createdAt: string,
      email: string,
      firstName?: string | null,
      id: string,
      lastName?: string | null,
      organizations:  Array< {
        __typename: "OrganizationMembership",
        id: string,
        joinedAt?: string | null,
        organization?:  {
          __typename: "Organization",
          createdAt: string,
          id: string,
          name: string,
          slug: string,
          status: OrganizationStatus,
          type: OrganizationType,
        } | null,
        organizationId: string,
        permissions: Array< string >,
        role: MembershipRole,
        status: MembershipStatus,
        user?:  {
          __typename: "User",
          avatarUrl?: string | null,
          createdAt: string,
          email: string,
          firstName?: string | null,
          id: string,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    userId: string,
  } | null,
};
