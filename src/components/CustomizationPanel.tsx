import React, { useState } from 'react';
import { Sliders, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { QRCustomization, ErrorCorrectionLevel } from '../types/qr';

interface CustomizationPanelProps {
  customization: QRCustomization;
  onChange: (updates: Partial<QRCustomization>) => void;
  onReset: () => void;
}

const PRESET_PALETTES = [
  { name: 'Monochrome', fg: '#000000', bg: '#ffffff' },
  { name: 'Dark Slate', fg: '#0f172a', bg: '#f8fafc' },
  { name: 'Deep Indigo', fg: '#1e1b4b', bg: '#eef2ff' },
  { name: 'Forest Green', fg: '#064e3b', bg: '#ecfdf5' },
];

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  onChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 overflow-hidden transition-all duration-200">
      {/* Accordion header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="customization-controls"
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-neutral-500" />
          <span>Appearance & Styling</span>
          <span className="text-[10px] text-neutral-400 bg-neutral-200/60 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono">
            {customization.size}px • {customization.errorCorrectionLevel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </div>
      </button>

      {/* Accordion body */}
      {isOpen && (
        <div
          id="customization-controls"
          className="p-4 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/60 space-y-4 text-xs animate-fade-in"
        >
          {/* Preset Palettes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Quick Palettes</span>
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors"
                title="Reset appearance to defaults"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_PALETTES.map((preset) => {
                const isActive =
                  customization.foregroundColor.toLowerCase() === preset.fg.toLowerCase() &&
                  customization.backgroundColor.toLowerCase() === preset.bg.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() =>
                      onChange({
                        foregroundColor: preset.fg,
                        backgroundColor: preset.bg,
                      })
                    }
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] transition-all ${
                      isActive
                        ? 'border-neutral-800 dark:border-neutral-200 bg-white dark:bg-neutral-800 font-medium shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 inline-block shadow-xs"
                      style={{ backgroundColor: preset.fg }}
                    />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label
                htmlFor="fg-color"
                className="block font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="fg-color"
                  type="color"
                  value={customization.foregroundColor}
                  onChange={(e) => onChange({ foregroundColor: e.target.value })}
                  className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent p-0"
                />
                <input
                  type="text"
                  aria-label="Foreground hex code"
                  value={customization.foregroundColor}
                  onChange={(e) => onChange({ foregroundColor: e.target.value })}
                  className="w-24 px-2 py-1 font-mono uppercase text-xs rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="bg-color"
                className="block font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="bg-color"
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent p-0"
                />
                <input
                  type="text"
                  aria-label="Background hex code"
                  value={customization.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                  className="w-24 px-2 py-1 font-mono uppercase text-xs rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
              </div>
            </div>
          </div>

          {/* Size & Margin Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="size-slider"
                  className="font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Resolution Size
                </label>
                <span className="font-mono text-neutral-500 text-[11px]">{customization.size}px</span>
              </div>
              <input
                id="size-slider"
                type="range"
                min="200"
                max="600"
                step="20"
                value={customization.size}
                onChange={(e) => onChange({ size: Number(e.target.value) })}
                className="w-full accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="margin-slider"
                  className="font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Quiet Zone (Margin)
                </label>
                <span className="font-mono text-neutral-500 text-[11px]">{customization.margin} modules</span>
              </div>
              <input
                id="margin-slider"
                type="range"
                min="0"
                max="6"
                step="1"
                value={customization.margin}
                onChange={(e) => onChange({ margin: Number(e.target.value) })}
                className="w-full accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
              />
            </div>
          </div>

          {/* Error correction level */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                Error Correction Level
              </span>
              <span className="text-[11px] text-neutral-400">
                {customization.errorCorrectionLevel === 'L' && 'L (~7% recovery)'}
                {customization.errorCorrectionLevel === 'M' && 'M (~15% recovery, default)'}
                {customization.errorCorrectionLevel === 'Q' && 'Q (~25% recovery)'}
                {customization.errorCorrectionLevel === 'H' && 'H (~30% recovery, maximum)'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-200/50 dark:bg-neutral-800/60 rounded-lg">
              {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((level) => {
                const isActive = customization.errorCorrectionLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onChange({ errorCorrectionLevel: level })}
                    className={`py-1 text-xs font-medium rounded transition-all ${
                      isActive
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    Level {level}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
