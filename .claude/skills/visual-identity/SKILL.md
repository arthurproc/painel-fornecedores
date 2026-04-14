---
name: visual-identity
description: Enforces ConectaFornece visual identity — OKLCH design tokens, DM Sans/JetBrains Mono typography, shadcn/ui component conventions, lucide-react icon sizing, Tailwind v4 layout and spacing patterns. Use when editing files under src/app/**, src/components/**, or src/app/globals.css; creating pages or UI components; styling with Tailwind classes; choosing colors, fonts, radii, icons, or Button/Card/Badge/Input/Dialog variants.
---

## Prerequisites

- Stack: Next.js 16, React 19, Tailwind CSS v4, shadcn/ui (installed via the `shadcn` package).
- Light mode is the only supported mode. Gate `dark:` utilities behind a `:root` dark block in `src/app/globals.css` (add the block first, then author `dark:` classes).
- Interface language is pt-BR with full diacritics (e.g., `região`, `serviços`, `três`, `manutenção`). Component and hook names stay in English.
- Two app areas exist: `/empresa/*` and `/fornecedor/*`, plus landing, `/login`, `/registro`.

## Design Tokens (globals.css, OKLCH)

Reference tokens via Tailwind utility classes (`bg-primary`, `text-muted-foreground`, `border-sidebar-border`). For any color usage, pick from the table below.

| Token | Value | Usage |
| --- | --- | --- |
| `--primary` | `oklch(0.45 0.18 250)` deep blue | CTAs, highlight icons, indicators, sidebar-primary |
| `--background` | `oklch(0.98 0.005 230)` cool off-white | Page background |
| `--foreground` | `oklch(0.15 0.02 250)` near-black blue | Body text |
| `--sidebar` | `oklch(0.22 0.05 250)` dark panel | Sidebar (intentionally dark) |
| `--sidebar-foreground` | light | Sidebar text and icons |
| `--chart-1`..`--chart-5` | 5 preset hues | Data visualizations |
| `--destructive` | `oklch(0.577 0.245 27.325)` red | Delete and error states only |

**Hard rules**:

- Use `bg-card` and `border-border` as the only surface classes (reject `bg-white` and `bg-gray-*` in review).
- Use `text-primary` or `bg-primary/10` as the only accent-blue classes (reject hex and inline `oklch(...)` in JSX).
- Use `--chart-*` tokens as the only chart color source (reject hex literals in chart components).
- Reserve `bg-destructive text-destructive-foreground` for delete and error flows.

**Escalation**: If a needed color has no matching token, stop and add the token to `src/app/globals.css` instead of inlining a value.

## Typography

Fonts are loaded in `src/app/layout.tsx` via `next/font/google`:

- Sans: **DM Sans** (`--font-sans`) — default for all UI.
- Mono: **JetBrains Mono** (`--font-mono`) — code, IDs, numeric tables.

Hierarchy (apply exactly these classes):

| Role | Classes |
| --- | --- |
| Hero h1 | `text-5xl font-bold tracking-tight leading-tight` |
| Section h2 | `text-3xl font-bold` |
| Card h3 | `text-xl font-semibold` (or `text-2xl font-bold` on CTA cards) |
| Topbar title | `text-lg font-semibold` |
| Body paragraph | base size with `leading-relaxed` |
| Muted label | `text-sm text-muted-foreground` or `text-xs` |

Use weights `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700). Cap font weights at 700 and keep all type upright (use `not-italic` or omit italic utilities entirely).

## Radius and Borders

Base: `--radius: 0.625rem` (10px). Apply radius per surface type:

| Surface | Class |
| --- | --- |
| Buttons, inputs | `rounded-lg` |
| Cards | `rounded-xl` |
| Small icon container (7x7, 9x9) | `rounded-lg` |
| Highlight icon container (12x12) | `rounded-xl` |
| Hero icon container (14x14) | `rounded-2xl` |
| Chips, pills, notification badges | `rounded-full` |

## shadcn/ui Components

Installed in `src/components/ui/`:
`avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `progress`, `select`, `separator`, `sheet`, `table`, `tabs`, `textarea`.

**Process for needing a UI component**:

1. Check `src/components/ui/` for an existing shadcn primitive.
2. If present, import and compose it.
3. If missing, install via `pnpm dlx shadcn@latest add <component>` (or npm equivalent). Installing keeps updates and theming consistent.
4. Build custom components only by composing shadcn primitives plus Tailwind tokens.

### Variant conventions

| Component | Variant | When to use |
| --- | --- | --- |
| Button | `default` | Primary action (blue) |
| Button | `ghost` | Navbar buttons, icon-only controls |
| Button | `outline` | Secondary CTA |
| Button | `secondary` | Action sitting on a `bg-primary` surface |
| Card | `border-none shadow-sm` | Informational section cards |
| Card | `border-2 border-primary/20` | Feature comparison / highlighted plan / "Sou um Fornecedor" style card |
| Card | `bg-primary text-primary-foreground border-none` | Strong CTA card |
| Badge | `h-5 w-5 p-0 text-[10px]` absolute | Notification count on bell icon |
| Input | `bg-muted/50 border-none h-9 pl-9` | Topbar search (with `absolute left-3 top-1/2 -translate-y-1/2` icon) |

## Icons (lucide-react)

Use `lucide-react` as the sole icon source. Size icons by their role:

| Role | Classes |
| --- | --- |
| Inline in button or small text | `w-4 h-4` |
| Link or navigation default | `w-5 h-5` |
| Highlight inside container | `w-6 h-6` or `w-7 h-7` |
| Hero or large CTA | `w-10 h-10` |

Control size only with Tailwind `w-* h-*` classes (the lucide `size` prop is rejected during review for consistency with the rest of the codebase).

**Highlight icon container pattern** (reuse verbatim):

```tsx
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
  <Icon className="w-6 h-6 text-primary" />
</div>
```

Inside the sidebar (dark panel), let icons inherit `text-sidebar-foreground` (omit any explicit `text-*` class on sidebar icons).

## Layout and Spacing

- Public page container: `max-w-7xl mx-auto px-6` on every section.
- Section padding: `py-20` default, `py-24` for hero, `py-12` for stats bar.
- Dashboard pages: wrap content in `<AppShell tipo="empresa|fornecedor" titulo="...">`, which already applies `p-6` to `<main>`.
- Navbar/topbar: `h-16 sticky top-0 z-50` for the public navbar, `z-10` for the internal topbar.
- Sidebar: `w-64` expanded, `w-20` collapsed, `sticky top-0 h-screen`.

### Grid templates

| Layout | Classes |
| --- | --- |
| 4-column stats / categorias | `grid grid-cols-4 gap-6` (or `gap-8`) |
| 3-column how-it-works | `grid grid-cols-3 gap-8` |
| 2-column CTA | `grid grid-cols-2 gap-8` |

The project is desktop-first with no responsive breakpoints yet. When introducing responsiveness, start at `md:` and keep the desktop layout as the default.

## Effects and State

- Card hover: `hover:shadow-md transition-shadow`.
- Color transitions: `transition-colors`.
- Hero background wash: `bg-gradient-to-br from-primary/5 via-transparent to-primary/10` placed on `absolute inset-0`.
- Accent pill: `bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium`.

## Naming Conventions

- UI strings in pt-BR with full accents (`região`, `serviços`, `manutenção`). Mock-data keys stay accent-free in identifiers (`titulo`, `descricao`, `regiao`) — the string *values* carry the accents.
- Component files and exports in English PascalCase; hooks in English camelCase with `use` prefix.
- Route folders follow app-area names: `src/app/empresa/...`, `src/app/fornecedor/...`.

## Process: Adding a New UI Surface

1. Identify the surface type (page section, card, dialog, form field).
2. Pick the container: public sections use `max-w-7xl mx-auto px-6 py-20`; app pages rely on `AppShell`.
3. Compose shadcn primitives for controls (Button, Card, Input). Skip this step only if no primitive fits — then install one (see shadcn process).
4. Apply tokens via Tailwind classes from the tables above. Resolve any missing token by adding it to `globals.css` first.
5. Size icons with `w-* h-*` classes from the icon table.
6. Verify against the quality checklist below before finishing.

## Good vs Bad Examples

**Icon button**

- Good: `<Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>`
- Bad: `<button className="p-2 hover:bg-gray-100 rounded-md">...</button>` (recreates shadcn Button, uses gray-* outside the token system).

**Highlight icon**

- Good: `<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="w-6 h-6 text-primary" /></div>`
- Bad: `<Icon className="text-blue-600" size={24} />` (hard-coded color, bypasses class-based sizing).

**Surface colors**

- Good: `bg-card border border-border`
- Bad: `bg-white border border-gray-200`

**Accent pill**

- Good: `<span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">Novo</span>`
- Bad: `<span style={{ background: '#e0ecff', color: '#1d4ed8' }}>Novo</span>`

## Quality Checklist

- [ ] Every color resolves to a token class (`bg-primary`, `text-muted-foreground`, `--chart-*`); hex and inline `oklch()` are rejected in JSX.
- [ ] Typography uses the hierarchy table classes; font weight is between 400 and 700; no italics.
- [ ] Radius matches the surface table (`rounded-lg` controls, `rounded-xl` cards, `rounded-full` pills).
- [ ] Controls reuse shadcn primitives from `src/components/ui/`; new primitives are installed via `shadcn add`.
- [ ] Icons come from `lucide-react` and use Tailwind `w-* h-*` sizing from the icon table.
- [ ] Highlight icons follow the `bg-primary/10` + `text-primary` container pattern.
- [ ] Public sections wrap in `max-w-7xl mx-auto px-6`; app pages use `AppShell`.
- [ ] Sidebar elements rely on `sidebar*` tokens and inherited foreground (no manual color overrides).
- [ ] UI strings are pt-BR with full accents; object keys stay accent-free (`titulo`, `descricao`, `regiao`).
- [ ] `dark:` classes appear only after a `:root` dark block exists in `globals.css`.

## References

- Tokens: `src/app/globals.css`
- Root layout and fonts: `src/app/layout.tsx`
- shadcn primitives: `src/components/ui/`
- App shell and navigation: `src/components/layout/`
