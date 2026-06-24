// ============================================================
// src/components/ColorFormatRow.tsx
// Satu baris format warna (Label + Nilai) dengan tombol copy
// ============================================================

import React, { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

interface ColorFormatRowProps {
  label: string;
  value: string;
  onCopied?: (text: string) => void;
}

const ColorFormatRow: React.FC<ColorFormatRowProps> = ({
  label,
  value,
  onCopied,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      onCopied?.(value);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      className="format-row"
      role="button"
      tabIndex={0}
      onClick={handleCopy}
      onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
      aria-label={`Salin nilai ${label}: ${value}`}
      title={`Klik untuk menyalin ${value}`}
    >
      <span className="format-label">{label}</span>
      <div className="format-right">
        <span className="format-value">{value}</span>
        <span className={`format-copy-icon ${copied ? 'copied' : ''}`}>
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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
          )}
        </span>
      </div>
    </div>
  );
};

export default ColorFormatRow;
