import { ToolEvent } from '@/types/agent';
import { useState } from 'react';
import styled from 'styled-components';

const TOOL_ICONS: Record<string, string> = {
  listAvailableCars: '🚗',
  bookCar: '📋',
  cancelBooking: '❌',
  getUserTrips: '🗂️',
};

interface Props {
  events: ToolEvent[];
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ToolItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
`;

const ToolHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: #f3f4f6;
  }
`;

const ToolIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`;

const ToolName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  flex: 1;
`;

type StatusVariant = 'success' | 'error' | 'pending';

const ToolStatus = styled.span<{ $variant: StatusVariant }>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 9999px;

  ${({ $variant }) => {
    switch ($variant) {
      case 'success': return 'background: #dcfce7; color: #15803d;';
      case 'error':   return 'background: #fee2e2; color: #dc2626;';
      case 'pending': return 'background: #fef9c3; color: #854d0e;';
    }
  }}
`;

const Chevron = styled.span`
  font-size: 0.625rem;
  color: #9ca3af;
  flex-shrink: 0;
`;

const ToolBody = styled.div`
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #e5e7eb;
`;

const ToolSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
`;

const ToolCode = styled.pre<{ $error?: boolean }>`
  margin: 0;
  padding: 8px 10px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 0.8rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: ${({ $error }) => ($error ? '#dc2626' : '#1f2937')};
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function ToolCallPanel({ events }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (!events.length) return null;

  const pairs: Array<{ call: ToolEvent; result?: ToolEvent }> = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i].type === 'call') {
      pairs.push({
        call: events[i],
        result: events[i + 1]?.type === 'result' ? events[i + 1] : undefined,
      });
      if (events[i + 1]?.type === 'result') i++;
    }
  }

  return (
    <Panel>
      {pairs.map((pair, idx) => {
        const icon = TOOL_ICONS[pair.call.name] ?? '⚙️';
        const isOpen = expanded === idx;

        let resultData: unknown = null;
        let resultError = false;

        if (pair.result) {
          try {
            resultData = JSON.parse(pair.result.payload);
          } catch {
            resultData = pair.result.payload;
            resultError = pair.result.payload.startsWith('Error');
          }
        }

        const statusVariant: StatusVariant = pair.result
          ? resultError ? 'error' : 'success'
          : 'pending';

        const statusLabel = pair.result
          ? resultError ? 'failed' : 'done'
          : 'running…';

        return (
          <ToolItem key={idx}>
            <ToolHeader
              onClick={() => setExpanded(isOpen ? null : idx)}
              aria-expanded={isOpen}
            >
              <ToolIcon>{icon}</ToolIcon>
              <ToolName>{pair.call.name}</ToolName>
              <ToolStatus $variant={statusVariant}>{statusLabel}</ToolStatus>
              <Chevron>{isOpen ? '▲' : '▼'}</Chevron>
            </ToolHeader>

            {isOpen && (
              <ToolBody>
                <ToolSection>
                  <SectionLabel>Input</SectionLabel>
                  <ToolCode>{pair.call.payload}</ToolCode>
                </ToolSection>
                {pair.result && (
                  <ToolSection>
                    <SectionLabel>Output</SectionLabel>
                    <ToolCode $error={resultError}>
                      {typeof resultData === 'string'
                        ? resultData
                        : JSON.stringify(resultData, null, 2)}
                    </ToolCode>
                  </ToolSection>
                )}
              </ToolBody>
            )}
          </ToolItem>
        );
      })}
    </Panel>
  );
}