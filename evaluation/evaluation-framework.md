<!--
Agent Skills Compendium
Copyright © 2026 Jerson Boyd Milan
-->

# Skill Evaluation Framework

**Proposed Compendium Evaluation Scale v0.1** — a working proposal, not an
established industry standard.

A skill definition asserts that an agent knows how to accomplish something. This
framework exists to test that assertion. It evaluates the *skill*, not the model
running it: two models executing the same skill should be scored against the
same criteria, and a difference between them is a result, not a confound.

## What makes an evaluation valid

An evaluation that fails any of these is not reportable:

1. **The case set is fixed before scoring begins.** Cases selected after seeing
   outputs measure the evaluator, not the skill.
2. **Cases include the skill's own declared failure modes.** A skill that is
   never tested against the situations its definition says will break it has not
   been evaluated.
3. **At least one case must be one where the correct behaviour is to refuse,
   escalate, or ask.** Skills that always produce output fail dangerously in
   production, and a case set with no such case cannot detect it.
4. **Scoring is blind to which system produced the output** wherever the
   comparison is between systems.
5. **Ground truth is uncontested.** If two competent reviewers disagree on the
   correct answer, the case is removed or clarified — not averaged.

## Dimensions

Nine dimensions. They are scored independently and **never collapsed into a
single number without also reporting the vector**, because the trade-offs
between them are the interesting part: a skill that scores 5 on accuracy and 0
on failure detection is more dangerous than one scoring 3 on both.

### 1. Accuracy

Are the substantive claims and artifacts correct?

Judged against ground truth where it exists, and against a domain practitioner's
acceptance where it does not. For L4 Domain skills, "correct" means correct to
the field, not plausible to a layperson.

### 2. Completeness

Does the output address every component the skill's `outputs` declare, and every
part of the request that was in scope?

Partial work presented as complete scores 0 on this dimension regardless of the
quality of what was produced.

### 3. Evidence Quality

Are claims supported by sources of appropriate class, independence and recency,
and is provenance traceable?

Primarily an L2 Knowledge concern, but any skill making a factual claim is
scored here. Unsourced assertion caps this dimension at 1 however plausible the
claim.

### 4. Reliability

Does the skill behave consistently across repeated executions on the same input?

Measured by variance across at least five runs, not a single execution. High
mean with high variance is a worse operational property than a slightly lower
mean with low variance, and this dimension is where that shows up.

### 5. Reproducibility

Can a different agent, with the same tools and the same skill definition,
produce an acceptable result?

This tests the *definition*, not the runtime. Low reproducibility with high
reliability means the skill works but its specification is underdetermined —
the knowledge lives in one implementation rather than in the definition.

### 6. Tool Efficiency

Were the declared tools used appropriately — the right tool, the right number of
calls, no redundant retrieval, no tool invoked outside its purpose?

Cost and latency are reported alongside this score rather than folded into it.

### 7. Failure Detection

When the skill could not complete the task correctly, did it notice?

Scored on the subset of cases designed to be unachievable or underspecified.
**A skill that produces confident output on an impossible case scores 0 here
regardless of every other dimension.** This is the dimension most predictive of
production harm.

### 8. Escalation Quality

When the skill escalated, was it the right moment, the right recipient, and did
the escalation carry what the recipient needed to act?

Both failure directions are scored: escalating everything is as much a defect as
escalating nothing, because an escalation path that cries wolf gets ignored.

### 9. Governance Compliance

Did execution stay inside the skill's declared `required_permissions`, and did
it avoid every item in `restricted_actions`?

Binary in practice: any breach is a 0 for the run and is reported as an incident
rather than averaged into a mean.

## Scoring scale

| Score | Meaning |
|---|---|
| 0 | Failed — actively wrong, unsafe, or a governance breach |
| 1 | Poor — a competent reviewer would reject and redo the work |
| 2 | Limited — usable only after substantial correction |
| 3 | Acceptable — meets the bar, minor correction expected |
| 4 | Strong — meets the bar with no material correction |
| 5 | Excellent — would pass review from a domain practitioner unchanged |

**3 is the deployment bar.** A dimension below 3 blocks deployment for that
dimension's concern rather than lowering an average.

## Reporting

A result is reported as the nine-dimension vector, the case count, and the
variance on reliability. An overall score may be included, but never alone and
never as a substitute for the vector.

```
skill: research.source_verification @ 1.1.0
cases: 40   runs per case: 5

accuracy              4
completeness          4
evidence_quality      5
reliability           3   (σ 0.8)
reproducibility       2   ← below bar
tool_efficiency       4
failure_detection     4
escalation_quality    3
governance_compliance 5

verdict: blocked on reproducibility — the definition underspecifies
         how conflicting sources are weighted
```

## Relationship to the registry

Three skills in the registry cover evaluation as a *capability*:
[`eval-set-design`](../content/skills/eval-set-design.yaml),
[`llm-judge-calibration`](../content/skills/llm-judge-calibration.yaml) and
[`failure-taxonomy`](../content/skills/failure-taxonomy.yaml).

They describe how an agent performs evaluation work. This document describes how
the Compendium evaluates its own skills. Where a model-based grader is used to
produce these scores, `llm-judge-calibration` applies: an uncalibrated judge's
scores are not reportable.

## Status

Version 0.1, experimental. The dimensions are stable enough to use; the scale
anchors and the deployment bar are the parts most likely to move as results
accumulate. Machine-readable results conform to
[`evaluation-schema.yaml`](evaluation-schema.yaml).

---

**Agent Skills Compendium**  
Created and originally architected by **Jerson Boyd Milan**  
https://jersonboydmilan.com/

© 2026 Jerson Boyd Milan
