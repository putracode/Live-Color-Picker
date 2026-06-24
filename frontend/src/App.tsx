// ============================================================
// src/App.tsx
// Root component — orkestrasi layout dan semua hooks
// ============================================================

import { useState, useCallback } from 'react';
import { useCamera } from './hooks/useCamera';
import { useColorPicker } from './hooks/useColorPicker';
import { useColorHistory } from './hooks/useColorHistory';
import { copyToClipboard } from './utils/clipboard';

import CameraViewport from './components/CameraViewport';
import ColorInfoPanel from './components/ColorInfoPanel';
import ActionButtons from './components/ActionButtons';
import ToastNotification from './components/ToastNotification';
import Navbar from './components/Navbar';

function App() {
  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Kamera
  const {
    videoRef,
    status,
    errorMessage,
    isFrozen,
    initCamera,
    switchCamera,
    toggleFreeze,
  } = useCamera();

  // Color picking
  const { canvasRef, currentColor, pickColorAt } = useColorPicker({
    videoRef,
    isFrozen,
    isActive: status === 'active' || status === 'frozen',
  });

  // Riwayat warna
  const { history, addToHistory } = useColorHistory();

  // Bekukan + tambahkan ke riwayat
  const handleToggleFreeze = useCallback(() => {
    if (!isFrozen) {
      addToHistory(currentColor);
    }
    toggleFreeze();
  }, [isFrozen, currentColor, addToHistory, toggleFreeze]);

  // Salin HEX saat ini
  const handleCopyHex = useCallback(async () => {
    const success = await copyToClipboard(currentColor.hex);
    if (success) {
      addToHistory(currentColor);
      showToast(`Disalin: ${currentColor.hex}`);
    }
  }, [currentColor, addToHistory, showToast]);

  // Klik manual pada canvas
  const handleCanvasClick = useCallback(
    (x: number, y: number) => {
      const color = pickColorAt(x, y);
      if (color) {
        addToHistory(color);
        showToast(`Dipilih: ${color.hex}`);
      }
    },
    [pickColorAt, addToHistory, showToast]
  );

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="app-wrapper">
        {/* Kiri: Area Kamera */}
        <CameraViewport
          canvasRef={canvasRef}
          videoRef={videoRef}
          status={status}
          errorMessage={errorMessage}
          onRetry={initCamera}
          onCanvasClick={handleCanvasClick}
        />

        {/* Kanan: Panel Kontrol */}
        <aside className="sidebar" aria-label="Panel kontrol warna">
          <ColorInfoPanel
            color={currentColor}
            history={history}
            onCopied={showToast}
          />

          <ActionButtons
            isFrozen={isFrozen}
            onToggleFreeze={handleToggleFreeze}
            onSwitchCamera={switchCamera}
            onCopyHex={handleCopyHex}
          />
        </aside>
      </div>

      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        visible={toast.visible}
        onHide={hideToast}
      />
    </div>
  );
}

export default App;
