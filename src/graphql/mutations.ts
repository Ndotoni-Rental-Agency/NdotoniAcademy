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
export const createOrganization = /* GraphQL */ `mutation CreateOrganization($input: CreateOrganizationInput!) {
  createOrganization(input: $input) {
    createdAt
    id
    members {
      id
      joinedAt
      organization {
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
