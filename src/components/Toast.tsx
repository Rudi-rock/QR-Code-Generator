import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xl border border-neutral-800 dark:border-neutral-200 text-xs font-medium tracking-wide animate-scale-in"
      role="status"
      aria-live="polite"
    >
      {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />}
      {isError && <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600 flex-shrink-0" />}
      {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400 dark:text-blue-600 flex-shrink-0" />}
      
      <span>{toast.message}</span>

      <button
        onClick={onDismiss}
        className="ml-2 text-neutral-400 hover:text-white dark:hover:text-black transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-neutral-400"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
