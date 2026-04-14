# ConectaFornece — Project Tracker

> Keep this document updated as features are completed or decisions are made.

---

## Platform Modules

The platform has **three distinct user modules**:

| Module | Who | What they do |
|--------|-----|--------------|
| **Admin** | Celso / platform team | Manages companies, users, permissions, platform KPIs |
| **Empresa (Cliente)** | Vale, Usiminas, ArcelorMittal, etc. | Publishes and manages contracting demands |
| **Fornecedor** | Local suppliers | Discovers demands and submits proposals |

---

## Feature Status

### Legend
- `mockup-done` — page/flow exists in the UI prototype with mock data
- `mockup-partial` — page exists but flow is incomplete
- `mockup-missing` — agreed scope, UI not built yet
- `needs-backend` — requires auth/database decision before mockup makes sense
- `needs-clarification` — requirement is vague or contradictory; align with Celso before building
- `deprioritize` — not MVP; decide if/when to include

---

### Auth & User Management `16h`

| Item | Module | Status | Notes |
|------|--------|--------|-------|
| Login screen | All | `mockup-done` | `/login` — screen only, no logic |
| Registration screen | All | `mockup-partial` | `/registro` — role selection + form, no logic |
| Password recovery | All | `needs-backend` | Not screened yet |
| Profile management / password change | All | `needs-backend` | Not screened yet |

**Decision needed before implementing:** Auth stack (NextAuth, Clerk, Supabase Auth, or custom). Affects registration flow, session management, and invite flows.

---

### Platform Admin Panel `10h` · module: admin

| Item | Status | Notes |
|------|--------|-------|
| Admin dashboard | `mockup-missing` | KPIs: active users/month, organizations, proposals |
| Organization list | `mockup-missing` | View all client + supplier companies |
| User management | `mockup-missing` | Manage users across orgs, change permissions |

**Routes to create:** `/admin/dashboard`, `/admin/organizacoes`, `/admin/usuarios`

---

### Organization Admin Panel `10h` · module: empresa + fornecedor

| Item | Status | Notes |
|------|--------|-------|
| Member list | `mockup-missing` | See all users in the organization |
| Invite/remove members | `mockup-missing` | Email invite + role assignment |
| Member permissions | `mockup-missing` | Read-only vs manager, etc. |

**Routes to create:** `/empresa/configuracoes/membros`, `/fornecedor/configuracoes/membros`

---

### Client Company Invite Flow `5h` · module: admin

| Item | Status | Notes |
|------|--------|-------|
| Send invite email (admin) | `mockup-missing` | Admin triggers invite from platform panel |
| Accept invite + fill company data | `mockup-missing` | Company receives email, clicks link, fills registration |

**Dependency:** Email service + auth stack must be chosen first.
**Note:** Client companies (Vale, Usiminas) can only sign up via admin invite — never self-register.

---

### Supplier Invite Flow `5h` · module: admin

| Item | Status | Notes |
|------|--------|-------|
| Direct self-registration | `mockup-partial` | `/registro` exists but generic |
| Admin invite link flow | `mockup-missing` | Admin sends link → supplier lands on pre-filled registration |
| Installed technical capacity form | `mockup-missing` | Part of supplier registration; defines what services they offer |

**Note:** Unlike clients, suppliers can self-register. The invite is optional but useful for Celso to onboard specific suppliers.

---

### Create Demand (Contracting Request) `10h` · module: empresa

| Item | Status | Notes |
|------|--------|-------|
| 3-step creation wizard | `mockup-done` | `/empresa/novo-projeto` — basic info, details, review + publish |
| Success / publish confirmation | `mockup-done` | Final step shows confirmation state |

**Gap:** Step 2 could be more detailed — requirements, mandatory certifications, preferred regions. Validate form fields with Celso.

---

### Demand Detail & Edit `3h` · module: empresa

| Item | Status | Notes |
|------|--------|-------|
| Demand detail view | `mockup-done` | `/empresa/projeto/[id]` — shows specs + all proposals |
| Edit demand flow | `mockup-partial` | No edit screen built; business rules need definition |

**Needs clarification:** What fields can be edited after proposals arrive? What happens to existing proposals if deadline changes? Define these rules with Celso before building the edit screen.

---

### Demand Tracking Table `8h` · module: fornecedor

| Item | Status | Notes |
|------|--------|-------|
| Project search with filters | `mockup-done` | `/fornecedor/projetos` — category, region, text search, sort |
| Results grid | `mockup-done` | 2-column cards with budget, deadline, status badge |

**Gap:** Notes mention "real-time tracking" and "filter by client company". Client company filter is not in the current mockup. Confirm required filters with Celso.

---

### Proposal Submission (Manifest Interest) `2h` · module: fornecedor

| Item | Status | Notes |
|------|--------|-------|
| Manifest interest dialog | `mockup-done` | `/fornecedor/projeto/[id]` — includes optional message field |
| Proposal confirmation | `mockup-done` | Toast/dialog confirmation after submission |

---

### Contact for Negotiation `1h` · module: empresa

