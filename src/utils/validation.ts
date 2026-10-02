import { QRType, AllFormValues, ValidationState } from '../types/qr';

export function validateForm(type: QRType, forms: AllFormValues): ValidationState {
  const errors: Record<string, string> = {};

  switch (type) {
    case 'url': {
      const val = forms.url.url.trim();
      if (!val) {
        return { isValid: false, errors: {} }; // Empty state, not an error
      }
      // Check if it looks like a valid URL or host
      try {
        const testUrl = /^https?:\/\//i.test(val) ? val : `https://${val}`;
        const parsed = new URL(testUrl);
        if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
          errors.url = 'Please enter a valid domain name (e.g. example.com)';
        }
      } catch {
        errors.url = 'Please enter a valid web address';
      }
      break;
    }

    case 'text': {
      const val = forms.text.text;
      if (!val.trim()) {
        return { isValid: false, errors: {} };
      }
      if (val.length > 2500) {
        errors.text = `Text is too long (${val.length}/2500 characters for reliable scanning)`;
      }
      break;
    }

    case 'email': {
      const email = forms.email.email.trim();
      if (!email) {
        return { isValid: false, errors: {} };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address';
      }
      break;
    }

    case 'phone': {
      const phone = forms.phone.phone.trim();
      if (!phone) {
        return { isValid: false, errors: {} };
      }
      // Allow +, digits, spaces, hyphens, parentheses. At least 3 digits.
      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length < 3) {
        errors.phone = 'Phone number is too short';
      } else if (!/^[+]?[\d\s\-().]{3,20}$/.test(phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
      break;
    }

    case 'wifi': {
      const { ssid, password, encryption } = forms.wifi;
      if (!ssid.trim()) {
        return { isValid: false, errors: {} };
      }
      if (ssid.length > 32) {
        errors.ssid = 'SSID must not exceed 32 characters';
      }
      if (encryption !== 'nopass') {
        if (!password) {
          errors.password = 'Password is required for encrypted networks';
        } else if (encryption === 'WPA' && password.length < 8) {
          errors.password = 'WPA/WPA2 passwords must be at least 8 characters';
        } else if (password.length > 63) {
          errors.password = 'Password must not exceed 63 characters';
        }
      }
      break;
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}
