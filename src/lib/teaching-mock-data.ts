// ============================================================
// Mock Data: Instructor course/lesson builder ("Teaching")
//
// Deliberately isolated from mock-data.ts. Flashcards and the
// block-based lesson shape used here don't exist in the real
// Course/Module model or the learner-facing lesson player, so
// this stays a self-contained, local-state-only illustration.
// ============================================================

export type LessonBlockType = 'video' | 'flashcards' | 'guide' | 'quiz';

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  title: string;
  meta: string;
}

export interface TeachingModule {
  id: string;
  title: string;
  blocks: LessonBlock[];
}

export interface TeachingCourse {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  priceTzs: number;
  status: 'draft' | 'published';
  enrolledCount: number;
  modules: TeachingModule[];
}

export const blockTypeMeta: Record<LessonBlockType, { label: string; defaultMeta: string }> = {
  video: { label: 'Video', defaultMeta: '0:00' },
  flashcards: { label: 'Flashcards', defaultMeta: '0 cards' },
  guide: { label: 'Written guide', defaultMeta: '0 min read' },
  quiz: { label: 'Quiz', defaultMeta: '0 questions' },
};

export const initialTeachingCourses: TeachingCourse[] = [
  {
    id: 'warehouse-safety',
    title: 'Warehouse Safety Fundamentals',
    shortDescription: 'Practical safety training for warehouse and logistics teams.',
    category: 'Project Management',
    priceTzs: 15000,
    status: 'draft',
    enrolledCount: 0,
    modules: [
      {
        id: 'ws-m1',
        title: 'Module 1: Getting Started',
        blocks: [
          { id: 'ws-m1-b1', type: 'video', title: 'Welcome & overview', meta: '6:20' },
          { id: 'ws-m1-b2', type: 'flashcards', title: 'Key terms', meta: '12 cards' },
          { id: 'ws-m1-b3', type: 'guide', title: 'Case study: Warehouse rollout', meta: '4 min read' },
          { id: 'ws-m1-b4', type: 'quiz', title: 'Check your understanding', meta: '5 questions' },
        ],
      },
      {
        id: 'ws-m2',
        title: 'Module 2: On the Floor',
        blocks: [
          { id: 'ws-m2-b1', type: 'video', title: 'Spotting common hazards', meta: '8:05' },
          { id: 'ws-m2-b2', type: 'quiz', title: 'Hazard identification quiz', meta: '6 questions' },
        ],
      },
    ],
  },
];
