/**
 * Agent Skills Compendium
 * Copyright © 2026 Jerson Boyd Milan
 */

/**
 * Content validator. Runs the canonical schema over every YAML file and then
 * checks referential integrity across the registry: categories, layers, tools
 * and every skill-to-skill relationship must resolve.
 *
 * Run with `npm run validate:content`. Exits non-zero on any error.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import {
  categorySchema,
  layerSchema,
  skillFileSchema,
  toolSchema,
  type Skill,
} from "../src/lib/schema";

const ROOT = join(process.cwd(), "content");
const errors: string[] = [];
const warnings: string[] = [];

const read = (p: string) => parse(readFileSync(join(ROOT, p), "utf8"));

const layers = (read("layers.yaml").layers as unknown[]).map((l) => layerSchema.parse(l));
const categories = (read("categories.yaml").categories as unknown[]).map((c) =>
  categorySchema.parse(c),
);
const tools = (read("tools.yaml").tools as unknown[]).map((t) => toolSchema.parse(t));

const categoryIds = new Set(categories.map((c) => c.slug));
const layerIds = new Set(layers.map((l) => l.id));
const toolIds = new Set(tools.map((t) => t.id));

const skills: Skill[] = [];
for (const file of readdirSync(join(ROOT, "skills")).filter((f) => f.endsWith(".yaml"))) {
  const parsed = skillFileSchema.safeParse(parse(readFileSync(join(ROOT, "skills", file), "utf8")));
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(`${file}: ${issue.path.join(".")} — ${issue.message}`);
    }
    continue;
  }
  const skill = parsed.data.skill;
  if (`${skill.slug}.yaml` !== file) {
    errors.push(`${file}: filename must match slug "${skill.slug}"`);
  }
  skills.push(skill);
}

const slugs = new Set(skills.map((s) => s.slug));
const ids = new Set<string>();

for (const skill of skills) {
  const where = `${skill.slug}`;
  if (ids.has(skill.id)) errors.push(`${where}: duplicate id "${skill.id}"`);
  ids.add(skill.id);

  if (!categoryIds.has(skill.category)) {
    errors.push(`${where}: unknown category "${skill.category}"`);
  }
  if (!layerIds.has(skill.layer)) {
    errors.push(`${where}: unknown layer "${skill.layer}"`);
  }
  for (const tool of skill.tools) {
    if (!toolIds.has(tool)) errors.push(`${where}: unknown tool "${tool}"`);
  }

  const relations: [string, string[]][] = [
    ["prerequisites", skill.prerequisites],
    ["related_skills.prerequisites", skill.related_skills.prerequisites],
    ["related_skills.complementary", skill.related_skills.complementary],
    ["related_skills.successors", skill.related_skills.successors],
    ["related_skills.related", skill.related_skills.related],
  ];
  for (const [field, refs] of relations) {
    for (const ref of refs) {
      if (ref === skill.slug) errors.push(`${where}: ${field} references itself`);
      else if (!slugs.has(ref)) errors.push(`${where}: ${field} → unknown skill "${ref}"`);
    }
  }

  const declared = new Set(skill.related_skills.prerequisites);
  for (const pre of skill.prerequisites) {
    if (!declared.has(pre)) {
      warnings.push(`${where}: prerequisite "${pre}" missing from related_skills.prerequisites`);
    }
  }
}

// Every category must have at least one skill, or the taxonomy overstates coverage.
for (const category of categories) {
  const count = skills.filter((s) => s.category === category.slug).length;
  if (count === 0) errors.push(`category "${category.slug}" has no skills`);
}
for (const layer of layers) {
  const count = skills.filter((s) => s.layer === layer.id).length;
  if (count === 0) errors.push(`layer "${layer.id}" has no skills`);
}
for (const tool of tools) {
  const count = skills.filter((s) => s.tools.includes(tool.id)).length;
  if (count === 0) warnings.push(`tool "${tool.id}" is referenced by no skill`);
}

console.log(
  `${skills.length} skills · ${categories.length} categories · ${layers.length} layers · ${tools.length} tools`,
);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.error(`  ERROR ${e}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\nContent valid${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
