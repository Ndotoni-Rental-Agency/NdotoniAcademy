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
  wantsToBeInstructor: boolean,
};

export type Organization = {
  __typename: "Organization",
  createdAt: string,
  id: string,
  members?:  Array<OrganizationMembership > | null,
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

export enum InstructorStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}


export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}


export type ModuleLessonRefInput = {
  lessonId: string,
  moduleId: string,
};

export type ModuleLesson = {
  __typename: "ModuleLesson",
  animationRef?: string | null,
  audioUrl?: string | null,
  body?: string | null,
  cards?:  Array<Flashcard > | null,
  createdAt: string,
  document?: Media | null,
  durationSeconds?: number | null,
  embedUrl?: string | null,
  isFree: boolean,
  lessonId: string,
  moduleId: string,
  order: number,
  prerequisites:  Array<ModuleLessonRef >,
  questions?:  Array<QuizQuestion > | null,
  title: string,
  type: LessonType,
  videoUrl?: string | null,
};

export type Flashcard = {
  __typename: "Flashcard",
  back: string,
  backMedia?: Media | null,
  front: string,
  frontMedia?: Media | null,
  id: string,
};

export type Media = {
  __typename: "Media",
  type: MediaType,
  url: string,
};

export enum MediaType {
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}


export type ModuleLessonRef = {
  __typename: "ModuleLessonRef",
  lessonId: string,
  moduleId: string,
};

export type QuizQuestion = {
  __typename: "QuizQuestion",
  correctIndex: number,
  id: string,
  options: Array< string >,
  question: string,
};

export enum LessonType {
  ANIMATION = "ANIMATION",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
  EMBED = "EMBED",
  FLASHCARDS = "FLASHCARDS",
  QUIZ = "QUIZ",
  TEXT = "TEXT",
  VIDEO = "VIDEO",
}


export type CourseModule = {
  __typename: "CourseModule",
  courseId: string,
  createdAt: string,
  description?: string | null,
  isFree: boolean,
  lessonCount: number,
  moduleId: string,
  order: number,
  thumbnailUrl?: string | null,
  title: string,
  totalDurationSeconds: number,
};

export type CreateCourseInput = {
  category?: string | null,
  description?: string | null,
  organizationId?: string | null,
  priceTzs: number,
  thumbnailUrl?: string | null,
  title: string,
};

export type Course = {
  __typename: "Course",
  category?: string | null,
  createdAt: string,
  description?: string | null,
  id: string,
  instructor?: User | null,
  instructorUserId: string,
  organization?: Organization | null,
  organizationId?: string | null,
  priceTzs: number,
  status: CourseStatus,
  thumbnailUrl?: string | null,
  title: string,
  updatedAt: string,
};

export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}


export type CreateLessonInput = {
  animationRef?: string | null,
  audioUrl?: string | null,
  body?: string | null,
  cards?: Array< FlashcardInput > | null,
  document?: MediaInput | null,
  durationSeconds?: number | null,
  embedUrl?: string | null,
  organizationId?: string | null,
  questions?: Array< QuizQuestionInput > | null,
  title: string,
  type: LessonType,
  videoUrl?: string | null,
};

export type FlashcardInput = {
  back: string,
  backMedia?: MediaInput | null,
  front: string,
  frontMedia?: MediaInput | null,
  id: string,
};

export type MediaInput = {
  type: MediaType,
  url: string,
};

export type QuizQuestionInput = {
  correctIndex: number,
  id: string,
  options: Array< string >,
  question: string,
};

export type CreateModuleInput = {
  description?: string | null,
  organizationId?: string | null,
  thumbnailUrl?: string | null,
  title: string,
};

export type CreateOrganizationInput = {
  name: string,
  slug: string,
  type: OrganizationType,
};

