// ============================================================
// src/components/StatusOverlay.tsx
// Overlay untuk state loading, error, atau initializing kamera
// ============================================================

import React from 'react';
import type { CameraStatus } from '../types/camera';

interface StatusOverlayProps {
  status: CameraStatus;
  errorMessage?: string;
  onRetry: () => void;
}

const StatusOverlay: React.FC<StatusOverlayProps> = ({
  status,
  errorMessage,
  onRetry,
}) => {
  const isVisible = status === 'initializing' || status === 'error';
  if (!isVisible) return null;

  return (
    <div className="status-overlay">
      <div className="status-content">
        {status === 'initializing' ? (
          <>
            <div className="status-spinner" />
            <h3 className="status-title">Menginisialisasi Kamera</h3>
            <p className="status-desc">
              Harap berikan izin akses kamera untuk memulai.
            </p>
          </>
        ) : (
          <>
            <div className="status-icon-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="status-title">Kamera Tidak Ditemukan</h3>
            <p className="status-desc">
              {errorMessage ||
                'Pastikan menggunakan HTTPS dan telah memberikan izin akses kamera.'}
            </p>
            <button className="btn-retry" onClick={onRetry}>
              Coba Lagi
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusOverlay;
