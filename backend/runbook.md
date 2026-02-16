1. Set up PostgreSQL database:
   createdb homework_helpers_admin
2. Update environment variables in .env files:

- BETTER_AUTH_SECRET (generate with openssl rand -base64 32)
- GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Cloud Console

3. Run database migrations (from frontend folder):
   npm run db:migrate
4. Start the apps:

# Backend (port 3001)

cd backend && npm run start:dev

# Frontend (port 3000)

cd frontend && npm run dev 5. Visit http://localhost:3000/sign-in

===

Prisma Configuration

Schema (prisma/schema.prisma) - includes Better Auth tables:

- User - user accounts
- Session - auth sessions
- Account - OAuth provider accounts (Google, etc.)
- Verification - email verification tokens

Key files:
frontend/
├── prisma/
│ └── schema.prisma
├── prisma.config.ts # Prisma 7 config with DATABASE_URL
└── src/
├── generated/prisma/ # Generated Prisma client
└── lib/
├── prisma.ts # Prisma client with PG adapter
└── auth.ts # Better Auth with Prisma adapter

backend/
├── prisma/
│ └── schema.prisma
├── prisma.config.ts
├── generated/prisma/
└── src/
├── prisma.ts
└── auth.ts

Commands

# Generate Prisma client

npm run db:generate

# Run migrations (creates tables)

npm run db:migrate

# Push schema without migration (dev)

npm run db:push

To Get Started

1. Create the database:
   createdb homework_helpers_admin
2. Run migrations (from either frontend or backend):
   npm run db:migrate
3. Start the apps:

# Backend (port 3001)

cd backend && npm run start:dev

# Frontend (port 3000)

cd frontend && npm run dev
