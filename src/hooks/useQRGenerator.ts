import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QRCustomization } from '../types/qr';

interface UseQRGeneratorProps {
  payload: string;
  customization: QRCustomization;
  isValid: boolean;
}

export function useQRGenerator({ payload, customization, isValid }: UseQRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!payload || !isValid) {
      setIsReady(false);
      setError(null);
      // Clear canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let isMounted = true;

    QRCode.toCanvas(canvas, payload, {
      width: customization.size,
      margin: customization.margin,
      errorCorrectionLevel: customization.errorCorrectionLevel,
      color: {
        dark: customization.foregroundColor,
        light: customization.backgroundColor,
      },
    })
      .then(() => {
        if (isMounted) {
          setIsReady(true);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('QR code generation error:', err);
          setIsReady(false);
          setError(err?.message || 'Failed to render QR code');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    payload,
    isValid,
    customization.size,
    customization.margin,
    customization.errorCorrectionLevel,
    customization.foregroundColor,
    customization.backgroundColor,
  ]);

  return { canvasRef, isReady, error };
}
