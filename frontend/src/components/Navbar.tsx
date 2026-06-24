// ============================================================
// src/components/Navbar.tsx
// Komponen Navigasi Utama (Header/Navbar)
// ============================================================

import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-brand">
        <div className="navbar-title-group">
          <span className="navbar-title">Live Color Picker</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
