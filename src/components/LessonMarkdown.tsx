import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

// No rehype-raw / dangerouslySetInnerHTML anywhere in this — react-markdown
// only ever renders the Markdown AST it parses itself, never raw HTML found
// in the source string, so lesson bodies (including ones auto-filled from
// an uploaded document — see LessonForm's transcribe flow) can't smuggle in
// a <script> tag or similar. Keep it that way; don't add rehype-raw here.
const components: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-extrabold text-ink-900 mt-6 mb-3 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-extrabold text-ink-900 mt-5 mb-2.5 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-bold text-ink-900 mt-4 mb-2 first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="text-base font-bold text-ink-900 mt-3 mb-1.5 first:mt-0">{children}</h4>,
  p: ({ children }) => <p className="text-ink-700 leading-relaxed mb-4 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-bold text-ink-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline decoration-1 underline-offset-2">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-4 text-ink-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-4 text-ink-700">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-ink-500 mb-4">{children}</blockquote>
  ),
  code: ({ children }) => <code className="rounded bg-ink-100 px-1.5 py-0.5 text-[0.85em] text-ink-800">{children}</code>,
  pre: ({ children }) => <pre className="rounded-xl bg-ink-900 text-ink-50 p-4 overflow-x-auto mb-4 text-sm">{children}</pre>,
  hr: () => <hr className="border-ink-200 my-6" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-ink-50">{children}</thead>,
  th: ({ children }) => <th className="border border-ink-200 px-3 py-2 text-left font-bold text-ink-900">{children}</th>,
  td: ({ children }) => <td className="border border-ink-200 px-3 py-2 text-ink-700 align-top">{children}</td>,
};

export default function LessonMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
