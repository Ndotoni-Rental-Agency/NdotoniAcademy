'use client';

import { Module } from '@/lib/mock-data';

export default function ModuleContent({ module }: { module: Module }) {
  const lines = module.content.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-xl font-extrabold text-ink-900 mt-10 mb-4 first:mt-0">{line.slice(3)}</h2>
      );
      i++; continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-base font-bold text-ink-800 mt-8 mb-3">{line.slice(4)}</h3>
      );
      i++; continue;
    }

    // Table
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        const cells = lines[i].trim().split('|').filter(c => c.trim() !== '');
        if (!cells.every(c => /^[\s\-:]+$/.test(c))) {
          tableRows.push(cells.map(c => c.trim()));
        }
        i++;
      }
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const body = tableRows.slice(1);
        elements.push(
          <div key={key++} className="mt-4 mb-6 overflow-x-auto rounded-xl border border-ink-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50 border-b border-ink-200">
                  {header.map((cell, ci) => (
                    <th key={ci} className="px-4 py-3 text-left font-semibold text-ink-700">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} className="border-b border-ink-100 last:border-0">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-ink-600">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Unordered list
    if (line.trim().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="mt-3 mb-5 space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-ink-600 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={key++} className="mt-3 mb-5 space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-ink-600 leading-relaxed">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph
    elements.push(
      <p key={key++} className="text-sm text-ink-600 leading-relaxed mb-4">
        <span dangerouslySetInnerHTML={{ __html: renderInline(line.trim()) }} />
      </p>
    );
    i++;
  }

  return <div className="animate-fade-in-up">{elements}</div>;
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ink-900">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-ink-100 text-ink-700 text-xs font-mono">$1</code>');
}
