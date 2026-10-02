import React from 'react';
import { History, Trash2, Globe, AlignLeft, Mail, Phone, Wifi, Clock } from 'lucide-react';
import { QRHistoryItem, QRType } from '../types/qr';

interface RecentHistoryProps {
  history: QRHistoryItem[];
  onSelect: (item: QRHistoryItem) => void;
  onClear: () => void;
}

const TYPE_ICONS: Record<QRType, React.FC<{ className?: string }>> = {
  url: Globe,
  text: AlignLeft,
  email: Mail,
  phone: Phone,
  wifi: Wifi,
};

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-neutral-500" />
          <h2 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
            Recent
          </h2>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-full">
            {history.length} / 5
          </span>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-[11px] text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
          title="Clear all recent items"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 mt-1">
        {history.map((item) => {
          const Icon = TYPE_ICONS[item.type] || Globe;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="w-full group flex items-center justify-between py-2.5 px-1 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/40 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate group-hover:text-black dark:group-hover:text-white">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-neutral-400 capitalize">
                    {item.type}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-neutral-400 flex-shrink-0 font-mono">
                <Clock className="w-3 h-3 text-neutral-400" />
                <span>{formatRelativeTime(item.timestamp)}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/60 text-[10px] text-neutral-400 flex items-center justify-between">
        <span>Click an item to restore it</span>
        <span className="italic">Wi-Fi passwords are never stored</span>
      </div>
    </div>
  );
};
