// ============================================================
// src/types/camera.ts
// Type definitions untuk state dan konfigurasi kamera
// ============================================================

/**
 * Status kamera saat ini:
 * - 'initializing': Sedang meminta izin / membuka stream
 * - 'active': Streaming berjalan normal
 * - 'frozen': Stream dijeda (frame freeze)
 * - 'error': Terjadi error (izin ditolak / tidak ada kamera)
 */
export type CameraStatus = 'initializing' | 'active' | 'frozen' | 'error';

/**
 * Arah kamera yang digunakan:
 * - 'environment': Kamera belakang (default untuk color picking)
 * - 'user': Kamera depan (selfie)
 */
export type FacingMode = 'environment' | 'user';

export interface CameraConstraints {
  facingMode: FacingMode;
  width?: { ideal: number };
  height?: { ideal: number };
}
