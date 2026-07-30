export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: 'How to Build a Learning Habit That Sticks',
    excerpt: 'Small consistent actions beat intense bursts. Here is how to make learning part of your routine.',
    content: [
      'Most people overestimate what they can learn in one long session and underestimate what a short daily habit adds up to over a month. A 15-minute lesson done five days a week outperforms a single three-hour cram session almost every time, because spaced repetition helps information move into long-term memory.',
      'The easiest way to build the habit is to attach it to something you already do, right after your morning coffee or during your commute. Pick a fixed time, keep the session short enough that skipping it feels harder than doing it, and track your streak so progress stays visible.',
      'Finally, expect to miss a day eventually. The habit does not break the first time you skip it. It breaks when you let one missed day turn into a week. Restarting immediately is the whole skill.',
    ],
    category: 'Productivity',
    date: 'July 2026',
    readTime: '4 min',
  },
  {
    id: 2,
    title: 'The Case for Microlearning in Professional Development',
    excerpt: 'Why 15-minute modules outperform hour-long lectures for skill retention.',
    content: [
      'Traditional professional development often takes the form of a half-day workshop or a long recorded lecture. The problem is not the content. It is the format. Attention drops sharply after the first 10-15 minutes, and without repetition, most of what was covered is forgotten within days.',
      'Microlearning breaks the same material into short, focused modules that end with a quick check for understanding. Each module fits into a lunch break or a gap between meetings, which makes consistency realistic in a way a full-day workshop rarely is.',
      'The tradeoff is that microlearning works best for skills that can be broken into discrete steps. It is less suited to open-ended discussion or group problem-solving, where a longer live session still has real value.',
    ],
    category: 'Research',
    date: 'June 2026',
    readTime: '6 min',
  },
  {
    id: 3,
    title: 'Certificates That Employers Actually Value',
    excerpt: 'What makes a credential worth putting on your CV and how to choose wisely.',
    content: [
      'Not all certificates carry the same weight. Employers generally trust credentials that require demonstrating a skill (a graded assessment, a project, a passing quiz score) over ones that only require watching a video to completion.',
      'A credential is more valuable when it is specific about what was tested: "scored 85% on a project management assessment covering scope, risk, and scheduling" tells a hiring manager more than "completed a course."',
      'When choosing what to study, prioritize courses tied to skills you can point to in an interview with a concrete example, not just the certificate itself.',
    ],
    category: 'Career',
    date: 'June 2026',
    readTime: '5 min',
  },
  {
    id: 4,
    title: 'From Passive Watching to Active Learning',
    excerpt: 'Techniques to get more out of video lessons and retain what you study.',
    content: [
      'Watching a video lesson feels productive, but passive watching is one of the least effective ways to retain new information. Retention improves dramatically the moment you introduce any active step: pausing to summarize in your own words, predicting what comes next, or answering a practice question.',
      'A simple technique: after each section of a lesson, close the video and write two sentences summarizing what you just learned without looking back. If you cannot, that is the section to rewatch.',
      'Quizzes at the end of a module exist for the same reason: they force retrieval, which is what actually builds memory, rather than just re-exposure to the material.',
    ],
    category: 'Tips',
    date: 'May 2026',
    readTime: '3 min',
  },
  {
    id: 5,
    title: 'Teaching Online: What Great Instructors Do Differently',
    excerpt: 'Patterns from top-rated courses on engagement, structure, and clarity.',
    content: [
      'The best-reviewed online courses share a few habits regardless of subject. They open each module by stating exactly what the learner will be able to do by the end of it, rather than just listing topics.',
      'They also keep each lesson focused on one idea. Courses that try to cover too much per module tend to see learners drop off, because there is no clear stopping point that feels like real progress.',
      'Finally, they design the quiz to reinforce the single most important idea in the module, not to test trivia. A well-placed question after a key concept does more for retention than five questions on minor details.',
    ],
    category: 'Teaching',
    date: 'May 2026',
    readTime: '5 min',
  },
];
