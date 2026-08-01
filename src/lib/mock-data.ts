// ============================================================
// Mock Data: Ndotoni Academy
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
  points: number;
  duration: string;
  modules: Module[];
  instructor: string;
  category: string;
  enrolledCount: number;
  completionRate: number;
  rating: number;
  outcomes: string[];
  skills: string[];
  prerequisites: string[];
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
  points: number;
  score: number;
}

// ============================================================
// Course 1: Foundations of Project Management
// ============================================================

const projectManagementModules: Module[] = [
  {
    id: 'pm-m1',
    courseId: 'project-management',
    order: 1,
    title: 'Introduction to Project Management',
    duration: '35 min',
    isFree: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'What Is a Project, Really?',
    contentType: 'mixed',
    content: `
## Introduction to Project Management

A project is a temporary endeavor with a defined start and end, undertaken to create a unique product, service, or result. Project management is the application of knowledge, skills, tools, and techniques to project activities to meet its requirements.

### Projects vs. Operations

- **Projects** are temporary and unique. They end once the goal is achieved.
- **Operations** are ongoing and repetitive. They sustain the business.

### The Triple Constraint

Every project is bound by three interdependent constraints:
1. **Scope**: what work will be done
2. **Time**: when it will be delivered
3. **Cost**: how much it will cost

Changing one constraint affects the other two. A good project manager balances all three against quality expectations.

### Why Project Management Matters

- Reduces the risk of scope creep and missed deadlines
- Improves resource allocation and team accountability
- Gives stakeholders visibility into progress and risk
- Turns a good idea into a delivered, measurable outcome

### The Role of a Project Manager

A project manager plans the work, coordinates the team, communicates with stakeholders, and manages risk, but does not necessarily do the technical work themselves. Their core skill is coordination under constraints.
    `,
    quiz: [
      {
        id: 'pm-m1-q1',
        question: 'What best distinguishes a project from an operation?',
        options: [
          'Projects are always more expensive',
          'Projects are temporary with a defined start and end',
          'Operations require more people',
          'Projects never have a budget',
        ],
        correctIndex: 1,
      },
      {
        id: 'pm-m1-q2',
        question: 'Which three elements make up the Triple Constraint?',
        options: [
          'Scope, Time, Cost',
          'People, Process, Technology',
          'Risk, Quality, Communication',
          'Planning, Execution, Closure',
        ],
        correctIndex: 0,
      },
      {
        id: 'pm-m1-q3',
        question: "What is a project manager's core skill?",
        options: [
          'Writing all technical documentation alone',
          'Coordinating people, scope, and constraints toward a goal',
          'Approving all company budgets',
          'Avoiding stakeholder communication',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'pm-m2',
    courseId: 'project-management',
    order: 2,
    title: 'Project Lifecycle & Methodologies',
    duration: '45 min',
    isFree: false,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Waterfall vs. Agile, Explained',
    contentType: 'mixed',
    content: `
## Project Lifecycle & Methodologies

### The Five Process Groups

1. **Initiation**: define the project and get approval to start
2. **Planning**: define scope, schedule, budget, and risk approach
3. **Execution**: do the work and build the deliverables
4. **Monitoring & Controlling**: track progress against the plan
5. **Closure**: deliver the final product and close out the project

### Waterfall vs. Agile

| | Waterfall | Agile |
|---|---|---|
| Approach | Sequential phases | Iterative sprints |
| Best for | Well-defined, stable requirements | Evolving requirements |
| Change | Costly late in the project | Expected and welcomed |
| Delivery | One final release | Frequent incremental releases |

### Hybrid Approaches

Many real projects combine both: a stable overall plan (Waterfall) with iterative delivery of individual workstreams (Agile). Choosing a methodology is a judgment call based on how well-known the requirements are upfront.
    `,
    quiz: [
      {
        id: 'pm-m2-q1',
        question: 'Which process group comes immediately after Planning?',
        options: ['Closure', 'Execution', 'Initiation', 'Monitoring & Controlling'],
        correctIndex: 1,
      },
      {
        id: 'pm-m2-q2',
        question: 'Agile methodology is best suited for projects where:',
        options: [
          'Requirements are fixed and fully known upfront',
          'Requirements are expected to evolve',
          'There is no need for stakeholder feedback',
          'A single final release is required',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'pm-m3',
    courseId: 'project-management',
    order: 3,
    title: 'Scope, Time & Cost Planning',
    duration: '50 min',
    isFree: false,
    content: `
## Scope, Time & Cost Planning

### Work Breakdown Structure (WBS)

A WBS decomposes the total project scope into smaller, manageable pieces of work. Each level breaks the work down further until tasks are small enough to estimate and assign.

### Building a Schedule

- List all tasks from the WBS
- Sequence tasks based on dependencies
- Estimate duration for each task
- Identify the **critical path**: the longest sequence of dependent tasks that determines the minimum project duration

### Budgeting Basics

- Estimate cost per task, then roll up to a total budget
- Add a contingency reserve for known risks
- Track actual spend against the baseline budget throughout execution

### Common Pitfalls

- Skipping the WBS and estimating the whole project as one block
- Ignoring dependencies when building the schedule
- Underestimating the contingency needed for uncertain tasks
    `,
    quiz: [
      {
        id: 'pm-m3-q1',
        question: 'What is a Work Breakdown Structure (WBS) used for?',
        options: [
          'Tracking employee attendance',
          'Decomposing project scope into manageable pieces of work',
          'Calculating tax obligations',
          'Assigning office space',
        ],
        correctIndex: 1,
      },
      {
        id: 'pm-m3-q2',
        question: 'The critical path is:',
        options: [
          'The cheapest way to complete a project',
          'The longest sequence of dependent tasks determining minimum duration',
          'A list of all project risks',
          'The first task in any project',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'pm-m4',
    courseId: 'project-management',
    order: 4,
    title: 'Managing Risk & Stakeholders',
    duration: '45 min',
    isFree: false,
    content: `
## Managing Risk & Stakeholders

### The Risk Register

A risk register tracks each identified risk along with its probability, impact, and a planned response. Reviewing it regularly keeps risk management active rather than a one-time exercise.

### Risk Response Strategies

- **Avoid**: change the plan to eliminate the risk
- **Mitigate**: reduce the probability or impact
- **Transfer**: shift the risk to a third party (e.g. insurance, a vendor contract)
- **Accept**: acknowledge the risk and prepare a contingency

### Stakeholder Mapping

Stakeholders can be mapped by **interest** and **influence**:
- High interest, high influence: manage closely
- High influence, low interest: keep satisfied
- High interest, low influence: keep informed
- Low interest, low influence: monitor with minimal effort

### Communication Planning

A good communication plan defines who needs which information, how often, and through which channel, preventing both information overload and costly surprises.
    `,
    quiz: [
      {
        id: 'pm-m4-q1',
        question: 'Which risk response strategy means shifting the risk to a third party?',
        options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
        correctIndex: 2,
      },
      {
        id: 'pm-m4-q2',
        question: 'A stakeholder with high influence but low interest should be:',
        options: ['Ignored entirely', 'Managed closely', 'Kept satisfied', 'Kept informed only'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'pm-m5',
    courseId: 'project-management',
    order: 5,
    title: 'Practical Tools: Gantt Charts & Kanban Boards',
    duration: '40 min',
    isFree: false,
    content: `
## Practical Tools: Gantt Charts & Kanban Boards

### Gantt Charts

A Gantt chart is a horizontal bar chart showing tasks against time, making dependencies and overall timeline easy to see at a glance. Best suited for schedule-driven, Waterfall-style planning.

### Kanban Boards

A Kanban board visualizes work as cards moving through columns (e.g. To Do, In Progress, Done), limiting work-in-progress to improve flow. Best suited for ongoing, Agile-style teams.

### Choosing a Tool

- Use a Gantt chart when the sequence and timing of tasks is the priority
- Use a Kanban board when continuous flow and visibility of current work matters most
- Many teams use both: a Gantt chart for the overall roadmap, a Kanban board for weekly execution

### Reporting Progress

Whatever tool is used, consistent status reporting (on-track, at-risk, blocked) keeps stakeholders aligned without requiring a meeting for every update.
    `,
    quiz: [
      {
        id: 'pm-m5-q1',
        question: 'A Gantt chart is primarily used to show:',
        options: [
          'Tasks plotted against time with dependencies',
          'Employee salaries',
          'Customer satisfaction scores',
          'Marketing campaign results',
        ],
        correctIndex: 0,
      },
      {
        id: 'pm-m5-q2',
        question: 'A Kanban board is best suited for:',
        options: [
          'Fixed, sequential Waterfall schedules only',
          'Visualizing continuous, Agile-style workflow',
          'Calculating project budgets',
          'Replacing stakeholder communication',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'pm-m6',
    courseId: 'project-management',
    order: 6,
    title: 'Final Assessment',
    duration: '30 min',
    isFree: false,
    content: `
## Final Comprehensive Assessment

Congratulations on completing all learning modules! This final assessment tests your understanding across everything covered in this course.

### Assessment Structure
- Covers all 5 modules
- Passing score: 70%
- You may retake once after a 24-hour waiting period

### Tips
- Review your module notes before attempting
- Read each question carefully
- Manage your time: aim for roughly 1.5 minutes per question

Good luck!
    `,
    quiz: [
      {
        id: 'pm-m6-q1',
        question: 'The Triple Constraint refers to:',
        options: [
          'Scope, Time, and Cost',
          'People, Process, and Tools',
          'Planning, Doing, Reviewing',
          'Risk, Budget, and Staff',
        ],
        correctIndex: 0,
      },
      {
        id: 'pm-m6-q2',
        question: 'Which methodology favors iterative delivery over a single final release?',
        options: ['Waterfall', 'Agile', 'Critical Path Method', 'Six Sigma'],
        correctIndex: 1,
      },
      {
        id: 'pm-m6-q3',
        question: 'A risk register tracks:',
        options: [
          'Only risks that have already occurred',
          'Probability, impact, and planned response for each risk',
          'Employee vacation schedules',
          'Marketing budgets',
        ],
        correctIndex: 1,
      },
      {
        id: 'pm-m6-q4',
        question: 'The critical path determines:',
        options: [
          'The cheapest possible project cost',
          'The minimum possible project duration',
          'The number of stakeholders involved',
          'Which tool the team should use',
        ],
        correctIndex: 1,
      },
      {
        id: 'pm-m6-q5',
        question: 'Which tool is best suited to visualize ongoing, Agile-style work-in-progress?',
        options: ['Gantt chart', 'Kanban board', 'Risk register', 'Budget spreadsheet'],
        correctIndex: 1,
      },
    ],
  },
];

// ============================================================
// Course 2: Digital Marketing Essentials
// ============================================================

const digitalMarketingModules: Module[] = [
  {
    id: 'dm-m1',
    courseId: 'digital-marketing',
    order: 1,
    title: 'Introduction to Digital Marketing',
    duration: '30 min',
    isFree: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'The Digital Marketing Landscape',
    contentType: 'mixed',
    content: `
## Introduction to Digital Marketing

Digital marketing is the promotion of products or services using digital channels (search engines, social media, email, and paid advertising) to reach and convert customers.

### The Marketing Funnel

1. **Awareness**: potential customers discover your brand
2. **Consideration**: they evaluate you against alternatives
3. **Conversion**: they take the desired action (purchase, signup)
4. **Retention**: they return and become advocates

### Core Digital Channels

- **Search (SEO & SEM)**: being found when people search
- **Social Media**: building community and reach
- **Email**: nurturing leads directly
- **Paid Advertising**: buying targeted visibility

### Why It Matters

Digital channels are measurable in a way traditional media rarely is. Every click, view, and conversion can be tracked, letting marketers continuously improve their return on investment.
    `,
    quiz: [
      {
        id: 'dm-m1-q1',
        question: 'What is the first stage of the marketing funnel?',
        options: ['Retention', 'Awareness', 'Conversion', 'Consideration'],
        correctIndex: 1,
      },
      {
        id: 'dm-m1-q2',
        question: 'Which of these is a core digital marketing channel?',
        options: ['Billboard advertising', 'Search engine optimization', 'Cold-calling', 'Print newspapers'],
        correctIndex: 1,
      },
      {
        id: 'dm-m1-q3',
        question: 'A key advantage of digital marketing over traditional media is:',
        options: [
          'It requires no strategy',
          'Results are measurable and trackable',
          'It guarantees viral growth',
          'It has no cost',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'dm-m2',
    courseId: 'digital-marketing',
    order: 2,
    title: 'SEO & Content Marketing Fundamentals',
    duration: '50 min',
    isFree: false,
    content: `
## SEO & Content Marketing Fundamentals

### On-Page SEO
- Keyword-relevant titles and headings
- Descriptive meta descriptions
- Fast page load times and mobile-friendly design

### Off-Page SEO
- Backlinks from reputable sites
- Brand mentions and citations
- Social signals that indicate authority

### Keyword Research Basics
1. Identify what your audience actually searches for
2. Balance search volume against competition
3. Match keywords to search intent (informational, navigational, transactional)

### Content Strategy

A content calendar mapped to the funnel keeps output consistent: awareness-stage blog posts, consideration-stage comparisons, and conversion-stage product content.
    `,
    quiz: [
      {
        id: 'dm-m2-q1',
        question: 'Which of these is an on-page SEO factor?',
        options: ['Backlinks from other sites', 'Page load speed and mobile-friendliness', 'Social media followers', 'Email open rate'],
        correctIndex: 1,
      },
      {
        id: 'dm-m2-q2',
        question: 'Off-page SEO primarily relies on:',
        options: ['Meta descriptions', 'Page titles', 'Backlinks and external signals', 'Font choice'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'dm-m3',
    courseId: 'digital-marketing',
    order: 3,
    title: 'Social Media & Paid Advertising',
    duration: '45 min',
    isFree: false,
    content: `
## Social Media & Paid Advertising

### Organic vs. Paid

- **Organic** reach is free but slower to build and increasingly limited by platform algorithms
- **Paid** advertising buys guaranteed, targeted visibility but requires ongoing budget

### Choosing a Platform

Match the platform to where your audience actually spends time and the format that suits your message. Not every business needs every channel.

### Campaign Basics

1. Define a clear objective (awareness, traffic, conversions)
2. Define your target audience (demographics, interests, behavior)
3. Set a budget and bidding strategy
4. Design creative suited to the platform and objective
5. Measure results against the original objective, not vanity metrics

### Targeting

Modern ad platforms allow targeting by demographics, interests, past behavior, and lookalike audiences modeled on your existing customers.
    `,
    quiz: [
      {
        id: 'dm-m3-q1',
        question: 'A key trade-off of organic social media reach is that it is:',
        options: [
          'Guaranteed and instant',
          'Free but slower and limited by algorithms',
          'Always more effective than paid ads',
          'Impossible to measure',
        ],
        correctIndex: 1,
      },
      {
        id: 'dm-m3-q2',
        question: 'The first step in planning a paid ad campaign should be:',
        options: [
          'Choosing colors for the creative',
          'Defining a clear campaign objective',
          'Setting the largest possible budget',
          'Copying a competitor\'s ad exactly',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'dm-m4',
    courseId: 'digital-marketing',
    order: 4,
    title: 'Final Assessment',
    duration: '25 min',
    isFree: false,
    content: `
## Final Comprehensive Assessment

This assessment covers everything from the digital marketing fundamentals, SEO, and paid social modules.

- Passing score: 70%
- Time limit: 25 minutes
    `,
    quiz: [
      {
        id: 'dm-m4-q1',
        question: 'Which funnel stage focuses on turning customers into advocates?',
        options: ['Awareness', 'Consideration', 'Conversion', 'Retention'],
        correctIndex: 3,
      },
      {
        id: 'dm-m4-q2',
        question: 'Backlinks are primarily part of:',
        options: ['On-page SEO', 'Off-page SEO', 'Email marketing', 'Paid advertising'],
        correctIndex: 1,
      },
      {
        id: 'dm-m4-q3',
        question: 'A lookalike audience is built from:',
        options: [
          'Random users with no data',
          'Your existing customers\' characteristics',
          'Competitor ad spend',
          'Search engine rankings',
        ],
        correctIndex: 1,
      },
    ],
  },
];

// ============================================================
// Course 3: Data Analytics Foundations
// ============================================================

const dataAnalyticsModules: Module[] = [
  {
    id: 'da-m1',
    courseId: 'data-analytics',
    order: 1,
    title: 'Why Data Analytics Matters',
    duration: '30 min',
    isFree: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'From Data to Decisions',
    contentType: 'mixed',
    content: `
## Why Data Analytics Matters

Data analytics turns raw numbers into decisions. Organizations that use data well can spot problems earlier, understand customers better, and justify decisions with evidence rather than guesswork.

### Four Types of Analytics

1. **Descriptive**: what happened? (e.g. last month's sales)
2. **Diagnostic**: why did it happen? (e.g. why sales dropped)
3. **Predictive**: what's likely to happen? (e.g. forecasted demand)
4. **Prescriptive**: what should we do about it? (e.g. recommended actions)

### A Simple Analytics Workflow

1. Collect relevant data
2. Clean and organize it
3. Analyze it for patterns
4. Visualize and communicate findings
5. Act on the insight

### Data-Driven vs. Data-Informed

Being data-driven doesn't mean ignoring judgment. The best decisions combine reliable data with domain expertise and context data alone can't capture.
    `,
    quiz: [
      {
        id: 'da-m1-q1',
        question: 'Which type of analytics answers "why did this happen"?',
        options: ['Descriptive', 'Diagnostic', 'Predictive', 'Prescriptive'],
        correctIndex: 1,
      },
      {
        id: 'da-m1-q2',
        question: 'What is the first step in a simple analytics workflow?',
        options: ['Visualize findings', 'Collect relevant data', 'Take action', 'Predict the future'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'da-m2',
    courseId: 'data-analytics',
    order: 2,
    title: 'Working with Data: Spreadsheets & Dashboards',
    duration: '45 min',
    isFree: false,
    content: `
## Working with Data: Spreadsheets & Dashboards

### Data Cleaning Basics

- Remove duplicates and fix inconsistent formatting
- Handle missing values deliberately (exclude, estimate, or flag)
- Standardize categories (e.g. "USA", "U.S.", "United States" should be one value)

### Pivot Tables

Pivot tables summarize large datasets by grouping and aggregating fields, a fast way to answer questions like "total sales by region by month" without writing formulas for every combination.

### Dashboard Design Principles

- Lead with the most important metric, not everything you have
- Use consistent, purposeful color, not decoration
- Group related metrics together
- Design for the audience's decision, not for completeness
    `,
    quiz: [
      {
        id: 'da-m2-q1',
        question: 'A pivot table is primarily used to:',
        options: [
          'Design website layouts',
          'Group and aggregate data to summarize it',
          'Send marketing emails',
          'Encrypt sensitive data',
        ],
        correctIndex: 1,
      },
      {
        id: 'da-m2-q2',
        question: 'A good dashboard should be designed around:',
        options: [
          'Showing every metric available',
          'The audience\'s decision-making needs',
          'As many colors as possible',
          'The size of the underlying dataset',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'da-m3',
    courseId: 'data-analytics',
    order: 3,
    title: 'Interpreting Data for Decisions',
    duration: '40 min',
    isFree: false,
    content: `
## Interpreting Data for Decisions

### Mean vs. Median

The **mean** (average) can be skewed by outliers; the **median** (middle value) often better represents a "typical" case in skewed data, like income or response times.

### Correlation Is Not Causation

Two variables moving together doesn't mean one causes the other. A third factor, coincidence, or reverse causation could explain the pattern. Always ask what else could explain a correlation before acting on it.

### Telling a Story with Data

- Start with the question the audience actually cares about
- Lead with the insight, not the methodology
- Use one chart per key point rather than a single crowded chart
- Always state what the data supports, and what it doesn't
    `,
    quiz: [
      {
        id: 'da-m3-q1',
        question: 'Compared to the mean, the median is generally more resistant to:',
        options: ['Small sample sizes', 'Outliers', 'Missing data', 'Rounding errors'],
        correctIndex: 1,
      },
      {
        id: 'da-m3-q2',
        question: 'If two variables correlate, this proves:',
        options: [
          'One definitely causes the other',
          'Nothing on its own; causation must be established separately',
          'The data must be wrong',
          'They will always correlate in the future',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'da-m4',
    courseId: 'data-analytics',
    order: 4,
    title: 'Final Assessment',
    duration: '25 min',
    isFree: false,
    content: `
## Final Comprehensive Assessment

This assessment covers analytics fundamentals, working with data, and interpretation for decision-making.

- Passing score: 70%
- Time limit: 25 minutes
    `,
    quiz: [
      {
        id: 'da-m4-q1',
        question: 'Forecasting future demand is an example of:',
        options: ['Descriptive analytics', 'Diagnostic analytics', 'Predictive analytics', 'Manual analytics'],
        correctIndex: 2,
      },
      {
        id: 'da-m4-q2',
        question: 'When cleaning data, inconsistent category labels should be:',
        options: ['Left as-is for authenticity', 'Standardized to one consistent value', 'Deleted entirely', 'Ignored'],
        correctIndex: 1,
      },
      {
        id: 'da-m4-q3',
        question: 'A good data story should:',
        options: [
          'Lead with the methodology before the insight',
          'Cram every available chart onto one slide',
          'Lead with the insight the audience cares about',
          'Avoid stating any conclusions',
        ],
        correctIndex: 2,
      },
    ],
  },
];

// ============================================================
// Course 4: UX Design Principles
// ============================================================

const uxDesignModules: Module[] = [
  {
    id: 'ux-m1',
    courseId: 'ux-design',
    order: 1,
    title: 'Foundations of User-Centered Design',
    duration: '30 min',
    isFree: true,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'What UX Actually Means',
    contentType: 'mixed',
    content: `
## Foundations of User-Centered Design

### UX vs. UI

- **UX (User Experience)** is how a product works, feels, and solves a user's problem end-to-end
- **UI (User Interface)** is the visual and interactive layer the user directly touches

UI is part of UX, but UX also covers research, flow, accessibility, and content: everything that shapes whether the product actually works for the person using it.

### The Design Thinking Process

1. **Empathize**: understand real user needs through research
2. **Define**: frame the specific problem worth solving
3. **Ideate**: generate a wide range of possible solutions
4. **Prototype**: build a quick, testable version
5. **Test**: get real feedback and iterate

### Why User-Centered Design Matters

Designing from assumptions instead of real user needs is the most common cause of products that look polished but fail to solve the actual problem.
    `,
    quiz: [
      {
        id: 'ux-m1-q1',
        question: 'UI (User Interface) is best described as:',
        options: [
          'The entire end-to-end experience of using a product',
          'The visual and interactive layer the user directly touches',
          'A synonym for UX',
          'Only the backend logic of an app',
        ],
        correctIndex: 1,
      },
      {
        id: 'ux-m1-q2',
        question: 'Which stage of Design Thinking comes right after "Define"?',
        options: ['Empathize', 'Ideate', 'Test', 'Prototype'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'ux-m2',
    courseId: 'ux-design',
    order: 2,
    title: 'Wireframing & Prototyping Basics',
    duration: '45 min',
    isFree: false,
    content: `
## Wireframing & Prototyping Basics

### Low-Fidelity vs. High-Fidelity

- **Low-fidelity** wireframes use simple boxes and placeholder text to test structure and flow quickly
- **High-fidelity** prototypes include real content, visuals, and interactions to test closer to the final experience

### Core Wireframe Elements

- Navigation and information hierarchy
- Content blocks and their relative priority
- Calls to action and their placement
- Whitespace and grouping to show relationships

### Prototyping Tools (General Categories)

- Static mockup tools for visual layout
- Interactive prototyping tools for clickable flows
- Code-based prototypes for testing real interaction behavior

### Choosing Fidelity

Start low-fidelity when testing whether the structure makes sense; move to high-fidelity once the flow is validated and visual/interaction details need testing.
    `,
    quiz: [
      {
        id: 'ux-m2-q1',
        question: 'A low-fidelity wireframe is best used to test:',
        options: ['Exact brand colors', 'Overall structure and flow quickly', 'Final animation timing', 'Font pairing'],
        correctIndex: 1,
      },
      {
        id: 'ux-m2-q2',
        question: 'When should a team typically move to high-fidelity prototypes?',
        options: [
          'Before any user research',
          'Once the overall flow has been validated at low fidelity',
          'Only after the product has shipped',
          'Never; low fidelity is always sufficient',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'ux-m3',
    courseId: 'ux-design',
    order: 3,
    title: 'Usability Testing Essentials',
    duration: '40 min',
    isFree: false,
    content: `
## Usability Testing Essentials

### Common Testing Methods

- **Moderated testing**: a facilitator guides the participant through tasks live
- **Unmoderated testing**: participants complete tasks independently, recorded for later review
- **A/B testing**: comparing two live variants with real users at scale

### Recruiting Participants

Test with people who resemble your actual target users. Five participants often surface most major usability issues, so testing doesn't require huge sample sizes to be valuable.

### Writing Good Test Tasks

- Frame tasks as goals, not instructions (e.g. "Find a course on marketing" not "Click the search icon")
- Avoid leading language that hints at the answer
- Observe where people hesitate, not just whether they succeed

### Analyzing Feedback

Look for patterns across multiple participants rather than over-indexing on one person's opinion, and separate what people did from what they said they'd do.
    `,
    quiz: [
      {
        id: 'ux-m3-q1',
        question: 'In moderated usability testing:',
        options: [
          'Participants complete tasks entirely alone',
          'A facilitator guides the participant through tasks live',
          'No tasks are given at all',
          'Only quantitative data is collected',
        ],
        correctIndex: 1,
      },
      {
        id: 'ux-m3-q2',
        question: 'A well-written usability test task should:',
        options: [
          'Give step-by-step instructions on which buttons to click',
          'Frame a goal without hinting at the exact answer',
          'Be skipped in favor of just asking opinions',
          'Only be tested with the design team',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'ux-m4',
    courseId: 'ux-design',
    order: 4,
    title: 'Final Assessment',
    duration: '25 min',
    isFree: false,
    content: `
## Final Comprehensive Assessment

This assessment covers user-centered design foundations, wireframing/prototyping, and usability testing.

- Passing score: 70%
- Time limit: 25 minutes
    `,
    quiz: [
      {
        id: 'ux-m4-q1',
        question: 'UX is best described as:',
        options: [
          'Only the visual style of an app',
          'The full end-to-end experience of using a product',
          'A type of programming language',
          'A synonym for graphic design',
        ],
        correctIndex: 1,
      },
      {
        id: 'ux-m4-q2',
        question: 'Roughly how many usability test participants are often enough to surface most major issues?',
        options: ['1', '5', '50', '500'],
        correctIndex: 1,
      },
      {
        id: 'ux-m4-q3',
        question: 'The "Ideate" stage of Design Thinking is about:',
        options: [
          'Narrowing to one final solution immediately',
          'Generating a wide range of possible solutions',
          'Shipping the final product',
          'Conducting user interviews',
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
    points: 8,
    duration: '4.5 hours',
    modules: projectManagementModules,
    instructor: 'Sarah Mwangi',
    category: 'Project Management',
    enrolledCount: 342,
    completionRate: 78,
    rating: 4.8,
    outcomes: [
      'Define project scope and objectives clearly',
      'Create work breakdown structures and timelines',
      'Identify and manage project risks',
      'Lead cross-functional teams effectively',
      'Use tools for tracking progress and reporting',
    ],
    skills: ['Scope Management', 'Risk Management', 'Stakeholder Communication', 'Agile & Waterfall Methodologies', 'Project Scheduling'],
    prerequisites: ['No prior experience required'],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Essentials',
    shortDescription: 'Master the core channels and strategies that drive growth online.',
    description: 'Digital marketing is essential for any business or professional looking to grow their reach. This course covers the key channels including SEO, social media, and paid advertising. You will learn how to create strategies, measure performance, and optimize campaigns for real results.',
    level: 'L1',
    levelLabel: 'Level 1: Foundational',
    points: 6,
    duration: '3 hours',
    modules: digitalMarketingModules,
    instructor: 'James Okonkwo',
    category: 'Marketing',
    enrolledCount: 218,
    completionRate: 72,
    rating: 4.6,
    outcomes: [
      'Build a digital marketing strategy from scratch',
      'Run effective social media and paid ad campaigns',
      'Measure results using core marketing metrics',
      'Optimize content for search engines',
    ],
    skills: ['SEO Fundamentals', 'Content Strategy', 'Social Media Advertising', 'Campaign Analytics'],
    prerequisites: ['Basic understanding of business concepts'],
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics Foundations',
    shortDescription: 'Turn raw data into clear, confident business decisions.',
    description: 'Every role increasingly requires comfort with data. This course teaches the fundamentals of analytical thinking, working with spreadsheets and dashboards, and interpreting data correctly so you can support decisions with evidence rather than guesswork.',
    level: 'L1',
    levelLabel: 'Level 1: Foundational',
    points: 7,
    duration: '3.5 hours',
    modules: dataAnalyticsModules,
    instructor: 'Grace Kimaro',
    category: 'Technology',
    enrolledCount: 156,
    completionRate: 74,
    rating: 4.7,
    outcomes: [
      'Distinguish descriptive, diagnostic, predictive, and prescriptive analytics',
      'Clean and organize raw data for analysis',
      'Build clear, decision-focused dashboards',
      'Avoid common pitfalls like confusing correlation with causation',
    ],
    skills: ['Data Cleaning', 'Dashboard Design', 'Statistical Reasoning', 'Data Storytelling'],
    prerequisites: ['No prior experience required'],
  },
  {
    id: 'ux-design',
    title: 'UX Design Principles',
    shortDescription: 'Design products people can actually use, from research to usability testing.',
    description: 'Great products are built around real user needs, not assumptions. This course walks through the design thinking process, wireframing and prototyping, and how to run usability tests that surface what really matters before you ship.',
    level: 'L1',
    levelLabel: 'Level 1: Foundational',
    points: 7,
    duration: '3.5 hours',
    modules: uxDesignModules,
    instructor: 'Neema Mushi',
    category: 'Design',
    enrolledCount: 189,
    completionRate: 81,
    rating: 4.9,
    outcomes: [
      'Apply the design thinking process to real problems',
      'Build low- and high-fidelity wireframes and prototypes',
      'Plan and run effective usability tests',
      'Turn user feedback into concrete design decisions',
    ],
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
    prerequisites: ['No prior experience required'],
  },
];

// ============================================================
// User Profile (mock authenticated user)
// ============================================================

// ============================================================
// Demo learning content — courses/certificates/points aren't part of the
// real backend yet (intentionally out of scope for the auth-only MVP, see
// ndotoniAcademyBackend's CLAUDE.md), so this stays static placeholder
// content rather than mocking a "current user" the way auth data used to.
// Real identity/organization info now comes from useAuth() instead.
// ============================================================
export const demoEnrolledCourses: EnrolledCourse[] = [
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
];

export const demoCertificates: Certificate[] = [
  {
    id: 'cert-001',
    courseTitle: 'Foundations of Project Management',
    issuedAt: '2026-05-10',
    points: 8,
    score: 85,
  },
];

export const demoPoints = { earned: 8, target: 30 };
export const demoStreakDays = 4;

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
