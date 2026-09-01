<!--
Agent Skills Compendium
Copyright © 2026 Jerson Boyd Milan
-->

# Contributing

Contributions to the Agent Skills Compendium are welcome.

## Attribution

Contributors retain attribution for their original contributions.

The original project and architecture were created by **Jerson Boyd Milan**.

Contributors should not remove or alter existing copyright, authorship, license,
or provenance notices. Add yourself to [AUTHORS.md](AUTHORS.md) and set the
`author` field on any skill definition you write to your own name.

## What the registry admits

Capabilities, not prompts. If an entry cannot state how it validates its own
output, it is a prompt and does not belong here. See `/contribute` in the
running application for the full admission standard.

## Skill Contributions

New skills must include:

- skill name
- purpose
- trigger
- inputs
- tools
- procedure
- decision rules
- outputs
- validation
- failure modes
- escalation
- examples
- related skills

Additional admission rules:

- **Failure modes must be real.** Each must be one that has occurred or that
  follows from the procedure, with a mitigation that changes the procedure.
- **Escalation must be specific.** Name the condition and the recipient.
  "Escalate if unsure" is not an escalation rule.
- **Relationships must resolve.** The validator rejects dangling edges.
- **Restricted actions are mandatory above low risk.** State what the skill may
  not do, in terms a runtime could enforce.
- **One skill, one outcome.** Composite work belongs in the composer.

Contributors should clearly identify third-party material and comply with
applicable licenses.

## Workflow

1. Write the definition to `content/skills/<slug>.yaml`. The filename must match
   the slug.
2. Run `npm run validate:content`. It enforces the schema and resolves every
   reference. It must exit zero.
3. Run `npm run typecheck` and `npm run build` for code changes.
4. Version it. New skills start at `1.0.0`. A procedure change is a minor bump;
   a change to inputs, outputs or validation is a major bump, because it breaks
   consumers.

## Pull Requests

Pull requests should explain:

1. What changed.
2. Why it changed.
3. Which skills or architecture are affected.
4. Whether new dependencies were introduced.
5. Whether licensing or attribution is affected.

---

**Agent Skills Compendium**  
Created and originally architected by **Jerson Boyd Milan**  
https://jersonboydmilan.com/

© 2026 Jerson Boyd Milan
