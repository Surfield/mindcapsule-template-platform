# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack web application template (Mindcapsule Template Platform) with a Next.js frontend and NestJS backend. The example implementation is a tutoring company admin dashboard.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI
- **Backend:** NestJS 11, TypeScript, Prisma 7.1, PostgreSQL
- **Auth:** better-auth (Google OAuth + Email/Password)
- **Analytics:** PostHog

## Project Structure

```
├── frontend/                 # Next.js application
│   ├── src/app/             # App Router pages
│   ├── src/components/      # React components (ui/ for shadcn)
│   ├── src/lib/             # Utilities and auth client
│   └── src/middleware.ts    # Route protection
│
├── backend/                  # NestJS application
│   ├── src/                 # Application modules
│   │   ├── auth.ts          # better-auth configuration
│   │   ├── prisma.ts        # Prisma client instance
│   │   ├── payments/        # Example module
│   │   └── students/        # Example module
│   └── prisma/
│       └── schema.prisma    # Database schema
```

## Common Commands

### Frontend (run from `/frontend`)
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run lint         # Run ESLint
```

### Backend (run from `/backend`)
```bash
npm run start:dev    # Start development server with hot reload (port 3001)
npm run build        # Production build
npm run start:prod   # Start production server
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

### Database (run from `/backend`)
```bash
npx prisma migrate dev      # Run migrations in development
npx prisma migrate deploy   # Run migrations in production
npx prisma generate         # Regenerate Prisma client
npx prisma studio           # Open Prisma Studio GUI
npx prisma db push          # Push schema changes without migration
```

## Architecture Guidelines

### Adding a New Backend Module
1. Create module directory in `backend/src/<module-name>/`
2. Create files: `<module>.module.ts`, `<module>.controller.ts`, `<module>.service.ts`
3. Create DTOs in `dto/` subdirectory
4. Register module in `app.module.ts`
5. Add Prisma model in `prisma/schema.prisma` if needed

### Adding a New Frontend Page
1. Create page in `frontend/src/app/<route>/page.tsx`
2. Use existing components from `src/components/ui/`
3. Protected routes go under `src/app/dashboard/`

### Authentication
- Backend auth config: `backend/src/auth.ts`
- Frontend auth client: `frontend/src/lib/auth-client.ts`
- Route protection: `frontend/src/middleware.ts`
- Auth endpoints are handled by better-auth at `/api/auth/*`

### Database Changes
1. Modify `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <migration-name>`
3. Prisma client is auto-regenerated

## Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001)
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL

## Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use named exports for components
- Use Tailwind CSS for styling (no inline styles)
- DTOs should use class-validator decorators in backend
