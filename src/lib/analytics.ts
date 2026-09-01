"use client";

/**
 * Analytics event surface. Events are emitted to a queue on `window` so any
 * downstream collector can drain them without this codebase depending on a
 * specific vendor. Named events are the contract; the transport is not.
 */
export type AnalyticsEvent =
  | { name: "skill_view"; slug: string; category: string; layer: string }
  | { name: "skill_search"; query: string; results: number }
  | { name: "skill_filter"; facet: string; value: string }
  | { name: "skill_copy"; slug: string; format: "yaml" | "json" }
  | { name: "skill_download"; slug: string; format: "yaml" | "json" }
  | { name: "category_view"; slug: string }
  | { name: "layer_view"; layer: string }
  | { name: "composer_add"; slug: string }
  | { name: "composer_export"; count: number };

declare global {
  interface Window {
    __skillCompendiumEvents?: (AnalyticsEvent & { at: string })[];
  }
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const queue = (window.__skillCompendiumEvents ??= []);
  queue.push({ ...event, at: new Date().toISOString() });
  if (queue.length > 500) queue.splice(0, queue.length - 500);
}
