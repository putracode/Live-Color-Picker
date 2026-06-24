// ============================================================
// src/types/color.ts
// Semua type definitions yang berhubungan dengan warna
// ============================================================

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface HSVColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface CMYKColor {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

/**
 * Agregasi lengkap semua representasi warna yang diperoleh
 * dari satu titik piksel kamera.
 */
export interface ColorData {
  hex: string;   // e.g. "#3B82F6"
  name: string;  // e.g. "Dodger Blue" (dari NTC)
  rgb: RGBColor;
  hsl: HSLColor;
  hsv: HSVColor;
  cmyk: CMYKColor;
}

export type ColorFormat = 'HEX' | 'RGB' | 'HSL' | 'HSV' | 'CMYK';
