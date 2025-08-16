// src/utils/mockApi.js
// Mock streaming API: emits chunks simulating SSE/token stream
export function streamResponse(prompt, onChunk, onDone) {
  const text = generateAssistantText(prompt);
  const words = text.split(/\s+/);
  let i = 0;
  let cancelled = false;

  const iv = setInterval(() => {
    if (cancelled) { clearInterval(iv); return; }
    // emit 1-3 words at a time for realistic feel
    const take = Math.min(words.length - i, Math.random() > 0.75 ? 1 : Math.random() > 0.5 ? 2 : 3);
    const chunk = words.slice(i, i + take).join(' ') + (i + take < words.length ? ' ' : '');
    i += take;
    onChunk(chunk);
    if (i >= words.length) {
      clearInterval(iv);
      onDone?.();
    }
  }, 60 + Math.floor(Math.random() * 80));

  return {
    cancel: () => { cancelled = true; clearInterval(iv); }
  };
}

// simple generator for mock assistant content (can be replaced by backend)
function generateAssistantText(prompt) {
  // short simulated response with a tiny code block example occasionally
  if (prompt.toLowerCase().includes('code')) {
    return `Here is a sample snippet:\n\`\`\`js\nconsole.log("hello world");\n\`\`\`\nThis demonstrates how to log output. You can modify as needed.`;
  }
  return `Sure — here's a refined version based on your prompt: ${prompt} — I can expand or convert this into different formats (JSON, YAML, CoT) if you want.`;
}
