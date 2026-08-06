'use client';

import { MessageSquare } from 'lucide-react';
import ComingSoonTab from '@/components/course/ComingSoonTab';

export default function CourseDiscussionPage() {
  return (
    <ComingSoonTab
      icon={MessageSquare}
      title="Discussion is coming soon"
      description="Ask questions and talk through the material with other learners, right here on the course."
    />
  );
}
