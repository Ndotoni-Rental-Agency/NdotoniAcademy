'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, ChevronUp, ChevronDown, CheckCircle2, Video, Layers, FileText, HelpCircle } from 'lucide-react';
import {
  initialTeachingCourses, blockTypeMeta,
  type TeachingCourse, type TeachingModule, type LessonBlockType,
} from '@/lib/teaching-mock-data';

const blockIcons: Record<LessonBlockType, typeof Video> = {
  video: Video,
  flashcards: Layers,
  guide: FileText,
  quiz: HelpCircle,
};

let blockIdCounter = 0;
function newBlockId() {
  blockIdCounter += 1;
  return `block-${Date.now()}-${blockIdCounter}`;
}

export default function TeachingCourseBuilderPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<TeachingCourse | undefined>(() =>
    initialTeachingCourses.find((c) => c.id === courseId)
  );
  const [addingBlockTo, setAddingBlockTo] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  if (!course) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl">
        <Link href="/dashboard/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-indigo-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
        <p className="text-sm text-ink-400 bg-white rounded-2xl border-2 border-ink-100 px-4 py-10 text-center">
          Course not found. It may have only existed in a previous session.
        </p>
      </div>
    );
  }

  function updateModules(updater: (modules: TeachingModule[]) => TeachingModule[]) {
    setCourse((prev) => (prev ? { ...prev, modules: updater(prev.modules) } : prev));
  }

  function addModule() {
    updateModules((modules) => [
      ...modules,
      { id: `mod-${Date.now()}`, title: `Module ${modules.length + 1}`, blocks: [] },
    ]);
  }

  function removeModule(moduleId: string) {
    updateModules((modules) => modules.filter((m) => m.id !== moduleId));
  }

  function updateModuleTitle(moduleId: string, title: string) {
    updateModules((modules) => modules.map((m) => (m.id === moduleId ? { ...m, title } : m)));
  }

  function addBlock(moduleId: string, type: LessonBlockType) {
    const meta = blockTypeMeta[type];
    updateModules((modules) => modules.map((m) =>
      m.id === moduleId
        ? { ...m, blocks: [...m.blocks, { id: newBlockId(), type, title: `New ${meta.label.toLowerCase()}`, meta: meta.defaultMeta }] }
        : m
    ));
    setAddingBlockTo(null);
  }

  function removeBlock(moduleId: string, blockId: string) {
    updateModules((modules) => modules.map((m) =>
      m.id === moduleId ? { ...m, blocks: m.blocks.filter((b) => b.id !== blockId) } : m
    ));
  }

  function updateBlockField(moduleId: string, blockId: string, field: 'title' | 'meta', value: string) {
    updateModules((modules) => modules.map((m) =>
      m.id === moduleId
        ? { ...m, blocks: m.blocks.map((b) => (b.id === blockId ? { ...b, [field]: value } : b)) }
        : m
    ));
  }

  function moveBlock(moduleId: string, blockId: string, direction: -1 | 1) {
    updateModules((modules) => modules.map((m) => {
      if (m.id !== moduleId) return m;
      const index = m.blocks.findIndex((b) => b.id === blockId);
      const targetIndex = index + direction;
      if (index === -1 || targetIndex < 0 || targetIndex >= m.blocks.length) return m;
      const blocks = [...m.blocks];
      [blocks[index], blocks[targetIndex]] = [blocks[targetIndex], blocks[index]];
      return { ...m, blocks };
    }));
  }

  function handleSave(status: 'draft' | 'published') {
    setCourse((prev) => (prev ? { ...prev, status } : prev));
    setSavedMessage(status === 'published' ? 'Published' : 'Draft saved');
    setTimeout(() => setSavedMessage(null), 2500);
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link href="/dashboard/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2 ${
            course.status === 'published' ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
          }`}>
            {course.status}
          </span>
          <h1 className="text-2xl font-extrabold text-ink-900">{course.title}</h1>
          <p className="text-sm text-ink-500 mt-1">{course.shortDescription}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => handleSave('draft')}
            className="rounded-xl border-2 border-ink-200 px-4 py-2.5 text-sm font-bold text-ink-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            Save draft
          </button>
          <button
            onClick={() => handleSave('published')}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
          >
            Publish
          </button>
        </div>
      </div>

      {savedMessage && (
        <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-700 mb-6">
          <CheckCircle2 className="w-4 h-4" /> {savedMessage}
        </p>
      )}

      <div className="space-y-5">
        {course.modules.map((mod) => (
          <div key={mod.id} className="rounded-2xl border-2 border-ink-100 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={mod.title}
                onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                className="flex-1 min-w-0 font-bold text-ink-900 text-sm rounded-lg border border-transparent hover:border-ink-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none px-2 py-1 -mx-2 transition-all"
              />
              <button
                onClick={() => removeModule(mod.id)}
                className="text-ink-300 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label="Remove module"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {mod.blocks.map((block, i) => {
                const Icon = blockIcons[block.type];
                return (
                  <div key={block.id} className="flex items-center gap-3 rounded-xl border border-ink-100 px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={block.title}
                      onChange={(e) => updateBlockField(mod.id, block.id, 'title', e.target.value)}
                      className="flex-1 min-w-0 text-sm font-semibold text-ink-900 rounded-lg border border-transparent hover:border-ink-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none px-2 py-1 -mx-2 transition-all"
                    />
                    <input
                      type="text"
                      value={block.meta}
                      onChange={(e) => updateBlockField(mod.id, block.id, 'meta', e.target.value)}
                      className="w-24 flex-shrink-0 text-xs text-ink-400 text-right rounded-lg border border-transparent hover:border-ink-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none px-2 py-1 transition-all"
                    />
                    <div className="flex items-center flex-shrink-0">
                      <button onClick={() => moveBlock(mod.id, block.id, -1)} disabled={i === 0} className="text-ink-300 hover:text-ink-600 disabled:opacity-30 disabled:hover:text-ink-300 transition-colors p-0.5" aria-label="Move up">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => moveBlock(mod.id, block.id, 1)} disabled={i === mod.blocks.length - 1} className="text-ink-300 hover:text-ink-600 disabled:opacity-30 disabled:hover:text-ink-300 transition-colors p-0.5" aria-label="Move down">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removeBlock(mod.id, block.id)} className="text-ink-300 hover:text-red-500 transition-colors p-0.5 ml-1" aria-label="Remove block">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {addingBlockTo === mod.id ? (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {(Object.keys(blockTypeMeta) as LessonBlockType[]).map((type) => {
                  const Icon = blockIcons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => addBlock(mod.id, type)}
                      className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-100 px-3 py-1.5 text-xs font-bold text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" /> {blockTypeMeta[type].label}
                    </button>
                  );
                })}
                <button
                  onClick={() => setAddingBlockTo(null)}
                  className="text-xs font-semibold text-ink-400 hover:text-ink-600 transition-colors px-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingBlockTo(mod.id)}
                className="w-full mt-3 rounded-xl border border-dashed border-ink-200 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-400 hover:border-brand-300 hover:text-brand-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add a block
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addModule}
        className="w-full mt-5 rounded-2xl border-2 border-dashed border-ink-200 py-4 flex items-center justify-center gap-1.5 text-sm font-bold text-ink-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add a module
      </button>
    </div>
  );
}
