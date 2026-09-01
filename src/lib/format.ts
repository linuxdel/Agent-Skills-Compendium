import type { Complexity, LayerId, Maturity, RiskLevel } from "./schema";

export const LAYER_NAMES: Record<LayerId, string> = {
  L1: "Cognitive",
  L2: "Knowledge",
  L3: "Action",
  L4: "Domain",
  L5: "Agentic",
};

/** Layer accent colours are defined as CSS variables so themes stay in one file. */
export const LAYER_VAR: Record<LayerId, string> = {
  L1: "var(--color-l1)",
  L2: "var(--color-l2)",
  L3: "var(--color-l3)",
  L4: "var(--color-l4)",
  L5: "var(--color-l5)",
};

export const COMPLEXITY_LABEL: Record<Complexity, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const MATURITY_LABEL: Record<Maturity, string> = {
  experimental: "Experimental",
  prototype: "Prototype",
  beta: "Beta",
  production: "Production",
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const BUILD_SPEED_LABEL: Record<number, string> = {
  1: "Deep build",
  2: "Moderate build",
  3: "Fast build",
};

export const SHAREABILITY_LABEL: Record<number, string> = {
  1: "Niche",
  2: "Useful",
  3: "Highly shareable",
};

export function ratingGlyphs(value: number, glyph: string): string {
  return glyph.repeat(value);
}

export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
