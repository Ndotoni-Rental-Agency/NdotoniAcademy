import type { Metadata } from 'next';
import CoursesPageClient from '@/components/CoursesPageClient';

export const metadata: Metadata = {
  title: 'Explore Courses',
  description: 'Find your next skill. Browse expert-led courses in project management, marketing, design, and technology. Module 1 is always free.',
};

export default function CoursesPage() {
  return <CoursesPageClient />;
}
