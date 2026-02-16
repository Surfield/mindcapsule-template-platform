# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Homework Helpers Admin - a monorepo with a Next.js frontend and NestJS backend for managing tutoring students and payments.

```
/admin/
├── frontend/    # Next.js 16 + React 19 (port 3000)
└── backend/     # NestJS 11 + Prisma 7 (port 3001)
```

## Commands

### Frontend
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

### Backend
```bash
cd backend
npm run start:dev    # Dev server with watch
npm run build        # Prisma generate + NestJS compile
npm run test         # Jest unit tests
npm run test:e2e     # End-to-end tests
npm run db:migrate   # Run migrations
npm run db:generate  # Generate Prisma client
```

**Important**: For schema changes, always use `npm run db:migrate && npm run db:generate`. Never use `npx prisma db push`.

## Database Commands - NEVER RUN

**CRITICAL**: Never execute any database commands directly. This includes:
- `npm run db:migrate`
- `npm run db:generate`
- `npx prisma migrate`
- `npx prisma db push`
- Any other Prisma CLI commands

Instead, when database changes are needed:
1. Make the schema changes to `backend/prisma/schema.prisma`
2. Tell the user what commands to run and let them execute manually
3. Wait for confirmation before proceeding

This allows the user to review all database changes before they are applied.

## Architecture

### API Communication
Frontend proxies all API calls through Next.js rewrites to avoid CORS/cookie issues:
- `/api/auth/*` → Backend `/api/auth/*` (auth routes)
- `/api/*` → Backend `/*` (all other routes)

Client code should use relative paths like `/api/payments` instead of direct backend URLs.

### Authentication
- **Library**: Better Auth with Google OAuth (email/password disabled)
- **Backend**: Global `AuthGuard` protects all routes, use `@Session()` decorator for user session
- **Frontend**: Middleware in `src/middleware.ts` protects `/dashboard/*` routes
- **Cookies**: HTTP-only session cookies (`better-auth.session_token`)

### Database
- **ORM**: Prisma with PostgreSQL
- **Schema**: `backend/prisma/schema.prisma`
- **Generated client**: `backend/generated/prisma` (CommonJS)

**Models**: User, Session, Account, Verification (auth), Payment, Student (business)

### Key Files
- `backend/src/auth.ts` - Better Auth configuration
- `backend/src/app.module.ts` - NestJS modules and global guard
- `frontend/next.config.ts` - API proxy rewrites
- `frontend/src/middleware.ts` - Route protection
- `frontend/src/lib/auth-client.ts` - Frontend auth client

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection
- `BETTER_AUTH_SECRET` - Session encryption
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth
- `FRONTEND_URL` - For CORS and callbacks

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend URL (default: http://localhost:3001)
