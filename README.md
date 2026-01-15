# Server Watcher

## Docker Setup

- Backend container build: `docker build -t server-watcher-back:local back`
- Run with compose: `docker-compose up -d`
- Uses local volume for persistent SQLite DB: `./database -> /app/database`
- Configure env via `.env` (copy from `.env.example`).

## Branching Strategy

- Branches:
  - `main`: production-ready
  - `dev`: integration branch
  - `feature/*`: one feature per branch
- Rules:
  - Use PRs from `feature/*` → `dev`, then `dev` → `main`
  - Conventional commits (feat, fix, ci, docs)
  - Keep PRs small, with passing CI (lint, tests, build)
