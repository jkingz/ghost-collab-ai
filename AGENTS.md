<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Application Building Context

Read the following files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — product definition, goals, features, and scope
2. `context/architecture-context.md` — system structure, boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography, canvas design, and component conventions
4. `context/code-standards.md` — implementation rules and conventions
5. `context/ai-workflow-rules.md` — development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps

Update `context/progress-tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.

## Documentation Maintenance

When adding a new feature specification to `context/feature-specs/`:

1. **Keep the spec concise** — implementation requirements only, no detailed integration patterns
2. **Create detailed documentation** — if the feature involves integration with external services (Supabase, Liveblocks, Trigger.dev, etc.), create or update a corresponding guide in `/docs/` with:
   - Complete code examples
   - Schema definitions and migration patterns
   - Security considerations
   - Integration workflows
3. **Update navigation files:**
   - Add the new spec to `context/feature-specs/README.md` under the appropriate section (Completed/In Progress)
   - If you created a new `/docs/` guide, add it to `docs/README.md` under the relevant category
4. **Update root `README.md`** — reflect the new feature in:
   - Core Features section if it's user-facing
   - Tech Stack section if it introduces new technology
   - Project Structure section if it adds new directories
   - Database Schema section if it adds new tables
   - API Routes section if it adds new endpoints

**Documentation structure:**
- `/context/feature-specs/*.md` — Concise "what to build" specs
- `/docs/*.md` — Detailed "how it works" integration guides
- `README.md` — High-level project overview and getting started
- `context/progress-tracker.md` — Current implementation status