export type MediaUploadResponse = {
  __typename: "MediaUploadResponse",
  fileUrl: string,
  key: string,
  uploadUrl: string,
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


export type CourseProgress = {
  __typename: "CourseProgress",
  completedLessonIds: Array< string >,
  courseId: string,
  totalLessons: number,
};

export type ModuleLessonSummary = {
  __typename: "ModuleLessonSummary",
  createdAt: string,
  durationSeconds?: number | null,
  isFree: boolean,
  lessonId: string,
  moduleId: string,
  order: number,
  prerequisites:  Array<ModuleLessonRef >,
  title: string,
  type: LessonType,
};

export type UpdateCourseInput = {
  category?: string | null,
  description?: string | null,
  priceTzs?: number | null,
  status?: CourseStatus | null,
  thumbnailUrl?: string | null,
  title?: string | null,
};

export type UpdateLessonInput = {
  animationRef?: string | null,
  audioUrl?: string | null,
  body?: string | null,
  cards?: Array< FlashcardInput > | null,
  document?: MediaInput | null,
  durationSeconds?: number | null,
  embedUrl?: string | null,
  questions?: Array< QuizQuestionInput > | null,
  title?: string | null,
  videoUrl?: string | null,
};

export type Lesson = {
  __typename: "Lesson",
  animationRef?: string | null,
  audioUrl?: string | null,
  body?: string | null,
  cards?:  Array<Flashcard > | null,
  createdAt: string,
  document?: Media | null,
  durationSeconds?: number | null,
  embedUrl?: string | null,
  id: string,
  instructorUserId: string,
  organizationId?: string | null,
  questions?:  Array<QuizQuestion > | null,
  title: string,
  type: LessonType,
  updatedAt: string,
  videoUrl?: string | null,
};

export type UpdateModuleInput = {
  description?: string | null,
  thumbnailUrl?: string | null,
  title?: string | null,
};

export type Module = {
  __typename: "Module",
  createdAt: string,
  description?: string | null,
  id: string,
  instructorUserId: string,
  organizationId?: string | null,
  thumbnailUrl?: string | null,
  title: string,
  updatedAt: string,
};

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
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    userId: string,
    wantsToBeInstructor: boolean,
  } | null,
};

export type AddLessonToModuleMutationVariables = {
  courseId: string,
  lessonId: string,
  moduleId: string,
  prerequisites?: Array< ModuleLessonRefInput > | null,
};

export type AddLessonToModuleMutation = {
  addLessonToModule:  {
    __typename: "ModuleLesson",
    animationRef?: string | null,
    audioUrl?: string | null,
    body?: string | null,
    cards?:  Array< {
      __typename: "Flashcard",
      back: string,
      backMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      front: string,
      frontMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      id: string,
    } > | null,
    createdAt: string,
    document?:  {
      __typename: "Media",
      type: MediaType,
      url: string,
    } | null,
    durationSeconds?: number | null,
    embedUrl?: string | null,
    isFree: boolean,
    lessonId: string,
    moduleId: string,
    order: number,
    prerequisites:  Array< {
      __typename: "ModuleLessonRef",
      lessonId: string,
      moduleId: string,
    } >,
    questions?:  Array< {
      __typename: "QuizQuestion",
      correctIndex: number,
      id: string,
      options: Array< string >,
      question: string,
    } > | null,
    title: string,
    type: LessonType,
    videoUrl?: string | null,
  },
};

export type AddModuleToCourseMutationVariables = {
  courseId: string,
  moduleId: string,
};

export type AddModuleToCourseMutation = {
  addModuleToCourse:  {
    __typename: "CourseModule",
    courseId: string,
    createdAt: string,
    description?: string | null,
    isFree: boolean,
    lessonCount: number,
    moduleId: string,
    order: number,
    thumbnailUrl?: string | null,
    title: string,
    totalDurationSeconds: number,
  },
};

export type ApplyToBeInstructorMutationVariables = {
};

