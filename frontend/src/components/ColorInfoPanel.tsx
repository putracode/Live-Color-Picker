// ============================================================
// src/components/ColorInfoPanel.tsx
// Panel sidebar: swatch, nama, HEX, format grid, history
// ============================================================

import React from 'react';
import type { ColorData } from '../types/color';
import ColorFormatRow from './ColorFormatRow';
import ColorHistory from './ColorHistory';

interface ColorInfoPanelProps {
  color: ColorData;
  history: ColorData[];
  onCopied: (message: string) => void;
}

const ColorInfoPanel: React.FC<ColorInfoPanelProps> = ({
  color,
  history,
  onCopied,
}) => {
  const { hex, name, rgb, hsl, hsv, cmyk } = color;

  const formats = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` },
    { label: 'HSV', value: `${hsv.h}°, ${hsv.s}%, ${hsv.v}%` },
    { label: 'CMYK', value: `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%` },
  ];

  return (
    <div className="color-display-card">
      {/* Preview Swatch + Nama */}
      <div className="color-name-wrapper">
        <div
          className="active-preview"
          style={{ backgroundColor: hex }}
          aria-label={`Warna saat ini: ${name}`}
          title={name}
        />
        <div className="color-title">
          <h2 id="color-name" className="color-name-text">
            {name}
          </h2>
          <span id="hex-value" className="hex-value-text">
            {hex}
          </span>
        </div>
      </div>

      {/* Grid Format Warna */}
      <div className="format-grid" role="list" aria-label="Format warna">
        {formats.map(({ label, value }) => (
          <ColorFormatRow
            key={label}
            label={label}
            value={value}
            onCopied={(text) => onCopied(`Disalin: ${text}`)}
          />
        ))}
      </div>

      {/* Riwayat */}
      <ColorHistory
        history={history}
        onCopied={onCopied}
      />
    </div>
  );
};

export default ColorInfoPanel;
