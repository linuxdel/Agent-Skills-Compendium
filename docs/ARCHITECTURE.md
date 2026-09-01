<!--
Agent Skills Compendium
Copyright © 2026 Jerson Boyd Milan
-->

# Agent Skills Compendium Architecture

Every skill in the registry belongs to exactly one architectural layer. The
layer answers a different question from the category: the category says what
*domain* the work is in, the layer says what *kind* of work it is — and
therefore what can go wrong and what verification is appropriate.

## Five Layers

### L1 — Cognitive Skills

Reasoning, planning, classification, synthesis, decision-making,
prioritization, and inference.

Cognitive skills operate on representations rather than on the world. They
consume context and produce judgement — never a side effect. A cognitive
failure does not raise an error; it shows up as bad downstream work. These
skills are validated by internal consistency and by stated assumptions.

*Registry examples:* `metric-anomaly-diagnosis`, `risk-weighted-recommendation`,
`scenario-planning`, `code-review`.

### L2 — Knowledge Skills

Research, retrieval, document analysis, memory, knowledge bases,
and knowledge graphs.

The defining property is provenance. A knowledge skill that returns a claim
without a traceable source and a confidence signal has failed, even when the
claim happens to be true. These skills are read-heavy against the world and
write-heavy against memory, and are validated by source verifiability rather
than by fluency.

*Registry examples:* `source-credibility-assessment`,
`competitive-intelligence-report`, `knowledge-graph-construction`,
`codebase-orientation`.

### L3 — Action Skills

Writing, coding, browsing, APIs, file manipulation, automation,
and external tool usage.

This is the layer where mistakes become real. Every action skill carries an
explicit blast radius, a validation step that runs *before* the irreversible
part, and a defined rollback or escalation path. Action skills are validated
against the artifact produced, not against the intent.

*Registry examples:* `feature-implementation`, `executive-brief`,
`idempotent-integration-design`, `visualization-design`.

### L4 — Domain Skills

Specialized capabilities for domains such as finance, logistics,
robotics, cybersecurity, governance, healthcare, manufacturing,
and other fields.

A domain skill is a general capability plus a body of field-specific rules that
make its output acceptable to a practitioner. Correctness is judged by domain
practitioners, not by users. These carry the highest correctness bar and the
sharpest escalation triggers, and frequently carry legal, financial or physical
consequence.

*Registry examples:* `account-reconciliation`, `threat-model-construction`,
`regulatory-change-impact`, `manipulation-task-planning`.

### L5 — Agentic Skills

Delegation, tool selection, multi-agent coordination, verification,
monitoring, escalation, autonomous execution, and recovery.

Agentic skills are the control plane. They operate on other agents, skills and
tools as their subject matter, own verification and recovery, and determine
autonomy boundaries and stop conditions. Failure at this layer is systemic
rather than local.

*Registry examples:* `task-decomposition-delegation`,
`prompt-injection-defense`, `tool-permission-scoping`, `autonomy-staging`.

## The skill specification

Every definition validates against one canonical schema before it ships. The
required elements are:

| Element | Purpose |
|---|---|
| `trigger` | when the skill applies |
| `inputs` | typed, with required/optional distinction |
| `prerequisites` | skills that must have run first |
| `tools` | referenced by identifier from the tool registry |
| `procedure` | ordered steps |
| `decision_rules` | condition → action pairs for branching |
| `outputs` | typed products |
| `validation` | checks that must pass for the outcome to count |
| `failure_modes` | failure paired with mitigation |
| `escalation` | condition → who or what takes over |
| `related_skills` | prerequisite, complementary, successor, related |
| `risk_level`, `required_permissions`, `restricted_actions` | governance surface |

The schema is the source of truth for the entire system: the UI, the search
index, the export endpoints and the composer are all generated from it.

## Relationship model

Skills form a directed graph over four edge types:

- **prerequisite** — must have run first; the composer resolves the transitive
  closure and orders execution accordingly
- **complementary** — commonly used alongside
- **successor** — natural next step
- **related** — relevant without a sequencing implication

Referential integrity is enforced across the whole registry: every edge must
resolve to a skill that exists, and no skill may reference itself.

## Implementation

The application is a Next.js App Router project reading a file-backed content
store. Nothing outside the content store knows the registry lives on disk;
pages and API routes depend only on the `SkillRepository` interface, so the
storage backend can be replaced without changing a page.

See the repository [README](../README.md) for the directory layout and the
machine interface.

---

## Original Architecture

The initial five-layer architecture was developed as part of the
Agent Skills Compendium by Jerson Boyd Milan.

Copyright © 2026 Jerson Boyd Milan.
