import type { Metadata } from 'next';
import EventsPageClient from '@/components/EventsPageClient';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Webinars, workshops, and live sessions for the Ndotoni Academy community.',
};

export default function EventsPage() {
  return <EventsPageClient />;
}
