# Timeline API Server

Express + MySQL backend that powers the Timeline application.

## Setup

1. Install dependencies (inside `project/api`):
   ```bash
   npm install
   ```
2. Provide a `.env` file (required at runtime). Example:
   ```ini
   PORT=4000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=timeline_abdullah_v2
   DB_USER=root
   DB_PASSWORD=root
   # BASIC_AUTH_USER=timeline
   # BASIC_AUTH_PASS=super-secret
   # CORS_ALLOW_ORIGIN=http://localhost:5173
   ```
   > The server refuses to start if `project/api/.env` is missing. `.env.dev`/`.env.prod` are reference samples only.

## Database

- Ensure your MySQL server has databases that match `DB_NAME` in the `.env.*` files.
- Run migrations (creates tables):
  ```bash
  npm run db:migrate
  ```
- Run seeders (currently empty placeholder):
  ```bash
  npm run db:seed
  ```

## Authentication (optional)

- Define both `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` in `.env` to require HTTP Basic authentication for every request. When unset/empty, the API remains public.
- If your UI runs on another origin, keep `CORS_ALLOW_ORIGIN` as `*` (default) or set it to a specific origin (e.g., `http://localhost:5173`).

## Scripts

- `npm run dev` – start server (uses `.env`)
- `npm start` – same as above, but sets `NODE_ENV=production` before loading `.env`
- `npm run db:migrate` – apply SQL files from `migrations/`
- `npm run db:seed` – apply SQL files from `seeders/`

## API routes

- `GET /api/health` – sanity check
- `GET /api/timeline/roots` – root level timeline items
- `GET /api/timeline/items/:id` – fetch a single item and metadata
- `GET /api/timeline/items/:id/children` – fetch child items for a parent

Responses use the same shape expected by the Timeline UI services (`children` IDs and `parents` maps included).
