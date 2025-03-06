# NFT Collection Creator Development Guide

## Commands
- Dev: `pnpm dev` (uses turbopack)
- Build: `pnpm build`
- Start: `pnpm start`
- Lint: `pnpm lint`

## Code Style
- **TypeScript**: Strict mode, explicit type annotations for functions
- **Components**: React functional components with "use client" directive where needed
- **Imports**: Group React/Next, then external libraries, then internal imports
- **Path aliases**: Use @/ imports (e.g., @/components, @/lib/utils)
- **Naming**: PascalCase for components/types, camelCase for variables/functions
- **State**: Zustand for global state, React Hook Form for form state
- **Validation**: Zod schemas for type-safe form validation
- **Styling**: Tailwind CSS with shadcn/ui components, use `cn()` utility
- **Error handling**: Form validation with explicit error messages
- **Formatting**: Double quotes, semicolons, 2-space indentation
- **File structure**: Components in src/components, state in src/store, utils in src/lib