/**
 * Agent Skills Compendium
 * Copyright © 2026 Jerson Boyd Milan
 */

import { stringify } from "yaml";
import type { Skill } from "./schema";

/**
 * Machine-readable export. The YAML form is byte-comparable with the source
 * file's shape (`skill:` root) so a downloaded definition can be dropped back
 * into a content directory unchanged.
 */
export function toYaml(skill: Skill): string {
  return stringify({ skill }, { lineWidth: 100, defaultStringType: "PLAIN" });
}

export function toJson(skill: Skill): string {
  return `${JSON.stringify({ skill }, null, 2)}\n`;
}

export function exportFilename(skill: Skill, format: "yaml" | "json"): string {
  return `${skill.slug}.${format}`;
}
