import type { Metadata } from 'next';
import KnowledgePageClient from '@/components/KnowledgePageClient';

export const metadata: Metadata = {
  title: 'Knowledge',
  description: 'Ideas, research, and tips for learners and instructors on Ndotoni Academy.',
};

export default function KnowledgePage() {
  return <KnowledgePageClient />;
}
