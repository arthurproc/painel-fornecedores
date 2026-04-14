<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# ConectaFornece

B2B platform that connects large companies in the Itabira/MG region (Vale, Usiminas, ArcelorMittal, and peers) to local suppliers of industrial services (maintenance, logistics, occupational safety, etc.).

## Current state

**UI mockup.** All data comes from `src/lib/mock-data.ts`. The project has no:

- Backend, API routes, or database
- Real authentication (`/login` and `/registro` are screens without logic)
- Network calls, `fetch`, or persistent server actions
- Automated tests

If a task requires any of the above, **stop and align with the user first** — the project has not yet picked a backend or auth stack.

## Stack

| Layer | Tool |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Styling | Tailwind CSS v4 (theme in `src/app/globals.css` via `@theme inline`) |
| Components | shadcn/ui (the `shadcn` package), installed under `src/components/ui/` |
| Icons | lucide-react |
| Fonts | DM Sans + JetBrains Mono (via `next/font/google`) |
| Package manager | npm (respect `package-lock.json`; do not introduce pnpm/yarn) |
| TypeScript | 5.x, `strict` |
| Lint | ESLint 9 + `eslint-config-next` |

## Commands

```bash
npm run dev     # Next dev server
npm run build   # production build
npm run start   # serve the build
npm run lint    # ESLint
```

To add a shadcn component: `npx shadcn@latest add <name>`.

## Route layout

```
src/app/
├── page.tsx                         # public landing
├── login/                           # login screen (mock)
├── registro/                        # registration (mock)
├── empresa/                         # contracting-company area
│   ├── dashboard/
│   ├── novo-projeto/
│   └── projeto/[id]/
└── fornecedor/                      # supplier area
    ├── dashboard/
    ├── projetos/                    # open-projects search
    ├── projeto/[id]/
    └── perfil/
```

Internal pages (empresa/fornecedor) are wrapped by `<AppShell tipo="empresa|fornecedor" titulo="..." />` (`src/components/layout/app-shell.tsx`), which mounts the sidebar and topbar.

## Project layers

| Path | Role |
| --- | --- |
| `src/app/` | Routes and pages |
| `src/components/ui/` | shadcn primitives — do not edit by hand; reinstall to upgrade |
| `src/components/layout/` | AppShell, Sidebar, Topbar |
| `src/lib/mock-data.ts` | Single source of mocked data — types `Projeto`, `Fornecedor`, `Proposta`, plus `categorias`, `regioes`, `statusLabels`, `statusColors` |
| `src/lib/utils.ts` | shadcn `cn()` helper |
| `src/app/globals.css` | Design tokens (OKLCH) + `@theme inline` |

## Conventions

### Language rules

- **Application UI strings are written in Brazilian Portuguese following full standard grammar** (proper diacritics, punctuation, agreement). Examples: `região`, `serviço`, `manutenção`, `três`, `conexão`, `negócios`.
- **Agent-facing content (this file, skills under `.claude/`, code comments, commit messages) is written in English.**
- **Source-code identifiers** (component, hook, type, and prop names) stay in English.
- **Mock-data object keys** remain accent-free (`titulo`, `descricao`, `regiao`) — historical and internally consistent. The **values** of those keys carry full diacritics.
- Route folder names use unaccented Portuguese (`empresa`, `fornecedor`, `novo-projeto`, `registro`).

### Data and dates

- Displayed dates use `DD/MM/YYYY`.
- Monetary values use Brazilian formatting: `R$ X.XXX,XX`.
- `orcamento` is usually a range string (`"R$ 250.000 - R$ 400.000"`), not a number.
- The mock timeline is anchored in **2026**. New mock records should respect that horizon.

### Two roles

Every new feature must explicitly decide whether it targets **empresa** (contractor), **fornecedor** (supplier), or both. "Both" usually means two mirrored pages with distinct views of the same resource. The sidebar links differ per role — see `src/components/layout/sidebar.tsx`.

## Visual identity

Covered by the `visual-identity` skill (`.claude/skills/visual-identity/SKILL.md`), auto-loaded during frontend work. It encodes OKLCH tokens, typography, radii, spacing, grids, Button/Card/Badge/Input variants, lucide icon sizing, and a quality checklist. Do not duplicate that content here.

## Decisions to raise before implementing

- Adding a backend, database, real auth, or API routes
- Switching package manager, bundler, or framework
- Introducing a second UI library alongside shadcn
- Enabling dark mode (requires a `:root` dark block in `globals.css` plus a toggle decision)
- Changing the `mock-data.ts` schema (existing pages depend on current fields)
- Adding mobile responsiveness (the mockup is desktop-first for now)
