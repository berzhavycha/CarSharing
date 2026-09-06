import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createMcpClient, getMcpTools } from './mcp-client.js';
import { runAgentLoop } from './agent.js';
import type { ChatMessage } from './types.js';

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

// ─── Chat — streaming SSE ─────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { messages, sessionId } = req.body as {
    messages: ChatMessage[];
    sessionId: string;
  };

  if (!messages?.length || !sessionId) {
    res.status(400).json({ error: 'messages and sessionId are required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    console.log(`[chat] sessionId=${sessionId} — connecting to MCP...`);
    const mcpClient = await createMcpClient(sessionId);
    console.log(`[chat] MCP connected, fetching tools...`);
    const tools = await getMcpTools(mcpClient);
    console.log(`[chat] Tools: ${tools.map(t => t.function.name).join(', ')}`);

    await runAgentLoop({
      messages,
      tools,
      mcpClient,
      sessionId,
      onToken:      (token)        => send('token',       { token }),
      onToolCall:   (name, input)  => send('tool_call',   { name, input }),
      onToolResult: (name, result) => send('tool_result', { name, result }),
      onError:      (message)      => send('error',       { message }),
    });

    send('done', {});
  } catch (err) {
    console.error('[chat] ERROR:', err);
    const message = err instanceof Error ? err.message : String(err);
    send('error', { message });
  } finally {
    res.end();
  }
});

// ─── OAuth proxy — forwards to your MCP server ────────────────────────────────

app.get('/oauth/start', (req, res) => {
  const { sessionId } = req.query as { sessionId: string };
  const mcpBase = process.env.MCP_SERVER_URL ?? 'http://localhost:3001';
  res.redirect(`${mcpBase}/oauth/start?sessionId=${sessionId}`);
});

app.get('/oauth/callback', (req, res) => {
  const mcpBase = process.env.MCP_SERVER_URL ?? 'http://localhost:3001';
  const params = new URLSearchParams(req.query as Record<string, string>);
  res.redirect(`${mcpBase}/oauth/callback?${params}`);
});

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`carsharing-agent running on http://localhost:${PORT}`);
});