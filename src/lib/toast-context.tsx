'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

type ToastVariant = 'success' | 'error';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message: string, variant: ToastVariant) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => dismiss(id), DISMISS_MS);
  }, [dismiss]);

  const value: ToastContextValue = {
    success: (message: string) => push(message, 'success'),
    error: (message: string) => push(message, 'error'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-white px-4 py-3 shadow-xl shadow-black/10 ${
                t.variant === 'success' ? 'border-brand-200' : 'border-red-200'
              }`}
            >
              {t.variant === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-semibold text-ink-900 flex-1 leading-snug">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-ink-300 hover:text-ink-600 transition-colors flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
