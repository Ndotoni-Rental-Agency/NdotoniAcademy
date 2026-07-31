/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const acceptInvitation = /* GraphQL */ `mutation AcceptInvitation($token: String!) {
  acceptInvitation(token: $token) {
    id
    joinedAt
    organization {
      createdAt
      id
      members {
        id
        joinedAt
        organization {
          createdAt
          id
          name
          slug
          status
          type
          __typename
        }
        organizationId
        permissions
        role
        status
        user {
          avatarUrl
          createdAt
          email
          firstName
          id
          lastName
          status
          updatedAt
          __typename
        }
        userId
        __typename
      }
      name
      slug
      status
      type
      __typename
    }
    organizationId
    permissions
    role
    status
    user {
      avatarUrl
      createdAt
      email
      firstName
      id
      lastName
      organizations {
        id
        joinedAt
        organization {
          createdAt
          id
          name
          slug
          status
          type
          __typename
        }
        organizationId
        permissions
        role
        status
        user {
          avatarUrl
          createdAt
          email
          firstName
          id
          lastName
          status
          updatedAt
          __typename
        }
        userId
        __typename
      }
      status
      updatedAt
      __typename
    }
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AcceptInvitationMutationVariables,
  APITypes.AcceptInvitationMutation
>;
export const changeMemberRole = /* GraphQL */ `mutation ChangeMemberRole(
  $organizationId: ID!
  $role: MembershipRole!
  $userId: ID!
) {
  changeMemberRole(
    organizationId: $organizationId
    role: $role
    userId: $userId
  ) {
    id
    joinedAt
    organization {
      createdAt
      id
      members {
        id
        joinedAt
        organization {
          createdAt
          id
          name
          slug
          status
          type
          __typename
        }
        organizationId
        permissions
        role
        status
        user {
          avatarUrl
          createdAt
          email
          firstName
          id
          lastName
          status
          updatedAt
          __typename
        }
        userId
        __typename
      }
      name
      slug
      status
      type
      __typename
    }
    organizationId
    permissions
    role
    status
    user {
      avatarUrl
      createdAt
      email
      firstName
      id
      lastName
      organizations {
        id
        joinedAt
        organization {
          createdAt
          id
          name
          slug
          status
          type
          __typename
        }
        organizationId
        permissions
        role
        status
        user {
          avatarUrl
          createdAt
          email
          firstName
          id
          lastName
          status
          updatedAt
          __typename
        }
        userId
        __typename
      }
      status
      updatedAt
      __typename
    }
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ChangeMemberRoleMutationVariables,
  APITypes.ChangeMemberRoleMutation
>;
// Trimmed by hand from Amplify codegen's default output, which expands
// Organization <-> OrganizationMembership's cyclic reference out to
// maxDepth (4) — members[].organization and members[].user included their
// own full nested sub-graphs. The backend's Lambda resolvers hand-construct
// their JSON response rather than doing per-field lazy resolution, so they
// can only populate what's actually requested; nothing here ever consumed
// that deep data anyway (the caller just needs the mutation to succeed,
// then refetches `me` separately). Keep this flat if regenerating.
export const createOrganization = /* GraphQL */ `mutation CreateOrganization($input: CreateOrganizationInput!) {
  createOrganization(input: $input) {
    createdAt
    id
    members {
      id
      joinedAt
      organizationId
      permissions
      role
      status
      userId
      __typename
    }
    name
    slug
    status
    type
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateOrganizationMutationVariables,
  APITypes.CreateOrganizationMutation
>;
export const inviteMember = /* GraphQL */ `mutation InviteMember(
  $email: AWSEmail!
  $organizationId: ID!
  $role: MembershipRole!
) {
  inviteMember(email: $email, organizationId: $organizationId, role: $role) {
    createdAt
    email
    expiresAt
    id
    organization {
      createdAt
      id
      members {
        id
        joinedAt
        organization {
          createdAt
          id
          name
          slug
          status
          type
          __typename
        }
        organizationId
        permissions
        role
        status
        user {
          avatarUrl
          createdAt
          email
          firstName
          id
          lastName
          status
          updatedAt
          __typename
        }
        userId
        __typename
      }
      name
      slug
      status
      type
      __typename
    }
    organizationId
    role
    status
    __typename
  }
}
` as GeneratedMutation<
  APITypes.InviteMemberMutationVariables,
  APITypes.InviteMemberMutation
>;
export const removeMember = /* GraphQL */ `mutation RemoveMember($organizationId: ID!, $userId: ID!) {
  removeMember(organizationId: $organizationId, userId: $userId)
}
` as GeneratedMutation<
  APITypes.RemoveMemberMutationVariables,
  APITypes.RemoveMemberMutation
>;
export const revokeInvitation = /* GraphQL */ `mutation RevokeInvitation($email: AWSEmail!, $organizationId: ID!) {
  revokeInvitation(email: $email, organizationId: $organizationId)
}
` as GeneratedMutation<
  APITypes.RevokeInvitationMutationVariables,
  APITypes.RevokeInvitationMutation
>;
// Trimmed by hand — see the comment on createOrganization above for why.
export const updateProfile = /* GraphQL */ `mutation UpdateProfile($input: UpdateUserProfileInput!) {
  updateProfile(input: $input) {
    avatarUrl
    createdAt
    email
    firstName
    id
    lastName
    organizations {
      id
      joinedAt
      organization {
        createdAt
        id
        name
        slug
        status
        type
        __typename
      }
      organizationId
      permissions
      role
      status
      userId
      __typename
    }
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateProfileMutationVariables,
  APITypes.UpdateProfileMutation
>;
