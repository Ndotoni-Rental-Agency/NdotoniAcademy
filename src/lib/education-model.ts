// ============================================================
// Ndotoni Academy — Core Domain Model (v3)
// ============================================================
// Hierarchy:
//   Program → Level → Course → Module → Lesson → ContentBlock
//   Assessment + Question + Assignment attach at any level
//   Enrollment + Progress track learner state
//   Certificate records achievement
//
// Changes from v2:
//   1. ContentBlock.content:string → typed ContentData union
//   2. Level entity extracted from Course
//   3. Enrollment scoped to Program + Level + Course
//   4. Progress made generic (entityType + entityId)
//   5. PublishStatus added to Course, Module, Lesson
//   6. CreatorType (USER | AI | SYSTEM) added to content entities
//   7. Tags as first-class entities instead of string category
//   8. LearningObjective as first-class entity
//   9. Certificate references achievementId
// ============================================================

// ─── Primitive enums ─────────────────────────────────────────

export type ContentType =
  | 'TEXT'
  | 'VIDEO'
  | 'AUDIO'
  | 'IMAGE'
  | 'PDF'
  | 'FLASHCARD'
  | 'DIAGRAM'
  | 'INTERACTIVE'
  | 'AI_TUTOR';

export type AssessmentScope = 'LESSON' | 'MODULE' | 'COURSE' | 'PROGRAM';
export type AssessmentType  = 'QUIZ' | 'EXAM' | 'ASSIGNMENT';

export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'FILL_BLANK'
  | 'MATCHING';

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'PAUSED';

/**
 * Lifecycle state for any authored entity.
 * DRAFT   → being worked on, invisible to learners
 * REVIEW  → submitted for approval
 * PUBLISHED → live to enrolled learners
 * ARCHIVED  → retired, read-only
 */
export type PublishStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

/**
 * Who or what created a piece of content.
 * Useful for analytics, trust levels, and moderation queues.
 */
export type CreatorType = 'USER' | 'AI' | 'SYSTEM';

/**
 * Bloom's Taxonomy level — used on LearningObjective.
 * Enables competency-based learning and adaptive paths.
 */
export type BloomLevel =
  | 'REMEMBER'
  | 'UNDERSTAND'
  | 'APPLY'
  | 'ANALYZE'
  | 'EVALUATE'
  | 'CREATE';

// ─── Tag ─────────────────────────────────────────────────────
// First-class entity replacing free-text category strings.
// Searchable, filterable, and reusable across Programs/Courses.

export interface Tag {
  id: string;
  slug: string;   // e.g. "mathematics", "primary-education"
  label: string;  // e.g. "Mathematics"
  color?: string; // hex for UI
}

// ─── LearningObjective ───────────────────────────────────────
// First-class entity that connects lessons ↔ assessments ↔ skills.
// Enables competency tracking and adaptive learning paths.

export interface LearningObjective {
  id: string;
  /** e.g. "Add two-digit numbers without carrying" */
  description: string;
  bloomLevel: BloomLevel;
  /** The Lesson, Module, or Course this objective belongs to */
  entityType: 'LESSON' | 'MODULE' | 'COURSE';
  entityId: string;
}

// ─── Program ─────────────────────────────────────────────────
// Top-level container. One Program can represent:
//   "Tanzania Primary Education", "AWS Certification", "Bootcamp"

