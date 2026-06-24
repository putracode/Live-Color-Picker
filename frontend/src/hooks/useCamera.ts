// ============================================================
// src/hooks/useCamera.ts
// Custom hook yang mengenkapsulasi semua logika kamera
// ============================================================

import { useState, useRef, useCallback, useEffect } from 'react';
import type { CameraStatus, FacingMode } from '../types/camera';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  errorMessage: string;
  isFrozen: boolean;
  facingMode: FacingMode;
  initCamera: () => Promise<void>;
  switchCamera: () => void;
  toggleFreeze: () => void;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CameraStatus>('initializing');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFrozen, setIsFrozen] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');

  const initCamera = useCallback(async () => {
    // Matikan stream sebelumnya jika ada
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setStatus('initializing');
    setErrorMessage('');
    setIsFrozen(false);

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        setStatus('active');
      };
    } catch (err) {
      console.error('Camera Error:', err);
      const msg =
        err instanceof Error ? err.message : 'Tidak dapat mengakses kamera';
      setErrorMessage(msg);
      setStatus('error');
    }
  }, [facingMode]);

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }, []);

  const toggleFreeze = useCallback(() => {
    setIsFrozen((prev) => {
      const next = !prev;
      setStatus(next ? 'frozen' : 'active');
      return next;
    });
  }, []);

  // Re-init saat facingMode berubah
  useEffect(() => {
    initCamera();
    // Cleanup saat component unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  return {
    videoRef,
    status,
    errorMessage,
    isFrozen,
    facingMode,
    initCamera,
    switchCamera,
    toggleFreeze,
  };
}
