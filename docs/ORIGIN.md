<!--
Agent Skills Compendium
Copyright © 2026 Jerson Boyd Milan
-->

# Origin of the Agent Skills Compendium

## 2026

The Agent Skills Compendium was initiated by **Jerson Boyd Milan** as a
framework for organizing reusable capabilities for AI agents.

The project is based on a central distinction:

> A tool is something an agent can use.
>
> A skill is something an agent knows how to accomplish.

A skill may invoke one or more tools to produce a validated outcome. The
distinction is what separates this project from a prompt library: a prompt
produces a result on one occasion, while a skill carries a trigger, typed
inputs, a procedure, decision rules, validation criteria, failure modes and an
escalation path.

## Initial architecture

Capabilities are organized across five layers:

1. **L1 — Cognitive Skills**
2. **L2 — Knowledge Skills**
3. **L3 — Action Skills**
4. **L4 — Domain Skills**
5. **L5 — Agentic Skills**

The layer determines what kind of failure a skill can produce, and therefore
what verification is appropriate. See [ARCHITECTURE.md](ARCHITECTURE.md).

## Initial taxonomy

Twenty categories, all implemented in the initial release:

Research & Intelligence · Writing & Communication · Data & Analysis ·
Coding & Engineering · Business Strategy · Workflow Automation ·
Knowledge Management · Sales & GTM · Marketing & Content ·
Finance & Operations · Governance & Compliance · Cybersecurity ·
DevOps & Infrastructure · Physical AI & Robotics · Multi-Agent Systems ·
Executive & Institutional Intelligence · Personal Productivity ·
Agent Evaluation · Agent Security · Agent Deployment

Category names, descriptions and layer affinities are stored as data in
`content/categories.yaml`. The taxonomy is not encoded in the application, so
it can be extended without a code change. See [TAXONOMY.md](TAXONOMY.md) for
the full documented set with per-category capabilities.

## What the initial release established

The 0.1.0 release contains:

- a canonical skill specification enforced by a schema validator
- 20 categories and 5 architectural layers, stored as data
- 76 fully specified skills, each answering ten required questions
- a normalized registry of 49 tools that skills reference by identifier
- a skill relationship model (prerequisite, complementary, successor, related)
  with referential integrity enforced across the whole registry
- machine-readable export of every definition as YAML and JSON
- a read API over the registry
- a composer that resolves prerequisites and orders skills for execution

Skill *execution* is deliberately outside the scope of the initial release. The
data model does not preclude it.

## Long-term objective

To provide a structured foundation for discovering, defining, composing,
evaluating, governing, and deploying reusable agent capabilities — extending
over time from isolated capabilities to reusable skills, composed workflows,
governed agents, and autonomous systems including physical AI.

## Authorship

Original creator and principal architect:

**Jerson Boyd Milan**

Website: https://jersonboydmilan.com/

Copyright © 2026 Jerson Boyd Milan.
