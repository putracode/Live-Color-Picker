// ============================================================
// src/components/ToastNotification.tsx
// Notifikasi popup sementara (toast) untuk feedback aksi copy
// ============================================================

import React, { useEffect, useState } from 'react';

interface ToastNotificationProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  visible,
  onHide,
  duration = 2500,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onHide, 300); // beri waktu animasi keluar
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  return (
    <div className={`toast ${show ? 'toast-show' : ''}`} aria-live="polite">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  );
};

export default ToastNotification;
