# Project Context — ConectaFornece

Strategic context about why the product exists, who it serves, how it makes money, and how the scope has evolved. Complements:

- `AGENTS.md` — technical rules, stakeholders, and conventions for the agent
- `design/` — product specifications (what the product is, how it works)
- `docs/roadmap.md` — phases, milestones, and pending decisions for mockup construction

## The product in one paragraph

ConectaFornece is a B2B marketplace connecting large industrial companies (Vale, Usiminas, ArcelorMittal, and peers) in the Itabira/MG region to local suppliers of services like maintenance, logistics, occupational safety, and civil construction. Conceptually analogous to "Airbnb for industrial contracting": projects are published by companies, suppliers apply, both sides review each other after contracts close. Embedded in the platform, as a paid product, is Celso's consulting: a coach that helps suppliers win contracts at the exact moment of peak anxiety — right before sending a candidatura or a formal proposal.

## Business model and monetization

**The marketplace is free for both sides.** Joining, browsing, applying, reviewing — all no-cost for both empresas and fornecedores. This keeps the marketplace genuinely useful and drives volume on both sides of the network.

**Revenue comes from the Consulting layer**, sold exclusively to suppliers. Four packaged services in the MVP catalog:

- Revisão de candidatura (pre-application review)
- Revisão de proposta formal (pre-formal-proposal review)
- Acompanhamento completo (bundle covering both phases)
- Retorno pós-descarte (diagnostic after rejection)

**Early funding was provided by client companies.** Anchor empresas paid to fund the initial build. This is historical context, not a product feature — there is no paid empresa tier in the product itself, and no plans for one.

## Celso's strategic moat

Celso's unique asset is deep domain knowledge of how procurement at Vale, Usiminas, ArcelorMittal and similar industrial giants actually works — hard-won from years of experience in the region. The platform is his acquisition channel for that advisory service. Without the consulting layer embedded at the right moment in the supplier's funnel, the platform would be just another listing site with no durable competitive advantage.

This is why the Consulting layer is **not optional** or a side product — it is the strategic reason the platform exists in the form it was designed.

## Strategic constraints

Confirmed with Arthur in the design sessions (2026-04-14). These should not be revisited without an explicit product conversation with Celso.

- **Team of advisors, not solo.** The consulting surface supports multi-advisor operations: roster, specialization, scheduling, assignment, workspace, outreach. Celso is `Advisor.role = owner`; additional advisors are `advisor` role.
- **Reviews are foundational, not optional.** Two-way reviews with release simultâneo (14-day window) and 5 dimensions per side are the trust backbone of the marketplace. Without them, suppliers can't differentiate and empresas can't verify quality.
- **No paid empresa tier.** Product monetization is exclusively the consulting sold to suppliers. Do not design features that gate empresa functionality behind payment.
- **Location-agnostic data model.** While the current market focus is Itabira/MG and neighboring cities, the schema treats `cidade` and `regiao` as first-class fields. No hardcoded regional constraints.
- **Consulting layer is scoped to the fornecedor context.** Tenants with only `perfil_empresa_ativo = true` never see the Consulting surface. Triggers and CTAs related to consulting fire only for suppliers.
- **Dual-role tenants are first-class.** One organization can operate as empresa and fornecedor simultaneously — modeled as `Organizacao` (tenant umbrella) with two 1:1 profile entities. Details in `design/data-model.md §1`.

## Scope history

The original estimate Celso brought to the first conversations was **75h of work**, based on Arthur working solo on a simpler version — essentially a project listing plus a place for Celso to sell consulting on the side.

After deep redesign (captured across the 7 artifacts in `design/`), the product became considerably larger: two-way reviews, three-step handshake, embedded consulting as a full sub-product with workspace and outreach, tenant-dual architecture, notifications system, curated case studies.

**The 75h estimate is obsolete as a scope cap.** With AI-assisted development (Claude generating most of the raw code while Arthur acts as designer/decision-maker), the effective effort is different — but still involves a meaningful amount of time. Flag scope tradeoffs clearly when they arise, but do not auto-cut features to fit the original 75h number. That number is history, not a constraint.

For historical reference, the original pre-redesign tracker is preserved at `docs/archive/project-tracker-pre-redesign.md`.

## Current phase

UI mockup. All data mocked in `src/lib/mock-data.ts`. No backend, authentication, API routes, or persistence. The project has not yet picked a backend / auth / database / email stack (see `docs/roadmap.md` §"Decisões pendentes — stack técnica").

If a task ever requires backend work, real auth, persistence, or network calls, **pause and align with Arthur** — those decisions have not been made, and premature stack commitment is a significant risk.

The code currently in `src/` predates the redesign and reflects an older, simpler product vision. Treat it as an ephemeral reference point, not a foundation — when current code conflicts with the designs in `design/`, the designs win. Refactor or delete aggressively to align.

## Pointers

- `design/README.md` — index of product specifications (7 artifacts: handshake, data model, information architecture, public profiles, consulting layer, notifications, plus the README)
- `docs/roadmap.md` — phases, milestones, pending stack decisions, pending product decisions
- `meetings/r1-celso/` — materials for the first strategic meeting with Celso (deck, one-pager, internal roteiro)
- `AGENTS.md` — technical rules, stakeholders, conventions, language rules, visual identity references
