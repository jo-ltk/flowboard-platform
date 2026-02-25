---
name: flowboard
description: Elite AI-powered project management platform built with Next.js 16, TypeScript, Tailwind CSS 4, Prisma 6 (PostgreSQL), and OpenRouter AI. Features multi-tenant workspaces, Kanban task pipelines, AI narrative synthesis, subtask generation, real-time activity feeds, billing via Stripe/Google Pay, and an "Editorial / Sage Wellness" design language.
---

# FlowBoard Platform Skill

## Project Overview

**FlowBoard** is an elite, AI-powered architectural workspace designed for calm and focused project management. It synthesises complex project telemetry into strategic narrative intelligence, helping leadership maintain clarity and momentum.

**Repository root:** `d:/guha/videCode/flowboard`  
**Dev server:** `npm run dev` → `http://localhost:3000`  
**GitHub repo:** `joelthomasitday/flowboard-platform`

---

## Tech Stack

| Layer                   | Technology                                       |
| ----------------------- | ------------------------------------------------ |
| Framework               | Next.js 16 (App Router)                          |
| Language                | TypeScript (Strict Mode)                         |
| Styling                 | Tailwind CSS 4 + Framer Motion                   |
| ORM / DB                | Prisma 6 + PostgreSQL                            |
| AI Core                 | OpenRouter SDK (Arcee-Trinity & Nvidia Nemotron) |
| Payments                | Stripe & Google Pay                              |
| Caching / Rate-limiting | Upstash Redis                                    |
| Monitoring              | Sentry                                           |
| Auth                    | NextAuth (session-based)                         |

---

## When to Use This Skill

Activate this skill whenever you are:

- Adding or modifying **any file** inside `d:/guha/videCode/flowboard/`
- Creating new **API routes**, **React components**, **Prisma models**, or **AI service methods** for FlowBoard
- Debugging TypeScript or build errors in this project
- Refactoring or extending dashboard pages (Tasks, Projects, Team, Billing, Settings, Developers)
- Updating styles — always follow the **Sage Wellness** design system
- Writing or updating tests, scripts, or documentation for FlowBoard

---

## Project Structure

```
flowboard/
├── prisma/
│   └── schema.prisma          # Prisma schema — source of truth for all models
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API route handlers
│   │   │   ├── v1/            # Public API (requires x-api-key header)
│   │   │   ├── ai/            # AI endpoints (subtasks, chat)
│   │   │   ├── dashboard/     # Internal dashboard data APIs
│   │   │   └── billing/       # Stripe / Google Pay webhook & checkout
│   │   └── dashboard/         # Dashboard pages (tasks, projects, team, etc.)
│   ├── components/
│   │   ├── ui/                # Primitive, stateless components (buttons, badges, cards)
│   │   ├── system/            # Business-aware components (modals, panels)
│   │   └── dashboard/         # Page-level dashboard UI (TaskManagement, ProjectView, etc.)
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── automation-engine.ts
│   │   ├── audit-log.ts
│   │   └── rate-limit.ts
│   ├── services/
│   │   └── ai/
│   │       ├── openai-service.ts   # Prompt versioning, JSON parsing, tool-calling
│   │       └── ai-orchestrator.ts  # Token budget management, FAST vs SMART model routing
│   ├── context/
│   │   └── WorkspaceContext.tsx    # Global workspace state (active workspace, user, etc.)
│   └── types/                 # Shared TypeScript interfaces
├── scripts/                   # Utility and migration scripts
├── DOCUMENTATION.md           # Full product & technical docs
├── ARCHITECTURE.md            # System architecture deep-dive
└── SKILL.md                   # This file
```

---

## Instructions

### 1. Always Follow the Editorial / Sage Wellness Design System

- **Background palette:** `#FFFDF5` (warm off-white), sage greens, muted earth tones
- **Typography:** Clean, editorial — prefer `font-light` or `font-normal` with generous spacing
- **Components:** Minimal borders, soft shadows (`shadow-sm`), rounded corners (`rounded-xl`)
- **Motion:** Use `framer-motion` for all data-driven state transitions; keep animations under 300ms
- **NO** aggressive dark blues, neons, or heavy drop shadows — the aesthetic is architectural calm
- **Always use Tailwind CSS 4 utility classes** — do not write raw inline styles unless absolutely necessary

### 2. Component Architecture (Atomic Design)

Follow the **Atomic Design** hierarchy strictly:

1. **`ui/`** — Dumb primitives: `Button`, `Badge`, `Card`, `Input`, `Modal`, `Avatar`, etc. No business logic.
2. **`system/`** — Smart wrappers: connect primitives to context, handle loading/error states, RBAC-gated rendering.
3. **`dashboard/`** — Full page-level orchestrations: `TaskManagement.tsx`, `ProjectView.tsx`, `TeamManagement.tsx`, etc.

**Rule:** Never import `dashboard/` components into `ui/` or `system/`. Data always flows down.

### 3. API Route Conventions

