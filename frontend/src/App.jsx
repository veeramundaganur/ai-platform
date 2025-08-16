// src/App.jsx
// Central app state, local persistence, keyboard shortcuts, layout
import React, { useEffect, useState, useRef } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import ChatWindow from './components/ChatWindow.jsx';

const STORAGE_KEY = 'pp:chats:v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const persisted = loadState();
  const defaultSession = {
    id: Date.now().toString(),
    title: 'UI plan continuation',
    messages: [
      { id: 'm-0', role: 'assistant', content: 'Hi Veer 👋 — ready to continue polishing your ChatGPT clone UI to look and feel exactly like the real one?' }
    ],
    createdAt: new Date().toISOString()
  };

  const [sessions, setSessions] = useState(persisted?.sessions ?? [defaultSession]);
  const [activeId, setActiveId] = useState(persisted?.activeId ?? sessions[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const toSave = { sessions, activeId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [sessions, activeId]);

  // Keyboard shortcuts
  useEffect(() => {
    function handler(e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const btn = document.querySelector('[data-testid="send-button"]');
        btn?.click();
      }
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        (document.activeElement instanceof HTMLElement) && document.activeElement.blur();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const activeSession = sessions.find(s => s.id === activeId) ?? sessions[0];

  function createSession() {
    const id = Date.now().toString();
    const session = { id, title: 'New chat', messages: [], createdAt: new Date().toISOString() };
    setSessions(prev => [session, ...prev]);
    setActiveId(id);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function updateSessionMessages(sessionId, messages) {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages } : s));
  }

  function renameSession(sessionId, title) {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title } : s));
  }

  function deleteSession(sessionId) {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeId === sessionId) {
      const next = sessions.find(s => s.id !== sessionId);
      setActiveId(next?.id ?? null);
    }
  }

  return (
    <div className="pp-app">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onNew={createSession}
        onSelect={(id) => { setActiveId(id); setSidebarOpen(false); }}
        onRename={renameSession}
        onDelete={deleteSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="pp-main" style={{ marginLeft: 280 }}>
        <Topbar
          title={activeSession?.title ?? 'Prompt Platform'}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
        />
        <ChatWindow
          key={activeId}
          session={activeSession}
          updateMessages={(msgs) => updateSessionMessages(activeId, msgs)}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}
