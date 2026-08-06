'use client';

import { ClipboardList } from 'lucide-react';
import ComingSoonTab from '@/components/course/ComingSoonTab';

export default function CourseAssignmentsPage() {
  return (
    <ComingSoonTab
      icon={ClipboardList}
      title="Assignments are coming soon"
      description="Submit work for review and get feedback from your instructor, right here on the course."
    />
  );
}
