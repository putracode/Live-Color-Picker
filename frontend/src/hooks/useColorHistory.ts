// ============================================================
// src/hooks/useColorHistory.ts
// Custom hook untuk manajemen riwayat warna
// ============================================================

import { useState, useCallback } from 'react';
import type { ColorData } from '../types/color';

const MAX_HISTORY = 10;

export function useColorHistory() {
  const [history, setHistory] = useState<ColorData[]>([]);

  const addToHistory = useCallback((color: ColorData) => {
    setHistory((prev) => {
      // Hindari duplikat di posisi pertama
      if (prev.length > 0 && prev[0].hex === color.hex) return prev;
      const updated = [{ ...color }, ...prev];
      return updated.slice(0, MAX_HISTORY);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
