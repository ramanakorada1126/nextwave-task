# Team Task Tracker API (Nextwave Take‑Home)

Backend REST API for a team-based task tracker with:
- JWT auth (access token + refresh token rotation)
- Role-based access control (ADMIN / MANAGER / MEMBER)
- MySQL + Sequelize
- Docker + docker-compose (one command startup)

## Tech Stack
- Node.js (CommonJS)
- Express
- Sequelize (MySQL)
- Joi (input + env validation)

## Quick Start (Docker)
Prereqs: Docker Desktop (or Docker Engine) with Compose.

1) Copy/update env:
- Edit `.env` (already included with defaults for local/dev).

2) Run:
```bash
docker compose up --build
```

3) Verify:
- `GET http://localhost:3000/health`

The API container connects to MySQL automatically via `MYSQL_HOST=db` from `docker-compose.yml`.

## Local Development (without Docker)
Prereqs: Node.js + a running MySQL (and Redis only if you enable caching later).

```bash
npm install
npm run dev
```

## Environment Variables
Loaded from `.env` via `dotenv` and validated with Joi in `src/config/env.js`.

Required:
- `JWT_ACCESS_SECRET` (min 16 chars)

Common:
- `PORT`
- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- `JWT_ACCESS_TTL_SECONDS`
- `REFRESH_TOKEN_TTL_DAYS`
- `SEED_ADMIN` + seed settings

## API Routes (current)
Base router is mounted at `/` (see `src/routes/index.js`).

## Swagger / OpenAPI
An OpenAPI spec is included at `openapi.yaml`.

You can:
- Paste it into Swagger Editor, or
- Import it into Postman as an API definition.

### Auth
- `POST /auth/register`
  - body: `{ org_name, name, email, password }`
- `POST /auth/login`
  - body: `{ email, password }`
- `POST /auth/refresh`
  - body: `{ refresh_token }`
- `POST /auth/logout`
  - body: `{ refresh_token }`

### Users
- `POST /users` (ADMIN only)
  - body: `{ name, email, password, role }` where role is `MANAGER` or `MEMBER`
- `GET /users` (ADMIN only)
- `GET /users/:id` (ADMIN only)
- `PATCH /users/:id` (ADMIN only)

### Projects
- `POST /projects` (ADMIN/MANAGER)
- `GET /projects`
- `GET /projects/:id`
- `PATCH /projects/:id` (ADMIN/MANAGER)
- `DELETE /projects/:id` (ADMIN/MANAGER)

Validation:
- Joi schemas live in `src/validation/authSchema.js`
- Middleware `validateBody` in `src/validation/validate.js` returns consistent errors using `ApiError`.

Error format:
```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "some helpful message"
}
```

## Data Model (schema description)
Implemented via Sequelize models in `src/models/*` and associations in `src/models/index.js`.

### Tables
- `organizations`
  - `id` (UUID, PK)
  - `name` (string, indexed)
- `users`
  - `id` (UUID, PK)
  - `orgId` (UUID, indexed)
  - `name`
  - `email` (unique)
  - `passwordHash`
  - `role` (ENUM: ADMIN|MANAGER|MEMBER, indexed)
- `projects`
  - `id` (UUID, PK)
  - `orgId` (UUID, indexed)
  - `name` (indexed)
  - `description`
- `tasks`
  - `id` (UUID, PK)
  - `orgId` (UUID, indexed)
  - `projectId` (UUID, nullable)
  - `title`
  - `description`
  - `priority` (ENUM: LOW|MEDIUM|HIGH)
  - `status` (ENUM: TODO|IN_PROGRESS|IN_REVIEW|DONE|BLOCKED, indexed)
  - `assigneeId` (UUID, indexed)
  - `createdById` (UUID)
  - `dueDate` (DATE, indexed)
  - `completedAt` (DATE, nullable)
- `refresh_tokens`
  - `id` (UUID, PK)
  - `userId` (UUID, indexed)
  - `tokenHash` (unique, indexed)
  - `jti` (indexed)
  - `expiresAt`
  - `revokedAt` (nullable)
  - `replacedByTokenId` (nullable)

### Relationships
- Organization 1—N Users
- Organization 1—N Projects
- Organization 1—N Tasks
- Project 1—N Tasks
- User 1—N Tasks (assignee)
- User 1—N Tasks (createdBy)
- User 1—N RefreshTokens

## DB Design Decision (example)
We index task fields used in list/filter queries (`status`, `assigneeId`, `dueDate`) because task listing is a high-frequency operation and these columns are commonly used in `WHERE` + pagination. This reduces scan cost and keeps list endpoints responsive as data grows.

See indexes in:
- `src/models/Task.js`

## Caching Strategy (Redis)
Planned requirement: cache task list per assignee and invalidate on task changes.

Current status:
- Redis is **temporarily disabled** in `src/server.js` (startup doesn’t require Redis).
- Redis client + invalidation helper exists in `src/cache/redis.js`.

Intended approach (when enabling task list endpoints):
- Cache key pattern: `tasklist:{orgId}:{assigneeId}:{page}:{limit}:{filtersHash}`
- TTL: short (e.g., 30–120 seconds) to reduce stale risk
- Invalidation:
  - On task create/update/delete OR reassignment affecting assignee, call `invalidateAssigneeTaskListCache(orgId, assigneeId)`
  - If reassigned: invalidate both old and new assignee caches

Why this works:
- Task lists are read-heavy; caching reduces DB load.
- Pattern-based invalidation clears all variants (pagination/filter combos) for that assignee.

## Project Structure
- `src/app.js` – Express app wiring
- `src/server.js` – startup (DB connect, seed, listen)
- `src/routes/` – route definitions (thin)
- `src/controllers/` – request handlers (HTTP layer)
- `src/services/` – domain logic (auth, password, etc.)
- `src/models/` – Sequelize models + associations
- `src/middleware/` – auth/rbac/error handlers
- `src/validation/` – Joi schemas + validation middleware

## What’s Next / Improvements
To fully match the assignment spec:
- Add Users/Projects/Tasks routes + controllers (CRUD)
- Add RBAC enforcement for all endpoints at middleware level
- Enforce server-side task status transitions and “who can advance” rule
- Implement task list caching with Redis and document TTL/invalidation
- Add OpenAPI/Swagger spec or Postman collection
- Add at least 2 tests for critical flows (auth + refresh rotation, RBAC)