export type ApplyToBeInstructorMutation = {
  applyToBeInstructor?:  {
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
        members?:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
          wantsToBeInstructor: boolean,
        } > | null,
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
        instructorStatus?: InstructorStatus | null,
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
          wantsToBeInstructor: boolean,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
      wantsToBeInstructor: boolean,
    } >,
    status: UserStatus,
    updatedAt: string,
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
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    userId: string,
    wantsToBeInstructor: boolean,
  } | null,
};

export type CreateCourseMutationVariables = {
  input: CreateCourseInput,
};

export type CreateCourseMutation = {
  createCourse:  {
    __typename: "Course",
    category?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    instructor?:  {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    instructorUserId: string,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId?: string | null,
    priceTzs: number,
    status: CourseStatus,
    thumbnailUrl?: string | null,
    title: string,
    updatedAt: string,
  },
};

export type CreateLessonForModuleMutationVariables = {
  courseId: string,
  input: CreateLessonInput,
  moduleId: string,
  prerequisites?: Array< ModuleLessonRefInput > | null,
};

export type CreateLessonForModuleMutation = {
  createLessonForModule:  {
    __typename: "ModuleLesson",
    animationRef?: string | null,
    audioUrl?: string | null,
    body?: string | null,
    cards?:  Array< {
      __typename: "Flashcard",
      back: string,
      backMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      front: string,
      frontMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      id: string,
    } > | null,
    createdAt: string,
    document?:  {
      __typename: "Media",
      type: MediaType,
      url: string,
    } | null,
    durationSeconds?: number | null,
    embedUrl?: string | null,
    isFree: boolean,
    lessonId: string,
    moduleId: string,
    order: number,
    prerequisites:  Array< {
      __typename: "ModuleLessonRef",
      lessonId: string,
      moduleId: string,
    } >,
    questions?:  Array< {
      __typename: "QuizQuestion",
      correctIndex: number,
      id: string,
      options: Array< string >,
      question: string,
    } > | null,
    title: string,
    type: LessonType,
    videoUrl?: string | null,
  },
};

export type CreateModuleForCourseMutationVariables = {
  courseId: string,
  input: CreateModuleInput,
};

export type CreateModuleForCourseMutation = {
  createModuleForCourse:  {
    __typename: "CourseModule",
    courseId: string,
    createdAt: string,
    description?: string | null,
    isFree: boolean,
    lessonCount: number,
    moduleId: string,
    order: number,
    thumbnailUrl?: string | null,
    title: string,
    totalDurationSeconds: number,
  },
};

export type CreateOrganizationMutationVariables = {
  input: CreateOrganizationInput,
};

export type CreateOrganizationMutation = {
  createOrganization?:  {
    __typename: "Organization",
    createdAt: string,
    id: string,
    members?:  Array< {
      __typename: "OrganizationMembership",
      id: string,
      joinedAt?: string | null,
      organization?:  {
        __typename: "Organization",
        createdAt: string,
        id: string,
        members?:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
          wantsToBeInstructor: boolean,
        } > | null,
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
        instructorStatus?: InstructorStatus | null,
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
          wantsToBeInstructor: boolean,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
      wantsToBeInstructor: boolean,
    } > | null,
    name: string,
    slug: string,
    status: OrganizationStatus,
    type: OrganizationType,
  } | null,
};

export type DeleteCourseMutationVariables = {
  id: string,
};

export type DeleteCourseMutation = {
  deleteCourse?: boolean | null,
};

export type DeleteLessonMutationVariables = {
  id: string,
};

export type DeleteLessonMutation = {
  deleteLesson?: boolean | null,
};

export type DeleteModuleMutationVariables = {
  id: string,
};

export type DeleteModuleMutation = {
  deleteModule?: boolean | null,
};

export type GenerateFlashcardsFromTextMutationVariables = {
  count?: number | null,
  text: string,
};

export type GenerateFlashcardsFromTextMutation = {
  generateFlashcardsFromText:  Array< {
    __typename: "Flashcard",
    back: string,
    backMedia?:  {
      __typename: "Media",
      type: MediaType,
      url: string,
    } | null,
    front: string,
    frontMedia?:  {
      __typename: "Media",
      type: MediaType,
      url: string,
    } | null,
    id: string,
  } >,
};

export type GenerateQuizFromTextMutationVariables = {
  count?: number | null,
  text: string,
};

export type GenerateQuizFromTextMutation = {
  generateQuizFromText:  Array< {
    __typename: "QuizQuestion",
    correctIndex: number,
    id: string,
    options: Array< string >,
    question: string,
  } >,
};

export type GetCourseMediaUploadUrlMutationVariables = {
  contentType: string,
  fileName: string,
};

export type GetCourseMediaUploadUrlMutation = {
  getCourseMediaUploadUrl:  {
    __typename: "MediaUploadResponse",
    fileUrl: string,
    key: string,
    uploadUrl: string,
  },
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
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
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

export type MarkLessonCompleteMutationVariables = {
  courseId: string,
  lessonId: string,
};

export type MarkLessonCompleteMutation = {
  markLessonComplete:  {
    __typename: "CourseProgress",
    completedLessonIds: Array< string >,
    courseId: string,
    totalLessons: number,
  },
};

export type RemoveLessonFromModuleMutationVariables = {
  lessonId: string,
  moduleId: string,
};

export type RemoveLessonFromModuleMutation = {
  removeLessonFromModule?: boolean | null,
};

export type RemoveMemberMutationVariables = {
  organizationId: string,
  userId: string,
};

export type RemoveMemberMutation = {
  removeMember?: boolean | null,
};

export type RemoveModuleFromCourseMutationVariables = {
  courseId: string,
  moduleId: string,
};

export type RemoveModuleFromCourseMutation = {
  removeModuleFromCourse?: boolean | null,
};

export type ReorderCourseModulesMutationVariables = {
  courseId: string,
  moduleIds: Array< string >,
};

export type ReorderCourseModulesMutation = {
  reorderCourseModules:  Array< {
    __typename: "CourseModule",
    courseId: string,
    createdAt: string,
    description?: string | null,
    isFree: boolean,
    lessonCount: number,
    moduleId: string,
    order: number,
    thumbnailUrl?: string | null,
    title: string,
    totalDurationSeconds: number,
  } >,
};

export type ReorderModuleLessonsMutationVariables = {
  courseId: string,
  lessonIds: Array< string >,
  moduleId: string,
};

export type ReorderModuleLessonsMutation = {
  reorderModuleLessons:  Array< {
    __typename: "ModuleLessonSummary",
    createdAt: string,
    durationSeconds?: number | null,
    isFree: boolean,
    lessonId: string,
    moduleId: string,
    order: number,
    prerequisites:  Array< {
      __typename: "ModuleLessonRef",
      lessonId: string,
      moduleId: string,
    } >,
    title: string,
    type: LessonType,
  } >,
};

export type RequestInstructorRoleMutationVariables = {
  organizationId: string,
};

export type RequestInstructorRoleMutation = {
  requestInstructorRole?:  {
    __typename: "OrganizationMembership",
    id: string,
    joinedAt?: string | null,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    userId: string,
    wantsToBeInstructor: boolean,
  } | null,
};

export type RevokeInvitationMutationVariables = {
  email: string,
  organizationId: string,
};

export type RevokeInvitationMutation = {
  revokeInvitation?: boolean | null,
};

export type SetInstructorStatusMutationVariables = {
  status: InstructorStatus,
  userId: string,
};

export type SetInstructorStatusMutation = {
  setInstructorStatus?:  {
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
        members?:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
          wantsToBeInstructor: boolean,
        } > | null,
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
        instructorStatus?: InstructorStatus | null,
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
          wantsToBeInstructor: boolean,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
      wantsToBeInstructor: boolean,
    } >,
    status: UserStatus,
    updatedAt: string,
  } | null,
};

