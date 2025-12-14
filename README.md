# Full-Stack Application Template

A production-ready full-stack application template designed to help developers quickly bootstrap modern web applications. This template provides a complete setup with **Next.js** frontend, **NestJS** backend, and **PostgreSQL** database integration, all pre-configured with authentication and example CRUD operations.

## Example Application: Tutoring Company Admin

This template includes a fully functional tutoring company admin dashboard as a reference implementation. The example demonstrates:

- User authentication (email/password + Google OAuth)
- Payment tracking and management (example)
- Student account management (example)
- Protected routes and role-based access

> **Note:** The example code is meant to showcase the template's capabilities. Replace or extend it with your own business logic.

---

## Technology Stack

### Frontend

| Technology                   | Version | Purpose                                                                                                                                                |
| ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Next.js**                  | 16.0.7  | React framework with App Router and Server Components                                                                                                  |
| **React**                    | 19.2.3  | UI library (Patched for https://semgrep.dev/blog/2025/new-react2shell-offspring-patched-react-server-components-dos-and-source-code-exposure/ exploit) |
| **TypeScript**               | 5.x     | Type-safe JavaScript                                                                                                                                   |
| **Tailwind CSS**             | 4.0     | Utility-first CSS framework                                                                                                                            |
| **Radix UI**                 | Latest  | Accessible, unstyled UI primitives                                                                                                                     |
| **Lucide React**             | 0.556.0 | Icon library                                                                                                                                           |
| **better-auth**              | 1.4.5   | Authentication client                                                                                                                                  |
| **Class Variance Authority** | 0.7.1   | Component variant management                                                                                                                           |
| **clsx**                     | 2.1.1   | Conditional class names                                                                                                                                |
| **tailwind-merge**           | 3.4.0   | Merge Tailwind classes                                                                                                                                 |
| **PostHog**                  | Latest  | Product analytics and event tracking                                                                                                                   |

#### Frontend Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Sign-in page
│   │   └── dashboard/          # Protected dashboard routes
│   │       ├── layout.tsx      # Dashboard layout with sidebar
│   │       ├── payment-sheet/  # Payment management
│   │       ├── students/       # Student management
│   │       ├── revenue/        # Revenue tracking
│   │       ├── recap/          # Session recaps
│   │       └── sponsorships/   # Sponsorship management
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   └── sidebar.tsx     # Navigation sidebar
│   │   └── ui/                 # Reusable UI components (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── separator.tsx
│   │       └── table.tsx
│   ├── lib/
│   │   ├── auth-client.ts      # better-auth client configuration
│   │   └── utils.ts            # Utility functions (cn helper)
│   ├── instrumentation-client.ts # PostHog analytics initialization
│   └── middleware.ts           # Route protection middleware
├── components.json             # shadcn/ui configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json
```

### Backend

| Technology                       | Version | Purpose                       |
| -------------------------------- | ------- | ----------------------------- |
| **NestJS**                       | 11.0.1  | Progressive Node.js framework |
| **TypeScript**                   | 5.7.3   | Type-safe JavaScript          |
| **Prisma**                       | 7.1.0   | Next-generation ORM           |
| **PostgreSQL**                   | -       | Relational database           |
| **better-auth**                  | 1.4.5   | Authentication library        |
| **@thallesp/nestjs-better-auth** | 2.2.0   | NestJS auth integration       |
| **RxJS**                         | 7.8.1   | Reactive programming          |
| **@nestjs/config**               | 4.0.2   | Environment configuration     |

#### Backend Structure

```
backend/
├── src/
│   ├── main.ts                 # Application bootstrap
│   ├── app.module.ts           # Root module
│   ├── app.controller.ts       # Health check & user profile endpoints
│   ├── app.service.ts          # Core service
│   ├── auth.ts                 # better-auth configuration
│   ├── prisma.ts               # Prisma client instance
│   ├── payments/               # Payment module
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── payments.module.ts
│   │   └── dto/
│   │       └── create-payment.dto.ts
│   └── students/               # Student module
│       ├── students.controller.ts
│       ├── students.service.ts
│       ├── students.module.ts
│       └── dto/
│           └── create-student.dto.ts
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── test/                       # E2E tests
└── package.json
```

### Database Schema

The template uses **Prisma ORM** with **PostgreSQL**. The example schema includes:

#### Authentication Tables (better-auth)

- **User** - User accounts with email, name, role
- **Session** - Active user sessions
- **Account** - OAuth provider data (Google, etc.)
- **Verification** - Email/identity verification tokens

#### Example Business Tables

- **Payment** - Payment records with date, time, amount, status
- **Student** - Student accounts with auto-generated credentials

### Development & Testing Tools

| Tool          | Version | Purpose                     |
| ------------- | ------- | --------------------------- |
| **Jest**      | 30.0.0  | Unit and E2E testing        |
| **ESLint**    | 9.18.0  | Code linting                |
| **Prettier**  | 3.4.2   | Code formatting             |
| **ts-jest**   | 29.2.5  | TypeScript Jest integration |
| **supertest** | 7.0.0   | HTTP assertions             |

---

## Authentication

This template uses **better-auth** for authentication, providing:

### Supported Authentication Methods

- **Google OAuth** - Social login with Google
- **Email/Password** - Can be enabled in configuration

### Features

- Session-based authentication with secure HTTP-only cookies
- Automatic session management
- Protected route middleware
- Role-based access control (admin, user, tutor roles)
- CSRF protection
- Secure cookie configuration

### Configuration

Authentication is configured in `backend/src/auth.ts`:

```typescript
export const auth = betterAuth({
  baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: false }, // Enable if needed
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.BACKEND_URL || 'http://localhost:3001',
  ],
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'tutor' },
    },
  },
});
```

---

## Analytics

This template includes **PostHog** for product analytics and event tracking.

### Setup

1. Create a PostHog account at [posthog.com](https://posthog.com)
2. Create a new project and copy your project API key
3. Add the environment variables to your frontend `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-project-api-key"
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

