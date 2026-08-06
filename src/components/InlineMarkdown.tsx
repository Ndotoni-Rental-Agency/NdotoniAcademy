import ReactMarkdown, { type Components } from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Lighter than LessonMarkdown — for short, single-line strings (quiz
// questions/options, flashcard front/back) that live inside a button or
// card row, not a full article. No block-level margins, no headings/lists/
// tables (this content should never contain them); just inline emphasis,
// code, and math. Same rehype-katex safety note as LessonMarkdown: it only
// renders KaTeX's own controlled output for $...$/$$...$$, never arbitrary
// HTML from the source string.
const components: Components = {
  p: ({ children }) => <>{children}</>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => <code className="rounded bg-black/5 px-1 py-0.5 text-[0.9em]">{children}</code>,
};

export default function InlineMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
