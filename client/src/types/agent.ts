export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolEvents?: ToolEvent[];
  streaming?: boolean;
}

export interface ToolEvent {
  type: 'call' | 'result';
  name: string;
  payload: string;
  timestamp: number;
}
