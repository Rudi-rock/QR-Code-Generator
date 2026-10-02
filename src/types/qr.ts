export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface UrlFormValues {
  url: string;
}

export interface TextFormValues {
  text: string;
}

export interface EmailFormValues {
  email: string;
  subject: string;
  message: string;
}

export interface PhoneFormValues {
  phone: string;
}

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export interface WifiFormValues {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface AllFormValues {
  url: UrlFormValues;
  text: TextFormValues;
  email: EmailFormValues;
  phone: PhoneFormValues;
  wifi: WifiFormValues;
}

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export interface QRHistoryItem {
  id: string;
  type: QRType;
  title: string;
  timestamp: number;
  payload: string;
  savedValues: UrlFormValues | TextFormValues | EmailFormValues | PhoneFormValues | WifiFormValues;
}

export interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}
