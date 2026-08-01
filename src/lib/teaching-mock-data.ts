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
    id: 'ux-design-fundamentals-teaching',
    title: 'UX Design Fundamentals',
    shortDescription: 'A practical introduction to user experience design.',
    category: 'Design',
    priceTzs: 15000,
    status: 'published',
    enrolledCount: 148,
    modules: [
      {
        id: 'ux-m1',
        title: 'Module 1: Foundations',
        blocks: [
          { id: 'ux-m1-b1', type: 'video', title: 'What UX design actually is', meta: '7:40' },
          { id: 'ux-m1-b2', type: 'flashcards', title: 'Core terminology', meta: '14 cards' },
          { id: 'ux-m1-b3', type: 'quiz', title: 'Check your understanding', meta: '5 questions' },
        ],
      },
    ],
  },
  {
    id: 'intro-to-wireframing-teaching',
    title: 'Intro to Wireframing',
    shortDescription: 'Sketch and prototype interfaces before you build them.',
    category: 'Design',
    priceTzs: 12000,
    status: 'published',
    enrolledCount: 64,
    modules: [
      {
        id: 'wf-m1',
        title: 'Module 1: Getting Started',
        blocks: [
          { id: 'wf-m1-b1', type: 'video', title: 'Low-fidelity vs. high-fidelity', meta: '5:15' },
          { id: 'wf-m1-b2', type: 'guide', title: 'Tools worth learning first', meta: '3 min read' },
        ],
      },
    ],
  },
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

export interface RecentStudentActivity {
  studentName: string;
  action: 'enrolled' | 'completed';
  courseTitle: string;
  when: string;
}

/** Illustrative — there's no real enrollment-event backend yet, so this ties to initialTeachingCourses' titles above but isn't derived from anything real. */
export const recentStudentActivity: RecentStudentActivity[] = [
  { studentName: 'Faraja Sumari', action: 'enrolled', courseTitle: 'UX Design Fundamentals', when: '2h ago' },
  { studentName: 'Halima Ndosi', action: 'completed', courseTitle: 'Intro to Wireframing', when: 'yesterday' },
];
