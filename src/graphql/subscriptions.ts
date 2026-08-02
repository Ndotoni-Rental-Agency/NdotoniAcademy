/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const organizationMemberJoined = /* GraphQL */ `subscription OrganizationMemberJoined($organizationId: ID!) {
  organizationMemberJoined(organizationId: $organizationId) {
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
          instructorStatus
          lastName
          status
          updatedAt
          __typename
        }
        userId
        wantsToBeInstructor
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
        user {
          avatarUrl
          createdAt
          email
          firstName
          id
          instructorStatus
          lastName
          status
          updatedAt
          __typename
        }
        userId
        wantsToBeInstructor
        __typename
      }
      status
      updatedAt
      __typename
    }
    userId
    wantsToBeInstructor
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OrganizationMemberJoinedSubscriptionVariables,
  APITypes.OrganizationMemberJoinedSubscription
>;
