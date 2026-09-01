/**
 * Agent Skills Compendium
 * Copyright © 2026 Jerson Boyd Milan
 */

import type { Category, Layer, Skill, Tool } from "./schema";

/**
 * The read contract every storage backend must satisfy.
 *
 * The v1 backend reads YAML off disk (see content-store.ts). Swapping in
 * Postgres, a KV store or a remote registry means implementing this interface —
 * no page, component or route reaches past it.
 */
export interface SkillRepository {
  listSkills(): Promise<Skill[]>;
  getSkill(slug: string): Promise<Skill | null>;
  listCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | null>;
  listLayers(): Promise<Layer[]>;
  getLayer(idOrSlug: string): Promise<Layer | null>;
  listTools(): Promise<Tool[]>;
  getTool(id: string): Promise<Tool | null>;
  listTags(): Promise<TagCount[]>;
  listDomains(): Promise<string[]>;
  listContributors(): Promise<Contributor[]>;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface Contributor {
  name: string;
  skillCount: number;
}

export interface RelatedSkillGroup {
  relation: "prerequisites" | "complementary" | "successors" | "related";
  label: string;
  skills: Skill[];
}

export interface SkillFilters {
  q?: string;
  category?: string[];
  layer?: string[];
  complexity?: string[];
  maturity?: string[];
  buildSpeed?: number[];
  shareability?: number[];
  tag?: string[];
  risk?: string[];
}
