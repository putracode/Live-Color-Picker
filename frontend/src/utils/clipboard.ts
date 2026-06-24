// ============================================================
// src/utils/clipboard.ts
// Utility untuk menyalin teks ke clipboard
// ============================================================

/**
 * Menyalin teks ke clipboard pengguna.
 * Mengembalikan Promise<boolean> — true jika berhasil.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard error:', err);
    return false;
  }
}