### Features

- Automatic page view tracking
- User identification (integrates with authentication)
- Custom event tracking
- Session recording (configurable in PostHog dashboard)
- Feature flags support

### Configuration

PostHog is initialized in `frontend/src/instrumentation-client.ts`. You can customize initialization options as needed.

---

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description                    |
| ------ | -------- | ------------------------------ |
| GET    | `/`      | Health check                   |
| GET    | `/me`    | Get authenticated user profile |

### Authentication (better-auth)

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| POST   | `/api/auth/sign-up/email`  | Register with email/password |
| POST   | `/api/auth/sign-in/email`  | Login with email/password    |
| GET    | `/api/auth/sign-in/social` | Initiate OAuth flow          |
| POST   | `/api/auth/sign-out`       | Sign out user                |
| GET    | `/api/auth/session`        | Get current session          |

### Example Endpoints (Payments)

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/payments`          | Create a payment        |
| GET    | `/payments`          | Get all unpaid payments |
| PATCH  | `/payments/:id`      | Update payment details  |
| PATCH  | `/payments/:id/paid` | Mark payment as paid    |

### Example Endpoints (Students)

| Method | Endpoint    | Description      |
| ------ | ----------- | ---------------- |
| POST   | `/students` | Create a student |
| GET    | `/students` | Get all students |

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- Google OAuth credentials (optional, for social login)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mindcapsule-template-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
```

Configure your `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"

# Server
PORT=3001
NODE_ENV=development
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"

# Authentication
BETTER_AUTH_SECRET="your-random-secret-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

```bash
# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Start development server
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local with required variables
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-project-api-key"
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
EOF

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

---

## Available Scripts

### Backend

```bash
npm run start:dev     # Start development server with hot reload
npm run build         # Build for production (runs migrations + Prisma generate)
npm run start:prod    # Start production server
npm run lint          # Lint and fix code
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:cov      # Run tests with coverage
npm run test:e2e      # Run end-to-end tests
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
npm run db:push       # Push schema changes (development)
```

### Frontend

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Lint code
```

---

## Customizing the Template

### 1. Update Database Schema

Edit `backend/prisma/schema.prisma` to define your data models:

```prisma
model YourModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Run migrations:

```bash
npx prisma migrate dev --name your_migration_name
```

### 2. Create New API Modules

Use NestJS CLI to generate modules:

```bash
nest generate module your-module
nest generate controller your-module
nest generate service your-module
```

### 3. Add New Frontend Pages

Create new pages in `frontend/src/app/dashboard/`:

```
dashboard/
└── your-page/
    └── page.tsx
```

### 4. Add UI Components

This template uses **shadcn/ui**. Add new components:

```bash
npx shadcn@latest add component-name
```

### 5. Update Navigation

Edit `frontend/src/components/dashboard/sidebar.tsx` to add new navigation items.

---

## Environment Variables

### Backend

| Variable               | Required | Description                          |
| ---------------------- | -------- | ------------------------------------ |
| `DATABASE_URL`         | Yes      | PostgreSQL connection string         |
| `PORT`                 | No       | Server port (default: 3001)          |
| `NODE_ENV`             | No       | Environment (development/production) |
| `BACKEND_URL`          | Yes      | Backend server URL                   |
| `FRONTEND_URL`         | Yes      | Frontend URL for CORS                |
| `BETTER_AUTH_SECRET`   | Yes      | Secret for session signing           |
| `GOOGLE_CLIENT_ID`     | No       | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET` | No       | Google OAuth client secret           |

### Frontend

| Variable                   | Required | Description                                          |
| -------------------------- | -------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`      | Yes      | Backend API URL                                      |
| `NEXT_PUBLIC_POSTHOG_KEY`  | Yes      | PostHog project API key for analytics                |
| `NEXT_PUBLIC_POSTHOG_HOST` | No       | PostHog host URL (default: https://us.i.posthog.com) |

---

## Project Structure Overview

```
mindcapsule-template-platform/
├── frontend/                   # Next.js 16 application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   └── lib/               # Utilities and configurations
│   └── package.json
├── backend/                    # NestJS application
│   ├── src/
│   │   ├── payments/          # Example module
│   │   ├── students/          # Example module
│   │   ├── auth.ts            # Authentication config
│   │   └── prisma.ts          # Database client
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
└── README.md
```

---

## Key Features

- **Modern Stack**: Next.js 16 + React 19 + NestJS 11 + Prisma 7
- **Type Safety**: Full TypeScript across frontend and backend
- **Authentication**: Pre-configured with better-auth (Google OAuth)
- **Analytics**: PostHog integration for product analytics and event tracking
- **Database Ready**: Prisma ORM with PostgreSQL support
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with modern configuration
- **Testing**: Jest setup for unit and E2E tests
- **Code Quality**: ESLint + Prettier configuration
- **Production Ready**: Build scripts and environment configuration

---

## License

MIT
