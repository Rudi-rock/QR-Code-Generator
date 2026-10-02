import { QRType } from '../types/qr';

export function getFilename(type: QRType): string {
  switch (type) {
    case 'url':
      return 'qr-url.png';
    case 'wifi':
      return 'qr-wifi.png';
    case 'email':
      return 'qr-email.png';
    case 'phone':
      return 'qr-phone.png';
    case 'text':
      return 'qr-text.png';
    default:
      return 'qr-code.png';
  }
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): boolean {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to download QR code image:', err);
    return false;
  }
}

export async function copyCanvasImageToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
      return new Promise<boolean>((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve(false);
            return;
          }
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            resolve(true);
          } catch {
            resolve(false);
          }
        }, 'image/png');
      });
    }
    return false;
  } catch {
    return false;
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers or restricted contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
