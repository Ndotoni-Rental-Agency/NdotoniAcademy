import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { courses } from '@/lib/mock-data';
import { articles } from '@/lib/knowledge-mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/courses',
    '/organizations',
    '/about',
    '/events',
    '/knowledge',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${SITE_URL}/courses/${course.id}`,
    lastModified: new Date(),
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/knowledge/${article.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...courseRoutes, ...articleRoutes];
}
