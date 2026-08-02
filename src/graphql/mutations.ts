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
` as GeneratedMutation<
  APITypes.AcceptInvitationMutationVariables,
  APITypes.AcceptInvitationMutation
>;
export const addLessonToModule = /* GraphQL */ `mutation AddLessonToModule(
  $isFree: Boolean
  $lessonId: ID!
  $moduleId: ID!
  $prerequisites: [ModuleLessonRefInput!]
) {
  addLessonToModule(
    isFree: $isFree
    lessonId: $lessonId
    moduleId: $moduleId
    prerequisites: $prerequisites
  ) {
    animationRef
    audioUrl
    body
    cards {
      back
      front
      id
      __typename
    }
    createdAt
    durationSeconds
    embedUrl
    isFree
    lessonId
    moduleId
    order
    prerequisites {
      lessonId
      moduleId
      __typename
    }
    questions {
      correctIndex
      id
      options
      question
      __typename
    }
    title
    type
    videoUrl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AddLessonToModuleMutationVariables,
  APITypes.AddLessonToModuleMutation
>;
export const addModuleToCourse = /* GraphQL */ `mutation AddModuleToCourse($courseId: ID!, $isFree: Boolean, $moduleId: ID!) {
  addModuleToCourse(courseId: $courseId, isFree: $isFree, moduleId: $moduleId) {
    courseId
    createdAt
    description
    isFree
    lessonCount
    moduleId
    order
    thumbnailUrl
    title
    totalDurationSeconds
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AddModuleToCourseMutationVariables,
  APITypes.AddModuleToCourseMutation
>;
export const applyToBeInstructor = /* GraphQL */ `mutation ApplyToBeInstructor {
  applyToBeInstructor {
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
        members {
          id
          joinedAt
          organizationId
          permissions
          role
          status
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
          organizationId
          permissions
          role
          status
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
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ApplyToBeInstructorMutationVariables,
  APITypes.ApplyToBeInstructorMutation
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
` as GeneratedMutation<
  APITypes.ChangeMemberRoleMutationVariables,
  APITypes.ChangeMemberRoleMutation
>;
export const createCourse = /* GraphQL */ `mutation CreateCourse($input: CreateCourseInput!) {
  createCourse(input: $input) {
    category
    createdAt
    description
    id
    instructorUserId
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
    priceTzs
    status
    thumbnailUrl
    title
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCourseMutationVariables,
  APITypes.CreateCourseMutation
>;
export const createLessonForModule = /* GraphQL */ `mutation CreateLessonForModule(
  $input: CreateLessonInput!
  $isFree: Boolean
  $moduleId: ID!
  $prerequisites: [ModuleLessonRefInput!]
) {
  createLessonForModule(
    input: $input
    isFree: $isFree
    moduleId: $moduleId
    prerequisites: $prerequisites
  ) {
    animationRef
    audioUrl
    body
    cards {
      back
      front
      id
      __typename
    }
    createdAt
    durationSeconds
    embedUrl
    isFree
    lessonId
    moduleId
    order
    prerequisites {
      lessonId
      moduleId
      __typename
    }
    questions {
      correctIndex
      id
      options
      question
      __typename
    }
    title
    type
    videoUrl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLessonForModuleMutationVariables,
  APITypes.CreateLessonForModuleMutation
>;
export const createModuleForCourse = /* GraphQL */ `mutation CreateModuleForCourse(
  $courseId: ID!
  $input: CreateModuleInput!
  $isFree: Boolean
) {
  createModuleForCourse(courseId: $courseId, input: $input, isFree: $isFree) {
    courseId
    createdAt
    description
    isFree
    lessonCount
    moduleId
    order
    thumbnailUrl
    title
    totalDurationSeconds
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateModuleForCourseMutationVariables,
  APITypes.CreateModuleForCourseMutation
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
          organizationId
          permissions
          role
          status
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
export const deleteCourse = /* GraphQL */ `mutation DeleteCourse($id: ID!) {
  deleteCourse(id: $id)
}
` as GeneratedMutation<
  APITypes.DeleteCourseMutationVariables,
  APITypes.DeleteCourseMutation
>;
export const deleteLesson = /* GraphQL */ `mutation DeleteLesson($id: ID!) {
  deleteLesson(id: $id)
}
` as GeneratedMutation<
  APITypes.DeleteLessonMutationVariables,
  APITypes.DeleteLessonMutation
>;
export const deleteModule = /* GraphQL */ `mutation DeleteModule($id: ID!) {
  deleteModule(id: $id)
}
` as GeneratedMutation<
  APITypes.DeleteModuleMutationVariables,
  APITypes.DeleteModuleMutation
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
    role
    status
    __typename
  }
}
` as GeneratedMutation<
  APITypes.InviteMemberMutationVariables,
  APITypes.InviteMemberMutation
>;
export const removeLessonFromModule = /* GraphQL */ `mutation RemoveLessonFromModule($lessonId: ID!, $moduleId: ID!) {
  removeLessonFromModule(lessonId: $lessonId, moduleId: $moduleId)
}
` as GeneratedMutation<
  APITypes.RemoveLessonFromModuleMutationVariables,
  APITypes.RemoveLessonFromModuleMutation
>;
export const removeMember = /* GraphQL */ `mutation RemoveMember($organizationId: ID!, $userId: ID!) {
  removeMember(organizationId: $organizationId, userId: $userId)
}
` as GeneratedMutation<
  APITypes.RemoveMemberMutationVariables,
  APITypes.RemoveMemberMutation
>;
export const removeModuleFromCourse = /* GraphQL */ `mutation RemoveModuleFromCourse($courseId: ID!, $moduleId: ID!) {
  removeModuleFromCourse(courseId: $courseId, moduleId: $moduleId)
}
` as GeneratedMutation<
  APITypes.RemoveModuleFromCourseMutationVariables,
  APITypes.RemoveModuleFromCourseMutation
>;
export const reorderCourseModules = /* GraphQL */ `mutation ReorderCourseModules($courseId: ID!, $moduleIds: [ID!]!) {
  reorderCourseModules(courseId: $courseId, moduleIds: $moduleIds) {
    courseId
    createdAt
    description
    isFree
    lessonCount
    moduleId
    order
    thumbnailUrl
    title
    totalDurationSeconds
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ReorderCourseModulesMutationVariables,
  APITypes.ReorderCourseModulesMutation
>;
export const reorderModuleLessons = /* GraphQL */ `mutation ReorderModuleLessons($lessonIds: [ID!]!, $moduleId: ID!) {
  reorderModuleLessons(lessonIds: $lessonIds, moduleId: $moduleId) {
    createdAt
    durationSeconds
    isFree
    lessonId
    moduleId
    order
    prerequisites {
      lessonId
      moduleId
      __typename
    }
    title
    type
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ReorderModuleLessonsMutationVariables,
  APITypes.ReorderModuleLessonsMutation
>;
export const requestInstructorRole = /* GraphQL */ `mutation RequestInstructorRole($organizationId: ID!) {
  requestInstructorRole(organizationId: $organizationId) {
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
` as GeneratedMutation<
  APITypes.RequestInstructorRoleMutationVariables,
  APITypes.RequestInstructorRoleMutation
>;
export const revokeInvitation = /* GraphQL */ `mutation RevokeInvitation($email: AWSEmail!, $organizationId: ID!) {
  revokeInvitation(email: $email, organizationId: $organizationId)
}
` as GeneratedMutation<
  APITypes.RevokeInvitationMutationVariables,
  APITypes.RevokeInvitationMutation
>;
export const setCourseModuleFree = /* GraphQL */ `mutation SetCourseModuleFree(
  $courseId: ID!
  $isFree: Boolean!
  $moduleId: ID!
) {
  setCourseModuleFree(
    courseId: $courseId
    isFree: $isFree
    moduleId: $moduleId
  ) {
    courseId
    createdAt
    description
    isFree
    lessonCount
    moduleId
    order
    thumbnailUrl
    title
    totalDurationSeconds
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SetCourseModuleFreeMutationVariables,
  APITypes.SetCourseModuleFreeMutation
>;
export const setInstructorStatus = /* GraphQL */ `mutation SetInstructorStatus($status: InstructorStatus!, $userId: ID!) {
  setInstructorStatus(status: $status, userId: $userId) {
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
        members {
          id
          joinedAt
          organizationId
          permissions
          role
          status
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
          organizationId
          permissions
          role
          status
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
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SetInstructorStatusMutationVariables,
  APITypes.SetInstructorStatusMutation
>;
export const setModuleLessonFree = /* GraphQL */ `mutation SetModuleLessonFree(
  $isFree: Boolean!
  $lessonId: ID!
  $moduleId: ID!
) {
  setModuleLessonFree(
    isFree: $isFree
    lessonId: $lessonId
    moduleId: $moduleId
  ) {
    animationRef
    audioUrl
    body
    cards {
      back
      front
      id
      __typename
    }
    createdAt
    durationSeconds
    embedUrl
    isFree
    lessonId
    moduleId
    order
    prerequisites {
      lessonId
      moduleId
      __typename
    }
    questions {
      correctIndex
      id
      options
      question
      __typename
    }
    title
    type
    videoUrl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SetModuleLessonFreeMutationVariables,
  APITypes.SetModuleLessonFreeMutation
>;
export const setModuleLessonPrerequisites = /* GraphQL */ `mutation SetModuleLessonPrerequisites(
  $lessonId: ID!
  $moduleId: ID!
  $prerequisites: [ModuleLessonRefInput!]!
) {
  setModuleLessonPrerequisites(
    lessonId: $lessonId
    moduleId: $moduleId
    prerequisites: $prerequisites
  ) {
    animationRef
    audioUrl
    body
    cards {
      back
      front
      id
      __typename
    }
    createdAt
    durationSeconds
    embedUrl
    isFree
    lessonId
    moduleId
    order
    prerequisites {
      lessonId
      moduleId
      __typename
    }
    questions {
      correctIndex
      id
      options
      question
      __typename
    }
    title
    type
    videoUrl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SetModuleLessonPrerequisitesMutationVariables,
  APITypes.SetModuleLessonPrerequisitesMutation
>;
export const updateCourse = /* GraphQL */ `mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
  updateCourse(id: $id, input: $input) {
    category
    createdAt
    description
    id
    instructorUserId
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
    priceTzs
    status
    thumbnailUrl
    title
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCourseMutationVariables,
  APITypes.UpdateCourseMutation
>;
export const updateLesson = /* GraphQL */ `mutation UpdateLesson($id: ID!, $input: UpdateLessonInput!) {
  updateLesson(id: $id, input: $input) {
    animationRef
    audioUrl
    body
    cards {
      back
      front
      id
      __typename
    }
    createdAt
    durationSeconds
    embedUrl
    id
    instructorUserId
    organizationId
    questions {
      correctIndex
      id
      options
      question
      __typename
    }
    title
    type
    updatedAt
    videoUrl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLessonMutationVariables,
  APITypes.UpdateLessonMutation
>;
export const updateModule = /* GraphQL */ `mutation UpdateModule($id: ID!, $input: UpdateModuleInput!) {
  updateModule(id: $id, input: $input) {
    createdAt
    description
    id
    instructorUserId
    organizationId
    thumbnailUrl
    title
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateModuleMutationVariables,
  APITypes.UpdateModuleMutation
>;
export const updateProfile = /* GraphQL */ `mutation UpdateProfile($input: UpdateUserProfileInput!) {
  updateProfile(input: $input) {
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
        members {
          id
          joinedAt
          organizationId
          permissions
          role
          status
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
          organizationId
          permissions
          role
          status
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
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateProfileMutationVariables,
  APITypes.UpdateProfileMutation
>;
