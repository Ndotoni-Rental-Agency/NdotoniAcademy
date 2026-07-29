// ============================================================
// Ndotoni Academy — Mock Data (v3)
// Aligned with education-model.ts v3
// ============================================================

import type {
  Program,
  Level,
  Course,
  Module,
  Lesson,
  ContentBlock,
  Assessment,
  Question,
  Instructor,
  Tag,
  CourseDetail,
  CourseListItem,
  FlashCard,
  VideoContent,
  TextContent,
  AudioContent,
  FlashcardContent,
  ImageContent,
} from './education-model';

// ─── Tags ─────────────────────────────────────────────────────

export const tags: Tag[] = [
  { id: 'tag-math',     slug: 'mathematics',       label: 'Mathematics',       color: '#4F46E5' },
  { id: 'tag-lang',     slug: 'language',           label: 'Language',          color: '#059669' },
  { id: 'tag-science',  slug: 'science',            label: 'Science',           color: '#7C3AED' },
  { id: 'tag-primary',  slug: 'primary-education',  label: 'Primary Education', color: '#0284C7' },
  { id: 'tag-english',  slug: 'english',            label: 'English',           color: '#DC2626' },
  { id: 'tag-swahili',  slug: 'kiswahili',          label: 'Kiswahili',         color: '#059669' },
];

// ─── Instructors ─────────────────────────────────────────────

export const instructors: Instructor[] = [
  {
    id: 'inst-amina',
    name: 'Mwalimu Amina Juma',
    title: 'Mwalimu',
    bio: '15 years teaching primary mathematics in Dar es Salaam. Specialises in making abstract concepts tangible for young learners.',
    expertise: ['Primary Mathematics', 'Visual Learning', 'Child Education'],
  },
  {
    id: 'inst-joseph',
    name: 'Mwalimu Joseph Mwakasege',
    title: 'Mwalimu',
    bio: 'Passionate Kiswahili teacher from Dodoma with expertise in early literacy and language development.',
    expertise: ['Kiswahili', 'Literacy', 'Storytelling'],
  },
  {
    id: 'inst-grace',
    name: 'Mwalimu Grace Kimaro',
    title: 'Mwalimu',
    bio: 'Science educator from Arusha. Loves making children curious about the natural world.',
    expertise: ['Primary Science', 'Environmental Studies', 'Hands-on Learning'],
  },
];

// ─── Programs ────────────────────────────────────────────────

