import { ChatMessage } from '@/types/agent';
import { useState, useCallback, useRef } from 'react';

const API_URL = 'http://localhost:3002';

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const updateLastMessage = useCallback(
    (updater: (msg: ChatMessage) => ChatMessage) => {
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === 'assistant') {
          next[next.length - 1] = updater(last);
        }
        return next;
      });
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming || !text.trim()) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
      };

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        toolEvents: [],
        streaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      // Build history for the API (exclude the empty assistant placeholder)
      const historyForApi = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const res = await fetch(`http://localhost:3002/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyForApi, sessionId }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          let currentEvent = '';
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              const raw = line.slice(6).trim();
              if (!raw) continue;
              try {
                const payload = JSON.parse(raw);
                handleSSEEvent(currentEvent, payload);
              } catch {
                // ignore malformed
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        updateLastMessage((msg) => ({
          ...msg,
          content: msg.content || 'Something went wrong. Please try again.',
          streaming: false,
        }));
      } finally {
        setIsStreaming(false);
        updateLastMessage((msg) => ({ ...msg, streaming: false }));
      }

      function handleSSEEvent(event: string, payload: Record<string, unknown>) {
        switch (event) {
          case 'token':
            updateLastMessage((msg) => ({
              ...msg,
              content: msg.content + (payload.token as string),
            }));
            break;

          case 'tool_call':
            updateLastMessage((msg) => ({
              ...msg,
              toolEvents: [
                ...(msg.toolEvents ?? []),
                {
                  type: 'call',
                  name: payload.name as string,
                  payload: JSON.stringify(payload.input, null, 2),
                  timestamp: Date.now(),
                },
              ],
            }));
            break;

          case 'tool_result':
            updateLastMessage((msg) => ({
              ...msg,
              toolEvents: [
                ...(msg.toolEvents ?? []),
                {
                  type: 'result',
                  name: payload.name as string,
                  payload: payload.result as string,
                  timestamp: Date.now(),
                },
              ],
            }));
            break;

          case 'error':
            updateLastMessage((msg) => ({
              ...msg,
              content:
                msg.content +
                `\n\n⚠️ ${payload.message as string}`,
            }));
            break;
        }
      }
    },
    [isStreaming, messages, sessionId, updateLastMessage]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    updateLastMessage((msg) => ({ ...msg, streaming: false }));
  }, [updateLastMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isStreaming, sendMessage, stopStreaming, clearMessages };
}
