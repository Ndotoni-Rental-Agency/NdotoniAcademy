'use client';

import { CheckCircle2, Circle, GripVertical, Plus, X } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface QuestionDraft {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const inputClass = 'flex-1 min-w-0 rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60';

function SortableQuestionCard({
  question: q, index, onUpdate, onRemove, canRemove, disabled,
}: {
  question: QuestionDraft;
  index: number;
  onUpdate: (patch: Partial<QuestionDraft>) => void;
  onRemove: () => void;
  canRemove: boolean;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: q.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  function updateOption(i: number, value: string) {
    const options = [...q.options];
    options[i] = value;
    onUpdate({ options });
  }

  function addOption() {
    onUpdate({ options: [...q.options, ''] });
  }

  function removeOption(i: number) {
    if (q.options.length <= 2) return;
    const options = q.options.filter((_, oi) => oi !== i);
    const correctIndex = q.correctIndex === i ? 0 : q.correctIndex > i ? q.correctIndex - 1 : q.correctIndex;
    onUpdate({ options, correctIndex });
  }

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-ink-100 bg-white p-3.5 space-y-3">
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="text-ink-300 hover:text-ink-500 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-ink-300 flex-shrink-0 w-4 text-center">{index + 1}</span>
        <input
          type="text"
          placeholder="Question"
          value={q.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          disabled={disabled}
          className={inputClass}
        />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="text-ink-300 hover:text-red-500 transition-colors flex-shrink-0 disabled:opacity-60"
            aria-label="Remove question"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-1.5 pl-9">
        {q.options.map((opt, oi) => {
          const isCorrect = q.correctIndex === oi;
          return (
            <div
              key={oi}
              className={`flex items-center gap-2 rounded-lg border px-2 py-1 transition-colors ${
                isCorrect ? 'border-brand-300 bg-brand-50' : 'border-transparent'
              }`}
            >
              <button
                type="button"
                onClick={() => onUpdate({ correctIndex: oi })}
                disabled={disabled}
                className={`flex-shrink-0 transition-colors disabled:opacity-60 ${isCorrect ? 'text-brand-600' : 'text-ink-300 hover:text-ink-400'}`}
                aria-label={isCorrect ? 'Correct answer' : 'Mark as correct answer'}
              >
                {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </button>
              <input
                type="text"
                placeholder={`Option ${oi + 1}`}
                value={opt}
                onChange={(e) => updateOption(oi, e.target.value)}
                disabled={disabled}
                className={`${inputClass} bg-transparent border-none focus:ring-0 px-1 py-1`}
              />
              {q.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(oi)}
                  disabled={disabled}
                  className="text-ink-300 hover:text-red-500 transition-colors flex-shrink-0 disabled:opacity-60"
                  aria-label="Remove option"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={addOption}
          disabled={disabled}
          className="text-xs font-semibold text-coral-600 hover:text-coral-700 transition-colors disabled:opacity-60"
        >
          + Add option
        </button>
      </div>
    </div>
  );
}

interface QuizEditorProps {
  questions: QuestionDraft[];
  onChange: (questions: QuestionDraft[]) => void;
  disabled?: boolean;
}

export default function QuizEditor({ questions, onChange, disabled }: QuizEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function addQuestion() {
    onChange([...questions, { id: crypto.randomUUID(), question: '', options: ['', ''], correctIndex: 0 }]);
  }

  function removeQuestion(id: string) {
    onChange(questions.filter((q) => q.id !== id));
  }

  function updateQuestion(id: string, patch: Partial<QuestionDraft>) {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(questions, oldIndex, newIndex));
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <SortableQuestionCard
                key={q.id}
                question={q}
                index={i}
                onUpdate={(patch) => updateQuestion(q.id, patch)}
                onRemove={() => removeQuestion(q.id)}
                canRemove={questions.length > 1}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={addQuestion}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-coral-600 hover:text-coral-700 transition-colors disabled:opacity-60"
      >
        <Plus className="w-3.5 h-3.5" /> Add question
      </button>
    </div>
  );
}
