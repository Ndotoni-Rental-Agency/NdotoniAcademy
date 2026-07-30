import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { articles } from '@/lib/knowledge-mock-data';

export function generateStaticParams() {
  return articles.map((a) => ({ id: String(a.id) }));
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articles.find((a) => a.id === Number(id));
  if (!article) return notFound();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link href="/knowledge" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-indigo-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">{article.category}</span>
          <span className="text-[11px] text-ink-400">{article.date}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-3 leading-tight">{article.title}</h1>
        <p className="flex items-center gap-1.5 text-sm text-ink-400 mb-8">
          <Clock className="w-3.5 h-3.5" /> {article.readTime} read
        </p>

        <div className="space-y-5">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-ink-700 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