export interface Program {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tagIds: string[];
  targetAudience?: string; // e.g. "6–13 years", "Working professionals"
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Level ───────────────────────────────────────────────────
// The structural tier within a Program.
// Primary → Standard 1 … Standard 7
// University CS → Year 1 Semester 1, Year 1 Semester 2 …
// Bootcamp → Week 1, Week 2 …

export interface Level {
  id: string;
  programId: string;
  title: string;       // "Standard 1", "Form 2", "Year 1 Semester 1"
  titleSwahili?: string; // "Darasa la 1"
  order: number;
  ageRange?: string;   // "6–7", "14–15"
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Course ──────────────────────────────────────────────────
// A single subject or discipline within a Level.
// e.g. "Mathematics", "Kiswahili", "Biology", "React Fundamentals"

export interface Course {
  id: string;
  levelId: string;     // belongs to a Level, not directly to Program
  title: string;
  titleSwahili?: string;
  description: string;
  shortDescription: string;
  tagIds: string[];
  imageUrl?: string;
  color?: string;
  outcomes: string[];          // plain text — for display
  objectiveIds: string[];      // refs to LearningObjective entities
  prerequisites: string[];     // plain text for now; could be courseId refs
  estimatedDuration: string;
  instructorId?: string;
  status: PublishStatus;
  enrolledCount?: number;      // denormalized counter — not source of truth
  completionRate?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Module ──────────────────────────────────────────────────
// A grouped unit of learning within a Course.
// e.g. "Numbers 1–10", "Addition", "Photosynthesis", "React Hooks"

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  objectiveIds: string[];
  estimatedDuration: string;
  icon?: string;          // lucide-react icon name
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Lesson ──────────────────────────────────────────────────
// An individual learning unit within a Module.
// e.g. "Counting 1–5", "What is addition?", "Using a number line"

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  order: number;
  objectiveIds: string[];
  estimatedDuration: string;
  isFree: boolean;        // preview access without enrollment
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── ContentData — typed payloads (replaces content:string) ──
// Each variant has explicit fields — no JSON-in-string tricks.
// The UI dispatches on `type`; the API/DB knows the exact schema.

export interface TextContent {
  type: 'TEXT';
  markdown: string;
  wordCount?: number;
}

export interface VideoContent {
  type: 'VIDEO';
  url: string;
  provider: 'YOUTUBE' | 'VIMEO' | 'S3' | 'OTHER';
  durationSeconds: number;
  /** VTT or SRT caption file URL */
  captionsUrl?: string;
  thumbnailUrl?: string;
}

export interface AudioContent {
  type: 'AUDIO';
  url: string;
  durationSeconds: number;
  transcriptMarkdown?: string;
}

export interface ImageContent {
  type: 'IMAGE';
  url: string;
  altText: string;
}

export interface PdfContent {
  type: 'PDF';
  url: string;
  pageCount?: number;
}

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  imageUrl?: string;
}

export interface FlashcardContent {
  type: 'FLASHCARD';
  cards: FlashCard[];
}

export interface DiagramLabel {
  id: string;
  text: string;
  x: number; // % position
  y: number;
}

export interface DiagramContent {
  type: 'DIAGRAM';
  url: string;
  altText: string;
  labels?: DiagramLabel[];
}

export interface InteractiveContent {
  type: 'INTERACTIVE';
  embedUrl: string;
  /** Markdown fallback if embed is unavailable */
  fallbackMarkdown?: string;
}

export interface AiTutorContent {
  type: 'AI_TUTOR';
  systemPrompt: string;
  suggestedQuestions: string[];
  /** Which model / config to use — resolved server-side */
  modelConfig?: string;
}

export type ContentData =
  | TextContent
  | VideoContent
  | AudioContent
  | ImageContent
  | PdfContent
  | FlashcardContent
  | DiagramContent
  | InteractiveContent
  | AiTutorContent;

// ─── ContentBlock ─────────────────────────────────────────────
// Atomic unit of learning content attached to a Lesson.
// `data` is fully typed — no JSON-string content field.

export interface ContentBlock {
  id: string;
  lessonId: string;
  type: ContentType;  // matches data.type — kept for fast DB queries
  title: string;
  data: ContentData;
  duration?: string;  // human-readable: "3 min"
  order: number;
  caption?: string;
  /** Who/what created this block */
  createdBy: CreatorType;
  createdAt: string;
  updatedAt: string;
}

// ─── Assessment ──────────────────────────────────────────────
// One shape covers QUIZ, EXAM, and ASSIGNMENT.
// scope + scopeId say where it attaches in the hierarchy.

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: AssessmentType;
  scope: AssessmentScope;
  /** ID of the Lesson / Module / Course / Program it belongs to */
  scopeId: string;
  passingScore: number;   // percentage
  timeLimit?: number;     // minutes; undefined = untimed
  maxAttempts: number;    // 0 = unlimited
  weight?: number;        // % toward final grade
  /** ASSIGNMENT only — detailed markdown instructions */
  instructions?: string;
  rubric?: RubricItem[];
  /** Who/what authored this assessment */
  createdBy: CreatorType;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RubricItem {
  criterion: string;
  maxPoints: number;
  levels: { label: string; points: number; description: string }[];
}

// ─── Question ────────────────────────────────────────────────
// Belongs to an Assessment. Fully typed options field.

export interface Question {
  id: string;
  assessmentId: string;
  type: QuestionType;
  questionText: string;
  order: number;
  points: number;
  explanation?: string;   // shown after answering
  /** Parsed options — array for MC/matching, empty for fill-blank */
  options: string[];
  /** Correct answer: index string for MC/TF, text for fill-blank */
  answer: string;
  /** Who/what authored this question */
  createdBy: CreatorType;
  createdAt: string;
  updatedAt: string;
}

// ─── Instructor ──────────────────────────────────────────────

export interface Instructor {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
  expertise: string[];
}

// ─── Enrollment ──────────────────────────────────────────────
// Learner joins at any level of the hierarchy.
//
// Examples:
//   A child joins Standard 4 (programId + levelId, no courseId)
//   A professional buys a single course (programId + courseId)
//   An admin previews everything (programId only)

export interface Enrollment {
  id: string;
  userId: string;
  programId: string;
  levelId?: string;   // set when enrolling in a class/year/semester
  courseId?: string;  // set when enrolling in a single course
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
}

// ─── Progress ────────────────────────────────────────────────
// One row per learner per entity.
// Generic entityType + entityId instead of hard-coded lessonId.
// Aggregation (module %, course %) is COMPUTED from these rows, not stored.
//
// Examples:
//   { entityType:'LESSON',  entityId:'les-123', completed:true,  score:85 }
//   { entityType:'MODULE',  entityId:'mod-456', completed:false, score:null }
//   { entityType:'COURSE',  entityId:'crs-789', completed:true,  score:72 }

export type ProgressEntityType = 'LESSON' | 'MODULE' | 'COURSE' | 'PROGRAM';

export interface Progress {
  id: string;
  userId: string;
  entityType: ProgressEntityType;
  entityId: string;
  completed: boolean;
  score?: number;             // 0–100; null if not yet assessed
  timeSpentSeconds?: number;
  completedAt?: string;
  updatedAt: string;
}

// ─── AssessmentAttempt ───────────────────────────────────────

export interface AssessmentAttempt {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  passed: boolean;
  answers: AnswerRecord[];
  submittedAt: string;
  submissionContent?: string;  // ASSIGNMENT text submission
  submissionFileUrl?: string;  // ASSIGNMENT file submission
  feedback?: string;
}

export interface AnswerRecord {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
}

// ─── Achievement ─────────────────────────────────────────────
// A reusable achievement definition that Certificates reference.
// Decouples "what was earned" from "who earned it".

export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** Skills demonstrated — used on the certificate */
  skills: string[];
  /** Which course or program this achievement belongs to */
  entityType: 'COURSE' | 'PROGRAM';
  entityId: string;
  imageUrl?: string;
}

// ─── Certificate ─────────────────────────────────────────────

export interface Certificate {
  id: string;
  userId: string;
  achievementId: string;  // references Achievement, not courseId directly
  score: number;
  issuedAt: string;
  verifyUrl?: string;     // publicly verifiable link
}

// ─── API response shapes (not stored) ────────────────────────
// Assembled by service layer for specific use cases.

/** Full course page — built by CourseService.GetCourseDetails */
export interface CourseDetail {
  course: Course;
  level: Level;
  program: Program;
  modules: Array<{
    module: Module;
    lessons: Array<{
      lesson: Lesson;
      contentBlocks: ContentBlock[];
      assessments: Assessment[];
    }>;
    assessments: Assessment[];
  }>;
  courseAssessment?: Assessment;
  instructor?: Instructor;
  objectives: LearningObjective[];
  tags: Tag[];
}

/** Flat item for listing/search pages */
export interface CourseListItem {
  id: string;
  levelId: string;
  levelTitle: string;
  programId: string;
  programTitle: string;
  title: string;
  titleSwahili?: string;
  shortDescription: string;
  tags: Tag[];
  imageUrl?: string;
  color?: string;
  moduleCount: number;
  lessonCount: number;
  estimatedDuration: string;
  status: PublishStatus;
  enrolledCount?: number;
  completionRate?: number;
  instructor?: Pick<Instructor, 'id' | 'name' | 'avatarUrl'>;
  isFeatured?: boolean;
}

/** Smithy service map — not instantiated, documents intended API boundaries */
export type ServiceMap = {
  /**
   * StudentService
   *   GetCourseCatalog  → CourseListItem[]
   *   GetCourseDetails  → CourseDetail
   *   StartLesson       → { lesson, contentBlocks }
   *   CompleteLesson    → Progress
   *   SubmitAssessment  → AssessmentAttempt
   *   GetProgress       → Progress[]
   */
  StudentService: never;

  /**
   * InstructorService
   *   CreateCourse      → Course
   *   AddLesson         → Lesson
   *   AddContentBlock   → ContentBlock
   *   CreateAssessment  → Assessment
   *   PublishCourse     → Course (status → PUBLISHED)
   */
  InstructorService: never;

  /**
   * AdminService
   *   CreateProgram     → Program
   *   CreateLevel       → Level
   *   ManageEnrollment  → Enrollment
   *   IssueCertificate  → Certificate
   */
  AdminService: never;
};
