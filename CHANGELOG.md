<!--
Agent Skills Compendium
Copyright © 2026 Jerson Boyd Milan
-->

# Changelog

All notable changes to the Agent Skills Compendium are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/), and the
project uses [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-09-01

> Published to GitHub on 2026-09-01. Not yet tagged: no `v0.1.0` Git tag or
> GitHub release exists, pending commit-signing configuration.

### Added

- Canonical Agent Skill Specification, enforced by a schema validator
- Five-layer capability architecture (L1 Cognitive, L2 Knowledge, L3 Action,
  L4 Domain, L5 Agentic), stored as data
- Agent Skills taxonomy: 20 categories, stored as data rather than encoded in
  the application
- Initial skill registry: 76 fully specified skills across all 20 categories
- Normalized tool registry: 49 tools referenced by skills by identifier
- Skill relationship model — prerequisite, complementary, successor, related —
  with referential integrity enforced across the registry
- `SkillRepository` interface with a file-backed implementation, so the storage
  backend can be replaced without changing pages or routes
- Content validator (`npm run validate:content`) enforcing schema conformance,
  slug/filename agreement, unique identifiers, and resolution of every
  category, layer, tool and skill-to-skill reference
- Web application: homepage, skill registry with search and seven filter
  facets, skill detail pages, category pages, layer pages
- Skill composer: prerequisite resolution, execution ordering, aggregation of
  required permissions, tools and risk level, and workflow specification export
- Machine interface: read API over skills, categories, layers, search, skill
  relationships, and YAML/JSON export
- Round-trippable YAML export — an exported definition re-validates against the
  schema unchanged
- SEO surface: unique routes for every skill, category and layer, plus sitemap
  and robots
- Typed analytics event surface (queued client-side; no collector wired)
- Node-link logo rendered as inline SVG, themed via `currentColor`, with
  stroke weight derived from render size; matching favicon
- Interface screenshots in `docs/screenshots/`, captured at 1440w @2x against
  a production build, referenced from the README
- Authorship and provenance documentation

### Fixed

- Registry filter input could be clipped by the CLEAR control, truncating its
  placeholder text; the input now shrinks correctly within its row
- Header logo stroke rendered as a 0.22px hairline, because a fixed stroke in
  the 200-unit viewBox does not survive scaling down to header size

### Known limitations

- Skill execution is out of scope for this release; the data model does not
  preclude it
- Skill definitions declare `CC-BY-4.0` while the repository LICENSE is MIT;
  this inconsistency is unresolved (see [COPYRIGHT.md](COPYRIGHT.md))
- Local commit signing is not configured, so commits authored locally are
  unsigned; only the GitHub-created root commit is verified
- Typography uses system font stacks rather than a licensed webface
