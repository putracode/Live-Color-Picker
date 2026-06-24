// ============================================================
// src/utils/color-name.ts
// Wrapper untuk NTC library — mengembalikan nama warna dari HEX
// ============================================================

import { ntcName } from '../lib/ntc';

/**
 * Mendapatkan nama warna yang paling mendekati dari kode HEX.
 * @param hex - Kode warna HEX (e.g. "#3B82F6")
 * @returns Nama warna (e.g. "Dodger Blue")
 */
export function getColorName(hex: string): string {
  const [, name] = ntcName(hex);
  return name;
}
