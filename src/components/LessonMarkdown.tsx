import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// No rehype-raw anywhere in this — react-markdown only ever renders the
// Markdown AST it parses itself, never raw HTML found in the source string,
// so lesson bodies (including ones auto-filled from an uploaded document,
// or polished by BeautifyMarkdownButton — see LessonForm) can't smuggle in
// a <script> tag or similar. Keep it that way; don't add rehype-raw here.
// rehype-katex is a different category: it only ever renders LaTeX source
// (parsed and sanitized by KaTeX itself, which emits a fixed, controlled
// set of HTML/MathML elements) inside $...$/$$...$$ delimiters — not a way
// to inject arbitrary HTML.
const components: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-semibold text-ink-900 mt-8 mb-3 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold text-ink-900 mt-7 mb-2.5 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-bold text-ink-900 mt-6 mb-2 first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="text-sm font-bold uppercase tracking-wide text-ink-500 mt-5 mb-1.5 first:mt-0">{children}</h4>,
  p: ({ children }) => <p className="text-[15px] sm:text-base text-ink-700 leading-[1.75] mb-4 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-bold text-ink-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline decoration-1 underline-offset-2">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 mb-4 text-[15px] sm:text-base text-ink-700 leading-[1.75]">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1.5 mb-4 text-[15px] sm:text-base text-ink-700 leading-[1.75]">{children}</ol>,
  li: ({ children }) => <li className="leading-[1.75]">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-200 bg-indigo-50/40 rounded-r-lg pl-4 pr-3 py-2 italic text-ink-600 mb-4">{children}</blockquote>
  ),
  code: ({ children }) => <code className="rounded bg-ink-100 px-1.5 py-0.5 text-[0.85em] text-ink-800">{children}</code>,
  pre: ({ children }) => <pre className="rounded-xl bg-ink-900 text-ink-50 p-4 overflow-x-auto mb-4 text-sm">{children}</pre>,
  hr: () => <hr className="border-ink-200 my-8" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-5 rounded-xl border border-ink-200">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-ink-50">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-ink-100">{children}</tbody>,
  th: ({ children }) => <th className="px-4 py-2.5 text-left font-bold text-ink-900 border-b border-ink-200">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2.5 text-ink-700 align-top">{children}</td>,
};

export default function LessonMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
