# FlowBoard: The Unified Strategic & Technical Documentation

Welcome to the definitive guide for **FlowBoard** — an elite, AI-powered architectural workspace designed for strategic project orchestration. This document combines high-level product vision with granular technical specifications.

---

## 🚀 1. Strategic Positioning

FlowBoard is an **Architectural Workspace** that solves context fragmentation by synthesizing project telemetry into narrative intelligence.

- **AI Narrative Synthesis**: Automated executive summaries for boardroom-ready reporting.
- **Intelligent Tasking**: AI-driven subtask generation and priority prediction based on natural language.
- **Editorial Design System**: A "Sage Wellness" aesthetic (#FFFDF5 background) designed for architectural calmness.
- **Enterprise Grade**: Multi-tenancy, rate limiting, and audit logging built for scale.

---

## 🛠️ 2. Technology Stack

Built on a modern, bleeding-edge stack optimized for performance and type safety.

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **ORM**: [Prisma 6](https://www.prisma.io/) with PostgreSQL
- **AI Core**: [OpenRouter SDK](https://openrouter.ai/) (Arcee-Trinity & Nvidia Nemotron)
- **Payments**: [Stripe](https://stripe.com/) & [Google Pay](https://pay.google.com/)
- **Infrastructure**: [Upstash Redis](https://upstash.com/) (Throttling) & [Sentry](https://sentry.io/) (Monitoring)

---

## 🏗️ 3. Core Systems Architecture

### A. AI Orchestration (`src/services/ai/`)

FlowBoard uses a multi-layered AI approach:

- **Provider Layer**: Interfaces with OpenRouter for model diversity.
- **Service Layer**: `openai-service.ts` handles prompt versioning, JSON parsing, and tool-calling (`create_task`).
- **Orchestrator**: `ai-orchestrator.ts` manages token usage limits and model failover (FAST vs SMART).

### B. Automation Engine (`src/lib/automation-engine.ts`)

A reactive system that triggers actions based on workspace events:

- **Triggers**: `TASK_CREATED`, `TASK_UPDATED`, `STATUS_CHANGED`.
- **Logic**: Evaluates active `AutomationRule` records in the database.
- **Example**: Changing a task to `DONE` can trigger an automated "Project Milestone" comment.

### C. Security & Permission Layer

- **RBAC**: Role-Based Access Control (OWNER, ADMIN, MEMBER, GUEST).
- **Rate Limiting**: Multi-tier throttling via Upstash Redis (Network level) and API-key level validation.
- **Audit Logging**: Structured events logged via `audit-log.ts` for compliance and security monitoring.

---

## 🔌 4. API Reference Hub

### 📡 Public V1 API (`/api/v1/*`)

Requires `x-api-key` header. Used for external integrations.

| Endpoint          | Method     | Description                             |
| :---------------- | :--------- | :-------------------------------------- |
| `/v1/projects`    | `GET/POST` | Management of workspace projects.       |
| `/v1/tasks`       | `GET/POST` | Access to task telemetry and creation.  |
| `/v1/automations` | `GET`      | Visibility into active workspace rules. |

### 🧠 AI Intelligence & System APIs

| Endpoint                  | Method | Description                              |
| :------------------------ | :----- | :--------------------------------------- |
| `/api/chat`               | `POST` | Multi-modal streaming (Text + Vision).   |
| `/api/ai/subtasks`        | `POST` | Recursive task breakdown into subtasks.  |
| `/api/dashboard/overview` | `GET`  | Core telemetry (Velocity, Density).      |
| `/api/billing/checkout`   | `POST` | Stripe/Google Pay session orchestration. |

---

## 🗄️ 5. Data Architecture (Prisma)

FlowBoard uses a workspace-partitioned database schema to ensure multi-tenant isolation.

### Key Models

- **Workspace**: The root entity. Stores billing status, AI usage, and branding.
- **Project & Task**: The core organizational units. Tasks support recursive `Subtask` relations.
- **ActivityLog**: A time-series log of all significant mutations in the workspace.
- **IntegrationConnection**: Stores OAuth tokens for external service bridges.

### Performance Indexing

- `@@index([workspaceId, createdAt])`: Optimizes real-time Activity Feed performance.
- `@@index([status])`: Ensures sub-millisecond Kanban board transitions.

---

## 🎨 6. Frontend & Design System

We follow a strict **Editorial UI** philosophy.

- **Atomic Design**: Components move from stateless Primitives (`ui/`) to business-aware System components (`system/`).
- **State Orchestration**: Uses `WorkspaceContext` for global awareness and Next.js Server Components for data fetching.
- **Visual Continuity**: `framer-motion` ensures that data updates (like AI synthesis) feel smooth and professional.

---

## 📂 7. Project Organization

```text
flowboard/
├── prisma/               # Schema & Migrations
├── src/
│   ├── app/              # App Router (Pages & API)
│   ├── components/       # Primitives, System, & Dashboard UI
│   ├── lib/              # Core utilities (DB, Engine, Auth)
│   ├── services/         # Business logic & AI orchestration
│   └── types/            # Global TypeScript interfaces
```

---

## 🚀 8. Getting Started

### Installation

1.  **Clone & Install**: `npm install`
2.  **Environment**: Populate `.env` with `DATABASE_URL`, `OPENAI_API_KEY`, and `STRIPE_SECRET`.
3.  **Database**: `npx prisma db push`
4.  **Dev Server**: `npm run dev`

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis (Upstash)
- OpenRouter API Key

---

## 🎨 9. Presentation Guide: The Landing Page Flow

FlowBoard's landing page is designed as a sequence of **"Architectural Protocols"** that move a user from chaos to clarity. Use this guide to explain the design narrative during presentations.

### A. The Core Philosophy: "Architectural Productivity"

- **The Mood**: Sage Wellness (#F4F7F5 background). It avoids the aggressive "blue/dark" tech tropes, opting for a calm, editorial feel.
- **The Voice**: Strategic, High-Precision, Clinical yet Human.

### B. Section-by-Section Narrative

1.  **Protocol 01: The Entrance (Hero)**
    - **Goal**: Immediate emotional resonance.
    - **Key Phrase**: _"Master your workflow."_
    - **Visual**: Stark, professional architectural imagery with clean, bold typography. CTAs use technical verbs like _"Initialize Flow"_ to reinforce the high-end feel.

2.  **Protocol 02: The Order (Statement & Metrics)**
    - **Goal**: Establish authority and name the pain points.
    - **Message**: Work is chaotic; FlowBoard is the structure.
    - **Data**: Surfaces hard metrics like **94.2% FlowScore™** and **2,400+ world-class teams** to build trust instantly.

3.  **Protocol 03: The Functional Stack (Capabilities Grid)**
    - **Goal**: Prove technical depth.
    - **Features**: Highlights the AI Scheduler, Report Engine, and Client Portals.
    - **Interaction**: Hover effects transition grayscale images to full color, symbolizing the "clarity" FlowBoard brings to a project.

4.  **Protocol 04: The Neural Layer (AI Demo)**
    - **Goal**: Showcase the "unfair advantage."
    - **Context**: Use of terms like _"Intelligence Protocol V.04"_ and _"Nervous System."_
    - **HUD Visuals**: Displays real-time efficiency metrics (e.g., _98.4% Efficiency_) using high-tech "Head-Up Display" components.

5.  **Protocol 05: The Trust Protocol (Social Validation)**
    - **Goal**: Prove social proof via "Architectural Monoliths."
    - **Narrative**: Testimonials are framed as _"Logs,"_ and brand logos move in a high-speed technical marquee, suggesting a fast-paced, enterprise-ready ecosystem.

6.  **Protocol 06: The Final Deployment (CTA)**
    - **Goal**: High-friction removal and enterprise readiness.
    - **Details**: Explicitly mentions **SOC2 Compliance** and **SAML Ready** to clear security hurdles before a user even signs up.

---

_Unified Product Presentation Protocol | Prepared by Antigravity_
