/**
 * Agent Skills Compendium
 * Copyright © 2026 Jerson Boyd Milan
 */

/**
 * Exports each skill as a SKILL.md package — YAML frontmatter plus a rendered
 * body — into `dist/skills/<category>/<slug>/SKILL.md`.
 *
 * This is a REPRESENTATION, not a second source of truth. The canonical
 * definition is `content/skills/<slug>.yaml`; this exporter derives the
 * packaging form so the same capability can travel into ecosystems that expect
 * SKILL.md, without anyone maintaining two copies that drift apart.
 *
 * Output is generated on demand and is not committed. Run:
 *   npm run export:skills
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse, stringify } from "yaml";
import { skillFileSchema, type Skill } from "../src/lib/schema";

const OUT = join(process.cwd(), "dist", "skills");

function section(title: string, body: string): string {
  return body.trim() ? `## ${title}\n\n${body.trim()}\n\n` : "";
}

function render(skill: Skill): string {
  // Frontmatter kept deliberately small and conventional, so it is readable by
  // tools that expect a minimal SKILL.md header. The full specification lives
  // in the body and in the canonical YAML.
  const frontmatter = stringify(
    {
      name: skill.slug,
      description: skill.description,
      version: skill.version,
      category: skill.category.replace(/-/g, "_"),
      layer: skill.layer,
      risk: skill.risk_level,
      license: skill.license,
      author: skill.author,
    },
    { lineWidth: 100 },
  );

  let md = `---\n${frontmatter}---\n\n# ${skill.name}\n\n> ${skill.description}\n\n`;
  md += `<!-- Generated from content/skills/${skill.slug}.yaml — do not edit. -->\n\n`;

  md += section("Purpose", skill.purpose);
  md += section("Trigger", skill.trigger);

  md += section(
    "Inputs",
    ["| Name | Type | Required | Description |", "|---|---|---|---|"]
      .concat(
        skill.inputs.map(
          (i) => `| \`${i.name}\` | ${i.type} | ${i.required ? "yes" : "no"} | ${i.description} |`,
        ),
      )
      .join("\n"),
  );

  md += section("Tools", skill.tools.map((t) => `- \`${t}\``).join("\n"));
  md += section("Dependencies", skill.dependencies.map((d) => `- ${d}`).join("\n"));
  md += section(
    "Procedure",
    skill.procedure.map((s, i) => `${i + 1}. **${s.step}** — ${s.description}`).join("\n"),
  );
  md += section(
    "Decision rules",
    skill.decision_rules.map((r) => `- **If** ${r.condition} → ${r.action}`).join("\n"),
  );
  md += section("Outputs", skill.outputs.map((o) => `- \`${o.name}\` (${o.type}) — ${o.description}`).join("\n"));
  md += section("Validation", skill.validation.map((v) => `- [ ] ${v.check}`).join("\n"));
  md += section(
    "Failure modes",
    skill.failure_modes.map((f) => `- **${f.failure}**\n  - Mitigation: ${f.mitigation}`).join("\n"),
  );
  md += section(
    "Escalation",
    skill.escalation.map((e) => `- **When** ${e.condition} → ${e.action}`).join("\n"),
  );
  md += section(
    "Examples",
    skill.examples
      .map(
        (e) =>
          `### ${e.title}\n\n\`\`\`yaml\n${stringify({ input: e.input, output: e.output }).trim()}\n\`\`\``,
      )
      .join("\n\n"),
  );

  const rel = skill.related_skills;
  const relLines = [
    rel.prerequisites.length ? `- **Depends on:** ${rel.prerequisites.map((s) => `\`${s}\``).join(", ")}` : "",
    rel.successors.length ? `- **Can precede:** ${rel.successors.map((s) => `\`${s}\``).join(", ")}` : "",
    rel.complementary.length ? `- **Composes with:** ${rel.complementary.map((s) => `\`${s}\``).join(", ")}` : "",
    rel.related.length ? `- **Related:** ${rel.related.map((s) => `\`${s}\``).join(", ")}` : "",
  ].filter(Boolean);
  md += section("Related skills", relLines.join("\n"));

  md += section(
    "Governance",
    [
      `- **Risk level:** ${skill.risk_level}`,
      `- **Required permissions:** ${skill.required_permissions.map((p) => `\`${p}\``).join(", ") || "none"}`,
      `- **Restricted actions:**`,
      ...(skill.restricted_actions.length
        ? skill.restricted_actions.map((a) => `  - ${a}`)
        : ["  - none declared"]),
    ].join("\n"),
  );

  md += `---\n\nAgent Skills Compendium · © 2026 Jerson Boyd Milan · ${skill.license}\n`;
  return md;
}

rmSync(OUT, { recursive: true, force: true });
const dir = join(process.cwd(), "content", "skills");
let count = 0;
const byCategory = new Map<string, number>();

for (const file of readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
  const skill = skillFileSchema.parse(parse(readFileSync(join(dir, file), "utf8"))).skill;
  const target = join(OUT, skill.category, skill.slug);
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, "SKILL.md"), render(skill));
  count += 1;
  byCategory.set(skill.category, (byCategory.get(skill.category) ?? 0) + 1);
}

console.log(`exported ${count} SKILL.md packages into dist/skills/`);
console.log(`across ${byCategory.size} categories`);
