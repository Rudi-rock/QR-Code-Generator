import React, { useState } from 'react';
import { Download, Copy, Check, QrCode as QrIcon, AlertCircle } from 'lucide-react';
import { QRType, QRCustomization } from '../types/qr';
import { useQRGenerator } from '../hooks/useQRGenerator';
import { getFilename, downloadCanvasAsPng, copyTextToClipboard } from '../utils/download';

interface QRPreviewProps {
  type: QRType;
  payload: string;
  metadata: string;
  customization: QRCustomization;
  isValid: boolean;
  onToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  type,
  payload,
  metadata,
  customization,
  isValid,
  onToast,
}) => {
  const { canvasRef, isReady, error } = useQRGenerator({
    payload,
    customization,
    isValid,
  });

  const [hasCopied, setHasCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!canvasRef.current || !isReady) return;
    setIsDownloading(true);
    const filename = getFilename(type);
    const success = downloadCanvasAsPng(canvasRef.current, filename);
    if (success) {
      onToast(`Downloaded ${filename}`, 'success');
    } else {
      onToast('Failed to download image', 'error');
    }
    setTimeout(() => setIsDownloading(false), 300);
  };

  const handleCopyPayload = async () => {
    if (!payload) return;
    const ok = await copyTextToClipboard(payload);
    if (ok) {
      setHasCopied(true);
      onToast('Payload copied to clipboard', 'success');
      setTimeout(() => setHasCopied(false), 2000);
    } else {
      onToast('Failed to copy to clipboard', 'error');
    }
  };

  const hasContent = Boolean(payload && isValid);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      {/* Visual Canvas Display Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6 min-h-[340px] sm:min-h-[380px]">
        {hasContent ? (
          <div className="flex flex-col items-center animate-scale-in">
            {/* QR Wrapper Container */}
            <div
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm relative transition-all duration-200"
              style={{
                backgroundColor: customization.backgroundColor,
              }}
            >
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto block rounded-lg select-none"
                style={{
                  width: '240px',
                  height: '240px',
                  imageRendering: 'crisp-edges',
                }}
              />
            </div>

            {/* Metadata indicator */}
            {metadata && (
              <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono tracking-tight bg-neutral-100/80 dark:bg-neutral-800/80 px-2.5 py-1 rounded-full border border-neutral-200/60 dark:border-neutral-700/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{metadata}</span>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-xs animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-center mb-4 text-neutral-400 dark:text-neutral-500">
              <QrIcon className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Your QR code will appear here
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
              Start typing above to generate a high-precision QR code in real-time.
            </p>
          </div>
        )}

        {/* Error message if QR fails rendering */}
        {error && (
          <div className="mt-3 p-2 text-xs text-rose-500 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="w-full pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center gap-2.5">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!hasContent || !isReady || isDownloading}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PNG</span>
        </button>

        <button
          type="button"
          onClick={handleCopyPayload}
          disabled={!hasContent}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          {hasCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-400" />
              <span>Copy Payload</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
