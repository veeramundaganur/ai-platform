// src/components/ChatWindow.jsx
// Chat area: renders messages, handles send, consumes mockApi streaming, persists via parent
import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble.jsx';
import InputBox from './InputBox.jsx';
import { streamResponse } from '../utils/mockApi.js';

export default function ChatWindow({ session, updateMessages, inputRef }) {
  const [messages, setMessages] = useState(session?.messages ?? []);
  const streamingRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setMessages(session?.messages ?? []);
  }, [session?.id]);

  useEffect(() => {
    updateMessages(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function pushUser(text) {
    const m = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, m]);
    // start streaming assistant
    startAssistant(text);
  }

  function startAssistant(prompt) {
    const assistantId = `a-${Date.now()}`;
    const assistantMsg = { id: assistantId, role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMsg]);

    // start streaming tokens
    streamingRef.current = streamResponse(prompt, (chunk) => {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m));
    }, () => {
      // done callback (could add any finalization)
      streamingRef.current = null;
    });
  }

  function handleSend(text) {
    if (!text || !text.trim()) return;
    // stop any existing streams
    if (streamingRef.current?.cancel) streamingRef.current.cancel();
    pushUser(text.trim());
    inputRef?.current?.focus?.();
  }

  return (
    <main className="pp-chat-col" role="main">
      <div className="pp-messages hidden-scroll" ref={containerRef} aria-live="polite" data-testid="messages-list">
        {messages.map((m) => (
          <div key={m.id} className="pp-msg-row">
            {m.role === 'assistant' ? (
              <div style={{width:'100%'}}>
                <div className="pp-msg-assistant" role="article" aria-label="Assistant message" data-testid={`assistant-${m.id}`}>
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(m.content) }} />
                </div>
                <div className="pp-action-row" aria-hidden="false">
                  <span className="pp-action-btn" title="Copy"><i className="bi bi-clipboard"></i></span>
                  <span className="pp-action-btn" title="Thumbs up"><i className="bi bi-hand-thumbs-up"></i></span>
                  <span className="pp-action-btn" title="Thumbs down"><i className="bi bi-hand-thumbs-down"></i></span>
                  <span className="pp-action-btn" title="Play"><i className="bi bi-volume-up"></i></span>
                  <span className="pp-action-btn" title="Edit"><i className="bi bi-pencil"></i></span>
                  <span className="pp-action-btn" title="Export"><i className="bi bi-upload"></i></span>
                  <span className="pp-action-btn" title="Regenerate"><i className="bi bi-arrow-clockwise"></i></span>
                </div>
              </div>
            ) : (
              <div style={{ marginLeft: 'auto' }}>
                <div className="pp-msg-user" data-testid="last-message">{m.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pp-input-wrap">
        <div className="pp-input-pill" role="search" aria-label="New prompt">
          <button className="pp-icon-btn" aria-hidden="true"><i className="bi bi-plus-lg"></i></button>
          <InputBox onSend={handleSend} inputRef={inputRef} />
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button className="pp-icon-btn" aria-label="Voice"><i className="bi bi-mic"></i></button>
            <button className="pp-icon-btn" aria-label="Waveform"><i className="bi bi-sliders"></i></button>
          </div>
        </div>
      </div>

      <div className="pp-footer-note">ChatGPT can make mistakes. Check important info. See Cookie Preferences.</div>
    </main>
  );
}

// small sanitizer for minimal HTML (preserves code blocks)
// we use a very tiny allowlist to avoid XSS from mock content
function sanitizeHtml(str) {
  if (!str) return '';
  // escape first
  const txt = document.createElement('div');
  txt.textContent = str;
  let escaped = txt.innerHTML;
  // allow simple code block markup: ```...``` -> <pre><code>
  escaped = escaped.replace(/```([\s\S]*?)```/g, (m, inner) => {
    return `<pre style="background:#0f1724;color:#f8fafc;padding:12px;border-radius:8px;overflow:auto;"><code>${inner}</code></pre>`;
  });
  // allow inline code `...`
  escaped = escaped.replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:6px;">$1</code>');
  return escaped;
}
