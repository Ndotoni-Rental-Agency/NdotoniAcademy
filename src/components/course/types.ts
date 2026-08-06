/** Where the "Resume"/"Keep going" CTAs on the course page link to — the first not-yet-completed lesson, or the course's last lesson once everything is done. Computed eagerly in page.tsx once a learner has started (see its resume-target effect). */
export interface ResumeTarget {
  moduleId: string;
  lessonId: string;
  title: string;
}
