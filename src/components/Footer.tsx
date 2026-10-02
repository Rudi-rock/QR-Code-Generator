import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-200/80 dark:border-neutral-800/80 py-6 text-center text-xs text-neutral-400 dark:text-neutral-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 font-medium text-neutral-600 dark:text-neutral-400">
          <span>QR Studio</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            Private by design
          </span>
        </div>

        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
          All QR codes are generated strictly in your browser. No cookies, no tracking, zero server calls.
        </p>
      </div>
    </footer>
  );
};
