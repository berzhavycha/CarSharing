# CarSharing MCP Server — Architecture & Auth Deep Dive

## Table of Contents

1. [System Overview](#system-overview)
2. [Project Structure](#project-structure)
3. [How MCP Works](#how-mcp-works)
4. [OAuth 2.0 + PKCE Auth Flow](#oauth-20--pkce-auth-flow)
5. [Token Lifecycle](#token-lifecycle)
6. [Per-Request Auth Flow](#per-request-auth-flow)
7. [Tools](#tools)
8. [Resources](#resources)
9. [Prompts](#prompts)
10. [Security Design](#security-design)
11. [Data Flow Diagrams](#data-flow-diagrams)

---

## System Overview

The CarSharing MCP server sits between an AI client and the existing NestJS REST API. It translates natural language tool calls from an AI into authenticated HTTP requests, acting on behalf of a real logged-in user — never as an admin or superuser.

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI Client Layer                          │
│          Claude Desktop / Claude.ai / MCP Inspector             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ MCP Protocol (Streamable HTTP)
                           │ POST/GET/DELETE http://localhost:3001/mcp
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MCP Server :3001                          │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │    Tools    │  │  Resources   │  │       Prompts          │ │
│  │─────────────│  │──────────────│  │────────────────────────│ │
│  │listAvailable│  │ car-detail   │  │ find-nearby-car        │ │
│  │Cars         │  │ user-profile │  │ estimate-trip-cost     │ │
│  │bookCar      │  │ booking-     │  │                        │ │
│  │cancelBooking│  │ history      │  │                        │ │
│  │getUserTrips │  │              │  │                        │ │
│  └──────┬──────┘  └──────┬───────┘  └────────────────────────┘ │
│         │                │                                      │
│  ┌──────▼────────────────▼──────────────────────────────────┐  │
│  │              Token Store (in-memory Map)                  │  │
│  │         sessionId → { accessToken, refreshToken,         │  │
│  │                        expiresAt, scopes }                │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │                    API Client                             │  │
│  │     axios instance with Authorization: Bearer <token>    │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │ REST API calls
                              │ Authorization: Bearer <jwt>
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NestJS API :4000                           │
│                                                                 │
│  JwtAuthGuard → JwtStrategy → req.user = real User entity      │
│  RoleGuard → ownership checks → business logic                 │
│                                                                 │
│  /cars          /rentals         /users          /oauth         │
└──────────────────────────────┬──────────────────────────────────┘
                               │ TypeORM
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PostgreSQL :5433                            │
│  users  │  cars  │  rentals  │  oauth_clients  │  oauth_codes  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
mcp/
├── src/
│   ├── main.ts                  # Express app + MCP server bootstrap
│   ├── tools/
│   │   └── index.ts             # All tool registrations
│   ├── resources/
│   │   └── index.ts             # All resource registrations
│   ├── prompts/
│   │   └── index.ts             # All prompt registrations
│   ├── api/
│   │   └── client.ts            # Axios factory — attaches Bearer token
│   └── auth/
│       └── oauth-session.ts     # PKCE helpers, token store, refresh logic
├── .env                         # MCP_CLIENT_ID, MCP_CLIENT_SECRET, etc.
├── package.json
└── tsconfig.json
```

```
server/src/
├── oauth/
│   ├── oauth.controller.ts      # /oauth/authorize, /oauth/token, /oauth/clients
│   ├── guards/
│   │   └── oauth-auth.guard.ts  # Redirects unauthenticated users to frontend login
│   └── services/
│       ├── oauth-client.service.ts   # Client validation, registration
│       ├── oauth-code.service.ts     # Code issuance, PKCE verification, consumption
│       └── oauth-token.service.ts    # JWT issuance, refresh token verification
├── entities/
│   ├── oauth-client.entity.ts   # clientId, clientSecret, redirectUris, allowedScopes
│   └── oauth-code.entity.ts     # code, userId, codeChallenge, scopes, expiresAt
```

---

## How MCP Works

MCP (Model Context Protocol) is an open protocol that lets AI clients discover and call capabilities exposed by a server. It uses a request/response model over **Streamable HTTP**.

### Connection Lifecycle

```
1. AI client sends POST /mcp  { method: "initialize" }
        ↓
2. MCP server responds with capabilities:
   { tools: {}, resources: {}, prompts: {} }
        ↓
3. Client sends tools/list, resources/list, prompts/list
        ↓
4. Server responds with full registry of what's available
        ↓
5. Client is now ready — user/AI can call tools
```

### What the SDK Does

The `@modelcontextprotocol/server` package handles all protocol-level concerns:

- JSON-RPC message parsing and routing
- Session management via `mcp-session-id` header
- Capability negotiation
- Schema validation of tool inputs via Zod
- Serialization of tool results back to the client

Your code only needs to register handlers — the SDK calls them when the client invokes a tool.

```typescript
// You write this:
server.registerTool('listAvailableCars', { inputSchema, description }, handler);

// SDK handles:
// - Receiving { method: "tools/call", params: { name: "listAvailableCars", arguments: {...} } }
// - Validating arguments against inputSchema
// - Calling your handler
// - Returning { content: [...] } back to the client
```

### Transport: NodeStreamableHTTPServerTransport

The v2 SDK uses `NodeStreamableHTTPServerTransport` from `@modelcontextprotocol/node`. This transport:

- Accepts `POST`, `GET`, and `DELETE` on the same `/mcp` endpoint
- Uses Server-Sent Events (SSE) for streaming responses back to the client
- Manages session state via the `mcp-session-id` request header
- Must receive the **raw** request body — do not pass it through `express.json()` first

```typescript
// Correct — /mcp registered BEFORE express.json()
app.all('/mcp', async (req, res) => {
  await transport.handleRequest(req, res);
});

app.use(express.json()); // Only applies to routes below this line
```

---

## OAuth 2.0 + PKCE Auth Flow

The MCP server implements the **Authorization Code Flow with PKCE** (RFC 7636). This is the standard for public clients that cannot safely store a client secret in the browser.

### Why PKCE?

Without PKCE, an attacker who intercepts the authorization code (e.g. via a malicious browser extension or network tap) could exchange it for tokens. PKCE prevents this by requiring the party exchanging the code to prove they generated it, using a secret that was never sent over the network.

### Complete Flow

```
┌──────────┐         ┌────────────┐         ┌──────────────┐        ┌──────────┐
│  Browser │         │ MCP Server │         │  NestJS API  │        │ Frontend │
│          │         │  :3001     │         │  :4000       │        │  :5173   │
└────┬─────┘         └─────┬──────┘         └──────┬───────┘        └────┬─────┘
     │                     │                        │                     │
     │  GET /oauth/start   │                        │                     │
     │  ?sessionId=uuid    │                        │                     │
     │────────────────────►│                        │                     │
     │                     │                        │                     │
     │                     │ 1. Generate PKCE pair  │                     │
     │                     │    codeVerifier (secret)                     │
     │                     │    codeChallenge = SHA256(verifier)          │
     │                     │                        │                     │
     │                     │ 2. Generate state      │                     │
     │                     │    Store { verifier, sessionId } in pkceStore│
     │                     │                        │                     │
     │  302 → /oauth/authorize?clientId=...         │                     │
     │        &codeChallenge=...&state=...          │                     │
     │◄────────────────────│                        │                     │
     │                     │                        │                     │
     │  GET /oauth/authorize?...                    │                     │
     │─────────────────────────────────────────────►│                     │
     │                     │                        │                     │
     │                     │              OAuthAuthGuard:                 │
     │                     │              no JWT cookie?                  │
     │                     │                        │                     │
     │  302 → /sign-in?returnTo=%2Foauth%2Fauthorize%3F...               │
     │◄─────────────────────────────────────────────────────────────────►│
     │                                              │                     │
     │  User fills login form                       │                     │
     │─────────────────────────────────────────────────────────────────►│
     │                     │                        │                     │
     │                     │              POST /auth/sign-in              │
     │                     │              ◄──────────────────────────────│
     │                     │              Sets JWT cookie                 │
     │                     │              ──────────────────────────────►│
     │                     │                        │                     │
     │                     │              Frontend detects returnTo       │
     │  302 → /oauth/authorize?... (now with cookie)│                     │
     │◄─────────────────────────────────────────────────────────────────►│
     │                     │                        │                     │
     │  GET /oauth/authorize?...                    │                     │
     │─────────────────────────────────────────────►│                     │
     │                     │                        │                     │
     │                     │              OAuthAuthGuard: cookie valid ✅ │
     │                     │              Validate clientId + redirectUri │
     │                     │              Validate requested scopes       │
     │                     │              Issue authorization code        │
     │                     │              Store { userId, codeChallenge,  │
     │                     │                      scopes } in oauth_codes │
     │                     │                        │                     │
     │  302 → /oauth/callback/?code=xxx&state=yyy   │                     │
     │◄─────────────────────────────────────────────│                     │
     │                     │                        │                     │
     │  GET /oauth/callback/?code=xxx&state=yyy     │                     │
     │────────────────────►│                        │                     │
     │                     │                        │                     │
     │                     │ 3. Verify state        │                     │
     │                     │    Look up pkceStore[state]                  │
     │                     │    Get { codeVerifier, sessionId }           │
     │                     │                        │                     │
     │                     │  POST /oauth/token     │                     │
     │                     │  { code, codeVerifier, │                     │
     │                     │    clientId, clientSecret, redirectUri }     │
     │                     │───────────────────────►│                     │
     │                     │                        │                     │
     │                     │              4. Verify client credentials    │
     │                     │              5. Find code in oauth_codes     │
     │                     │              6. Check code not expired       │
     │                     │              7. Check code not used before   │
     │                     │              8. Verify PKCE:                 │
     │                     │                 SHA256(codeVerifier)         │
     │                     │                 === codeChallenge ✅         │
     │                     │              9. Mark code as consumed        │
     │                     │              10. Issue JWT access token (15m)│
     │                     │              11. Issue refresh token (30d)   │
     │                     │                        │                     │
     │                     │  { accessToken, refreshToken, expiresIn }   │
     │                     │◄───────────────────────│                     │
     │                     │                        │                     │
     │                     │ 12. Store in tokenStore[sessionId]           │
     │                     │                        │                     │
     │  "Authorization successful. Close this tab." │                     │
     │◄────────────────────│                        │                     │
```

### Key Files

**`mcp/src/auth/oauth-session.ts`** — owns the entire client-side OAuth flow:

```typescript
// PKCE generation
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto.createHash('sha256')
  .update(codeVerifier).digest('base64url');

// State store — prevents CSRF
// Maps state → { codeVerifier, sessionId }
const pkceStore = new Map<string, { codeVerifier: string; sessionId: string }>();

// Token store — holds tokens per session
// Maps sessionId → TokenSet
const tokenStore = new Map<string, TokenSet>();
```

**`server/src/oauth/oauth.controller.ts`** — owns the server-side OAuth flow:

- `GET /oauth/authorize` — validates client, issues code, redirects back
- `POST /oauth/token` — validates PKCE, exchanges code for tokens
- `POST /oauth/clients` — admin-only client registration

---

## Token Lifecycle

```
Authorization Code
  └── Single use
  └── Expires in 5 minutes
  └── Stored in oauth_codes table
  └── Deleted on consumption

Access Token (JWT)
  └── Short-lived: 15 minutes
  └── Contains: { sub: userId, scopes: [...] }
  └── Sent as: Authorization: Bearer <token>
  └── Validated by NestJS JwtAuthGuard on every request

Refresh Token (JWT)
  └── Long-lived: 30 days
  └── Used to get new access tokens silently
  └── MCP server refreshes 60 seconds before access token expiry
  └── Never sent to the NestJS API endpoints — only to /oauth/token

PKCE State
  └── Lives in pkceStore (in-memory)
  └── Auto-deleted after 5 minutes via setTimeout
  └── Deleted immediately on use
```

### Automatic Token Refresh

```typescript
// In oauth-session.ts
export async function getAccessToken(sessionId: string): Promise<string> {
  const tokens = tokenStore.get(sessionId);

  // Refresh 60 seconds before expiry — proactive, not reactive
  if (Date.now() >= tokens.expiresAt - 60_000) {
    return refreshAccessToken(sessionId, tokens);
  }

  return tokens.accessToken;
}
```

This means the user **never needs to re-authorize** as long as they use the MCP server within the refresh token lifetime (30 days). Silent refresh happens automatically on every tool call.

---

## Per-Request Auth Flow

Every tool and resource handler follows this path:

```
Tool call arrives from AI client
        │
        ▼
handler(args, { sessionId })
        │
        ▼
getApiClient(sessionId)
        │
        ▼
getAccessToken(sessionId)
        ├── tokenStore has entry?
        │       ├── No → throw "No tokens found — user must re-authorize"
        │       └── Yes → check expiry
        │               ├── Expiring soon → POST /oauth/token (refresh grant)
        │               └── Still valid → return accessToken
        │
        ▼
axios.create({
  baseURL: 'http://localhost:4000',
  headers: { Authorization: `Bearer ${accessToken}` }
})
        │
        ▼
NestJS API receives request
        │
        ▼
JwtAuthGuard extracts Bearer token
        │
        ▼
JwtStrategy.validate({ sub: userId, scopes })
        │
        ▼
validateUserById(userId) → User entity from DB
        │
        ▼
req.user = real logged-in User ✅
        │
        ▼
RoleGuard, ownership checks, business logic
— all work exactly as browser flow
```

---

## Tools

Tools are actions the AI can invoke. They map 1:1 to NestJS API endpoints.

```typescript
// Registration pattern
server.registerTool(
  'toolName',
  {
    description: 'What this tool does',
    inputSchema: z.object({ ... }),  // Zod schema — validated by SDK
  },
  async (args, { sessionId }) => {
    const api = await getApiClient(sessionId);  // authenticated axios
    const { data } = await api.get('/endpoint');
    return { content: [{ type: 'text', text: JSON.stringify(data) }] };
  }
);
```

### Registered Tools

| Tool | Method | Endpoint | Description |
|---|---|---|---|
| `listAvailableCars` | GET | `/cars` | List available cars with date + filter params |
| `bookCar` | POST | `/rentals` | Create a new rental |
| `cancelBooking` | PATCH | `/rentals/:id` | Cancel an active rental |
| `getUserTrips` | GET | `/rentals/history` | Paginated rental history |

### `sessionId` in Tool Context

The `sessionId` comes from the MCP protocol session — it's the value of the `mcp-session-id` header sent by the client, generated by `sessionIdGenerator: () => randomUUID()` in the transport. It's stable for the lifetime of the client connection and is the key used to look up the user's tokens.

---

## Resources

Resources expose read-only data that the AI or host application can fetch as context. Unlike tools (which the AI decides when to call), resources are fetched by the host.

```typescript
server.registerResource(
  'resource-name',
  new ResourceTemplate('scheme:///{param}', { list: undefined }),
  { description: 'What this resource represents' },
  async (uri, { param }, { sessionId }) => {
    const api = await getApiClient(sessionId);
    const { data } = await api.get(`/endpoint/${param}`);
    return {
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(data),
      }]
    };
  }
);
```

### Registered Resources

| Name | URI Pattern | API Endpoint |
|---|---|---|
| `car-detail` | `car:///{carId}` | `GET /cars/:carId` |
| `user-profile` | `user:///{userId}/profile` | `GET /users/:userId` |
| `booking-history` | `bookings:///{userId}/history` | `GET /rentals/history` |

---

## Prompts

Prompts are reusable message templates that structure how the AI approaches a task. They are user-invoked, not AI-invoked.

```typescript
server.registerPrompt(
  'prompt-name',
  {
    description: 'What this prompt does',
    argsSchema: z.object({ ... }),
  },
  (args) => ({
    messages: [{
      role: 'user',
      content: { type: 'text', text: `Rendered template with ${args.value}` }
    }]
  })
);
```

### Registered Prompts

| Prompt | Args | Purpose |
|---|---|---|
| `find-nearby-car` | `location`, `date`, `durationHours` | Instructs AI to call `listAvailableCars` and return sorted results |
| `estimate-trip-cost` | `carId`, `startDate`, `endDate` | Instructs AI to fetch car resource and calculate total cost |

---

## Security Design

### Why OAuth instead of a shared API key?

| Approach | Problem |
|---|---|
| Shared admin API key | All AI actions run as superuser — no ownership, no audit trail |
| Per-user API key stored in MCP | Users must manage keys; no expiry; key leaks are permanent |
| OAuth 2.0 + PKCE | Tokens are short-lived, scoped, user-specific, auto-refreshing |

### Defense Layers

**PKCE** — Prevents authorization code interception attacks. Even if an attacker captures the `?code=` redirect, they cannot exchange it without the `codeVerifier` that stays inside the MCP server process.

**State parameter** — Prevents CSRF. The MCP server generates a random `state` value and verifies it matches on callback. An attacker cannot forge a callback from a different session.

**Single-use authorization codes** — Codes are marked consumed immediately on first use. Replaying a captured code fails.

**Short-lived access tokens** — 15 minute TTL limits the window of misuse if a token leaks.

**Scoped tokens** — The access token only grants `cars:read`, `rentals:read`, `rentals:write`, `profile:read`. It cannot access admin endpoints or other users' data.

**Client credentials** — `clientId` + `clientSecret` verify the token exchange came from the legitimate MCP server, not an arbitrary party who captured the authorization code.

**Redirect URI validation** — NestJS rejects any authorization request whose `redirectUri` doesn't exactly match what was registered in the DB, preventing open redirector attacks.

### What the NestJS API Sees

From the API's perspective, MCP tool calls are indistinguishable from normal browser requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

`JwtAuthGuard` validates the token, loads the user, and sets `req.user`. Every guard, decorator, and ownership check works identically to the browser flow. The API has no special MCP mode.

---

## Data Flow Diagrams

### Successful Tool Call (token already exists)

```
MCP Inspector          MCP Server              NestJS API
     │                     │                       │
     │  tools/call         │                       │
     │  listAvailableCars  │                       │
     │  { startDate, ... } │                       │
     │────────────────────►│                       │
     │                     │                       │
     │                     │ getAccessToken(sid)   │
     │                     │ → token valid ✅      │
     │                     │                       │
     │                     │ GET /cars             │
     │                     │ Authorization: Bearer │
     │                     │──────────────────────►│
     │                     │                       │
     │                     │                       │ JwtAuthGuard ✅
     │                     │                       │ req.user = User
     │                     │                       │ fetch cars from DB
     │                     │                       │
     │                     │ [{ id, model, ... }]  │
     │                     │◄──────────────────────│
     │                     │                       │
     │  { content: [       │                       │
     │    { type: 'text',  │                       │
     │      text: '...' }  │                       │
     │  ]}                 │                       │
     │◄────────────────────│                       │
```

### First Tool Call (no token — triggers auth)

```
MCP Inspector          MCP Server
     │                     │
     │  tools/call         │
     │────────────────────►│
     │                     │
     │                     │ getAccessToken(sid)
     │                     │ → tokenStore empty
     │                     │ → throw Error
     │                     │
     │  { isError: true,   │
     │    content: "No     │
     │    tokens found..." }│
     │◄────────────────────│
     │                     │
     │  [User opens]       │
     │  /oauth/start?      │
     │  sessionId=sid      │
     │────────────────────►│
     │                     │ [Full OAuth flow — see above]
     │                     │
     │  "Auth successful"  │
     │◄────────────────────│
     │                     │
     │  [User calls tool again]
     │────────────────────►│
     │                     │ getAccessToken(sid) → ✅
     │                     │ [Normal flow continues]
```