Clerk is already installed and connected. Wire it into the Next.js app: provider, auth pages, redirects, route protection, and user menu.

## Design

Use Clerk’s `dark` theme from `@clerk/ui/themes` as the base, then map Clerk appearance variables to the application tokens from `globals.css`.

Override Clerk appearance variables using the app’s existing CSS variables. Do not hardcode colors.

### Sign-in and sign-up pages:

- large screens: explicit 50/50 split layout using a two-column CSS grid
- left: Ghost Collab AI product information panel with brand mark, concise value proposition, and three product capabilities
- right: centered Clerk form on the dark application background
- small screens: single-column form layout with a compact Ghost Collab AI mark above the form
- no gradients
- no oversized hero sections
- no feature cards
- no scroll-heavy layouts

Keep the layout minimal and professional.

### Clerk appearance decisions

- `colorPrimary` and `colorWarning` map to the app's `--primary` Clerk warning-orange token.
- Backgrounds, inputs, borders, foreground text, muted text, danger states, focus rings, and typography inherit the app CSS variables.
- Clerk cards remain flat and border-defined rather than using an additional shadow or light surface.
- Social buttons use the app secondary surface and border tokens.
- The default Clerk user menu behavior remains intact; only its shared appearance foundation is themed.

## Implementation

Wrap the root layout with `ClerkProvider` using Clerk’s `dark` theme.

Create sign-in and sign-up pages using Clerk components.

Use `proxy.ts` at the project root, not `middleware.ts`.

Define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

Update `/`:

- authenticated users redirect to `/editor`
- unauthenticated users redirect to `/sign-in`

Add Clerk’s built-in `UserButton` to the editor navbar right section for profile settings and logout.

Keep Clerk’s default user menu and profile flows intact. Do not rebuild or heavily customize Clerk internals.

Use existing Clerk env vars. Do not rename or invent new ones.

## Dependencies

install: @clerk/ui.

## Check When Done

- `proxy.ts` exists at the root
- all routes are protected except public auth paths
- auth pages use CSS variables with no hardcoded colors
- `ClerkProvider` wraps the root layout
- `npm run build` passes
