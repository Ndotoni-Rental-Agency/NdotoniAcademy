import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { articles } from '@/lib/knowledge-mock-data';

// Individual course pages (/courses/[id]) aren't listed here — they're real,
// backend-authored content now, fetched client-side, with no build-time data
// source to enumerate ids from. The /courses catalog itself stays listed;
// it's how both search engines and learners discover what's published.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/courses',
    '/organizations',
    '/instructors',
    '/about',
    '/events',
    '/knowledge',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/knowledge/${article.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...articleRoutes];
}
