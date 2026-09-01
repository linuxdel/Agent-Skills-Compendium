/**
 * Agent Skills Compendium
 * Copyright © 2026 Jerson Boyd Milan
 */

import type { Skill } from "./schema";
import type { SkillFilters } from "./repository";

interface Scored<T> {
  item: T;
  score: number;
}

/** Cheap, deterministic fuzzy match: subsequence with contiguity bonus. */
function fuzzyScore(needle: string, haystack: string): number {
  if (!needle) return 0;
  const n = needle.toLowerCase();
  const h = haystack.toLowerCase();

  const exact = h.indexOf(n);
  if (exact === 0) return 100;
  if (exact > 0) return 70 - Math.min(20, exact / 4);

  let hi = 0;
  let matched = 0;
  let streak = 0;
  let bonus = 0;
  for (const ch of n) {
    const found = h.indexOf(ch, hi);
    if (found === -1) {
      streak = 0;
      continue;
    }
    matched += 1;
    bonus += found === hi ? (streak += 1) : (streak = 0);
    hi = found + 1;
  }
  if (matched < n.length) return 0;
  return 30 + Math.min(20, bonus);
}

const FIELD_WEIGHTS = {
  name: 3,
  slug: 2.5,
  tags: 2,
  description: 1.4,
  purpose: 0.8,
  trigger: 0.8,
  category: 1.2,
  domain: 1,
  tools: 0.8,
} as const;

export function scoreSkill(query: string, skill: Skill): number {
  if (!query.trim()) return 0;
  const terms = query.trim().toLowerCase().split(/\s+/);
  let total = 0;

  for (const term of terms) {
    let best = 0;
    best = Math.max(best, fuzzyScore(term, skill.name) * FIELD_WEIGHTS.name);
    best = Math.max(best, fuzzyScore(term, skill.slug) * FIELD_WEIGHTS.slug);
    best = Math.max(best, fuzzyScore(term, skill.description) * FIELD_WEIGHTS.description);
    best = Math.max(best, fuzzyScore(term, skill.purpose) * FIELD_WEIGHTS.purpose);
    best = Math.max(best, fuzzyScore(term, skill.trigger) * FIELD_WEIGHTS.trigger);
    best = Math.max(best, fuzzyScore(term, skill.category) * FIELD_WEIGHTS.category);
    if (skill.domain) best = Math.max(best, fuzzyScore(term, skill.domain) * FIELD_WEIGHTS.domain);
    for (const tag of skill.tags) best = Math.max(best, fuzzyScore(term, tag) * FIELD_WEIGHTS.tags);
    for (const tool of skill.tools) best = Math.max(best, fuzzyScore(term, tool) * FIELD_WEIGHTS.tools);
    if (best === 0) return 0; // every term must match somewhere
    total += best;
  }
  return total;
}

export function searchSkills(query: string, skills: Skill[]): Skill[] {
  if (!query.trim()) return skills;
  const scored: Scored<Skill>[] = [];
  for (const skill of skills) {
    const score = scoreSkill(query, skill);
    if (score > 0) scored.push({ item: skill, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .map((s) => s.item);
}

export function applyFilters(skills: Skill[], filters: SkillFilters): Skill[] {
  let out = skills;
  const has = (list: string[] | undefined) => list && list.length > 0;

  if (has(filters.category)) out = out.filter((s) => filters.category!.includes(s.category));
  if (has(filters.layer)) out = out.filter((s) => filters.layer!.includes(s.layer));
  if (has(filters.complexity)) out = out.filter((s) => filters.complexity!.includes(s.complexity));
  if (has(filters.maturity)) out = out.filter((s) => filters.maturity!.includes(s.maturity));
  if (has(filters.risk)) out = out.filter((s) => filters.risk!.includes(s.risk_level));
  if (has(filters.tag)) out = out.filter((s) => s.tags.some((t) => filters.tag!.includes(t)));
  if (filters.buildSpeed?.length) {
    out = out.filter((s) => filters.buildSpeed!.includes(s.build_speed));
  }
  if (filters.shareability?.length) {
    out = out.filter((s) => filters.shareability!.includes(s.shareability));
  }
  if (filters.q) out = searchSkills(filters.q, out);
  return out;
}

/** Parses the URLSearchParams shape used by /skills into typed filters. */
export function filtersFromParams(
  params: Record<string, string | string[] | undefined>,
): SkillFilters {
  const list = (key: string): string[] | undefined => {
    const value = params[key];
    if (!value) return undefined;
    const parts = Array.isArray(value) ? value : value.split(",");
    const cleaned = parts.map((p) => p.trim()).filter(Boolean);
    return cleaned.length ? cleaned : undefined;
  };
  const numbers = (key: string): number[] | undefined =>
    list(key)
      ?.map((v) => Number(v))
      .filter((n) => n === 1 || n === 2 || n === 3);

  const q = typeof params.q === "string" ? params.q : undefined;
  return {
    q,
    category: list("category"),
    layer: list("layer"),
    complexity: list("complexity"),
    maturity: list("maturity"),
    risk: list("risk"),
    tag: list("tag"),
    buildSpeed: numbers("speed"),
    shareability: numbers("share"),
  };
}
