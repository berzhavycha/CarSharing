import { ChatInput } from '@/components/cs-agent/ChatInput';
import { MessageBubble } from '@/components/cs-agent/MessageBubble';
import { useChat } from '@/hooks/use-chat';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const API_URL = 'http://localhost:3002';

function getOrCreateSessionId(): string {
  const key = 'carsharing_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.header`
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  flex-shrink: 0;
`;

const HeaderInner = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;

  em {
    font-style: normal;
    font-weight: 700;
    color: #2563eb;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BtnAuth = styled.button`
  padding: 6px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #1d4ed8;
  }
`;

const BtnClear = styled.button`
  padding: 6px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

const Main = styled.main`
  flex: 1;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem 1rem;
  text-align: center;
`;

const EmptyCar = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem;
`;

const EmptySub = styled.p`
  color: #6b7280;
  max-width: 320px;
  margin: 0 0 2rem;
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

const SuggestionChip = styled.button`
  padding: 8px 16px;
  font-size: 0.875rem;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #dbeafe;
  }
`;

const Messages = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OAuthBanner = styled.div`
  background: #fffbeb;
  border-top: 1px solid #fde68a;
  padding: 12px 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;

  span {
    font-size: 0.875rem;
    color: #92400e;
  }
`;

const Footer = styled.footer`
  background: #fff;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

const FooterInner = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function CSAgent() {
  const sessionId = getOrCreateSessionId();
  const { messages, isStreaming, sendMessage, stopStreaming, clearMessages } = useChat(sessionId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [oauthNeeded, setOauthNeeded] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const hasAuthed = sessionStorage.getItem('carsharing_authed');
    if (!hasAuthed) setOauthNeeded(true);
  }, []);

  const handleOAuth = () => {
    const url = `${API_URL}/oauth/start?sessionId=${sessionId}`;
    const popup = window.open(url, 'oauth', 'width=520,height=640');
    const check = setInterval(() => {
      if (popup?.closed) {
        clearInterval(check);
        setOauthNeeded(false);
        sessionStorage.setItem('carsharing_authed', 'true');
      }
    }, 500);
  };

  useEffect(() => {
    const last = messages[messages.length - 1];
    const toolFailed = last?.toolEvents?.some(
      (e) => e.type === 'result' && e.payload.includes('No tokens found')
    );
    const textMentions =
      last?.content?.includes('No tokens found') ||
      last?.content?.includes('must re-authorize');

    if (toolFailed || textMentions) setOauthNeeded(true);
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <Wrapper>
      <Header>
        <HeaderInner>
          <Logo>
            <span>🚗</span>
            <span>CarShare<em>AI</em></span>
          </Logo>
          <HeaderActions>
            {oauthNeeded && (
              <BtnAuth onClick={handleOAuth}>Connect account</BtnAuth>
            )}
            {!isEmpty && (
              <BtnClear onClick={clearMessages} title="New conversation">
                New chat
              </BtnClear>
            )}
          </HeaderActions>
        </HeaderInner>
      </Header>

      <Main>
        {isEmpty ? (
          <EmptyState>
            <EmptyCar>🚗</EmptyCar>
            <EmptyTitle>Your car rental assistant</EmptyTitle>
            <EmptySub>
              Find available cars, book rentals, and manage trips — all through conversation.
            </EmptySub>
            <ChipsRow>
              {['Find a car in Kyiv this Friday', 'Show my booking history', 'Cancel my last rental'].map((s) => (
                <SuggestionChip key={s} onClick={() => sendMessage(s)}>
                  {s}
                </SuggestionChip>
              ))}
            </ChipsRow>
          </EmptyState>
        ) : (
          <Messages>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </Messages>
        )}
      </Main>

      {oauthNeeded && (
        <OAuthBanner>
          <span>🔐 You need to connect your account to access car data.</span>
          <BtnAuth onClick={handleOAuth}>Connect account</BtnAuth>
        </OAuthBanner>
      )}

      <Footer>
        <FooterInner>
          <ChatInput
            onSend={sendMessage}
            onStop={stopStreaming}
            isStreaming={isStreaming}
          />
        </FooterInner>
      </Footer>
    </Wrapper>
  );
}