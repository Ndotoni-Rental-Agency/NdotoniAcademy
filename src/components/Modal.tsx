'use client';

import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Blocks the backdrop/X close while a submit is in flight. */
  closeDisabled?: boolean;
  maxWidth?: 'lg' | '2xl';
}

export default function Modal({ open, onClose, title, children, closeDisabled, maxWidth = 'lg' }: ModalProps) {
  if (!open) return null;

  function handleClose() {
    if (closeDisabled) return;
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={handleClose}>
      <div
        className={`max-h-[90vh] w-full ${maxWidth === '2xl' ? 'max-w-2xl' : 'max-w-lg'} overflow-y-auto rounded-2xl bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-extrabold text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
