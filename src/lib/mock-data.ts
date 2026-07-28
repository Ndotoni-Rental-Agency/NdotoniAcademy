// ============================================================
// Mock Data for TAA Prototype
// ============================================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Module {
  id: string;
  courseId: string;
  order: number;
  title: string;
  duration: string;
  content: string;
  isFree: boolean;
  quiz: QuizQuestion[];
  videoUrl?: string;
  videoTitle?: string;
  contentType?: 'video' | 'text' | 'mixed';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  level: 'L1' | 'L2' | 'L3' | 'L4';
  levelLabel: string;
  cpdPoints: number;
  duration: string;
  modules: Module[];
  instructor: string;
  category: string;
  enrolledCount: number;
  completionRate: number;
  outcomes: string[];
  prerequisites: string[];
  imageUrl: string;
  color?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'flame' | 'trophy' | 'star' | 'zap' | 'target' | 'book' | 'award' | 'rocket';
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: boolean;
  weeklyGoal: number;
  weeklyProgress: number;
  lastActiveDate: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  streak: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  memberNumber: string;
  role: 'member' | 'admin' | 'board';
  cpdPointsEarned: number;
  cpdPointsTarget: number;
  enrolledCourses: EnrolledCourse[];
  certificates: Certificate[];
}

export interface EnrolledCourse {
  courseId: string;
  courseTitle: string;
  progress: number; // 0-100
  currentModule: number;
  totalModules: number;
  enrolledAt: string;
  lastAccessedAt: string;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  issuedAt: string;
  cpdPoints: number;
  score: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
}

// ============================================================
// Course 1: Land Management and Administration
// ============================================================

