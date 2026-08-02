'use client';

import { GripVertical, Plus, X } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MediaField, { type MediaValue } from './MediaField';

export interface CardDraft {
  id: string;
  front: string;
  back: string;
  frontMedia: MediaValue | null;
  backMedia: MediaValue | null;
}

const textareaClass = 'flex-1 min-w-0 rounded-lg border border-ink-200 px-2.5 py-1.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 disabled:opacity-60 resize-none';

function SortableCardRow({
  card, index, onUpdate, onRemove, canRemove, disabled,
}: {
  card: CardDraft;
  index: number;
  onUpdate: (patch: Partial<CardDraft>) => void;
  onRemove: () => void;
  canRemove: boolean;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 rounded-lg border border-ink-100 p-2.5 bg-white">
      <button
        {...attributes}
        {...listeners}
        className="text-ink-300 hover:text-ink-500 cursor-grab active:cursor-grabbing flex-shrink-0 mt-3 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="text-xs font-bold text-ink-300 flex-shrink-0 mt-3 w-4 text-center">{index + 1}</span>

      <div className="flex-1 grid grid-cols-2 gap-2 min-w-0">
        <div className="flex items-start gap-2">
          <MediaField value={card.frontMedia} onChange={(m) => onUpdate({ frontMedia: m })} size="sm" />
          <textarea
            rows={2}
            placeholder="Front"
            value={card.front}
            onChange={(e) => onUpdate({ front: e.target.value })}
            disabled={disabled}
            className={textareaClass}
          />
        </div>
        <div className="flex items-start gap-2">
          <MediaField value={card.backMedia} onChange={(m) => onUpdate({ backMedia: m })} size="sm" />
          <textarea
            rows={2}
            placeholder="Back"
            value={card.back}
            onChange={(e) => onUpdate({ back: e.target.value })}
            disabled={disabled}
            className={textareaClass}
          />
        </div>
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="text-ink-300 hover:text-red-500 transition-colors flex-shrink-0 mt-3 disabled:opacity-60"
          aria-label="Remove card"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface FlashcardEditorProps {
  cards: CardDraft[];
  onChange: (cards: CardDraft[]) => void;
  disabled?: boolean;
}

export default function FlashcardEditor({ cards, onChange, disabled }: FlashcardEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function addCard() {
    onChange([...cards, { id: crypto.randomUUID(), front: '', back: '', frontMedia: null, backMedia: null }]);
  }

  function removeCard(id: string) {
    onChange(cards.filter((c) => c.id !== id));
  }

  function updateCard(id: string, patch: Partial<CardDraft>) {
    onChange(cards.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = cards.findIndex((c) => c.id === active.id);
    const newIndex = cards.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(cards, oldIndex, newIndex));
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 pl-9 pr-7">
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide">Front</p>
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide">Back</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {cards.map((card, i) => (
              <SortableCardRow
                key={card.id}
                card={card}
                index={i}
                onUpdate={(patch) => updateCard(card.id, patch)}
                onRemove={() => removeCard(card.id)}
                canRemove={cards.length > 1}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={addCard}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-coral-600 hover:text-coral-700 transition-colors disabled:opacity-60"
      >
        <Plus className="w-3.5 h-3.5" /> Add card
      </button>
    </div>
  );
}
