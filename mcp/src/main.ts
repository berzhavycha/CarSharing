import 'dotenv/config';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/server';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';

import { registerTools } from './tools/index.js';
import { registerResources } from './resources/index.js';
import { registerPrompts } from './prompts/index.js';
import {
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  clearSession,
} from './auth/oauth-session.js';

const PORT = process.env.MCP_PORT ?? 3001;

const app = express();

// ─── MCP Server setup ────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'carsharing-mcp',
  version: '1.0.0',
});

registerTools(server);
registerResources(server);
registerPrompts(server);

// ─── Streamable HTTP transport ────────────────────────────────────────────────

const transport = new NodeStreamableHTTPServerTransport({
  sessionIdGenerator: () => randomUUID(),
});

await server.connect(transport);

app.all('/mcp', (req, res) => transport.handleRequest(req, res));


app.use(express.json());
// ─── OAuth callback ───────────────────────────────────────────────────────────

app.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query as { code: string; state: string };

  if (!code || !state) {
    res.status(400).send('Missing code or state parameter');
    return;
  }

  try {
    await exchangeCodeForTokens(code, state);
    res.send(`
      <html>
        <body>
          <p>Authorization successful. You can close this tab.</p>
          <script>window.close();</script>
        </body>
      </html>
    `);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).send(`Authorization failed: ${message}`);
  }
});

// ─── OAuth initiation ─────────────────────────────────────────────────────────

app.get('/oauth/start', (req, res) => {
  const { sessionId } = req.query as { sessionId: string };

  if (!sessionId) {
    res.status(400).send('Missing sessionId');
    return;
  }

  const authUrl = buildAuthorizationUrl(sessionId);
  res.redirect(authUrl);
});

// ─── Session cleanup ──────────────────────────────────────────────────────────

app.delete('/sessions/:sessionId', (req, res) => {
  clearSession(req.params.sessionId);
  res.status(204).send();
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`CarSharing MCP server running on http://localhost:${PORT}/mcp`);
});
