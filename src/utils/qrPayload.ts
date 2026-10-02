import { QRType, AllFormValues, WifiFormValues } from '../types/qr';

/**
 * Escapes characters for Wi-Fi QR code syntax (ZXing standard)
 * Special characters \ ; , : " need to be backslash escaped
 */
function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

export function formatUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  // If it doesn't have a protocol, prepend https://
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function generatePayload(type: QRType, forms: AllFormValues): string {
  switch (type) {
    case 'url': {
      const url = forms.url.url.trim();
      return url ? formatUrl(url) : '';
    }
    case 'text': {
      return forms.text.text;
    }
    case 'email': {
      const { email, subject, message } = forms.email;
      const cleanEmail = email.trim();
      if (!cleanEmail) return '';
      
      const params = new URLSearchParams();
      if (subject.trim()) params.append('subject', subject.trim());
      if (message.trim()) params.append('body', message.trim());
      
      const queryString = params.toString();
      return queryString ? `mailto:${cleanEmail}?${queryString}` : `mailto:${cleanEmail}`;
    }
    case 'phone': {
      const cleanPhone = forms.phone.phone.trim();
      return cleanPhone ? `tel:${cleanPhone}` : '';
    }
    case 'wifi': {
      const { ssid, password, encryption, hidden } = forms.wifi;
      const cleanSSID = ssid.trim();
      if (!cleanSSID) return '';
      
      const encType = encryption === 'nopass' ? 'nopass' : encryption;
      const escapedSSID = escapeWifiString(cleanSSID);
      const escapedPass = encryption === 'nopass' ? '' : escapeWifiString(password);
      const isHidden = hidden ? 'true' : 'false';

      return `WIFI:T:${encType};S:${escapedSSID};P:${escapedPass};H:${isHidden};;`;
    }
    default:
      return '';
  }
}

export function getMetadataString(type: QRType, forms: AllFormValues, payload: string): string {
  if (!payload) return '';

  switch (type) {
    case 'url': {
      const len = payload.length;
      return `URL • ${len} character${len === 1 ? '' : 's'}`;
    }
    case 'text': {
      const chars = forms.text.text.length;
      return `Plain Text • ${chars} character${chars === 1 ? '' : 's'}`;
    }
    case 'email': {
      return `Email • ${forms.email.email.trim()}`;
    }
    case 'phone': {
      return `Phone • ${forms.phone.phone.trim()}`;
    }
    case 'wifi': {
      const enc = forms.wifi.encryption === 'nopass' ? 'Open' : forms.wifi.encryption;
      const hidden = forms.wifi.hidden ? 'Hidden' : '';
      return ['Wi-Fi', enc, hidden].filter(Boolean).join(' • ');
    }
    default:
      return `${payload.length} characters`;
  }
}

export function getHistoryTitle(type: QRType, forms: AllFormValues): string {
  switch (type) {
    case 'url': {
      const url = forms.url.url.trim();
      return url.replace(/^https?:\/\//i, '').replace(/\/$/, '') || 'Web Link';
    }
    case 'text': {
      const text = forms.text.text.trim();
      return text.length > 28 ? `${text.slice(0, 25)}...` : text || 'Note';
    }
    case 'email': {
      return forms.email.email.trim() || 'Email draft';
    }
    case 'phone': {
      return forms.phone.phone.trim() || 'Phone contact';
    }
    case 'wifi': {
      return `Wi-Fi: ${forms.wifi.ssid.trim() || 'Network'}`;
    }
    default:
      return 'QR Code';
  }
}

/**
 * Strips sensitive data like Wi-Fi passwords before saving to local history
 */
export function sanitizeValuesForHistory(type: QRType, forms: AllFormValues): AllFormValues[QRType] {
  if (type === 'wifi') {
    const wifi = forms.wifi;
    const sanitized: WifiFormValues = {
      ssid: wifi.ssid,
      password: '', // Never store passwords in history
      encryption: wifi.encryption,
      hidden: wifi.hidden,
    };
    return sanitized;
  }
  return { ...forms[type] };
}
