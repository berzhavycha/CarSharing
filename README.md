## Index

- [Usage](#usage)
  - [Installation](#installation)
  - [Commands](#commands)


## Usage

### Installation

1. Clone the repository to your local machine: 
```
\$ git clone https://github.com/berzhavycha/CarSharing.git CarSharing
```
2. Navigate to the project directory:
```
\$ cd CarSharing
```
3. Install dependencies: 
```
\$ cd client
\$ npm install 
\$ cd server 
\$ npm install 
```


### Commands
1. To run client: 
```
\$ cd client
\$ npm run dev
```
2. To run server: 
```
\$ cd server 
\$ npm run start:dev 
```
3. To run migrations: 
```
\$ npm run typeorm:run-migrations
```

Make sure you have looked to the .env.example file in both client and server and assigned in your .env file in both client and server values for each of the environment variable.



User opens AI client (Claude Desktop / Claude.ai)
        ↓
AI client connects to your MCP server
        ↓
MCP server redirects user to your existing auth (login page)
        ↓
User logs in — same flow as the browser today
        ↓
Your server issues a short-lived access token scoped to that user
        ↓
MCP server holds that token for the session duration
        ↓
Every tool call uses that token — acts as that user, not as admin
        ↓
Token expires → user re-authenticates → no manual rotation anywhere










User's AI Client (Claude Desktop / Claude.ai)
        ↓  "I need access to carsharing tools"
MCP Server  ← OAuth client, registered with your NestJS app
        ↓  "redirect user to authorize"
User's Browser → your NestJS login page (already exists)
        ↓  user logs in, grants permission
NestJS issues authorization code → redirected back to MCP server
        ↓  MCP server exchanges code for tokens
NestJS issues access token (short-lived) + refresh token (long-lived)
        ↓  MCP server uses access token on every API call
NestJS API — req.user is the real logged-in user ✅





MCP tool call arrives with user's access token
        ↓
NestJS JwtAuthGuard runs
        ↓
Extracts JWT from Authorization: Bearer header (not cookie this time)
        ↓  
JwtStrategy.validate() → validateUserById(payload.sub) → real User entity
        ↓
req.user = actual logged-in user
        ↓
RoleGuard(Roles.USER) → user.role.name === 'USER' ✅
        ↓
@CurrentUser() returns the real user ✅
        ↓
Ownership checks, balance checks — all work exactly as browser flow