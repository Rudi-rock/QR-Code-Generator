import React from 'react';
import { QrCode, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../hooks/useTheme';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800/80 bg-white/75 dark:bg-[#0c0d0e]/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                QR Studio
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-700/60">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal leading-none hidden xs:block mt-0.5">
              Generate beautiful QR codes locally.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Client-side</span>
          </div>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
};
