import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { ContentTypeTabs } from './components/ContentTypeTabs';
import { InputPanel } from './components/InputPanel';
import { CustomizationPanel } from './components/CustomizationPanel';
import { QRPreview } from './components/QRPreview';
import { RecentHistory } from './components/RecentHistory';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  QRType,
  AllFormValues,
  QRCustomization,
  QRHistoryItem,
} from './types/qr';
import {
  generatePayload,
  getMetadataString,
  getHistoryTitle,
  sanitizeValuesForHistory,
} from './utils/qrPayload';
import { validateForm } from './utils/validation';

const DEFAULT_CUSTOMIZATION: QRCustomization = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  size: 320,
  margin: 2,
  errorCorrectionLevel: 'M',
};

const INITIAL_FORMS: AllFormValues = {
  url: { url: '' },
  text: { text: '' },
  email: { email: '', subject: '', message: '' },
  phone: { phone: '' },
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
};

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Content type state
  const [activeType, setActiveType] = useState<QRType>('url');

  // Input forms state
  const [forms, setForms] = useState<AllFormValues>(INITIAL_FORMS);

  // Customization state
  const [customization, setCustomization] = useState<QRCustomization>(DEFAULT_CUSTOMIZATION);

  // History state in localStorage (max 5 items)
  const [history, setHistory] = useLocalStorage<QRHistoryItem[]>('qr_studio_history', []);

  // Toast notification state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Math.random().toString(), message, type });
  };

  // Form update handler
  const handleUpdateForm = <T extends QRType>(type: T, updates: Partial<AllFormValues[T]>) => {
    setForms((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        ...updates,
      },
    }));
  };

  // Customization update handler
  const handleUpdateCustomization = (updates: Partial<QRCustomization>) => {
    setCustomization((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleResetCustomization = () => {
    setCustomization(DEFAULT_CUSTOMIZATION);
    showToast('Customization reset to default', 'info');
  };

  // Validation
  const validation = useMemo(() => {
    return validateForm(activeType, forms);
  }, [activeType, forms]);

  // Payload computation
  const payload = useMemo(() => {
    return generatePayload(activeType, forms);
  }, [activeType, forms]);

  // Metadata label
  const metadata = useMemo(() => {
    return getMetadataString(activeType, forms, payload);
  }, [activeType, forms, payload]);

  // Debounced auto-save to history
  const historySaveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!payload || !validation.isValid) return;

    if (historySaveTimeoutRef.current) {
      window.clearTimeout(historySaveTimeoutRef.current);
    }

    historySaveTimeoutRef.current = window.setTimeout(() => {
      const title = getHistoryTitle(activeType, forms);
      const sanitized = sanitizeValuesForHistory(activeType, forms);

      setHistory((prev) => {
        // Prevent duplicate immediate entry
        if (prev.length > 0 && prev[0].payload === payload) {
          return prev;
        }

        const newItem: QRHistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: activeType,
          title,
          timestamp: Date.now(),
          payload,
          savedValues: sanitized,
        };

        const updated = [newItem, ...prev.filter((item) => item.payload !== payload)];
        return updated.slice(0, 5);
      });
    }, 1200);

    return () => {
      if (historySaveTimeoutRef.current) {
        window.clearTimeout(historySaveTimeoutRef.current);
      }
    };
  }, [payload, validation.isValid, activeType, forms, setHistory]);

  // Restore item from history
  const handleRestoreHistory = (item: QRHistoryItem) => {
    setActiveType(item.type);
    setForms((prev) => ({
      ...prev,
      [item.type]: {
        ...prev[item.type],
        ...item.savedValues,
      },
    }));
    showToast(`Restored "${item.title}"`, 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('Recent history cleared', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#0c0d0e] text-[#09090b] dark:text-[#f4f4f5] transition-colors duration-150">
      {/* Toast notifications */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero headline - concise, elegant */}
        <section aria-label="Introduction" className="mb-8 sm:mb-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Create. Customize. Share.
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-lg">
            High-precision QR codes rendered entirely in your browser with instant live preview.
          </p>
        </section>

        {/* Studio Grid: Left Configuration / Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Configuration & Controls (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#141517] p-5 sm:p-6 shadow-subtle-light dark:shadow-card-dark space-y-6">
              {/* Step 1: Content Type Tabs */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Content Type
                </span>
                <ContentTypeTabs activeType={activeType} onChange={setActiveType} />
              </div>

              {/* Step 2: Content Input Panel */}
              <div className="pt-2">
                <InputPanel
                  activeType={activeType}
                  forms={forms}
                  errors={validation.errors}
                  onUpdateForm={handleUpdateForm}
                />
              </div>

              {/* Step 3: Appearance Customization (Collapsible) */}
              <div className="pt-2">
                <CustomizationPanel
                  customization={customization}
                  onChange={handleUpdateCustomization}
                  onReset={handleResetCustomization}
                />
              </div>
            </div>

            {/* Recent History Component */}
            <RecentHistory
              history={history}
              onSelect={handleRestoreHistory}
              onClear={handleClearHistory}
            />
          </div>

          {/* Right Column: Live QR Preview & Actions (5 cols on desktop) */}
          <div className="lg:col-span-5 sticky top-20">
            <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#141517] p-5 sm:p-6 shadow-subtle-light dark:shadow-card-dark flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  Live Preview
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                  {customization.errorCorrectionLevel} • {customization.size}×{customization.size}
                </span>
              </div>

              <div className="w-full mt-2">
                <QRPreview
                  type={activeType}
                  payload={payload}
                  metadata={metadata}
                  customization={customization}
                  isValid={validation.isValid}
                  onToast={showToast}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
