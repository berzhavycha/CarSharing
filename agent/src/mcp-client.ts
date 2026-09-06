import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { OllamaTool } from './types.js';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL ?? 'http://localhost:3001';

// OAuth sessionId → MCP Client cache
const clientCache = new Map<string, Client>();

export async function createMcpClient(sessionId: string): Promise<Client> {
  if (clientCache.has(sessionId)) {
    return clientCache.get(sessionId)!;
  }

  const transport = new StreamableHTTPClientTransport(
    new URL(`${MCP_SERVER_URL}/mcp`),
    {
      // Do NOT pass sessionId here — let the server assign a real MCP
      // session ID on the initialize handshake. Passing your OAuth session ID
      // here caused "Server not initialized" because the server looked it up
      // in its transport map and found nothing.
      requestInit: {
        headers: {
          // Pass the OAuth session as a separate header so your MCP server's
          // tool handlers can resolve the right access token.
          'x-oauth-session-id': sessionId,
        },
      },
    }
  );

  const client = new Client(
    { name: 'carsharing-agent', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  // connect() sends MCP initialize + waits for initialized notification.
  // Fully handshaked before we cache — this is what was missing before.
  await client.connect(transport);

  clientCache.set(sessionId, client);

  transport.onclose = () => {
    clientCache.delete(sessionId);
  };

  return client;
}

export async function getMcpTools(client: Client): Promise<OllamaTool[]> {
  const { tools } = await client.listTools();

  return tools.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description ?? '',
      parameters: tool.inputSchema ?? { type: 'object', properties: {} },
    },
  }));
}

export async function callMcpTool(
  client: Client,
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  // Strip keys where Ollama passed "null" string or actual null/undefined
  const cleanArgs = Object.fromEntries(
    Object.entries(args).filter(
      ([, v]) =>
        v !== null &&
        v !== undefined &&
        v !== 'null' &&
        v !== 'undefined' &&
        v !== ''        // ← add this
    )
  );

  const result = await client.callTool({ name, arguments: cleanArgs });

  const text = result.content
    .filter((c): c is { type: 'text'; text: string } => c.type === 'text')
    .map((c) => c.text)
    .join('\n');

  return text || JSON.stringify(result.content);
}