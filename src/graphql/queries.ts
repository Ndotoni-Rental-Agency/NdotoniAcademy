/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const course = /* GraphQL */ `query Course($id: ID!) {
  course(id: $id) {
    category
    createdAt
    description
    id
    instructor {
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
` as GeneratedQuery<APITypes.CourseQueryVariables, APITypes.CourseQuery>;
export const coursesForOrganization = /* GraphQL */ `query CoursesForOrganization($organizationId: ID!) {
  coursesForOrganization(organizationId: $organizationId) {
    category
    createdAt
    description
    id
    instructor {
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
` as GeneratedQuery<
  APITypes.CoursesForOrganizationQueryVariables,
  APITypes.CoursesForOrganizationQuery
>;
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
` as GeneratedQuery<
  APITypes.InvitationsForOrganizationQueryVariables,
  APITypes.InvitationsForOrganizationQuery
>;
export const lesson = /* GraphQL */ `query Lesson($lessonId: ID!, $moduleId: ID!) {
  lesson(lessonId: $lessonId, moduleId: $moduleId) {
    animationRef
    audioUrl
    body
    cards {
      back
      backMedia {
        type
        url
        __typename
      }
      front
      frontMedia {
        type
        url
        __typename
      }
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
` as GeneratedQuery<APITypes.LessonQueryVariables, APITypes.LessonQuery>;
export const lessonsForModule = /* GraphQL */ `query LessonsForModule($moduleId: ID!) {
  lessonsForModule(moduleId: $moduleId) {
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
` as GeneratedQuery<
  APITypes.LessonsForModuleQueryVariables,
  APITypes.LessonsForModuleQuery
>;
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
` as GeneratedQuery<APITypes.MeQueryVariables, APITypes.MeQuery>;
export const module = /* GraphQL */ `query Module($id: ID!) {
  module(id: $id) {
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
` as GeneratedQuery<APITypes.ModuleQueryVariables, APITypes.ModuleQuery>;
export const modulesForCourse = /* GraphQL */ `query ModulesForCourse($courseId: ID!) {
  modulesForCourse(courseId: $courseId) {
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
` as GeneratedQuery<
  APITypes.ModulesForCourseQueryVariables,
  APITypes.ModulesForCourseQuery
>;
export const myCourses = /* GraphQL */ `query MyCourses {
  myCourses {
    category
    createdAt
    description
    id
    instructor {
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
` as GeneratedQuery<APITypes.MyCoursesQueryVariables, APITypes.MyCoursesQuery>;
export const myLessons = /* GraphQL */ `query MyLessons {
  myLessons {
    animationRef
    audioUrl
    body
    cards {
      back
      backMedia {
        type
        url
        __typename
      }
      front
      frontMedia {
        type
        url
        __typename
      }
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
` as GeneratedQuery<APITypes.MyLessonsQueryVariables, APITypes.MyLessonsQuery>;
export const myModules = /* GraphQL */ `query MyModules {
  myModules {
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
` as GeneratedQuery<APITypes.MyModulesQueryVariables, APITypes.MyModulesQuery>;
export const organization = /* GraphQL */ `query Organization($id: ID!) {
  organization(id: $id) {
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
` as GeneratedQuery<
  APITypes.OrganizationBySlugQueryVariables,
  APITypes.OrganizationBySlugQuery
>;
export const publicCourses = /* GraphQL */ `query PublicCourses {
  publicCourses {
    category
    createdAt
    description
    id
    instructor {
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
` as GeneratedQuery<
  APITypes.PublicCoursesQueryVariables,
  APITypes.PublicCoursesQuery
>;
