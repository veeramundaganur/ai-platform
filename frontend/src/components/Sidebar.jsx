// src/components/Sidebar.jsx
// Sidebar with chats, search, new chat, profile (responsive offcanvas)
import React, { useState } from 'react';

export default function Sidebar({ sessions, activeId, onNew, onSelect, onRename, onDelete, isOpen, onClose }) {
  const [q, setQ] = useState('');
  const filtered = sessions.filter(s => s.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <aside className={`pp-sidebar ${isOpen ? 'open' : ''}`} aria-label="Sidebar">
      <div className="pp-brand">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#111" strokeWidth="1.2"/></svg>
        <div style={{fontSize:15}}>ChatGPT</div>
      </div>

      <button className="btn btn-outline-secondary pp-new-btn" data-testid="new-chat-button" onClick={onNew}>
        <i className="bi bi-plus-lg me-2"></i> New chat
      </button>

      <div className="pp-search">
        <div className="d-flex align-items-center">
          <i className="bi bi-search me-2" style={{color:'#9aa0a6'}}></i>
          <input aria-label="Search chats" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats" style={{border:'none', background:'transparent', outline:'none', width:'100%'}}/>
        </div>
      </div>

      <div className="pp-chats hidden-scroll" role="list" aria-label="Chats list">
        {filtered.map(s => (
          <div
            role="listitem"
            key={s.id}
            className={`pp-chat-item ${s.id === activeId ? 'active' : ''}`}
            onClick={() => onSelect(s.id)}
            data-testid={`sidebar-item-${s.id}`}
            tabIndex={0}
          >
            <div style={{flex:1}}>
              <div style={{fontSize:14, fontWeight:600}}>{s.title}</div>
              <div style={{fontSize:12, color:'var(--pp-muted)'}}>{s.messages?.length ?? 0} messages</div>
            </div>
            <div style={{fontSize:12, color:'#9aa0a6'}}><i className="bi bi-chevron-right"></i></div>
          </div>
        ))}
      </div>

      <div className="pp-profile">
        <img src="https://via.placeholder.com/38" alt="avatar" style={{width:38,height:38,borderRadius:8}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600}}>Veer Mundaganur</div>
          <div style={{fontSize:12,color:'var(--pp-muted)'}}>Free</div>
        </div>
      </div>

      {/* Mobile close button */}
      <button className="btn btn-sm btn-outline-secondary d-md-none mt-2" onClick={onClose}>Close</button>
    </aside>
  );
}
