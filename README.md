# Ghost Collab AI

A real-time collaborative system design workspace where teams describe systems in plain English, AI generates architecture diagrams, and collaborators refine designs into technical specifications.

## What is Ghost Collab AI?

Ghost Collab AI transforms system architecture design from static documents into collaborative, AI-assisted workflows. Users describe a system, an AI agent maps it onto a shared canvas, teams refine the architecture together in real-time, and the app generates production-ready technical specifications from the final design.

## Core Features

### 🎨 Real-time Collaborative Canvas
- Shared workspace powered by Liveblocks and React Flow
- Live cursors and presence indicators
- Simultaneous editing by multiple collaborators
- Visual system architecture with nodes and edges

### 🤖 AI-Powered Architecture Generation
- Generate system designs from natural language prompts
- AI creates nodes and edges directly in the shared canvas
- Extend existing designs with additional components
- Background processing for complex architectures

### 📚 Starter System Design Templates
- Curated library of prebuilt architecture patterns
- Common patterns: monolith, microservices, event-driven, serverless
- Import templates at any point during editing
- Accelerate design with proven architectural patterns

### 📝 Technical Specification Generation
- Convert canvas graphs into Markdown technical specs
- Persistent storage and versioning
- Download specifications for documentation
- AI-powered spec generation from visual designs

### 👥 Project Management
- Multi-project workspace
- Project ownership and collaborator access
- Secure authentication via Clerk
- Team-based collaboration

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 + TypeScript | Full-stack application |
| UI | Tailwind + shadcn/ui | Component library and styling |
| Auth | Clerk | Authentication and session management |
| Database | Supabase Postgres | Project metadata and persistence |
| Canvas | Liveblocks + React Flow | Real-time collaboration |
| Background Tasks | Trigger.dev | Durable AI workflows |
| Storage | Vercel Blob | Canvas snapshots and specs |

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- A Clerk account for authentication
- A Supabase project for persistence
- A Liveblocks account for real-time collaboration

### Environment Setup

1. Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

2. Configure Clerk as a Supabase Third-Party Auth provider
3. Apply database migrations:

```bash
supabase migration up
```

Or run the migration through the Supabase SQL editor:
- `supabase/migrations/20260912222527_project_persistence.sql`

4. Verify Clerk session tokens include the `role: authenticated` claim

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## User Flow

1. **Sign in** — Authenticate with Clerk
2. **Create or select a project** — Manage multiple architecture projects
3. **Import a starter template** (optional) — Begin with proven patterns
4. **Generate architecture** — Describe your system in plain English
5. **Collaborate in real-time** — Refine the design with your team
6. **Generate specification** — Convert the canvas into a technical spec
7. **Download and share** — Export documentation for your team

## Project Structure

```
ghost-ai/
├── app/                    # Next.js app router
│   ├── api/               # API routes for projects and Liveblocks auth
│   └── (routes)/          # Page routes
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   └── editor/           # Editor-specific components
├── lib/                   # Utilities and service layers
│   ├── supabase/         # Database client and operations
│   └── projects/         # Project persistence logic
├── trigger/              # Background task definitions
├── supabase/migrations/  # Database schema
├── types/                # TypeScript definitions
├── context/              # Project documentation and specifications
│   └── feature-specs/    # Concise implementation specs
└── docs/                 # Detailed integration guides
```

## Database Schema

The application uses Supabase Postgres with RLS policies:

- **projects** — Project metadata, owner, name, and slug
- **project_members** — Collaborator memberships
- Future tables for canvas snapshots, specs, and task runs

Owners can manage their projects; collaborators have read access to projects they belong to.

## API Routes

- `GET /api/projects` — List visible projects
- `POST /api/projects` — Create a new project
- `GET /api/projects/{projectId}` — Retrieve project details
- `PATCH /api/projects/{projectId}` — Update project name
- `DELETE /api/projects/{projectId}` — Delete owned project

## Contributing

This project follows conventions documented in:
- `context/code-standards.md` — Implementation rules
- `context/ai-workflow-rules.md` — Development workflow
- `AGENTS.md` — AI agent guidelines for Next.js

## Architecture Documentation

Complete architecture and design context is available in the `/context` directory:
- `project-overview.md` — Goals, features, and scope
- `architecture-context.md` — Stack, boundaries, and storage model
- `ui-context.md` — Design system and component conventions
- `progress-tracker.md` — Current status and next steps
- `feature-specs/` — Concise implementation specifications

Detailed integration guides are in `/docs`:
- `supabase-integration.md` — Database setup, RLS, Clerk integration, and future extensions

## License

[Add your license here]
