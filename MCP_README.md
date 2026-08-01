# CarSharing MCP Server — Setup Guide

This guide covers everything needed to run the CarSharing MCP server locally and connect it to an AI client (Claude Desktop or MCP Inspector).

## Architecture Overview

```
AI Client (Claude Desktop / MCP Inspector)
        ↕  MCP protocol (Streamable HTTP)
MCP Server — port 3001
        ↕  REST + OAuth 2.0
NestJS API — port 4000
        ↕  SQL
PostgreSQL — port 5433
        ↑
React Frontend — port 5173 (used for OAuth login page)
```

---

## Prerequisites

- Node.js 22+
- npm
- Docker + Docker Compose
- A running React frontend (for the OAuth login page)

---

## Step 1 — Start PostgreSQL

Only Postgres runs in Docker. The API and MCP server run locally.

```bash
docker compose up postgres
```

Verify it's healthy:
```bash
docker compose ps
# postgres should show "healthy"
```

---

## Step 2 — Start the NestJS API

```bash
cd server
npm install
npm run start:dev
```

Verify it's running:
```bash
curl http://localhost:4000/health
# → { "status": "ok" }
```

### Required `server/.env` values

```dotenv
NODE_ENV=development
PORT=4000

POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=carsharing
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

JWT_ACCESS_SECRET=access-secret
JWT_REFRESH_SECRET=refresh-secret
JWT_ACCESS_TOKEN_TIME=15m
JWT_REFRESH_TOKEN_TIME=30d
JWT_VERIFICATION_TOKEN_SECRET=verification-secret
JWT_VERIFICATION_TOKEN_EXPIRATION_TIME=5m

FRONTEND_URL=http://localhost:5173

EMAIL_CONFIRMATION_URL=http://localhost:5173/confirm-email
EMAIL_SERVICE=gmail
EMAIL_USER=your@email.com
EMAIL_PASSWORD=your-app-password

LOGIN_FIELD=email
AUTH_COOKIE_EXPIRATION_DAYS_TIME=30
CORS_ORIGIN=http://localhost:5173,http://localhost:3001

ADMIN_INVITATION_CODE=1234

AWS_PUBLIC_BUCKET_NAME=mock
AWS_ACCESS_KEY_ID=mock
AWS_SECRET_ACCESS_KEY=mock
AWS_REGION=mock

CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

---

## Step 3 — Create an Admin Account (first time only)

```bash
curl -X POST http://localhost:4000/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@carsharing.local",
    "password": "Admin1234!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "invitationCode": "1234"
  }'
```

---

## Step 4 — Register the MCP OAuth Client (first time only)

This creates a trusted OAuth client entry in the database for the MCP server.

### 4a — Log in as admin and save the cookie

```bash
curl -X POST http://localhost:4000/auth/sign-in \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@carsharing.local",
    "password": "Admin1234!"
  }'
```

### 4b — Register the client

```bash
curl -X POST http://localhost:4000/oauth/clients \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "carsharing-mcp",
    "redirectUri": "http://localhost:3001/oauth/callback/"
  }'
```

You will get back:
```json
{
  "clientId": "abc123...",
  "clientSecret": "xyz789..."
}
```

**Save these — you will need them in the next step. The secret is shown only once.**

---

## Step 5 — Configure and Start the MCP Server

### 5a — Create `mcp/.env`

```dotenv
MCP_PORT=3001
API_BASE_URL=http://localhost:4000
MCP_CLIENT_ID=<clientId from step 4>
MCP_CLIENT_SECRET=<clientSecret from step 4>
MCP_REDIRECT_URI=http://localhost:3001/oauth/callback/
```

### 5b — Start the MCP server

```bash
cd mcp
npm install
npm run dev
```

Verify it's running:
```bash
curl http://localhost:3001/mcp
# MCP server should respond
```

---

## Step 6 — Start the React Frontend

```bash
cd client   # or wherever your frontend lives
npm install
npm run dev
```

Frontend must be running at `http://localhost:5173` — it's used as the OAuth login page when an unauthenticated user tries to authorize.

### Required frontend `.env` value

```dotenv
VITE_API_URL=http://localhost:4000
```

---

## Step 7 — Connect an AI Client

### Option A — MCP Inspector (recommended for testing)

```bash
npx @modelcontextprotocol/inspector
```

Open `http://localhost:6274` in your browser, then:

1. Click **Add Servers** → **+ Add manually**
2. Set **Transport** to `Streamable HTTP`
3. Set **URL** to `http://localhost:3001/mcp`
4. Click **Add** then toggle the switch to **Connect**

### Option B — Claude Desktop

Edit the config file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "carsharing": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

Restart Claude Desktop. You should see a 🔨 hammer icon in the chat input confirming tools are available.

---

## Step 8 — Authorize as a User (OAuth Flow)

The first time you call any tool, the MCP server will have no token for your session and will return:

```
No tokens found for session — user must re-authorize
```

To authorize:

1. Find your `sessionId` from the MCP server terminal logs
2. Open in your browser:
   ```
   http://localhost:3001/oauth/start?sessionId=<your-session-id>
   ```
3. You will be redirected to your React login page at `localhost:5173/sign-in`
4. Log in with your carsharing account credentials
5. You are redirected back to the NestJS API which issues an authorization code
6. The MCP server exchanges the code for an access token + refresh token
7. The browser shows **"Authorization successful. You can close this tab."**
8. Go back to your AI client — all tool calls now work as that authenticated user ✅

**This only needs to be done once per session.** The MCP server automatically refreshes the access token using the refresh token before it expires.

---

## Available Tools

| Tool | Description |
|---|---|
| `listAvailableCars` | List cars available for rental within a date range with optional filters |
| `bookCar` | Book a car for the authenticated user for a given date range |
| `cancelBooking` | Cancel (return) an active rental |
| `getUserTrips` | Get the rental history for the authenticated user |

## Available Resources

| Resource | URI Pattern | Description |
|---|---|---|
| `car-detail` | `car:///{carId}` | Fetch details for a specific car |
| `user-profile` | `user:///{userId}/profile` | Fetch a user's profile |
| `booking-history` | `bookings:///{userId}/history` | Fetch rental history for a user |

## Available Prompts

| Prompt | Description |
|---|---|
| `find-nearby-car` | Find available cars near a location for a given time period |
| `estimate-trip-cost` | Estimate total cost of renting a car for a date range |

---

## How the OAuth Flow Works

```
1. Tool call arrives → MCP checks token store → no token found
2. Error surfaced to user with /oauth/start URL
3. User opens URL in browser
4. MCP builds PKCE authorization URL → redirects to NestJS /oauth/authorize
5. OAuthAuthGuard: no cookie → redirects to frontend /sign-in?returnTo=...
6. User logs in on existing login page
7. Frontend detects returnTo → redirects back to NestJS /oauth/authorize
8. NestJS validates client, issues authorization code → redirects to MCP /oauth/callback/
9. MCP exchanges code + PKCE verifier for access token + refresh token
10. Tokens stored in memory keyed by sessionId
11. All subsequent tool calls use Bearer token → NestJS sees req.user as the real user
12. Access token auto-refreshed 60s before expiry using refresh token
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `No tokens found for session` | Expected — first tool call before auth | Complete the OAuth flow via `/oauth/start` |
| `Invalid redirect URI` | URI mismatch between `.env` and DB | Ensure `MCP_REDIRECT_URI` exactly matches what was registered in Step 4b (including trailing slash) |
| `Unauthorized` on `/oauth/authorize` | `OAuthAuthGuard` not replacing `JwtAuthGuard` | Check the guard is applied correctly on the authorize endpoint |
| `FRONTEND_URL` is undefined in redirect | Env var not loaded | Add `FRONTEND_URL=http://localhost:5173` to `server/.env` and restart |
| MCP Inspector shows `Parse error: Invalid JSON` | `express.json()` middleware conflicting with MCP transport | Ensure `/mcp` route is registered before `app.use(express.json())` |
| Port 4000 already allocated | Previous process still running | Run `sudo fuser -k 4000/tcp` then restart |
| `getaddrinfo EAI_AGAIN postgres` | App reading `.env` file inside Docker instead of container env | Set `ignoreEnvFile: process.env.DOCKER === 'true'` in `ConfigModule.forRoot()` |

---

## Quick Start Checklist

```
□ docker compose up postgres
□ cd server && npm run start:dev
□ Register admin account (first time only)
□ Register MCP OAuth client (first time only) → save clientId + clientSecret
□ Create mcp/.env with clientId + clientSecret
□ cd mcp && npm run dev
□ cd client && npm run dev
□ Open MCP Inspector or configure Claude Desktop
□ Connect to http://localhost:3001/mcp
□ Call a tool → open oauth/start URL → log in → close tab
□ Call the tool again → works ✅
```