| Item | Status | Notes |
|------|--------|-------|
| View proposals on demand | `mockup-done` | `/empresa/projeto/[id]` — list of proposals with supplier info |
| Select supplier + see contact | `mockup-done` | "Ver contato" toggle on every proposal card; contact auto-revealed for selected supplier |

---

### Close / Archive Demand `5h` · module: empresa

| Item | Status | Notes |
|------|--------|-------|
| Close demand flow | `mockup-done` | Modal on `/empresa/projeto/[id]` — supplier summary, visibility picker, split ratings, archive |
| Move to "closed contracts" table | `mockup-done` | "Contratos Fechados" section on `/empresa/dashboard` with supplier, value, date, visibility |
| Visibility settings | `mockup-done` | Three options: Público / Apenas fornecedores / Privado |

**Routes to create:** Flow within `/empresa/projeto/[id]` (modal or step) + new section in `/empresa/dashboard` for closed contracts.

---

### SSO · module: empresa + fornecedor

| Item | Status | Notes |
|------|--------|-------|
| SSO integration | `deprioritize` | On-demand, per-company billing. Not MVP. |

---

## Items Added to Scope (originally excluded)

### Supplier Profile `added`

| Item | Status | Notes |
|------|--------|-------|
| Supplier public profile (own view) | `mockup-done` | `/fornecedor/perfil` — logo, ratings, certifications, reviews, history |
| Supplier profile (empresa view) | `mockup-done` | `/empresa/fornecedor/[id]` — read-only, contact always visible, per-supplier mock data |

---

### Supplier Reviews `needs-clarification`

| Item | Status | Notes |
|------|--------|-------|
| Review submission | `mockup-done` | Submitted via close-contract modal — split ratings (Qualidade + Prazo, 1–5 ★) + free-text comment |
| Review display on supplier profile | `mockup-done` | Split-rating cards on `/fornecedor/perfil` and `/empresa/fornecedor/[id]`; stats (Entrega no Prazo, Satisfação) computed from real review averages |

**Decisions made (2026-04-14):** Split ratings (Qualidade do serviço + Cumprimento de prazo). Visibility: Público by default. Supplier response: deferred to post-MVP.

---

### Client Profile (for supplier) `added`

| Item | Status | Notes |
|------|--------|-------|
| Client company public profile | `mockup-done` | `/fornecedor/empresa/[id]` — header with sector/region/stats, open demands grid, closed contracts list; linked from company card on `/fornecedor/projeto/[id]` |

---

### Admin Notes on Contracts `needs-clarification`

| Item | Status | Notes |
|------|--------|-------|
| Admin annotations on demands | `needs-clarification` | Celso wants to add notes/tips on contracts — who can see them? Only suppliers? Only after selection? |

**Action:** Schedule a short call with Celso to define: (a) who writes the note, (b) who reads it, (c) when it becomes visible, (d) whether it attaches to the demand or the contract.

---

### Automatic Demand Discovery (Diário Oficial) `needs-clarification`

| Item | Status | Notes |
|------|--------|-------|
| Scraping / monitoring Diário Oficial | `needs-clarification` | Mentioned as "include in the proposal", not a confirmed feature |

**Recommendation:** This is a significant technical addition (web scraping, data normalization, legal considerations). Treat as a **post-MVP module** unless Celso explicitly makes it a launch requirement. If included, it should be a separate backend service.

---

## Mockup Backlog (what to build next in the UI)

Ordered by impact/dependency:

1. **Supplier contact display** — complete the `empresa/projeto/[id]` flow so that selecting a supplier shows their contact info. Small, high-value, unblocked.
2. **Close demand flow** — modal within `empresa/projeto/[id]`. Needed to demo the full company lifecycle.
3. **Client company profile** — `/fornecedor/empresa/[id]`. Completes the supplier's view of a demand.
4. **Admin platform panel** — `/admin/dashboard`, orgs, users. Needed for Celso to see the platform's own experience.
5. **Organization member management** — settings pages for both empresa and fornecedor.
6. **Installed technical capacity form** — part of supplier registration, critical for matching.
7. **Demand edit screen** — needs business rules first (align with Celso).

---

## Decisions to Make Before Backend Work

| Decision | Why it blocks |
|----------|--------------|
| Auth stack (Clerk / NextAuth / Supabase / custom) | Login, invite flows, session management, SSO path |
| Database (Postgres/Supabase/PlanetScale) | All persistence |
| Email provider (Resend / SendGrid / SES) | Invite flows, password recovery, notifications |
| Hosting (Vercel / Railway / other) | Deployment strategy, env vars |
| Multi-tenancy model | How organizations and users are isolated |

---

## Total Estimated Hours (from original notes)

| Feature | Hours |
|---------|-------|
| Auth & user management | 16h |
| Admin platform panel | 10h |
| Organization admin panel | 10h |
| Client invite flow | 5h |
| Supplier invite flow | 5h |
| Create demand | 10h |
| Demand detail & edit | 3h |
| Demand tracking table | 8h |
| Proposal submission | 2h |
| Contact for negotiation | 1h |
| Close demand | 5h |
| **Total** | **75h** |

*Items added to scope (supplier/client profiles, admin notes) not yet estimated.*
