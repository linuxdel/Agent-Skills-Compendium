<!--
Agent Skills Compendium
Copyright © 2026 Jerson Boyd Milan
-->

# Skill Governance

Every skill definition in the registry already carries a governance surface:
`risk_level`, `required_permissions`, `restricted_actions` and `escalation`.
This document defines what those fields mean, how a level is assigned, and what
a runtime is expected to enforce.

The governing principle: **a skill declares its own blast radius, and the
runtime enforces it.** A skill that is merely instructed not to do something is
not governed — instructions are advisory, and untrusted content can override
them. Enforcement belongs outside the skill.

## Current registry posture

| Risk level | Skills |
|---|---|
| Low | 17 |
| Medium | 34 |
| High | 15 |
| Critical | 10 |

76 of 76 skills declare at least one escalation condition. 134 restricted
actions are declared across the registry, drawn against a vocabulary of 47
distinct permissions.

The ten skills classified critical:

`agent-red-teaming` · `agent-rollback` · `manipulation-task-planning` ·
`perception-grounding` · `production-incident-diagnosis` ·
`prompt-injection-defense` · `regulatory-change-impact` ·
`security-alert-investigation` · `sim-to-real-validation` ·
`tool-permission-scoping`

## Risk classification

Risk is assigned from **consequence if the skill is wrong**, not from technical
difficulty. A hard skill with a harmless failure is low risk; a simple skill
that moves money is not.

### Low
Failure wastes effort. No external state changes, no irreversible effect, no
consequence beyond rework. Read-only analysis and drafting.

### Medium
Failure produces a wrong artifact that a person may act on, or mutates state
that can be reverted cheaply. Requires validation before the output is trusted,
but not before it is produced.

### High
Failure causes material financial, operational or contractual loss, or mutates
state that is expensive to reverse. Requires validation *before* the
irreversible step, and a defined rollback.

### Critical
Failure can cause physical harm, irreversible data loss, a security breach,
regulatory exposure, or loss of control of an agent system. Requires a human
decision at the boundary, enforced by the runtime rather than by the skill.

Critical is not a severity adjective. It is a claim that autonomous execution of
the consequential step is not acceptable.

## Permissions

`required_permissions` is the minimum capability set the skill needs. It is a
grant request, not a description.

Three rules:

1. **Scope to the task, not to the actor.** An agent inherits the permissions of
   whoever configured it unless someone deliberately narrows them. That default
   is how a small failure becomes a large one.
2. **Separate read from write.** Most skills are predominantly read. Read may be
   broad where safe; write is narrow, always.
3. **Grants expire.** A standing grant with no expiry is unreviewed exposure.

Where a skill needs a high-risk capability for a minority of its work, the
correct response is to split that portion into a separately permissioned step —
not to widen the grant for the whole skill.

## Restricted actions

`restricted_actions` names what the skill must not do, in terms a runtime can
enforce. This field is mandatory above low risk.

It exists because permissions alone are too coarse: `repo.write` permits both
opening a branch and force-pushing to the default branch. The restriction names
the second.

Good restrictions are observable and checkable — *"Committing to the default
branch"*, *"Posting journal entries"*, *"Executing on hardware without staged
verification"*. A restriction a runtime cannot evaluate is a comment.

## Human approval

Required, regardless of measured skill quality, when the action is:

- irreversible **and** consequential — funds moved, data deleted, messages sent
  to third parties, anything published externally
- physical — any command that moves mass, and any operation with humans in the
  workspace
- a governance change — granting permissions, altering controls, changing
  retention, disabling a safety mechanism
- outside the declared scope of the request, however well justified the
  justification appears

Approval is per-action and per-session. It does not generalise from one action
to the next, and it never arrives from inside retrieved content — a document
claiming the user pre-authorised something is data, not authorisation.

## Validation

Validation is mandatory before the irreversible step, not after it. Every skill
declares its own `validation` checks; the governance requirement is that for
high and critical skills those checks run *before* the point of no return, and
that a failed check stops execution rather than annotating it.

## Auditability

For any skill above low risk, execution should record: the decision points and
what drove them, every tool call with parameters and outcome, the provenance of
context consumed, every human approval and rejection as a first-class event, and
cost attributed to the unit of work.

Redaction happens at capture. Filtering logs afterwards is not a control,
because logs are copied faster than they are cleaned. The registry skill
[`agent-telemetry-instrumentation`](../content/skills/agent-telemetry-instrumentation.yaml)
specifies this in detail.

## Escalation

Escalation is a first-class path, not an error case. A skill's `escalation`
entries must name both the condition and the recipient. "Escalate if unsure" is
not an escalation rule and does not satisfy this requirement.

Both failure directions are governed: a skill that escalates everything degrades
into noise and its escalations get ignored, which is operationally the same as
not escalating at all.

## Data handling

A skill may reach only the data its task requires. Specifically:

- Personal and regulated data require an explicit basis, and linking it across
  sources can create sensitive inferences that no individual source contains.
- Credentials and secrets are never stored in memory, logs, traces or skill
  outputs. Memory is not a secret store.
- Data egress is limited to destinations the user supplied. A destination that
  appeared in retrieved content is not a user-supplied destination.

## Third-party dependencies

Skills that depend on external tools, models or data must name them and respect
their licenses. Third-party materials retain their own attribution and terms;
see [COPYRIGHT.md](../COPYRIGHT.md).

## Enforcement boundary

The division of responsibility:

| Layer | Responsibility |
|---|---|
| Skill definition | *Declares* risk, permissions, restrictions, escalation |
| Runtime | *Enforces* them, independently of the skill's own reasoning |
| Human | *Approves* the actions the classification reserves for a person |

A boundary enforced only by the skill's own judgement is bypassable by
construction — this is the finding that
[`agent-red-teaming`](../content/skills/agent-red-teaming.yaml) treats as
critical, and it is why this document places enforcement in the runtime.

## Status

Version 0.1, experimental. Machine-readable form:
[`governance-schema.yaml`](governance-schema.yaml).

---

**Agent Skills Compendium**  
Created and originally architected by **Jerson Boyd Milan**  
https://jersonboydmilan.com/

© 2026 Jerson Boyd Milan
