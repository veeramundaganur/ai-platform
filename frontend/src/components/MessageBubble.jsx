// src/components/MessageBubble.jsx
// (kept for potential reuse) simple bubble component (not used directly in ChatWindow)
import React from 'react';

export default function MessageBubble({ sender, text }) {
  if (sender === 'assistant') {
    return (
      <div className="pp-msg-assistant" role="article" dangerouslySetInnerHTML={{ __html: text }}></div>
    );
  }
  return (
    <div className="pp-msg-user" role="article">{text}</div>
  );
}