export const programs: Program[] = [
  {
    id: 'prog-primary',
    title: 'Elimu ya Msingi',
    description: 'Tanzania Primary Education curriculum covering Standards 1–7. NECTA-aligned syllabus with interactive lessons, quizzes, and assignments.',
    tagIds: ['tag-primary'],
    targetAudience: '6–13 years',
    imageUrl: '/images/primary-education.jpg',
    status: 'PUBLISHED',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prog-secondary',
    title: 'Elimu ya Sekondari',
    description: 'Tanzania Ordinary Level curriculum (Form 1–4) preparing students for the CSEE national examination.',
    tagIds: [],
    targetAudience: '14–18 years',
    imageUrl: '/images/secondary-education.jpg',
    status: 'DRAFT',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ─── Levels ───────────────────────────────────────────────────
// Standard 1–7 under Primary; Form 1–4 under Secondary (skeleton)

export const levels: Level[] = [
  { id: 'level-std1', programId: 'prog-primary', title: 'Standard 1', titleSwahili: 'Darasa la 1', order: 1, ageRange: '6–7', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-std2', programId: 'prog-primary', title: 'Standard 2', titleSwahili: 'Darasa la 2', order: 2, ageRange: '7–8', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-std3', programId: 'prog-primary', title: 'Standard 3', titleSwahili: 'Darasa la 3', order: 3, ageRange: '8–9', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-std4', programId: 'prog-primary', title: 'Standard 4', titleSwahili: 'Darasa la 4', order: 4, ageRange: '9–10', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-std5', programId: 'prog-primary', title: 'Standard 5', titleSwahili: 'Darasa la 5', order: 5, ageRange: '10–11', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-std6', programId: 'prog-primary', title: 'Standard 6', titleSwahili: 'Darasa la 6', order: 6, ageRange: '11–12', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-std7', programId: 'prog-primary', title: 'Standard 7', titleSwahili: 'Darasa la 7', order: 7, ageRange: '12–13', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-form1', programId: 'prog-secondary', title: 'Form 1', titleSwahili: 'Kidato cha 1', order: 1, ageRange: '14–15', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-form2', programId: 'prog-secondary', title: 'Form 2', titleSwahili: 'Kidato cha 2', order: 2, ageRange: '15–16', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-form3', programId: 'prog-secondary', title: 'Form 3', titleSwahili: 'Kidato cha 3', order: 3, ageRange: '16–17', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'level-form4', programId: 'prog-secondary', title: 'Form 4', titleSwahili: 'Kidato cha 4', order: 4, ageRange: '17–18', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

// ─── Courses (Standard 1) ─────────────────────────────────────
// levelId replaces programId — a Course belongs to a Level, not a Program

export const courses: Course[] = [
  {
    id: 'course-hisabati-std1',
    levelId: 'level-std1',         // ← Level, not Program
    title: 'Hisabati — Darasa la 1',
    titleSwahili: 'Hisabati',
    description: 'Mathematics for Standard 1 covers counting, basic addition and subtraction within 10, and number recognition through engaging visual and audio content.',
    shortDescription: 'Jifunze kuhesabu, kuongeza, na kutoa nambari hadi 10',
    tagIds: ['tag-math', 'tag-primary'],
    color: '#4F46E5',
    imageUrl: '/images/hisabati-std1.jpg',
    outcomes: [
      'Kutambua na kuandika nambari 1–10',
      'Kuhesabu vitu hadi 10 kwa usahihi',
      'Kuongeza nambari zenye jumla hadi 10',
      'Kutoa nambari ndani ya 10',
    ],
    objectiveIds: [],
    prerequisites: [],
    estimatedDuration: '2 saa',
    instructorId: 'inst-amina',
    status: 'PUBLISHED',
    enrolledCount: 1247,
    completionRate: 82,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-kiswahili-std1',
    levelId: 'level-std1',
    title: 'Kiswahili — Darasa la 1',
    titleSwahili: 'Kiswahili',
    description: 'Kusoma na kuandika herufi za Kiswahili, maneno rahisi, na sentensi fupi.',
    shortDescription: 'Jifunze herufi, maneno, na kusoma Kiswahili',
    tagIds: ['tag-lang', 'tag-swahili', 'tag-primary'],
    color: '#059669',
    outcomes: ['Kutambua herufi zote za Kiswahili', 'Kusoma maneno rahisi', 'Kuandika sentensi fupi'],
    objectiveIds: [],
    prerequisites: [],
    estimatedDuration: '3 saa',
    instructorId: 'inst-joseph',
    status: 'PUBLISHED',
    enrolledCount: 1891,
    completionRate: 78,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-english-std1',
    levelId: 'level-std1',
    title: 'English — Standard 1',
    titleSwahili: 'Kiingereza',
    description: 'Introduction to English letters, greetings, and basic vocabulary for Standard 1 students.',
    shortDescription: 'Learn the English alphabet and simple greetings',
    tagIds: ['tag-lang', 'tag-english', 'tag-primary'],
    color: '#DC2626',
    outcomes: ['Recite the English alphabet', 'Greet people in English', 'Identify common objects in English'],
    objectiveIds: [],
    prerequisites: [],
    estimatedDuration: '3 saa',
    instructorId: 'inst-joseph',
    status: 'PUBLISHED',
    enrolledCount: 1654,
    completionRate: 74,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'course-sayansi-std1',
    levelId: 'level-std1',
    title: 'Sayansi — Darasa la 1',
    titleSwahili: 'Sayansi',
    description: 'Basic science for young learners — exploring the world through observation and curiosity.',
    shortDescription: 'Chunguza ulimwengu unaokuzunguka',
    tagIds: ['tag-science', 'tag-primary'],
    color: '#7C3AED',
    outcomes: ['Kutaja sehemu za mwili', 'Kutambua viumbe hai na visivyo hai', 'Kuelewa hali ya hewa ya msingi'],
    objectiveIds: [],
    prerequisites: [],
    estimatedDuration: '2.5 saa',
    instructorId: 'inst-grace',
    status: 'PUBLISHED',
    enrolledCount: 1102,
    completionRate: 80,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ─── Modules: Hisabati Standard 1 ────────────────────────────

export const hisabatiModules: Module[] = [
  {
    id: 'mod-his-1', courseId: 'course-hisabati-std1', title: 'Kuhesabu (Counting 1–10)',
    description: 'Learn to count, order, and compare numbers 1 through 10',
    order: 1, objectiveIds: [], estimatedDuration: '45 dak', icon: 'hash', status: 'PUBLISHED',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mod-his-2', courseId: 'course-hisabati-std1', title: 'Kuongeza (Addition up to 10)',
    description: 'Understand addition and add numbers with sums up to 10',
    order: 2, objectiveIds: [], estimatedDuration: '35 dak', icon: 'plus', status: 'PUBLISHED',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mod-his-3', courseId: 'course-hisabati-std1', title: 'Kutoa (Subtraction up to 10)',
    description: 'Understand subtraction and subtract numbers within 10',
    order: 3, objectiveIds: [], estimatedDuration: '30 dak', icon: 'minus', status: 'PUBLISHED',
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ─── Lessons ─────────────────────────────────────────────────

export const mod1Lessons: Lesson[] = [
  { id: 'les-his-1-1', moduleId: 'mod-his-1', title: 'Nambari 1–5', description: 'Jifunze nambari moja hadi tano', order: 1, objectiveIds: [], estimatedDuration: '12 dak', isFree: true,  status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'les-his-1-2', moduleId: 'mod-his-1', title: 'Nambari 6–10', description: 'Jifunze nambari sita hadi kumi', order: 2, objectiveIds: [], estimatedDuration: '12 dak', isFree: true,  status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'les-his-1-3', moduleId: 'mod-his-1', title: 'Kupanga na Kulinganisha', description: 'Panga nambari kwa mpangilio na ulinganishe makundi', order: 3, objectiveIds: [], estimatedDuration: '10 dak', isFree: false, status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

export const mod2Lessons: Lesson[] = [
  { id: 'les-his-2-1', moduleId: 'mod-his-2', title: 'Kuongeza hadi 5',  description: 'Kuongeza nambari zenye jumla hadi 5',  order: 1, objectiveIds: [], estimatedDuration: '12 dak', isFree: false, status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'les-his-2-2', moduleId: 'mod-his-2', title: 'Kuongeza hadi 10', description: 'Kuongeza nambari zenye jumla hadi 10', order: 2, objectiveIds: [], estimatedDuration: '14 dak', isFree: false, status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

export const mod3Lessons: Lesson[] = [
  { id: 'les-his-3-1', moduleId: 'mod-his-3', title: 'Kutoa hadi 5',  description: 'Kutoa nambari ndani ya 5',  order: 1, objectiveIds: [], estimatedDuration: '10 dak', isFree: false, status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'les-his-3-2', moduleId: 'mod-his-3', title: 'Kutoa hadi 10', description: 'Kutoa nambari ndani ya 10', order: 2, objectiveIds: [], estimatedDuration: '12 dak', isFree: false, status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

// ─── ContentBlocks — lesson 1.1 (Nambari 1–5) ────────────────
// data is now typed, not a string blob

const cards_1to5: FlashCard[] = [
  { id: 'fc-1', front: '1', back: 'Moja (One)',  hint: 'Kidole kimoja ☝️' },
  { id: 'fc-2', front: '2', back: 'Mbili (Two)', hint: 'Macho mawili 👀' },
  { id: 'fc-3', front: '3', back: 'Tatu (Three)',hint: 'Pembe za pembetatu △' },
  { id: 'fc-4', front: '4', back: 'Nne (Four)',  hint: 'Miguu ya meza 🪑' },
  { id: 'fc-5', front: '5', back: 'Tano (Five)', hint: 'Vidole vya mkono ✋' },
];

export const lesson_1_1_blocks: ContentBlock[] = [
  {
    id: 'cb-his-1-1-1', lessonId: 'les-his-1-1',
    type: 'VIDEO', title: 'Kujifunza Nambari 1 hadi 5',
    data: { type: 'VIDEO', url: 'https://www.youtube.com/embed/example-1-5', provider: 'YOUTUBE', durationSeconds: 180 } satisfies VideoContent,
    duration: '3 dak', order: 1, caption: 'Video ya katuni inayofundisha nambari 1–5 kwa nyimbo',
    createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cb-his-1-1-2', lessonId: 'les-his-1-1',
    type: 'TEXT', title: 'Nambari 1–5: Maelezo',
    data: {
      type: 'TEXT',
      wordCount: 95,
      markdown: `## Nambari 1 hadi 5

### 1 — Moja
Kidole kimoja ☝️. Jua moja angani. Pua moja usoni.

### 2 — Mbili
Macho mawili 👀. Mikono miwili. Miguu miwili.

### 3 — Tatu
Rangi za taa ya barabarani 🚦. Pembe za pembetatu △.

### 4 — Nne
Miguu ya meza. Magurudumu ya gari 🚗. Pembe za mraba □.

### 5 — Tano
Vidole vya mkono mmoja ✋. Nyota ya pointi tano ⭐.

---
**Zoezi:** Tazama chumba chako — taja vitu vilivyo moja, viwili, vitatu, vinne, na vitano!`,
    } satisfies TextContent,
    duration: '5 dak', order: 2,
    createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cb-his-1-1-3', lessonId: 'les-his-1-1',
    type: 'FLASHCARD', title: 'Kadi za Nambari 1–5',
    data: { type: 'FLASHCARD', cards: cards_1to5 } satisfies FlashcardContent,
    duration: '3 dak', order: 3, caption: 'Zoeza nambari kwa kadi hizi',
    createdBy: 'AI', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cb-his-1-1-4', lessonId: 'les-his-1-1',
    type: 'AUDIO', title: 'Wimbo wa Nambari 1–5',
    data: { type: 'AUDIO', url: '/audio/wimbo-nambari-1-5.mp3', durationSeconds: 90 } satisfies AudioContent,
    duration: '1.5 dak', order: 4, caption: 'Sikiliza na imba pamoja!',
    createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ─── ContentBlocks — lesson 1.2 (Nambari 6–10) ───────────────

const cards_6to10: FlashCard[] = [
  { id: 'fc-6',  front: '6',  back: 'Sita (Six)',   hint: 'Pande za kete 🎲' },
  { id: 'fc-7',  front: '7',  back: 'Saba (Seven)', hint: 'Siku za wiki 📅' },
  { id: 'fc-8',  front: '8',  back: 'Nane (Eight)', hint: 'Miguu ya buibui 🕷️' },
  { id: 'fc-9',  front: '9',  back: 'Tisa (Nine)',  hint: 'Wachezaji 9' },
  { id: 'fc-10', front: '10', back: 'Kumi (Ten)',   hint: 'Vidole vyote 🙌' },
];

export const lesson_1_2_blocks: ContentBlock[] = [
  {
    id: 'cb-his-1-2-1', lessonId: 'les-his-1-2',
    type: 'VIDEO', title: 'Kujifunza Nambari 6 hadi 10',
    data: { type: 'VIDEO', url: 'https://www.youtube.com/embed/example-6-10', provider: 'YOUTUBE', durationSeconds: 210 } satisfies VideoContent,
    duration: '3.5 dak', order: 1,
    createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cb-his-1-2-2', lessonId: 'les-his-1-2',
    type: 'TEXT', title: 'Nambari 6–10: Maelezo',
    data: {
      type: 'TEXT',
      wordCount: 80,
      markdown: `## Nambari 6 hadi 10

### 6 — Sita
Pande za kete (dice) 🎲. Miguu ya wadudu wengi.

### 7 — Saba
Siku za wiki 📅. Rangi za upinde wa mvua 🌈.

### 8 — Nane
Miguu ya buibui 🕷️. Pembe za octagon.

### 9 — Tisa
Wachezaji wa timu ya mpira (bila goalkeeper).

### 10 — Kumi
Vidole vyote vya mikono miwili 🙌. Alama ya kamili!

---
**Zoezi:** Hesabu vidole vyako vyote — ni kumi!`,
    } satisfies TextContent,
    duration: '5 dak', order: 2,
    createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cb-his-1-2-3', lessonId: 'les-his-1-2',
    type: 'FLASHCARD', title: 'Kadi za Nambari 6–10',
    data: { type: 'FLASHCARD', cards: cards_6to10 } satisfies FlashcardContent,
    duration: '3 dak', order: 3,
    createdBy: 'AI', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ─── ContentBlocks — lesson 1.3 (Kupanga na Kulinganisha) ─────

export const lesson_1_3_blocks: ContentBlock[] = [
  {
    id: 'cb-his-1-3-1', lessonId: 'les-his-1-3',
    type: 'IMAGE', title: 'Mstari wa Nambari 1–10',
    data: { type: 'IMAGE', url: '/images/number-line-1-10.svg', altText: 'Mstari wa nambari unaonyesha mpangilio wa 1 hadi 10' } satisfies ImageContent,
    duration: '2 dak', order: 1, caption: 'Mstari wa nambari unaonyesha mpangilio wa 1 hadi 10',
    createdBy: 'SYSTEM', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cb-his-1-3-2', lessonId: 'les-his-1-3',
    type: 'TEXT', title: 'Kupanga na Kulinganisha',
    data: {
      type: 'TEXT',
      wordCount: 100,
      markdown: `## Kupanga na Kulinganisha Nambari

### Kupanga (Ordering)
Nambari zinaweza kupangwa kutoka **ndogo hadi kubwa**:
> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

Au kutoka **kubwa hadi ndogo**:
> 10, 9, 8, 7, 6, 5, 4, 3, 2, 1

### Kulinganisha (Comparing)
- **Kubwa kuliko (>):** 5 > 3 — tano ni kubwa kuliko tatu
- **Ndogo kuliko (<):** 2 < 7 — mbili ni ndogo kuliko saba
- **Sawa na (=):** 4 = 4 — nne ni sawa na nne

Fikiria matunda: 🍎🍎🍎 na 🍊🍊🍊🍊🍊 — Machungwa ni mengi zaidi! **5 > 3**`,
    } satisfies TextContent,
    duration: '6 dak', order: 2,
    createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ─── ContentBlocks — lesson 2.1 & 3.1 ────────────────────────

export const lesson_2_1_blocks: ContentBlock[] = [
  {
    id: 'cb-his-2-1-1', lessonId: 'les-his-2-1',
    type: 'VIDEO', title: 'Kuongeza kwa Kutumia Vidole',
    data: { type: 'VIDEO', url: 'https://www.youtube.com/embed/example-add-5', provider: 'YOUTUBE', durationSeconds: 240 } satisfies VideoContent,
    duration: '4 dak', order: 1,
    createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cb-his-2-1-2', lessonId: 'les-his-2-1',
    type: 'TEXT', title: 'Kuongeza hadi 5: Maelezo',
    data: {
      type: 'TEXT', wordCount: 70,
      markdown: `## Kuongeza Hadi 5

Kuongeza maana yake ni **kuweka vitu pamoja**.

- 1 + 1 = **2** (tunda moja na tunda moja = matunda mawili 🍎🍎)
- 2 + 3 = **5** (vidole viwili na vidole vitatu = vidole vitano ✋)

**Njia ya Vidole:** Nyoosha vidole vya nambari ya kwanza, ongeza ya pili, hesabu zote!`,
    } satisfies TextContent,
    duration: '5 dak', order: 2,
    createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const lesson_3_1_blocks: ContentBlock[] = [
  {
    id: 'cb-his-3-1-1', lessonId: 'les-his-3-1',
    type: 'TEXT', title: 'Kutoa hadi 5: Maelezo',
    data: {
      type: 'TEXT', wordCount: 45,
      markdown: `## Kutoa Hadi 5

Kutoa maana yake ni **kuondoa**.

- 5 - 2 = **3** (una matunda 5, ukila 2, yanabaki 3 🍎🍎🍎)
- 4 - 1 = **3**
- 3 - 3 = **0** (hakuna kilichobaki!)

*"Nilikuwa na vitu 5. Niliondoa 2. Ninabaki na ngapi?"*`,
    } satisfies TextContent,
    duration: '5 dak', order: 1,
    createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ─── Assessments ─────────────────────────────────────────────

export const assessments: Assessment[] = [
  // Lesson quizzes
  { id: 'asmnt-les-1-1', title: 'Mtihani Mdogo: Nambari 1–5',  type: 'QUIZ', scope: 'LESSON', scopeId: 'les-his-1-1', passingScore: 60, maxAttempts: 0, createdBy: 'USER', status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'asmnt-les-1-2', title: 'Mtihani Mdogo: Nambari 6–10', type: 'QUIZ', scope: 'LESSON', scopeId: 'les-his-1-2', passingScore: 60, maxAttempts: 0, createdBy: 'USER', status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'asmnt-les-2-1', title: 'Mtihani Mdogo: Kuongeza hadi 5', type: 'QUIZ', scope: 'LESSON', scopeId: 'les-his-2-1', passingScore: 60, maxAttempts: 0, createdBy: 'USER', status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  // Module tests
  { id: 'asmnt-mod-1', title: 'Mtihani wa Moduli 1: Kuhesabu 1–10', type: 'QUIZ',  scope: 'MODULE', scopeId: 'mod-his-1', passingScore: 70, timeLimit: 15, maxAttempts: 2, weight: 30, createdBy: 'USER', status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'asmnt-mod-2', title: 'Mtihani wa Moduli 2: Kuongeza',      type: 'QUIZ',  scope: 'MODULE', scopeId: 'mod-his-2', passingScore: 70, timeLimit: 10, maxAttempts: 2, weight: 30, createdBy: 'USER', status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  // Assignment
  {
    id: 'asmnt-assign-mod-1', title: 'Hesabu Vitu Nyumbani', type: 'ASSIGNMENT', scope: 'MODULE', scopeId: 'mod-his-1',
    passingScore: 50, maxAttempts: 1, weight: 20, createdBy: 'USER', status: 'PUBLISHED',
    instructions: `## Zoezi la Nyumbani: Hesabu Vitu Nyumbani

Tembea nyumba yako na utafute vitu:
1. Andika au chora kitu **kimoja (1)** — mfano: mlango mmoja
2. Kitu **viwili (2)** — mfano: viatu viwili
3. Endelea hadi **kumi (10)**
4. Rudisha jedwali lako + picha moja.`,
    rubric: [
      { criterion: 'Usahihi', maxPoints: 5, levels: [{ label: 'Bora', points: 5, description: 'Vitu vyote vimehesabiwa kwa usahihi' }, { label: 'Vizuri', points: 3, description: 'Makosa 1–2' }, { label: 'Jaribu tena', points: 1, description: 'Makosa mengi' }] },
      { criterion: 'Ukamilifu', maxPoints: 5, levels: [{ label: 'Bora', points: 5, description: 'Nambari zote 1–10 zimeonyeshwa' }, { label: 'Vizuri', points: 3, description: 'Nambari 5+ zimeonyeshwa' }, { label: 'Jaribu tena', points: 1, description: 'Chini ya nambari 5' }] },
    ],
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  // Final exam
  { id: 'asmnt-exam-hisabati-std1', title: 'Mtihani wa Mwisho: Hisabati Darasa la 1', description: 'Comprehensive exam covering counting, addition, and subtraction', type: 'EXAM', scope: 'COURSE', scopeId: 'course-hisabati-std1', passingScore: 60, timeLimit: 30, maxAttempts: 1, weight: 40, createdBy: 'USER', status: 'PUBLISHED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

// ─── Questions ────────────────────────────────────────────────
// options is now a real string[] — no JSON.parse() in the UI

export const questions: Question[] = [
  // Lesson 1-1
  { id: 'q-1-1-a', assessmentId: 'asmnt-les-1-1', type: 'MULTIPLE_CHOICE', questionText: 'Vidole vya mkono mmoja ni vingapi?', options: ['3','4','5','6'], answer: '2', order: 1, points: 1, explanation: 'Mkono mmoja una vidole vitano (5).', createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-1-1-b', assessmentId: 'asmnt-les-1-1', type: 'TRUE_FALSE',       questionText: 'Macho ya mtu ni mawili (2).',          options: ['Kweli','Si kweli'], answer: '0', order: 2, points: 1, explanation: 'Ndio! Mtu ana macho mawili.', createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-1-1-c', assessmentId: 'asmnt-les-1-1', type: 'FILL_BLANK',       questionText: 'Gari lina magurudumu ___',              options: [], answer: '4', order: 3, points: 1, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  // Lesson 1-2
  { id: 'q-1-2-a', assessmentId: 'asmnt-les-1-2', type: 'MULTIPLE_CHOICE', questionText: 'Siku za wiki ni ngapi?',    options: ['5','6','7','8'], answer: '2', order: 1, points: 1, explanation: 'Wiki ina siku saba (7).', createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-1-2-b', assessmentId: 'asmnt-les-1-2', type: 'MULTIPLE_CHOICE', questionText: 'Buibui ana miguu mingapi?', options: ['6','8','10','4'], answer: '1', order: 2, points: 1, explanation: 'Buibui ana miguu nane (8).', createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  // Lesson 2-1
  { id: 'q-2-1-a', assessmentId: 'asmnt-les-2-1', type: 'MULTIPLE_CHOICE', questionText: '2 + 2 = ?',        options: ['3','4','5','2'], answer: '1', order: 1, points: 1, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-2-1-b', assessmentId: 'asmnt-les-2-1', type: 'FILL_BLANK',      questionText: '1 + ___ = 4',      options: [], answer: '3', order: 2, points: 1, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  // Module 1 test
  { id: 'q-mod-1-a', assessmentId: 'asmnt-mod-1', type: 'MULTIPLE_CHOICE', questionText: 'Nambari inayokuja baada ya 7 ni:', options: ['6','8','9','5'], answer: '1', order: 1, points: 2, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-mod-1-b', assessmentId: 'asmnt-mod-1', type: 'FILL_BLANK',      questionText: 'Panga: 3, ___, 5, 6',               options: [], answer: '4', order: 2, points: 2, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-mod-1-c', assessmentId: 'asmnt-mod-1', type: 'TRUE_FALSE',      questionText: '9 ni kubwa kuliko 6',               options: ['Kweli','Si kweli'], answer: '0', order: 3, points: 1, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-mod-1-d', assessmentId: 'asmnt-mod-1', type: 'MULTIPLE_CHOICE', questionText: 'Ni nambari ipi ndogo zaidi?',        options: ['8','3','5','10'], answer: '1', order: 4, points: 2, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  // Final exam
  { id: 'q-exam-a', assessmentId: 'asmnt-exam-hisabati-std1', type: 'MULTIPLE_CHOICE', questionText: 'Nambari inayokuja baada ya 8 ni:', options: ['7','9','10','6'], answer: '1', order: 1, points: 2, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-exam-b', assessmentId: 'asmnt-exam-hisabati-std1', type: 'FILL_BLANK',      questionText: '4 + 5 = ___',                        options: [], answer: '9', order: 2, points: 2, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-exam-c', assessmentId: 'asmnt-exam-hisabati-std1', type: 'MULTIPLE_CHOICE', questionText: '10 - 4 = ?',                         options: ['5','6','7','4'], answer: '1', order: 3, points: 2, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'q-exam-d', assessmentId: 'asmnt-exam-hisabati-std1', type: 'TRUE_FALSE',      questionText: '4 ni kubwa kuliko 7',                options: ['Kweli','Si kweli'], answer: '1', order: 4, points: 1, createdBy: 'USER', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

// ─── Query helpers ────────────────────────────────────────────

export function getProgram(id: string)   { return programs.find(p => p.id === id); }
export function getLevel(id: string)     { return levels.find(l => l.id === id); }
export function getCourse(id: string)    { return courses.find(c => c.id === id); }
export function getInstructor(id: string){ return instructors.find(i => i.id === id); }
export function getTags(ids: string[])   { return tags.filter(t => ids.includes(t.id)); }

export function getLevelsByProgram(programId: string) {
  return levels.filter(l => l.programId === programId);
}
export function getCoursesByLevel(levelId: string) {
  return courses.filter(c => c.levelId === levelId);
}
export function getModulesByCourse(courseId: string): Module[] {
  return courseId === 'course-hisabati-std1' ? hisabatiModules : [];
}
export function getLessonsByModule(moduleId: string): Lesson[] {
  return ({ 'mod-his-1': mod1Lessons, 'mod-his-2': mod2Lessons, 'mod-his-3': mod3Lessons } as Record<string, Lesson[]>)[moduleId] ?? [];
}
export function getContentBlocks(lessonId: string): ContentBlock[] {
  return ({
    'les-his-1-1': lesson_1_1_blocks,
    'les-his-1-2': lesson_1_2_blocks,
    'les-his-1-3': lesson_1_3_blocks,
    'les-his-2-1': lesson_2_1_blocks,
    'les-his-3-1': lesson_3_1_blocks,
  } as Record<string, ContentBlock[]>)[lessonId] ?? [];
}
export function getAssessments(scopeId: string)   { return assessments.filter(a => a.scopeId === scopeId); }
export function getQuestions(assessmentId: string){ return questions.filter(q => q.assessmentId === assessmentId); }

/** Full CourseDetail response — as CourseService.GetCourseDetails would return */
export function getCourseDetail(courseId: string): CourseDetail | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  const level = getLevel(course.levelId);
  if (!level) return undefined;
  const program = getProgram(level.programId);
  if (!program) return undefined;

  const modules = getModulesByCourse(courseId).map(module => ({
    module,
    lessons: getLessonsByModule(module.id).map(lesson => ({
      lesson,
      contentBlocks: getContentBlocks(lesson.id),
      assessments: getAssessments(lesson.id),
    })),
    assessments: getAssessments(module.id),
  }));

  return {
    course, level, program, modules,
    courseAssessment: getAssessments(courseId).find(a => a.type === 'EXAM'),
    instructor: course.instructorId ? getInstructor(course.instructorId) : undefined,
    objectives: [],
    tags: getTags(course.tagIds),
  };
}

/** Flat list for the /learn listing page */
export function getCourseListItems(programId?: string): CourseListItem[] {
  const filteredLevels = programId ? getLevelsByProgram(programId) : levels;
  const filteredCourses = filteredLevels.flatMap(l => getCoursesByLevel(l.id));

  return filteredCourses.map(course => {
    const level = getLevel(course.levelId)!;
    const program = getProgram(level.programId)!;
    const mods = getModulesByCourse(course.id);
    const lessonCount = mods.reduce((s, m) => s + getLessonsByModule(m.id).length, 0);
    const instructor = course.instructorId ? getInstructor(course.instructorId) : undefined;

    return {
      id: course.id,
      levelId: level.id,
      levelTitle: level.title,
      programId: program.id,
      programTitle: program.title,
      title: course.title,
      titleSwahili: course.titleSwahili,
      shortDescription: course.shortDescription,
      tags: getTags(course.tagIds),
      imageUrl: course.imageUrl,
      color: course.color,
      moduleCount: mods.length,
      lessonCount,
      estimatedDuration: course.estimatedDuration,
      status: course.status,
      enrolledCount: course.enrolledCount,
      completionRate: course.completionRate,
      instructor: instructor ? { id: instructor.id, name: instructor.name, avatarUrl: instructor.avatarUrl } : undefined,
    };
  });
}
