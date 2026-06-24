// ============================================================
// src/components/ColorHistory.tsx
// Riwayat warna — tampilan dot swatches yang bisa diklik untuk copy
// ============================================================

import React from 'react';
import type { ColorData } from '../types/color';
import { copyToClipboard } from '../utils/clipboard';

interface ColorHistoryProps {
  history: ColorData[];
  onCopied?: (text: string) => void;
}

const ColorHistory: React.FC<ColorHistoryProps> = ({ history, onCopied }) => {
  const handleClick = async (item: ColorData) => {
    const success = await copyToClipboard(item.hex);
    if (success) {
      onCopied?.(`Disalin: ${item.hex}`);
    }
  };

  return (
    <div className="history-section">
      <h3 className="history-label">Riwayat</h3>
      {history.length === 0 ? (
        <p className="history-empty">Bekukan atau salin warna untuk menyimpan.</p>
      ) : (
        <div className="history-list" role="list">
          {history.map((item, index) => (
            <button
              key={`${item.hex}-${index}`}
              className="history-swatch"
              style={{ backgroundColor: item.hex }}
              onClick={() => handleClick(item)}
              title={`${item.name} (${item.hex}) — Klik untuk menyalin`}
              aria-label={`Salin ${item.name}: ${item.hex}`}
              role="listitem"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorHistory;