const course1Modules: Module[] = [
  {
    id: 'lma-m1',
    courseId: 'project-management',
    order: 1,
    title: 'Introduction to Land Governance',
    duration: '45 min',
    isFree: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Understanding Land Governance Fundamentals',
    contentType: 'mixed',
    content: `
## Introduction to Land Governance

Land governance refers to the rules, processes, and structures through which decisions are made about access to land, how those decisions are implemented, and how competing interests in land are managed.

### Key Concepts

**Land tenure** is the relationship between people and land. It defines how access is granted, the rights and obligations of holders, and the duration and conditions of those rights.

**Good land governance** is characterized by:
- Transparency in land administration
- Equity in access to land
- Participation of all stakeholders
- Accountability of institutions
- Rule of law in land matters

### The Tanzanian Context

Tanzania's land governance framework is built on three fundamental principles:
1. All land is public land vested in the President as trustee
2. The right of every citizen to access land
3. Recognition of both statutory and customary tenure

### Land Categories in Tanzania

| Category | Governed By | Area |
|----------|-------------|------|
| General Land | Land Act, 1999 | ~2% |
| Village Land | Village Land Act, 1999 | ~70% |
| Reserved Land | Various sector laws | ~28% |

### Why This Matters

Understanding land governance is the foundation for all land professionals. Whether you work in valuation, surveying, planning, or law — governance frameworks determine how land rights are created, transferred, and protected.
    `,
    quiz: [
      {
        id: 'lma-m1-q1',
        question: 'What is land tenure?',
        options: [
          'The price of land in a given market',
          'The relationship between people and land defining access rights',
          'The physical characteristics of a piece of land',
          'The process of surveying land boundaries',
        ],
        correctIndex: 1,
      },
      {
        id: 'lma-m1-q2',
        question: 'In Tanzania, all land is vested in whom as trustee?',
        options: [
          'The Village Council',
          'The Commissioner for Lands',
          'The President',
          'The District Authority',
        ],
        correctIndex: 2,
      },
      {
        id: 'lma-m1-q3',
        question: 'Which category covers approximately 70% of Tanzania\'s land?',
        options: [
          'General Land',
          'Reserved Land',
          'Village Land',
          'Urban Land',
        ],
        correctIndex: 2,
      },
      {
        id: 'lma-m1-q4',
        question: 'Which is NOT a characteristic of good land governance?',
        options: [
          'Transparency',
          'Equity',
          'Secrecy in decision-making',
          'Accountability',
        ],
        correctIndex: 2,
      },
      {
        id: 'lma-m1-q5',
        question: 'The Land Act of 1999 governs which category of land?',
        options: [
          'Village Land',
          'Reserved Land',
          'General Land',
          'All categories equally',
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'lma-m2',
    courseId: 'project-management',
    order: 2,
    title: 'Tenure Systems & Frameworks',
    duration: '50 min',
    isFree: false,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Land Tenure Systems in East Africa',
    contentType: 'mixed',
    content: `
## Tenure Systems & Frameworks

This module explores the different tenure systems operating in Tanzania and their legal frameworks.

### Statutory Tenure
- Right of Occupancy (granted/deemed)
- Derivative rights (leases, licenses)
- Certificate of Customary Right of Occupancy (CCRO)

### Customary Tenure
- Governed by customary law and local customs
- Recognized under the Village Land Act, 1999
- CCRO formalizes customary rights

### Key Legislation
1. **Land Act, 1999** — General land framework
2. **Village Land Act, 1999** — Village land management
3. **Land Registration Act, 2002** — Title registration
4. **Land Use Planning Act, 2007** — Spatial planning

### Rights Bundle
Land rights are often described as a "bundle of rights":
- Right to use
- Right to transfer
- Right to exclude
- Right to benefit from
- Right to manage
    `,
    quiz: [
      {
        id: 'lma-m2-q1',
        question: 'What does CCRO stand for?',
        options: [
          'Certificate of Community Right of Ownership',
          'Certificate of Customary Right of Occupancy',
          'Certification of Civic Right of Occupancy',
          'Certificate of Collective Right of Ownership',
        ],
        correctIndex: 1,
      },
      {
        id: 'lma-m2-q2',
        question: 'Which Act governs village land in Tanzania?',
        options: [
          'Land Act, 1999',
          'Land Registration Act, 2002',
          'Village Land Act, 1999',
          'Land Use Planning Act, 2007',
        ],
        correctIndex: 2,
      },
      {
        id: 'lma-m2-q3',
        question: 'Which is NOT part of the "bundle of rights" in land tenure?',
        options: [
          'Right to use',
          'Right to destroy permanently',
          'Right to transfer',
          'Right to exclude',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'lma-m3',
    courseId: 'project-management',
    order: 3,
    title: 'Land Use Planning Principles',
    duration: '55 min',
    isFree: false,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Land Use Planning in Practice',
    contentType: 'mixed',
    content: `
## Land Use Planning Principles

Land use planning is the systematic assessment of land potential, alternatives for land use, and economic and social conditions to select and adopt the best land use options.

### Objectives of Land Use Planning
- Orderly and rational use of land resources
- Prevention of land use conflicts
- Protection of environmentally sensitive areas
- Provision of adequate infrastructure and services
- Promotion of sustainable development

### Planning Hierarchy in Tanzania
1. National Land Use Framework Plan
2. Regional Land Use Plans
3. District Land Use Plans
4. Village Land Use Plans
5. Detailed (Local) Plans

### Key Principles
- **Participation**: Stakeholders must be involved
- **Sustainability**: Balance economic, social, environmental needs
- **Integration**: Coordinate across sectors
- **Flexibility**: Plans must adapt to changing circumstances
    `,
    quiz: [
      {
        id: 'lma-m3-q1',
        question: 'What is the primary objective of land use planning?',
        options: [
          'Maximizing land prices',
          'Orderly and rational use of land resources',
          'Restricting private ownership',
          'Increasing government revenue',
        ],
        correctIndex: 1,
      },
      {
        id: 'lma-m3-q2',
        question: 'Which is the lowest level in Tanzania\'s planning hierarchy?',
        options: [
          'District Land Use Plans',
          'Village Land Use Plans',
          'Detailed (Local) Plans',
          'Regional Land Use Plans',
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'lma-m4',
    courseId: 'project-management',
    order: 4,
    title: 'Conflict Resolution in Land Matters',
    duration: '45 min',
    isFree: false,
    content: `
## Conflict Resolution in Land Matters

Land disputes are among the most common sources of conflict in Tanzania. This module covers the institutional and legal framework for resolving land disputes.

### Common Sources of Land Conflict
- Boundary disputes
- Inheritance disputes
- Multiple allocations of the same land
- Encroachment on village/public land
- Compulsory acquisition grievances

### Dispute Resolution Hierarchy
1. Village Land Council (mediation)
2. Ward Tribunal
3. District Land and Housing Tribunal
4. High Court (Land Division)
5. Court of Appeal

### Alternative Dispute Resolution
- Mediation (facilitated negotiation)
- Arbitration (binding third-party decision)
- Negotiation (direct discussion between parties)

### Best Practices
- Early intervention prevents escalation
- Documentation is critical for evidence
- Gender sensitivity in land dispute resolution
- Community-based approaches for customary land
    `,
    quiz: [
      {
        id: 'lma-m4-q1',
        question: 'What is the first formal level of land dispute resolution?',
        options: [
          'High Court',
          'Ward Tribunal',
          'Village Land Council',
          'District Tribunal',
        ],
        correctIndex: 2,
      },
      {
        id: 'lma-m4-q2',
        question: 'Which is NOT a common source of land conflict in Tanzania?',
        options: [
          'Boundary disputes',
          'Weather patterns',
          'Multiple allocations',
          'Inheritance disputes',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'lma-m5',
    courseId: 'project-management',
    order: 5,
    title: 'Practical Tools & GIS in Land Management',
    duration: '60 min',
    isFree: false,
    content: `
## Practical Tools & GIS in Land Management

Modern land management increasingly relies on technology. This module introduces the practical tools used by land professionals.

### Geographic Information Systems (GIS)
GIS integrates hardware, software, and data to capture, manage, analyze, and display geographically referenced information.

### Applications in Land Management
- Cadastral mapping and land registration
- Land use monitoring and change detection
- Environmental impact assessment
- Infrastructure planning
- Property valuation support

### Remote Sensing
- Satellite imagery for land cover classification
- Aerial photography for detailed mapping
- Drone surveys for site-specific data

### Land Information Systems (LIS)
A LIS is a tool for legal, administrative, and economic decision-making. Components include:
- Cadastral database
- Topographic data
- Land use data
- Valuation records
- Planning data
    `,
    quiz: [
      {
        id: 'lma-m5-q1',
        question: 'What does GIS stand for?',
        options: [
          'General Information Service',
          'Geographic Information Systems',
          'Government Inspection Standards',
          'Geospatial Integration Software',
        ],
        correctIndex: 1,
      },
      {
        id: 'lma-m5-q2',
        question: 'Which is NOT a component of a Land Information System?',
        options: [
          'Cadastral database',
          'Social media profiles',
          'Valuation records',
          'Planning data',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'lma-m6',
    courseId: 'project-management',
    order: 6,
    title: 'Final Assessment',
    duration: '30 min',
    isFree: false,
    content: `
## Final Comprehensive Assessment

Congratulations on completing all learning modules! This final assessment tests your understanding across all topics covered in this course.

### Assessment Structure
- 20 multiple-choice questions
- Covers all 5 modules
- Passing score: 70%
- You may retake once after a 24-hour waiting period

### Tips
- Review your module notes before attempting
- Read each question carefully
- Manage your time — aim for 1.5 minutes per question
- Trust your preparation

Good luck!
    `,
    quiz: [
      {
        id: 'lma-m6-q1',
        question: 'Land tenure is best defined as:',
        options: [
          'The price of land',
          'The relationship between people and land',
          'Government ownership of land',
          'The physical survey of land',
        ],
        correctIndex: 1,
      },
      {
        id: 'lma-m6-q2',
        question: 'The Village Land Act was enacted in:',
        options: ['1995', '1997', '1999', '2002'],
        correctIndex: 2,
      },
      {
        id: 'lma-m6-q3',
        question: 'Alternative Dispute Resolution does NOT include:',
        options: [
          'Mediation',
          'Arbitration',
          'Court litigation',
          'Negotiation',
        ],
        correctIndex: 2,
      },
      {
        id: 'lma-m6-q4',
        question: 'Which technology uses satellite imagery for land cover analysis?',
        options: [
          'GIS',
          'Remote Sensing',
          'AutoCAD',
          'Blockchain',
        ],
        correctIndex: 1,
      },
      {
        id: 'lma-m6-q5',
        question: 'Good land governance requires all EXCEPT:',
        options: [
          'Transparency',
          'Accountability',
          'Secrecy',
          'Participation',
        ],
        correctIndex: 2,
      },
    ],
  },
];

// ============================================================
// Course 2: Land Valuation
// ============================================================

const course2Modules: Module[] = [
  {
    id: 'lv-m1',
    courseId: 'digital-marketing',
    order: 1,
    title: 'Introduction to Property Valuation',
    duration: '40 min',
    isFree: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Introduction to Property Valuation',
    contentType: 'mixed',
    content: `
## Introduction to Property Valuation

Property valuation is the process of forming an opinion of value for a specified interest in property at a given date. It is fundamental to functioning land and property markets.

### Why Valuation Matters
- **Taxation**: Fair assessment of property taxes
- **Compensation**: Just compensation for compulsory acquisition
- **Investment**: Informed decision-making for buyers and sellers
- **Lending**: Security for mortgage finance
- **Insurance**: Adequate coverage for property risks

### The Valuer's Role
A professional valuer is both a technical expert and a custodian of public trust. They must:
- Maintain independence and objectivity
- Apply recognized methods consistently
- Act within their competence
- Disclose conflicts of interest
- Keep adequate records

### Bases of Value
- **Market Value**: Most probable price in an open market
- **Investment Value**: Value to a particular investor
- **Fair Value**: Price between knowledgeable parties
- **Forced Sale Value**: Amount in a constrained timeframe
    `,
    quiz: [
      {
        id: 'lv-m1-q1',
        question: 'Property valuation is the process of:',
        options: [
          'Selling property at the highest price',
          'Forming an opinion of value for a specified interest',
          'Building new structures on land',
          'Registering land ownership',
        ],
        correctIndex: 1,
      },
      {
        id: 'lv-m1-q2',
        question: 'Market Value represents:',
        options: [
          'The cheapest possible price',
          'The most probable price in an open market',
          'The government-assessed value',
          'The historical purchase price',
        ],
        correctIndex: 1,
      },
      {
        id: 'lv-m1-q3',
        question: 'A professional valuer must:',
        options: [
          'Always favour the client who pays them',
          'Maintain independence and objectivity',
          'Only work for government agencies',
          'Avoid keeping records for privacy',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'lv-m2',
    courseId: 'digital-marketing',
    order: 2,
    title: 'Valuation Methods',
    duration: '55 min',
    isFree: false,
    content: `
## Valuation Methods

This module covers the five recognized approaches to property valuation.

### 1. Comparison Method
- Most widely used for residential property
- Based on analysis of recent comparable sales
- Adjustments for differences (size, location, condition)

### 2. Income Approach (Investment Method)
- Used for income-producing properties
- Capitalizes net income at an appropriate yield
- Variants: direct capitalization, DCF analysis

### 3. Cost Approach (Contractor's Method)
- Used for specialized/non-market properties
- Land value + cost of construction - depreciation
- Suitable for schools, hospitals, factories

### 4. Residual Method
- Used for development properties
- Gross Development Value - costs - profit = land value
- High sensitivity to assumptions

### 5. Profits Method
- Used for trade-related properties (hotels, petrol stations)
- Based on the trading potential of the property
- Requires analysis of business accounts
    `,
    quiz: [
      {
        id: 'lv-m2-q1',
        question: 'Which method is most commonly used for residential property?',
        options: [
          'Cost Approach',
          'Profits Method',
          'Comparison Method',
          'Residual Method',
        ],
        correctIndex: 2,
      },
      {
        id: 'lv-m2-q2',
        question: 'The Residual Method is primarily used for:',
        options: [
          'Existing residential homes',
          'Development properties',
          'Agricultural land',
          'Government buildings',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'lv-m3',
    courseId: 'digital-marketing',
    order: 3,
    title: 'Valuation for Compensation',
    duration: '50 min',
    isFree: false,
    content: `
## Valuation for Compensation

Compulsory acquisition is a government power to take private land for public purposes. Fair compensation is a constitutional right.

### Legal Framework
- Constitution of Tanzania (Article 24)
- Land Act, 1999 (Part VI)
- Land Acquisition Act, 1967
- Village Land Act, 1999

### Compensable Items
- Land value (market value of unimproved site)
- Improvements (buildings, structures)
- Crops and trees (at assessed value)
- Disturbance allowance
- Transport allowance
- Loss of profits (for businesses)
- Accommodation allowance

### Assessment Principles
- Full, fair, and prompt compensation
- Based on market value at the date of valuation
- Disturbance allowance = percentage of total value
- Special considerations for vulnerable groups
    `,
    quiz: [
      {
        id: 'lv-m3-q1',
        question: 'Fair compensation for compulsory acquisition is guaranteed by:',
        options: [
          'A local bylaw',
          'The Constitution of Tanzania',
          'International convention only',
          'The valuer\'s discretion',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'lv-m4',
    courseId: 'digital-marketing',
    order: 4,
    title: 'Final Assessment',
    duration: '25 min',
    isFree: false,
    content: `
## Final Comprehensive Assessment

This assessment covers all modules in the Land Management and Valuation course.

- 15 questions covering valuation principles, methods, and compensation
- Passing score: 70%
- Time limit: 25 minutes
    `,
    quiz: [
      {
        id: 'lv-m4-q1',
        question: 'Investment Value differs from Market Value because:',
        options: [
          'It is always higher',
          'It reflects value to a particular investor',
          'It only applies to commercial property',
          'It ignores market conditions',
        ],
        correctIndex: 1,
      },
      {
        id: 'lv-m4-q2',
        question: 'The Income Approach is used primarily for:',
        options: [
          'Vacant land',
          'Residential owner-occupied homes',
          'Income-producing properties',
          'Heritage buildings',
        ],
        correctIndex: 2,
      },
      {
        id: 'lv-m4-q3',
        question: 'Disturbance allowance compensates for:',
        options: [
          'Noise pollution',
          'Disruption caused by compulsory acquisition',
          'Natural disasters',
          'Construction defects',
        ],
        correctIndex: 1,
      },
    ],
  },
];

// ============================================================
// Courses Array
// ============================================================

export const courses: Course[] = [
  {
    id: 'project-management',
    title: 'Foundations of Project Management',
    shortDescription: 'Learn how to plan, execute, and deliver projects on time and within scope.',
    description: 'Project management is a core skill across every industry. This course teaches you the frameworks, tools, and techniques that professional project managers use to deliver results consistently. From initiation to closure, you will learn how to lead teams, manage stakeholders, and handle risks.',
    level: 'L1',
    levelLabel: 'Level 1: Foundational',
    cpdPoints: 8,
    duration: '4.5 hours',
    modules: course1Modules,
    instructor: 'Sarah Mwangi',
    category: 'Project Management',
    enrolledCount: 342,
    completionRate: 78,
    outcomes: [
      'Define project scope and objectives clearly',
      'Create work breakdown structures and timelines',
      'Identify and manage project risks',
      'Lead cross-functional teams effectively',
      'Use tools for tracking progress and reporting',
    ],
    prerequisites: ['No prior experience required'],
    imageUrl: '/images/course-pm.jpg',
    color: 'emerald',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Essentials',
    shortDescription: 'Master the core channels and strategies that drive growth online.',
    description: 'Digital marketing is essential for any business or professional looking to grow their reach. This course covers the key channels including SEO, social media, email, and paid advertising. You will learn how to create strategies, measure performance, and optimize campaigns for real results.',
    level: 'L1',
    levelLabel: 'Level 1: Foundational',
    cpdPoints: 6,
    duration: '3 hours',
    modules: course2Modules,
    instructor: 'James Okonkwo',
    category: 'Marketing',
    enrolledCount: 218,
    completionRate: 72,
    outcomes: [
      'Build a digital marketing strategy from scratch',
      'Run effective social media and email campaigns',
      'Measure ROI using analytics tools',
      'Optimize content for search engines',
    ],
    prerequisites: ['Basic understanding of business concepts'],
    imageUrl: '/images/course-marketing.jpg',
    color: 'violet',
  },
];

// ============================================================
// User Profile (mock authenticated user)
// ============================================================

export const mockUser: UserProfile = {
  id: 'user-449',
  name: 'Emmanuel Makoye',
  email: 'makoye224@gmail.com',
  memberNumber: 'TAA-449',
  role: 'member',
  cpdPointsEarned: 8,
  cpdPointsTarget: 20,
  enrolledCourses: [
    {
      courseId: 'project-management',
      courseTitle: 'Foundations of Project Management',
      progress: 33,
      currentModule: 2,
      totalModules: 6,
      enrolledAt: '2026-06-15',
      lastAccessedAt: '2026-07-20',
    },
    {
      courseId: 'digital-marketing',
      courseTitle: 'Digital Marketing Essentials',
      progress: 0,
      currentModule: 1,
      totalModules: 4,
      enrolledAt: '2026-07-22',
      lastAccessedAt: '2026-07-22',
    },
  ],
  certificates: [
    {
      id: 'cert-001',
      courseTitle: 'Foundations of Project Management',
      issuedAt: '2026-05-10',
      cpdPoints: 8,
      score: 85,
    },
  ],
};

// ============================================================
// Testimonials
// ============================================================

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Diana Itabi',
    role: 'Head of Operations, Supernova Africa Limited',
    text: 'The live webinar sessions at TAA have significantly enhanced my professional competence. The self-paced courses fit perfectly into my busy schedule.',
  },
  {
    id: 't2',
    name: 'Praise Bintabala',
    role: 'Member, Tanzania Ardhi Academy',
    text: 'Smart mind with creative ideas and planning of modern and digital cities for ongoing development. I am happy to be a member.',
  },
  {
    id: 't3',
    name: 'Robert Lyale',
    role: 'Land Professional',
    text: 'Digital transformation in land administration is key to minimizing boundary disputes. TAA courses gave me the foundation to drive that change.',
  },
];

// ============================================================
// Stats
// ============================================================

export const platformStats = {
  totalMembers: 560,
  coursesAvailable: 2,
  cpdPointsAwarded: 4480,
  completionRate: 76,
};

// ============================================================
// Helper Functions
// ============================================================

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getModule(courseId: string, moduleId: string): Module | undefined {
  const course = getCourse(courseId);
  return course?.modules.find((m) => m.id === moduleId);
}

// ============================================================
// Achievements
// ============================================================

export const achievements: Achievement[] = [
  {
    id: 'ach-first-lesson',
    title: 'First Steps',
    description: 'Complete your first module',
    icon: 'rocket',
    earned: true,
    earnedAt: '2026-06-15',
    rarity: 'common',
  },
  {
    id: 'ach-quiz-perfect',
    title: 'Perfect Score',
    description: 'Score 100% on any quiz',
    icon: 'star',
    earned: true,
    earnedAt: '2026-06-18',
    rarity: 'rare',
  },
  {
    id: 'ach-streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: 'flame',
    earned: true,
    earnedAt: '2026-07-01',
    rarity: 'rare',
  },
  {
    id: 'ach-course-complete',
    title: 'Graduate',
    description: 'Complete an entire course',
    icon: 'trophy',
    earned: true,
    earnedAt: '2026-05-10',
    rarity: 'epic',
  },
  {
    id: 'ach-streak-30',
    title: 'Unstoppable',
    description: 'Maintain a 30-day learning streak',
    icon: 'zap',
    earned: false,
    progress: 12,
    maxProgress: 30,
    rarity: 'epic',
  },
  {
    id: 'ach-all-courses',
    title: 'Scholar',
    description: 'Complete all available courses',
    icon: 'award',
    earned: false,
    progress: 1,
    maxProgress: 2,
    rarity: 'legendary',
  },
  {
    id: 'ach-cpd-master',
    title: 'CPD Master',
    description: 'Earn 20 CPD points',
    icon: 'target',
    earned: false,
    progress: 8,
    maxProgress: 20,
    rarity: 'legendary',
  },
  {
    id: 'ach-speed-learner',
    title: 'Speed Learner',
    description: 'Complete 3 modules in one day',
    icon: 'zap',
    earned: false,
    progress: 2,
    maxProgress: 3,
    rarity: 'rare',
  },
];

// ============================================================
// Learning Streak
// ============================================================

export const mockStreak: LearningStreak = {
  currentStreak: 5,
  longestStreak: 12,
  todayCompleted: true,
  weeklyGoal: 5,
  weeklyProgress: 4,
  lastActiveDate: '2026-07-27',
};

// ============================================================
// Leaderboard
// ============================================================

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Diana Itabi', points: 2450, streak: 28, avatar: 'DI' },
  { rank: 2, name: 'Robert Lyale', points: 2180, streak: 15, avatar: 'RL' },
  { rank: 3, name: 'Praise B.', points: 1920, streak: 12, avatar: 'PB' },
  { rank: 4, name: 'Emmanuel M.', points: 1650, streak: 5, avatar: 'EM', isCurrentUser: true },
  { rank: 5, name: 'Amina H.', points: 1480, streak: 8, avatar: 'AH' },
  { rank: 6, name: 'Joseph K.', points: 1320, streak: 3, avatar: 'JK' },
  { rank: 7, name: 'Grace M.', points: 1150, streak: 6, avatar: 'GM' },
  { rank: 8, name: 'Peter N.', points: 980, streak: 2, avatar: 'PN' },
];

// ============================================================
// XP & Gamification Data
// ============================================================

export const xpData = {
  currentXP: 1650,
  nextLevelXP: 2000,
  level: 4,
  levelTitle: 'Land Explorer',
  todayXP: 45,
  weeklyXP: [30, 45, 60, 45, 35, 0, 45],
  weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};
