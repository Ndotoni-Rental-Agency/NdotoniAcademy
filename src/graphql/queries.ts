/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const invitationsForOrganization = /* GraphQL */ `query InvitationsForOrganization($organizationId: ID!) {
  invitationsForOrganization(organizationId: $organizationId) {
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
` as GeneratedQuery<APITypes.MeQueryVariables, APITypes.MeQuery>;
// Trimmed by hand — see the comment on createOrganization in mutations.ts
// for why: Amplify codegen expands Organization's cyclic reference to
// members[].organization/.user out to maxDepth, which this backend's
// hand-constructed resolver responses can't (and don't need to) populate.
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
