// src/components/Topbar.jsx
// Sticky topbar with title and small status area
import React from 'react';

export default function Topbar({ title, onToggleSidebar }) {
  return (
    <header className="pp-topbar" role="banner">
      <div className="left">
        <button className="btn btn-light d-md-none" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <div style={{fontWeight:600, fontSize:16}}>{title} <i className="bi bi-caret-down-fill" style={{fontSize:12, marginLeft:6, color:'#6b6b6b'}}></i></div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <div style={{fontSize:13,color:'var(--pp-muted)'}}>Saved memory full</div>
        <button className="btn btn-sm btn-outline-secondary" aria-label="Share"><i className="bi bi-upload"></i> Share</button>
      </div>
    </header>
  );
}