export type SetModuleLessonPrerequisitesMutationVariables = {
  courseId: string,
  lessonId: string,
  moduleId: string,
  prerequisites: Array< ModuleLessonRefInput >,
};

export type SetModuleLessonPrerequisitesMutation = {
  setModuleLessonPrerequisites:  {
    __typename: "ModuleLesson",
    animationRef?: string | null,
    audioUrl?: string | null,
    body?: string | null,
    cards?:  Array< {
      __typename: "Flashcard",
      back: string,
      backMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      front: string,
      frontMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      id: string,
    } > | null,
    createdAt: string,
    document?:  {
      __typename: "Media",
      type: MediaType,
      url: string,
    } | null,
    durationSeconds?: number | null,
    embedUrl?: string | null,
    isFree: boolean,
    lessonId: string,
    moduleId: string,
    order: number,
    prerequisites:  Array< {
      __typename: "ModuleLessonRef",
      lessonId: string,
      moduleId: string,
    } >,
    questions?:  Array< {
      __typename: "QuizQuestion",
      correctIndex: number,
      id: string,
      options: Array< string >,
      question: string,
    } > | null,
    title: string,
    type: LessonType,
    videoUrl?: string | null,
  },
};

export type TranscribeDocumentMutationVariables = {
  fileUrl: string,
};

