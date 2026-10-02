import React from 'react';
import { Globe, AlignLeft, Mail, Phone, Wifi } from 'lucide-react';
import { QRType } from '../types/qr';

interface ContentTypeTabsProps {
  activeType: QRType;
  onChange: (type: QRType) => void;
}

const TABS: Array<{ id: QRType; label: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'url', label: 'URL', icon: Globe },
  { id: 'text', label: 'Text', icon: AlignLeft },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
];

export const ContentTypeTabs: React.FC<ContentTypeTabsProps> = ({ activeType, onChange }) => {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % TABS.length;
      onChange(TABS[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + TABS.length) % TABS.length;
      onChange(TABS[prevIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="QR Code Content Types"
      className="grid grid-cols-5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800"
    >
      {TABS.map((tab, idx) => {
        const Icon = tab.icon;
        const isActive = activeType === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`relative flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 ${
              isActive
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-sm border border-neutral-200/60 dark:border-neutral-700/60 font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500'}`} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
