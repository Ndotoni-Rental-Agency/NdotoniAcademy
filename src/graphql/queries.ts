/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

// Trimmed by hand — see the comment on createOrganization in mutations.ts.
// OrganizationInvitation.organization is nullable and nothing here reads
// it — the team page already knows which org it's looking at.
export const invitationsForOrganization = /* GraphQL */ `query InvitationsForOrganization($organizationId: ID!) {
  invitationsForOrganization(organizationId: $organizationId) {
    createdAt
    email
    expiresAt
    id
    organizationId
    role
    status
    __typename
  }
}
` as GeneratedQuery<
  APITypes.InvitationsForOrganizationQueryVariables,
  APITypes.InvitationsForOrganizationQuery
>;
// Trimmed by hand — see the comment on createOrganization in mutations.ts
// for why: organizations[].organization stays flat (no nested .members),
// and organizations[].user is dropped entirely — nothing in the app reads
// either, and the backend's resolver doesn't populate that deep anyway.
export const me = /* GraphQL */ `query Me {
  me {
    avatarUrl
    createdAt
    email
    firstName
    id
    instructorStatus
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
      wantsToBeInstructor
      userId
      __typename
    }
    status
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.MeQueryVariables, APITypes.MeQuery>;
// Trimmed by hand — see the comment on createOrganization in mutations.ts
// for why Amplify codegen's default output is dropped (members[].organization
// nested further, in particular). members[].user stays, flat (no nested
// .organizations) — the team roster genuinely needs real names, and the
// backend now populates it (organization-service.ts's listMembersWithPermissions).
export const organization = /* GraphQL */ `query Organization($id: ID!) {
  organization(id: $id) {
    createdAt
    id
    members {
      id
      joinedAt
      organizationId
      permissions
      role
      status
      wantsToBeInstructor
      user {
        avatarUrl
        email
        firstName
        id
        lastName
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
` as GeneratedQuery<
  APITypes.OrganizationQueryVariables,
  APITypes.OrganizationQuery
>;
export const organizationBySlug = /* GraphQL */ `query OrganizationBySlug($slug: String!) {
  organizationBySlug(slug: $slug) {
    createdAt
    id
    members {
      id
      joinedAt
      organizationId
      permissions
      role
      status
      wantsToBeInstructor
      user {
        avatarUrl
        email
        firstName
        id
        lastName
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
` as GeneratedQuery<
  APITypes.OrganizationBySlugQueryVariables,
  APITypes.OrganizationBySlugQuery
>;