export type TranscribeDocumentMutation = {
  transcribeDocument: string,
};

export type UpdateCourseMutationVariables = {
  id: string,
  input: UpdateCourseInput,
};

export type UpdateCourseMutation = {
  updateCourse:  {
    __typename: "Course",
    category?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    instructor?:  {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    instructorUserId: string,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId?: string | null,
    priceTzs: number,
    status: CourseStatus,
    thumbnailUrl?: string | null,
    title: string,
    updatedAt: string,
  },
};

export type UpdateLessonMutationVariables = {
  id: string,
  input: UpdateLessonInput,
};

export type UpdateLessonMutation = {
  updateLesson:  {
    __typename: "Lesson",
    animationRef?: string | null,
    audioUrl?: string | null,
    body?: string | null,
    cards?:  Array< {
      __typename: "Flashcard",
      back: string,
      backMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      front: string,
      frontMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      id: string,
    } > | null,
    createdAt: string,
    document?:  {
      __typename: "Media",
      type: MediaType,
      url: string,
    } | null,
    durationSeconds?: number | null,
    embedUrl?: string | null,
    id: string,
    instructorUserId: string,
    organizationId?: string | null,
    questions?:  Array< {
      __typename: "QuizQuestion",
      correctIndex: number,
      id: string,
      options: Array< string >,
      question: string,
    } > | null,
    title: string,
    type: LessonType,
    updatedAt: string,
    videoUrl?: string | null,
  },
};

export type UpdateModuleMutationVariables = {
  id: string,
  input: UpdateModuleInput,
};

export type UpdateModuleMutation = {
  updateModule:  {
    __typename: "Module",
    createdAt: string,
    description?: string | null,
    id: string,
    instructorUserId: string,
    organizationId?: string | null,
    thumbnailUrl?: string | null,
    title: string,
    updatedAt: string,
  },
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
        members?:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
          wantsToBeInstructor: boolean,
        } > | null,
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
        instructorStatus?: InstructorStatus | null,
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
          wantsToBeInstructor: boolean,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
      wantsToBeInstructor: boolean,
    } >,
    status: UserStatus,
    updatedAt: string,
  } | null,
};

export type CourseQueryVariables = {
  id: string,
};

