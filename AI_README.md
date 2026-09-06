# CarShare AI — Frontend Client

A streaming chat UI that connects to your carsharing MCP server via Ollama (local LLM).

## Architecture

```
Browser (React + Vite)  :5173
        │  fetch / SSE
Express Backend         :3002
        │  MCP SDK Client
Your MCP Server         :3001
        │  OAuth + REST API
Car Rental API          :4000
```

The backend runs the **agentic loop**: sends messages to Ollama, intercepts tool calls, executes them against your MCP server, feeds results back, and streams tokens to the browser via Server-Sent Events.

## Prerequisites

1. **Ollama** installed and running: https://ollama.com
2. A model that supports tool use pulled locally:
   ```bash
   ollama pull llama3.1       # recommended (8B, ~5GB)
   # or
   ollama pull qwen2.5:7b     # good alternative
   ```
3. Your carsharing MCP server running on `:3001`

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env if your ports differ
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

### Or run both at once (from root):

```bash
npm install          # installs concurrently
npm run install:all  # installs backend + frontend deps
npm run dev          # starts both
```

## Environment variables

### `backend/.env`

| Variable | Default | Description |
|---|---|---|
| `MCP_SERVER_URL` | `http://localhost:3001` | URL of your MCP server |
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama API |
| `OLLAMA_MODEL` | `llama3.1` | Model to use (must support tools) |
| `PORT` | `3002` | Backend port |

### `frontend/.env`

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3002` | Backend URL |

## How the agent loop works

```
User sends message
        │
        ▼
Ollama (streaming) ──► text tokens ──► SSE "token" events ──► browser
        │
        │ tool_call in response
        ▼
MCP client.callTool(name, args)
        │
        │ result
        ▼
History updated → back to Ollama
        │
        │ no more tool calls
        ▼
Final streaming response
```

Tool calls and results are shown in the UI as collapsible panels above each assistant message.

## OAuth flow

When the MCP server returns a "must re-authorize" error, the UI shows a **Connect account** button. Clicking it opens your MCP server's OAuth flow in a popup. Once the user completes it, the popup closes and chat resumes automatically.

## Models known to support tool use

- `llama3.1` (8B or 70B)
- `qwen2.5:7b` or `qwen2.5:14b`
- `mistral-nemo`
- `command-r`

Avoid `llama3.2` 1B/3B — too small for reliable tool use.
