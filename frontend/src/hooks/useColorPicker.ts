// ============================================================
// src/hooks/useColorPicker.ts
// Custom hook untuk logika color picking dari frame kamera
// ============================================================

import { useState, useRef, useCallback, useEffect } from 'react';
import type { ColorData } from '../types/color';
import { rgbToHex, rgbToHsl, rgbToHsv, rgbToCmyk } from '../utils/color-converter';
import { getColorName } from '../utils/color-name';

const DEFAULT_COLOR: ColorData = {
  hex: '#000000',
  name: 'Black',
  rgb: { r: 0, g: 0, b: 0 },
  hsl: { h: 0, s: 0, l: 0 },
  hsv: { h: 0, s: 0, v: 0 },
  cmyk: { c: 0, m: 0, y: 0, k: 100 },
};

interface UseColorPickerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isFrozen: boolean;
  isActive: boolean; // true ketika kamera streaming
}

interface UseColorPickerReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  currentColor: ColorData;
  pickColorAt: (x: number, y: number) => ColorData | null;
}

export function useColorPicker({
  videoRef,
  isFrozen,
  isActive,
}: UseColorPickerProps): UseColorPickerReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [currentColor, setCurrentColor] = useState<ColorData>(DEFAULT_COLOR);

  /**
   * Membaca piksel pada koordinat (x, y) dari canvas
   * dan mengembalikan objek ColorData.
   */
  const readPixelAt = useCallback(
    (x: number, y: number): ColorData | null => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;

      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];

      const hex = rgbToHex(r, g, b);
      const name = getColorName(hex);
      const hsl = rgbToHsl(r, g, b);
      const hsv = rgbToHsv(r, g, b);
      const cmyk = rgbToCmyk(r, g, b);

      return { hex, name, rgb: { r, g, b }, hsl, hsv, cmyk };
    },
    []
  );

  /**
   * Fungsi publik — pick warna dari koordinat canvas yang
   * sudah di-scale dari koordinat DOM (untuk klik manual).
   */
  const pickColorAt = useCallback(
    (domX: number, domY: number): ColorData | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (domX - rect.left) * scaleX;
      const y = (domY - rect.top) * scaleY;

      const color = readPixelAt(x, y);
      if (color) setCurrentColor(color);
      return color;
    },
    [readPixelAt]
  );

  /**
   * Loop animasi — menggambar frame dari video ke canvas
   * dan membaca piksel tengah setiap frame.
   */
  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });

    if (!video || !canvas || !ctx || !isActive) {
      animationIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // Sinkronkan ukuran canvas dengan resolusi video
    if (
      canvas.width !== video.videoWidth ||
      canvas.height !== video.videoHeight
    ) {
      canvas.width = video.videoWidth || canvas.width;
      canvas.height = video.videoHeight || canvas.height;
    }

    if (!isFrozen) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const cx = Math.floor(canvas.width / 2);
      const cy = Math.floor(canvas.height / 2);
      const color = readPixelAt(cx, cy);
      if (color) setCurrentColor(color);
    }

    animationIdRef.current = requestAnimationFrame(processFrame);
  }, [videoRef, isFrozen, isActive, readPixelAt]);

  // Mulai / hentikan loop animasi
  useEffect(() => {
    animationIdRef.current = requestAnimationFrame(processFrame);
    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [processFrame]);

  return { canvasRef, currentColor, pickColorAt };
}
