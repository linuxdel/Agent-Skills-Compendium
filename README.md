# Agent Skills Compendium

A structured intelligence layer for building, understanding, and deploying AI agent
capabilities.

This is a **capability registry**, not a prompt library. The distinction it is built on:

- A **tool** is something an agent can *use* — a browser, a SQL client, a deployment system.
- A **skill** is something an agent knows how to *accomplish* — with a trigger, inputs, a
  procedure, validation criteria, failure modes and an escalation path.

A skill may invoke several tools to produce a validated outcome.

## Authorship

**Created and originally architected by Jerson Boyd Milan**

The Agent Skills Compendium was initiated and developed as a structured
framework for defining, organizing, discovering, and composing reusable
capabilities for AI agents.

Website: https://jersonboydmilan.com/

Copyright © 2026 Jerson Boyd Milan. See [COPYRIGHT.md](COPYRIGHT.md),
[AUTHORS.md](AUTHORS.md) and [PROVENANCE.md](PROVENANCE.md).

Licensed under the [MIT License](LICENSE). Note that skill definitions in
`content/skills/` currently declare `license: CC-BY-4.0` in their own metadata,
which is inconsistent with the repository LICENSE — see
[COPYRIGHT.md](COPYRIGHT.md) for how to reconcile it.

## What is here

| | |
|---|---|
| Skills | 76, each fully specified against one canonical schema |
| Categories | 20, stored as data — adding one is a content change, not a code change |
| Architectural layers | 5 — Cognitive, Knowledge, Action, Domain, Agentic |
| Tools | 49, in a normalised registry that skills reference by id |

Every skill answers ten questions completely: what it does, when to use it, what it needs,
what tools it may use, how it executes, how it validates the result, what goes wrong, when it
should escalate, what it produces, and which skills it connects to.

## Running it

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build             # production build; prerenders every skill, category and layer route
npm run typecheck         # tsc --noEmit
npm run validate:content  # schema + referential integrity across the whole registry
```

`validate:content` is the gate. It enforces the canonical schema on every YAML file, checks
that filenames match slugs, that ids are unique, that every category, layer and tool exists,
and that every skill-to-skill relationship resolves to a real skill. It exits non-zero on any
error.

## Architecture

```
content/                     the registry — this is the product
  layers.yaml                5 architectural layers
  categories.yaml            20 categories
  tools.yaml                 49 normalised tools
  skills/<slug>.yaml         one skill per file, `skill:` root

src/lib/
  schema.ts                  THE canonical Agent Skill Specification (zod)
  repository.ts              SkillRepository — the read contract every backend implements
  content-store.ts           file-backed implementation; parses and caches once per process
  search.ts                  fuzzy scoring + facet filtering, shared by UI and API
  relations.ts               related groups, inverse edges, prerequisite closure
  export.ts                  YAML / JSON serialisation
  analytics.ts               typed event surface (skill_view, skill_search, skill_copy, …)

src/app/                     routes; every page is a server component reading the repository
src/app/api/                 the machine interface
```

### Swapping the storage backend

Nothing outside `src/lib/content-store.ts` knows the registry lives on disk. Pages and API
routes depend on the `SkillRepository` interface only. Moving to Postgres, a KV store or a
remote registry means implementing that interface and exporting a different `repository` —
no page, component or route changes.

## Machine interface

```
GET /api/skills                              filterable; add ?view=full for whole definitions
GET /api/skills/:slug
GET /api/skills/:slug/related                resolved edges, including inverse dependents
GET /api/skills/:slug/export?format=yaml     also json; add &download=1 for a file
GET /api/categories                          with live skill counts
GET /api/layers                              with live skill counts
GET /api/search?q=                           matches skills, categories and layers
```

The `/api/skills` route accepts the same query parameters as the `/skills` page — `q`,
`category`, `layer`, `complexity`, `maturity`, `risk`, `tag`, `speed`, `share` — so a URL a
person is looking at and a URL an agent fetches describe the same result set.

YAML export is round-trippable: the exported document has the same shape as the source file
and re-validates against the schema unchanged.

## Adding a skill

1. Copy an existing definition (every skill page exposes its YAML).
2. Write it to `content/skills/<slug>.yaml`. The filename must match the slug.
3. Run `npm run validate:content`.
4. Version it. New skills start at `1.0.0`. A procedure change is a minor bump; a change to
   inputs, outputs or validation is a major bump, because it breaks consumers.

The full admission standard is at `/contribute`.

## Notes on the current build

- Typography uses system font stacks rather than a webfont, so the build has no network
  dependency. Swapping in a licensed face is a change to `--font-sans` / `--font-mono` in
  `src/app/globals.css`.
- Analytics events are queued on `window.__skillCompendiumEvents` for a collector to drain.
  No vendor is wired up.
- The composer is client-side and produces a workflow specification; it does not execute
  anything. Execution is deliberately out of scope for v1 but nothing in the data model
  blocks it.

## Interface

### Registry

Search and seven filter facets over the whole registry — architectural layer,
category, complexity, maturity, build speed, shareability and risk level. Facet
counts are live, and options that would return nothing are disabled rather than
hidden.

![Skill registry filtered to the L5 Agentic layer](docs/screenshots/02-skill-registry.png)

### Skill detail

Every skill renders its full specification: purpose, trigger, typed inputs,
tools, procedure, decision rules, outputs, validation, failure modes,
escalation, worked examples, relationships and the governance surface
(risk level, required permissions, restricted actions).

![Prompt Injection Defence skill specification](docs/screenshots/03-skill-detail.png)

### Architectural layers

![The five architectural layers](docs/screenshots/04-layers.png)

### Category view

![Agent Security category](docs/screenshots/05-category.png)

### Composer

Select skills and the composer resolves their prerequisites, orders them for
execution, aggregates required permissions and tools, reports the highest risk
level in the chain, and exports the result as an agent specification.

![Skill composer](docs/screenshots/06-composer.png)

### Home

![Agent Skills Compendium home](docs/screenshots/01-home.png)

## Project documents

| Document | Purpose |
|---|---|
| [AUTHORS.md](AUTHORS.md) | Creator and contributors |
| [COPYRIGHT.md](COPYRIGHT.md) | Copyright, third-party materials, licensing status |
| [PROVENANCE.md](PROVENANCE.md) | Origin, attribution policy, verification status |
| [CITATION.cff](CITATION.cff) | Machine-readable citation metadata |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute a skill |
| [LICENSE](LICENSE) | MIT License |
| [docs/ORIGIN.md](docs/ORIGIN.md) | Conceptual origin of the framework |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | The five-layer model and skill specification |
| [docs/TAXONOMY.md](docs/TAXONOMY.md) | All 20 categories with their capabilities |

---

**Agent Skills Compendium**  
Created and originally architected by **Jerson Boyd Milan**  
https://jersonboydmilan.com/

© 2026 Jerson Boyd Milan
