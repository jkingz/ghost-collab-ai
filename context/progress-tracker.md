# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete (04-project-dialogs)

## Current Goal

- Ready for next feature implementation (e.g. database schema / persistence or canvas)

## Completed

- `01-design-system.md`:
  - Installed and configured `shadcn/ui` with Tailwind CSS v4
  - Installed `lucide-react`
  - Added UI primitive components: `Button`, `Card`, `Dialog`, `Input`, `Tabs`, `Textarea`, `ScrollArea`
  - Created `lib/utils.ts` with reusable `cn()` helper
  - Configured dark-only styling in `globals.css` and `app/layout.tsx`
  - Verified component imports, build pass, and styling consistency

- `02-editor.md`:
  - Created `components/editor/editor-navbar.tsx` with sidebar toggle
  - Created `components/editor/project-sidebar.tsx` with tabs and empty states
  - Sidebar floats above content with backdrop overlay
  - Uses `PanelLeftOpen`/`PanelLeftClose` icons for toggle
  - Tabs show "My Projects" and "Shared" with placeholder states
  - "New Project" button with `Plus` icon at bottom
  - Verified TypeScript compilation and ESLint pass

- `03-auth.md`:
  - Installed `@clerk/themes` package
  - Wrapped root layout with `ClerkProvider` using `dark` theme from `@clerk/ui/themes`
  - Created `proxy.ts` at project root with `clerkMiddleware` for route protection
  - Public routes: `/sign-in(.*)` and `/sign-up(.*)`
  - All other routes protected by default
  - Created sign-in page at `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
  - Created sign-up page at `app/(auth)/sign-up/[[...sign-up]]/page.tsx`
  - Both auth pages use two-panel layout: left panel with logo and feature list (desktop), right panel with Clerk form
  - Updated home page (`app/page.tsx`) to redirect authenticated users to `/editor` and unauthenticated users to `/sign-in`
  - Created `/editor` page placeholder
  - Added `UserButton` component to editor navbar right section
  - Verified `npm run build` passes

- `04-project-dialogs.md`:
  - Installed `dropdown-menu` primitive via shadcn CLI
  - Created `hooks/use-project-dialogs.tsx` hook managing dialog state, form state, slug generation, and loading state
  - Created `components/editor/project-dialogs.tsx` with `CreateProjectDialog` (live slug preview), `RenameProjectDialog` (auto-focus, Enter to submit), and `DeleteProjectDialog` (destructive styling)
  - Created `components/editor/editor-home.tsx` with centered minimal layout, heading, description, and "New Project" button (no cards)
  - Updated `components/editor/project-sidebar.tsx` with mock owned and shared projects, dropdown actions (rename/delete) visible only on owned projects, and mobile backdrop scrim
  - Created `components/editor/project-dialog-context.tsx` and structured `app/(app)` layout to wrap editor views with dialog provider and layout chrome
  - Wired editor home and sidebar actions to open corresponding dialogs
  - Verified `npm run build` and `npm run lint` pass without errors

## In Progress

- None

## Open Questions

- None

## Architecture Decisions

- Configured global dark theme as the default to align with `context/ui-context.md` dark-only workspace design language.
- Using `proxy.ts` instead of `middleware.ts` as specified in the auth spec.
- Clerk auth uses CSS variables through the `dark` theme from `@clerk/ui/themes`.
- Moved editor pages into `app/(app)` route group with `AppLayout` and `ProjectDialogProvider` so auth routes are clean and editor routes share dialog context and layout chrome.

## Session Notes

- All design system components in `components/ui/*` installed and verified.
- Next.js production build (`npm run build`) and linting (`npm run lint`) passing cleanly.

## Open Questions

- None

## Architecture Decisions

- Configured global dark theme as the default to align with `context/ui-context.md` dark-only workspace design language.
- Using `proxy.ts` instead of `middleware.ts` as specified in the auth spec.
- Clerk auth uses CSS variables through the `dark` theme from `@clerk/ui/themes`.

## Session Notes

- All design system components in `components/ui/*` installed and verified without modifications.
- Next.js production build (`npm run build`) passing cleanly.
- Clerk environment variables already configured in `.env.local`.
