interface CourseWithAttribution {
  organization?: { name: string } | null;
  instructor?: { firstName?: string | null; lastName?: string | null } | null;
}

// An org-authored course credits the org; an independent instructor's course
// credits them by name — never both.
export function instructorDisplayName(course: CourseWithAttribution): string | null {
  if (course.organization?.name) return course.organization.name;
  const instructor = course.instructor;
  if (!instructor) return null;
  const name = [instructor.firstName, instructor.lastName].filter(Boolean).join(' ').trim();
  return name || null;
}
