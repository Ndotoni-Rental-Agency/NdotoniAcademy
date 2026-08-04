'use client';

import { useState } from 'react';
import { GripVertical, Pencil, Plus } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { reorderCourseModules } from '@/graphql/mutations';
import type { ReorderCourseModulesMutation, ReorderCourseModulesMutationVariables } from '@/API';
import type { CourseModuleData } from './StudioLessonPane';
import ModuleModal from './ModuleModal';

interface StudioModuleListProps {
  courseId: string;
  modules: CourseModuleData[];
  selectedModuleId: string | null;
  onSelect: (id: string) => void;
  onModulesChange: (modules: CourseModuleData[]) => void;
  onModuleSaved: () => void;
}

function SortableModuleRow({
  module: mod,
  index,
  selected,
  onSelect,
  onEdit,
}: {
  module: CourseModuleData;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: mod.moduleId });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 cursor-pointer transition-all ${
        selected ? 'bg-coral-50 border-2 border-coral-200 shadow-sm' : 'border-2 border-transparent hover:bg-ink-50'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
        className="text-ink-300 hover:text-ink-500 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-extrabold ${
          selected ? 'bg-coral-600 text-white' : 'bg-ink-100 text-ink-500'
        }`}
      >
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 truncate">{mod.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-ink-400">
            {mod.lessonCount} lesson{mod.lessonCount === 1 ? '' : 's'}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            mod.isFree ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-500'
          }`}>
            {mod.isFree ? 'Free' : 'Paid'}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="text-ink-300 hover:text-coral-600 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 p-0.5"
        aria-label="Edit module"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function StudioModuleList({
  courseId, modules, selectedModuleId, onSelect, onModulesChange, onModuleSaved,
}: StudioModuleListProps) {
  const toast = useToast();
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModuleData | null>(null);
  const [error, setError] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((m) => m.moduleId === active.id);
    const newIndex = modules.findIndex((m) => m.moduleId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(modules, oldIndex, newIndex);
    onModulesChange(reordered);
    setError('');
    try {
      await GraphQLClient.execute<ReorderCourseModulesMutation>(reorderCourseModules, {
        courseId,
        moduleIds: reordered.map((m) => m.moduleId),
      } satisfies ReorderCourseModulesMutationVariables);
      // The backend computes isFree from position (course is free, or this
      // is module #1) — reordering can change which module that is, so
      // refetch rather than trust the locally-reordered isFree values.
      onModuleSaved();
    } catch (err) {
      console.error('[StudioModuleList] reorder failed ->', err);
      setError('Could not save the new order.');
      toast.error('Could not save the new order.');
    }
  }

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-ink-200 bg-white flex flex-col lg:h-full">
      <div className="px-4 pt-4 pb-2 flex items-baseline justify-between gap-2">
        <p className="text-xs font-bold text-ink-400 uppercase tracking-wide">Course structure</p>
        {modules.length > 1 && (
          <span className="flex items-center gap-1 text-[10px] text-ink-300 flex-shrink-0">
            <GripVertical className="w-3 h-3" /> Drag to reorder
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 space-y-1.5 max-h-72 lg:max-h-none">
        {modules.length === 0 ? (
          <button
            type="button"
            onClick={() => { setEditingModule(null); setModuleModalOpen(true); }}
            className="w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-ink-200 px-3 py-6 text-center hover:border-coral-300 hover:bg-coral-50/40 transition-colors"
          >
            <Plus className="w-4 h-4 text-coral-500" />
            <span className="text-xs font-bold text-ink-700">Add your first module</span>
            <span className="text-[11px] text-ink-400">Modules hold your lessons</span>
          </button>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={modules.map((m) => m.moduleId)} strategy={verticalListSortingStrategy}>
              {modules.map((mod, index) => (
                <SortableModuleRow
                  key={mod.moduleId}
                  module={mod}
                  index={index}
                  selected={mod.moduleId === selectedModuleId}
                  onSelect={() => onSelect(mod.moduleId)}
                  onEdit={() => { setEditingModule(mod); setModuleModalOpen(true); }}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
        {error && <p className="text-[11px] text-red-600 px-2">{error}</p>}
      </div>

      <div className="p-2.5 border-t border-ink-100">
        <button
          type="button"
          onClick={() => { setEditingModule(null); setModuleModalOpen(true); }}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-200 py-2.5 text-xs font-semibold text-ink-400 hover:border-coral-300 hover:text-coral-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add module
        </button>
      </div>

      <ModuleModal
        open={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        courseId={courseId}
        editModule={editingModule ? { id: editingModule.moduleId, title: editingModule.title, description: editingModule.description } : undefined}
        onSaved={() => {
          setModuleModalOpen(false);
          onModuleSaved();
        }}
      />
    </aside>
  );
}
