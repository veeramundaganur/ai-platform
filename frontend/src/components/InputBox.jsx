// src/components/InputBox.jsx
// InputBox inside pill, supports keyboard shortcuts and forwards send
import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';

const InputBox = forwardRef(function InputBox({ onSend, inputRef }, ref) {
  const [value, setValue] = useState('');
  const innerRef = useRef();

  useImperativeHandle(inputRef, () => ({
    focus: () => innerRef.current?.focus()
  }), []);

  useEffect(() => {
    // expose to parent for focusing via inputRef prop
    if (inputRef && inputRef.current === undefined) inputRef.current = { focus: () => innerRef.current?.focus() };
  }, [inputRef]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    if (!value.trim()) return;
    onSend?.(value);
    setValue('');
  }

  return (
    <div style={{display:'flex', alignItems:'center', flex:1}}>
      <textarea
        ref={innerRef}
        className="form-control"
        placeholder="Ask anything"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        style={{resize:'none', border:'none', outline:'none', padding:'6px 8px', background:'transparent'}}
        aria-label="Ask anything"
        data-testid="input-box"
      />
      <button className="btn btn-primary" onClick={submit} data-testid="send-button" style={{borderRadius:999}}>
        <i className="bi bi-send-fill"></i>
      </button>
    </div>
  );
});

export default InputBox;