- All internal APIs live under `src/app/api/dashboard/` or `src/app/api/ai/`
- All routes must:
  - Validate the user session with `getServerSession()`
  - Return structured JSON with consistent shape: `{ data, error, meta }`
  - Use `try/catch` with proper `NextResponse.json({ error: ... }, { status: 5xx/4xx })`
- Public API routes (`/api/v1/*`) require the `x-api-key` header — always validate it first

### 4. Database (Prisma)

- **Never** edit `prisma/schema.prisma` and forget to run `npx prisma generate` + `npx prisma db push`
- The Prisma client singleton lives at `src/lib/db.ts` — import it as `import { db } from '@/lib/db'`
- All models are workspace-partitioned — always filter by `workspaceId` in every query
- Use compound indexes `@@index([workspaceId, createdAt])` for time-series queries (e.g., Activity Feed)
- After adding or modifying a model, regenerate the client **before** writing any TypeScript that uses it

### 5. AI Service Integration

- **Model routing:** Use `FAST` (Arcee-Trinity) for low-latency tasks; `SMART` (Nvidia Nemotron) for complex synthesis
- **AI endpoints:**
  - `/api/chat` — multi-modal streaming (text + vision)
  - `/api/ai/subtasks` — recursive task breakdown (POST with `{ taskId, title, description }`)
- **Prompt engineering:** Prompts live in `openai-service.ts` — keep them versioned with comments
- **Token budget:** The `ai-orchestrator.ts` manages limits per workspace — always respect `remainingTokens`

### 6. Multi-Tenancy & Security

- Every DB query and API handler **must** scope data by `workspaceId`
- RBAC roles: `OWNER → ADMIN → MEMBER → GUEST` — check role before any destructive operation
- Rate limiting is enforced via Upstash Redis — do not bypass `rateLimit()` checks in API routes
- Log significant mutations with `auditLog({ action, entityType, entityId, workspaceId })`

### 7. State Management

- **Global state:** `WorkspaceContext` — provides `activeWorkspace`, `user`, `workspaces[]`, `switchWorkspace()`
- **Never** introduce a new global store (Redux, Zustand, etc.) — use React Context + Server Components
- **Server Components** for data fetching; **Client Components** only when interactivity is needed (mark with `'use client'`)

### 8. Task & Project Domain Logic

- **Task statuses** (canonical): `NOT_STARTED`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `CANCELLED`, `SUSPENDED`
- **Pipeline order:** `Not Started → In Progress → Completed` (primary flow); `On Hold` and `Suspended` are lateral
- **Subtasks** are children of `Task` — show progress as `X of Y completed`
- The **Automation Engine** fires on `TASK_CREATED`, `TASK_UPDATED`, `STATUS_CHANGED` — do not break these event names

### 9. Billing

- Stripe session creation lives in `/api/billing/checkout`
- Google Pay is a parallel payment method — both share the same webhook handler
- Workspace billing status is stored on the `Workspace` model — always check `workspace.billingStatus` before unlocking premium features

### 10. TypeScript Rules

- Strict mode is **on** — never use `any` unless wrapping an untyped third-party response
- Shared interfaces live in `src/types/` — reuse before creating new ones
- Always handle `null` / `undefined` — the most common bug is forgetting that `activeWorkspace` can be null before the context loads
- After schema changes, run `tsc --noEmit` to catch type regressions before pushing

---

## Common Workflows

### Adding a New Dashboard Page

1. Create `src/app/dashboard/<page>/page.tsx`
2. Create matching component in `src/components/dashboard/<Page>.tsx`
3. Add the route to the sidebar navigation in the layout
4. Create an API route at `src/app/api/dashboard/<page>/route.ts`
5. Gate the page with session + workspace check

### Adding a New AI Feature

1. Add the prompt and service method to `src/services/ai/openai-service.ts`
2. Create an API route at `src/app/api/ai/<feature>/route.ts`
3. Wire the UI trigger (button, auto-trigger) in the relevant dashboard component
4. Log token usage to the `Workspace` model

### Running the Project

```bash
# Install
npm install

# DB sync (after schema changes)
npx prisma generate
npx prisma db push

# Dev
npm run dev

# Type-check
npx tsc --noEmit
```

### Environment Variables Required

```
DATABASE_URL=
OPENAI_API_KEY=        # OpenRouter key
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
SENTRY_DSN=
```

---

## Key Design Decisions & Gotchas

- `activeWorkspace` from `WorkspaceContext` **can be null** during initial load — always guard: `if (!activeWorkspace) return`
- Framer Motion animations should use `layout` prop on list items to prevent janky reorders
- The Kanban board uses CSS Grid, NOT Flexbox — keep column widths consistent
- Task cards have `overflow-hidden` intentionally — do not add scrollbars to individual cards
- The `/dashboard/tasks` "Pipeline" view and the `/dashboard/projects` "Project Board" view share the same task data but have different column groupings — keep their status label maps in sync
- The Activity Feed component does **not** use card-within-card styling — it renders directly inside its parent container

---

_Skill maintained for the FlowBoard platform | joelthomasitday/flowboard-platform_
