/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const certificateByPublicId = /* GraphQL */ `query CertificateByPublicId($id: ID!) {
  certificateByPublicId(id: $id) {
    category
    courseId
    courseTitle
    holderName
    id
    instructorName
    issuedAt
    totalLessons
    __typename
  }
}
` as GeneratedQuery<
  APITypes.CertificateByPublicIdQueryVariables,
  APITypes.CertificateByPublicIdQuery
>;
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
export const courseExam = /* GraphQL */ `query CourseExam($courseId: ID!) {
  courseExam(courseId: $courseId) {
    courseId
    passingScorePercent
    questions {
      correctIndex
      id
      options
      question
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.CourseExamQueryVariables,
  APITypes.CourseExamQuery
>;
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
export const examToTake = /* GraphQL */ `query ExamToTake($courseId: ID!) {
  examToTake(courseId: $courseId) {
    courseId
    passingScorePercent
    questions {
      id
      options
      question
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ExamToTakeQueryVariables,
  APITypes.ExamToTakeQuery
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
export const lesson = /* GraphQL */ `query Lesson($courseId: ID!, $lessonId: ID!, $moduleId: ID!) {
  lesson(courseId: $courseId, lessonId: $lessonId, moduleId: $moduleId) {
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
    document {
      type
      url
      __typename
    }
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
export const lessonsForModule = /* GraphQL */ `query LessonsForModule($courseId: ID!, $moduleId: ID!) {
  lessonsForModule(courseId: $courseId, moduleId: $moduleId) {
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
export const myCertificates = /* GraphQL */ `query MyCertificates {
  myCertificates {
    category
    courseId
    courseTitle
    holderName
    id
    instructorName
    issuedAt
    totalLessons
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MyCertificatesQueryVariables,
  APITypes.MyCertificatesQuery
>;
export const myCourseProgress = /* GraphQL */ `query MyCourseProgress($courseId: ID!) {
  myCourseProgress(courseId: $courseId) {
    completedLessonIds
    courseId
    totalLessons
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MyCourseProgressQueryVariables,
  APITypes.MyCourseProgressQuery
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
export const myExamAttempt = /* GraphQL */ `query MyExamAttempt($courseId: ID!) {
  myExamAttempt(courseId: $courseId) {
    attemptedAt
    courseId
    passed
    score
    total
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MyExamAttemptQueryVariables,
  APITypes.MyExamAttemptQuery
>;
export const myLearning = /* GraphQL */ `query MyLearning {
  myLearning {
    category
    completedLessonCount
    courseId
    lastActivityAt
    resumeLessonId
    resumeModuleId
    thumbnailUrl
    title
    totalLessons
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MyLearningQueryVariables,
  APITypes.MyLearningQuery
>;
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
    document {
      type
      url
      __typename
    }
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
