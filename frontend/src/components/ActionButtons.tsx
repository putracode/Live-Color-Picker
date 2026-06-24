// ============================================================
// src/components/ActionButtons.tsx
// Tombol kontrol: Ganti Kamera, Salin HEX, Bekukan/Lanjutkan
// ============================================================

import React from 'react';

interface ActionButtonsProps {
  isFrozen: boolean;
  onToggleFreeze: () => void;
  onSwitchCamera: () => void;
  onCopyHex: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isFrozen,
  onToggleFreeze,
  onSwitchCamera,
  onCopyHex,
}) => {
  return (
    <div className="actions-container">
      <button
        id="btn-switch"
        className="btn btn-secondary"
        onClick={onSwitchCamera}
        title="Ganti antara kamera depan dan belakang"
      >
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
          <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
          <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="5" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="19" />
        </svg>
        Ganti Kamera
      </button>

      <button
        id="btn-copy"
        className="btn btn-secondary"
        onClick={onCopyHex}
        title="Salin kode HEX warna saat ini"
      >
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
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        Salin HEX
      </button>

      <button
        id="btn-freeze"
        className={`btn btn-primary ${isFrozen ? 'btn-active' : ''}`}
        onClick={onToggleFreeze}
        title={isFrozen ? 'Lanjutkan streaming kamera' : 'Bekukan frame saat ini'}
      >
        {isFrozen ? (
          <>
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
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Lanjutkan Live
          </>
        ) : (
          <>
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
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
            Bekukan View
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
