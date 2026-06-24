// ============================================================
// src/components/CameraViewport.tsx
// Area tampilan kamera: canvas, overlay reticle, scanner line, status
// ============================================================

import React, { useCallback } from 'react';
import type { CameraStatus } from '../types/camera';
import StatusOverlay from './StatusOverlay';

interface CameraViewportProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  errorMessage?: string;
  onRetry: () => void;
  onCanvasClick: (x: number, y: number) => void;
}

const CameraViewport: React.FC<CameraViewportProps> = ({
  canvasRef,
  videoRef,
  status,
  errorMessage,
  onRetry,
  onCanvasClick,
}) => {
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      onCanvasClick(e.clientX, e.clientY);
    },
    [onCanvasClick]
  );

  return (
    <main className="viewport-container" role="main">
      {/* Video element tersembunyi — sumber frame */}
      <video
        ref={videoRef}
        id="camera-video"
        autoPlay
        playsInline
        muted
        aria-hidden="true"
      />

      {/* Canvas — tampilan frame + area klik pick warna */}
      <canvas
        ref={canvasRef}
        id="camera-canvas"
        onClick={handleCanvasClick}
        aria-label="Area kamera — klik untuk memilih warna"
        role="img"
        style={{ cursor: 'crosshair' }}
      />

      {/* Overlay UI: Scanner line + Reticle */}
      <div className="viewport-overlay" aria-hidden="true">
        <div className="reticle-container">
          <div className="reticle-circle" />
        </div>
      </div>

      {/* Status Overlay (loading / error) */}
      <StatusOverlay
        status={status}
        errorMessage={errorMessage}
        onRetry={onRetry}
      />

      {/* Frozen badge */}
      {status === 'frozen' && (
        <div className="frozen-badge" aria-live="polite">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
          DIBEKUKAN
        </div>
      )}
    </main>
  );
};

export default CameraViewport;
