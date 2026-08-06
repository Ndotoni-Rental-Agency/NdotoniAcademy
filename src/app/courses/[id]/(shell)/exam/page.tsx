'use client';

import { GraduationCap } from 'lucide-react';
import ComingSoonTab from '@/components/course/ComingSoonTab';

export default function CourseExamPage() {
  return (
    <ComingSoonTab
      icon={GraduationCap}
      title="The final exam is coming soon"
      description="Once you finish every lesson, a short final exam will unlock here — pass it to earn your certificate."
    />
  );
}
