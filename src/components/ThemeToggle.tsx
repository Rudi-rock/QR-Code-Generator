import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="group relative inline-flex items-center justify-center w-8 h-8 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
      title={`Toggle theme (${theme === 'dark' ? 'Light' : 'Dark'})`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12" />
      )}
    </button>
  );
};
