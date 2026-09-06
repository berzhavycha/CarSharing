import styled, { keyframes } from 'styled-components';
import { ChatMessage } from '@/types/agent';
import { ToolCallPanel } from './ToolCallPanel';

interface Props {
  message: ChatMessage;
}

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const MessageWrapper = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: ${({ $isUser }) => ($isUser ? 'row-reverse' : 'row')};
  align-items: flex-start;
  gap: 10px;
`;

const Avatar = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 2px;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 75%;
`;

const Bubble = styled.div<{ $isUser: boolean }>`
  padding: 10px 14px;
  border-radius: ${({ $isUser }) =>
    $isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  font-size: 0.9375rem;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;

  ${({ $isUser }) =>
    $isUser
      ? `
    background: #2563eb;
    color: #fff;
    align-self: flex-end;
  `
      : `
    background: #f3f4f6;
    color: #111827;
    align-self: flex-start;
  `}
`;

const TypingCursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #6b7280;
  border-radius: 2px;
  animation: ${blink} 1s step-start infinite;
`;

const InlineCode = styled.code`
  background: rgba(0, 0, 0, 0.08);
  padding: 1px 5px;
  border-radius: 4px;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.875em;
`;

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const hasTools = (message.toolEvents?.length ?? 0) > 0;

  return (
    <MessageWrapper $isUser={isUser}>
      <Avatar>{isUser ? '👤' : '🚗'}</Avatar>
      <MessageContent>
        {hasTools && <ToolCallPanel events={message.toolEvents!} />}
        <Bubble $isUser={isUser}>
          {message.content
            ? <MessageText text={message.content} />
            : message.streaming && <TypingCursor />
          }
        </Bubble>
      </MessageContent>
    </MessageWrapper>
  );
}

function MessageText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => (
        <span key={li}>
          {parseInline(line)}
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) parts.push(<strong key={m.index}>{m[2]}</strong>);
    else if (m[3]) parts.push(<InlineCode key={m.index}>{m[3]}</InlineCode>);
    last = re.lastIndex;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}