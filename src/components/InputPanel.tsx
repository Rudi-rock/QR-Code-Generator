import React, { useState } from 'react';
import { Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import { QRType, AllFormValues, WifiEncryption } from '../types/qr';

interface InputPanelProps {
  activeType: QRType;
  forms: AllFormValues;
  errors: Record<string, string>;
  onUpdateForm: <T extends QRType>(type: T, updates: Partial<AllFormValues[T]>) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  activeType,
  forms,
  errors,
  onUpdateForm,
}) => {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  return (
    <div
      role="tabpanel"
      id={`panel-${activeType}`}
      aria-labelledby={`tab-${activeType}`}
      className="space-y-4"
    >
      {/* URL TAB */}
      {activeType === 'url' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="input-url"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Website URL
            </label>
            {forms.url.url && (
              <button
                type="button"
                onClick={() => onUpdateForm('url', { url: '' })}
                className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="input-url"
              type="text"
              inputMode="url"
              autoFocus
              placeholder="https://example.com"
              value={forms.url.url}
              onChange={(e) => onUpdateForm('url', { url: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-normal bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 transition-all duration-150 focus:outline-none focus:ring-1 ${
                errors.url
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                  : 'border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-400 dark:focus:ring-neutral-600'
              }`}
            />
          </div>
          {errors.url ? (
            <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.url}</span>
            </p>
          ) : (
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Entering domain names like <code className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">github.com</code> will automatically resolve with https://.
            </p>
          )}
        </div>
      )}

      {/* TEXT TAB */}
      {activeType === 'text' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="input-text"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Plain Text
            </label>
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
              {forms.text.text.length} / 2500
            </span>
          </div>
          <textarea
            id="input-text"
            rows={4}
            autoFocus
            placeholder="Type or paste any text, notes, or instructions here..."
            value={forms.text.text}
            onChange={(e) => onUpdateForm('text', { text: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-normal bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 transition-all duration-150 resize-y focus:outline-none focus:ring-1 ${
              errors.text
                ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                : 'border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-400 dark:focus:ring-neutral-600'
            }`}
          />
          {errors.text && (
            <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.text}</span>
            </p>
          )}
        </div>
      )}

      {/* EMAIL TAB */}
      {activeType === 'email' && (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <label
              htmlFor="input-email"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Recipient Email <span className="text-neutral-400 font-normal">*</span>
            </label>
            <input
              id="input-email"
              type="email"
              autoFocus
              placeholder="hello@example.com"
              value={forms.email.email}
              onChange={(e) => onUpdateForm('email', { email: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-lg border text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 transition-all duration-150 focus:outline-none focus:ring-1 ${
                errors.email
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                  : 'border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-400 dark:focus:ring-neutral-600'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="input-email-subject"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Subject <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <input
              id="input-email-subject"
              type="text"
              placeholder="Meeting agenda, inquiry..."
              value={forms.email.subject}
              onChange={(e) => onUpdateForm('email', { subject: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 text-sm transition-all focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="input-email-body"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Message Body <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="input-email-body"
              rows={3}
              placeholder="Pre-filled email message..."
              value={forms.email.message}
              onChange={(e) => onUpdateForm('email', { message: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 text-sm transition-all resize-y focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            />
          </div>
        </div>
      )}

      {/* PHONE TAB */}
      {activeType === 'phone' && (
        <div className="space-y-2">
          <label
            htmlFor="input-phone"
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Phone Number
          </label>
          <input
            id="input-phone"
            type="tel"
            autoFocus
            placeholder="+1 (555) 019-2834"
            value={forms.phone.phone}
            onChange={(e) => onUpdateForm('phone', { phone: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 transition-all duration-150 focus:outline-none focus:ring-1 ${
              errors.phone
                ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                : 'border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-400 dark:focus:ring-neutral-600'
            }`}
          />
          {errors.phone ? (
            <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.phone}</span>
            </p>
          ) : (
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Include country code (e.g. +1 or +91) for international compatibility.
            </p>
          )}
        </div>
      )}

      {/* WIFI TAB */}
      {activeType === 'wifi' && (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <label
              htmlFor="input-wifi-ssid"
              className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Network Name (SSID) <span className="text-neutral-400 font-normal">*</span>
            </label>
            <input
              id="input-wifi-ssid"
              type="text"
              autoFocus
              placeholder="e.g. Office_Guest_5G"
              value={forms.wifi.ssid}
              onChange={(e) => onUpdateForm('wifi', { ssid: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-lg border text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 transition-all duration-150 focus:outline-none focus:ring-1 ${
                errors.ssid
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                  : 'border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-400 dark:focus:ring-neutral-600'
              }`}
            />
            {errors.ssid && (
              <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.ssid}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="input-wifi-encryption"
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Security Type
              </label>
              <select
                id="input-wifi-encryption"
                value={forms.wifi.encryption}
                onChange={(e) =>
                  onUpdateForm('wifi', {
                    encryption: e.target.value as WifiEncryption,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>

            {forms.wifi.encryption !== 'nopass' && (
              <div className="space-y-1.5">
                <label
                  htmlFor="input-wifi-password"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Password <span className="text-neutral-400 font-normal">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-wifi-password"
                    type={showWifiPassword ? 'text' : 'password'}
                    placeholder="Network password"
                    value={forms.wifi.password}
                    onChange={(e) => onUpdateForm('wifi', { password: e.target.value })}
                    className={`w-full pl-3.5 pr-10 py-2 rounded-lg border text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 transition-all duration-150 focus:outline-none focus:ring-1 ${
                      errors.password
                        ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                        : 'border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-neutral-400 dark:focus:ring-neutral-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
                    aria-label={showWifiPassword ? 'Hide password' : 'Show password'}
                  >
                    {showWifiPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Hidden network switch */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={forms.wifi.hidden}
                onChange={(e) => onUpdateForm('wifi', { hidden: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-500 dark:focus:ring-neutral-400 dark:bg-neutral-800"
              />
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Hidden Network (SSID is not broadcasted)
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
