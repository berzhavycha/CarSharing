import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

const SUGGESTIONS = [
  'Show me available SUVs next weekend',
  'Book a sedan from Aug 10 to Aug 12',
  'What are my recent trips?',
  'Cancel my latest booking',
];

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SuggestionChip = styled.button`
  padding: 6px 12px;
  font-size: 0.8rem;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;

  &:hover {
    background: #dbeafe;
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 8px 8px 12px;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const ChatTextarea = styled.textarea`
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #111827;
  background: transparent;
  min-height: 24px;
  max-height: 160px;
  font-family: inherit;

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
`;

const BtnSend = styled(IconButton)`
  background: #2563eb;
  color: #fff;

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const BtnStop = styled(IconButton)`
  background: #fee2e2;
  color: #dc2626;

  &:hover {
    background: #fecaca;
  }
`;

const InputHint = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
  text-align: center;
`;

export function ChatInput({ onSend, onStop, isStreaming }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const submit = () => {
    if (!value.trim() || isStreaming) return;
    onSend(value.trim());
    setValue('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <InputArea>
      {!isStreaming && (
        <Suggestions>
          {SUGGESTIONS.map((s) => (
            <SuggestionChip key={s} onClick={() => onSend(s)}>
              {s}
            </SuggestionChip>
          ))}
        </Suggestions>
      )}

      <InputRow>
        <ChatTextarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about cars, bookings, or your trips…"
          rows={1}
          disabled={isStreaming}
        />
        {isStreaming ? (
          <BtnStop onClick={onStop} title="Stop">
            <StopIcon />
          </BtnStop>
        ) : (
          <BtnSend onClick={submit} disabled={!value.trim()} title="Send (Enter)">
            <SendIcon />
          </BtnSend>
        )}
      </InputRow>

      <InputHint>Enter to send · Shift+Enter for newline</InputHint>
    </InputArea>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}