export type CourseQuery = {
  course?:  {
    __typename: "Course",
    category?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    instructor?:  {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    instructorUserId: string,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId?: string | null,
    priceTzs: number,
    status: CourseStatus,
    thumbnailUrl?: string | null,
    title: string,
    updatedAt: string,
  } | null,
};

export type CoursesForOrganizationQueryVariables = {
  organizationId: string,
};

export type CoursesForOrganizationQuery = {
  coursesForOrganization:  Array< {
    __typename: "Course",
    category?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    instructor?:  {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    instructorUserId: string,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId?: string | null,
    priceTzs: number,
    status: CourseStatus,
    thumbnailUrl?: string | null,
    title: string,
    updatedAt: string,
  } >,
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
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
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

export type LessonQueryVariables = {
  courseId: string,
  lessonId: string,
  moduleId: string,
};

export type LessonQuery = {
  lesson?:  {
    __typename: "ModuleLesson",
    animationRef?: string | null,
    audioUrl?: string | null,
    body?: string | null,
    cards?:  Array< {
      __typename: "Flashcard",
      back: string,
      backMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      front: string,
      frontMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      id: string,
    } > | null,
    createdAt: string,
    document?:  {
      __typename: "Media",
      type: MediaType,
      url: string,
    } | null,
    durationSeconds?: number | null,
    embedUrl?: string | null,
    isFree: boolean,
    lessonId: string,
    moduleId: string,
    order: number,
    prerequisites:  Array< {
      __typename: "ModuleLessonRef",
      lessonId: string,
      moduleId: string,
    } >,
    questions?:  Array< {
      __typename: "QuizQuestion",
      correctIndex: number,
      id: string,
      options: Array< string >,
      question: string,
    } > | null,
    title: string,
    type: LessonType,
    videoUrl?: string | null,
  } | null,
};

export type LessonsForModuleQueryVariables = {
  courseId: string,
  moduleId: string,
};

export type LessonsForModuleQuery = {
  lessonsForModule:  Array< {
    __typename: "ModuleLessonSummary",
    createdAt: string,
    durationSeconds?: number | null,
    isFree: boolean,
    lessonId: string,
    moduleId: string,
    order: number,
    prerequisites:  Array< {
      __typename: "ModuleLessonRef",
      lessonId: string,
      moduleId: string,
    } >,
    title: string,
    type: LessonType,
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
        members?:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
          wantsToBeInstructor: boolean,
        } > | null,
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
        instructorStatus?: InstructorStatus | null,
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
          wantsToBeInstructor: boolean,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
      wantsToBeInstructor: boolean,
    } >,
    status: UserStatus,
    updatedAt: string,
  } | null,
};

export type ModuleQueryVariables = {
  id: string,
};

export type ModuleQuery = {
  module?:  {
    __typename: "Module",
    createdAt: string,
    description?: string | null,
    id: string,
    instructorUserId: string,
    organizationId?: string | null,
    thumbnailUrl?: string | null,
    title: string,
    updatedAt: string,
  } | null,
};

export type ModulesForCourseQueryVariables = {
  courseId: string,
};

export type ModulesForCourseQuery = {
  modulesForCourse:  Array< {
    __typename: "CourseModule",
    courseId: string,
    createdAt: string,
    description?: string | null,
    isFree: boolean,
    lessonCount: number,
    moduleId: string,
    order: number,
    thumbnailUrl?: string | null,
    title: string,
    totalDurationSeconds: number,
  } >,
};

export type MyCourseProgressQueryVariables = {
  courseId: string,
};

export type MyCourseProgressQuery = {
  myCourseProgress:  {
    __typename: "CourseProgress",
    completedLessonIds: Array< string >,
    courseId: string,
    totalLessons: number,
  },
};

export type MyCoursesQueryVariables = {
};

export type MyCoursesQuery = {
  myCourses:  Array< {
    __typename: "Course",
    category?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    instructor?:  {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    instructorUserId: string,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId?: string | null,
    priceTzs: number,
    status: CourseStatus,
    thumbnailUrl?: string | null,
    title: string,
    updatedAt: string,
  } >,
};

export type MyLessonsQueryVariables = {
};

export type MyLessonsQuery = {
  myLessons:  Array< {
    __typename: "Lesson",
    animationRef?: string | null,
    audioUrl?: string | null,
    body?: string | null,
    cards?:  Array< {
      __typename: "Flashcard",
      back: string,
      backMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      front: string,
      frontMedia?:  {
        __typename: "Media",
        type: MediaType,
        url: string,
      } | null,
      id: string,
    } > | null,
    createdAt: string,
    document?:  {
      __typename: "Media",
      type: MediaType,
      url: string,
    } | null,
    durationSeconds?: number | null,
    embedUrl?: string | null,
    id: string,
    instructorUserId: string,
    organizationId?: string | null,
    questions?:  Array< {
      __typename: "QuizQuestion",
      correctIndex: number,
      id: string,
      options: Array< string >,
      question: string,
    } > | null,
    title: string,
    type: LessonType,
    updatedAt: string,
    videoUrl?: string | null,
  } >,
};

export type MyModulesQueryVariables = {
};

export type MyModulesQuery = {
  myModules:  Array< {
    __typename: "Module",
    createdAt: string,
    description?: string | null,
    id: string,
    instructorUserId: string,
    organizationId?: string | null,
    thumbnailUrl?: string | null,
    title: string,
    updatedAt: string,
  } >,
};

export type OrganizationQueryVariables = {
  id: string,
};

export type OrganizationQuery = {
  organization?:  {
    __typename: "Organization",
    createdAt: string,
    id: string,
    members?:  Array< {
      __typename: "OrganizationMembership",
      id: string,
      joinedAt?: string | null,
      organization?:  {
        __typename: "Organization",
        createdAt: string,
        id: string,
        members?:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
          wantsToBeInstructor: boolean,
        } > | null,
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
        instructorStatus?: InstructorStatus | null,
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
          wantsToBeInstructor: boolean,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
      wantsToBeInstructor: boolean,
    } > | null,
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
    members?:  Array< {
      __typename: "OrganizationMembership",
      id: string,
      joinedAt?: string | null,
      organization?:  {
        __typename: "Organization",
        createdAt: string,
        id: string,
        members?:  Array< {
          __typename: "OrganizationMembership",
          id: string,
          joinedAt?: string | null,
          organizationId: string,
          permissions: Array< string >,
          role: MembershipRole,
          status: MembershipStatus,
          userId: string,
          wantsToBeInstructor: boolean,
        } > | null,
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
        instructorStatus?: InstructorStatus | null,
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
          wantsToBeInstructor: boolean,
        } >,
        status: UserStatus,
        updatedAt: string,
      } | null,
      userId: string,
      wantsToBeInstructor: boolean,
    } > | null,
    name: string,
    slug: string,
    status: OrganizationStatus,
    type: OrganizationType,
  } | null,
};

export type PublicCoursesQueryVariables = {
};

export type PublicCoursesQuery = {
  publicCourses:  Array< {
    __typename: "Course",
    category?: string | null,
    createdAt: string,
    description?: string | null,
    id: string,
    instructor?:  {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    instructorUserId: string,
    organization?:  {
      __typename: "Organization",
      createdAt: string,
      id: string,
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
      name: string,
      slug: string,
      status: OrganizationStatus,
      type: OrganizationType,
    } | null,
    organizationId?: string | null,
    priceTzs: number,
    status: CourseStatus,
    thumbnailUrl?: string | null,
    title: string,
    updatedAt: string,
  } >,
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
      members?:  Array< {
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } > | null,
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
          instructorStatus?: InstructorStatus | null,
          lastName?: string | null,
          status: UserStatus,
          updatedAt: string,
        } | null,
        userId: string,
        wantsToBeInstructor: boolean,
      } >,
      status: UserStatus,
      updatedAt: string,
    } | null,
    userId: string,
    wantsToBeInstructor: boolean,
  } | null,
};
