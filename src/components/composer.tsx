"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { LAYER_VAR } from "@/lib/format";
import type { LayerId } from "@/lib/schema";

export interface ComposerNode {
  slug: string;
  name: string;
  layer: LayerId;
  category: string;
  categoryName: string;
  description: string;
  trigger: string;
  prerequisites: string[];
  successors: string[];
  complementary: string[];
  requiredInputs: string[];
  outputs: string[];
  tools: string[];
  riskLevel: string;
  permissions: string[];
}

interface Props {
  nodes: ComposerNode[];
}

function orderByPrerequisites(selected: string[], byId: Map<string, ComposerNode>): string[] {
  const done = new Set<string>();
  const out: string[] = [];
  const visiting = new Set<string>();

  const visit = (slug: string) => {
    if (done.has(slug) || visiting.has(slug)) return;
    visiting.add(slug);
    const node = byId.get(slug);
    if (node) {
      for (const pre of node.prerequisites) if (selected.includes(pre)) visit(pre);
    }
    visiting.delete(slug);
    done.add(slug);
    out.push(slug);
  };

  for (const slug of selected) visit(slug);
  return out;
}

export function Composer({ nodes }: Props) {
  const byId = useMemo(() => new Map(nodes.map((n) => [n.slug, n])), [nodes]);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("Untitled workflow");

  const ordered = useMemo(() => orderByPrerequisites(selected, byId), [selected, byId]);
  const orderedNodes = ordered.map((s) => byId.get(s)!).filter(Boolean);

  const missingPrereqs = useMemo(() => {
    const missing = new Set<string>();
    for (const slug of selected) {
      for (const pre of byId.get(slug)?.prerequisites ?? []) {
        if (!selected.includes(pre)) missing.add(pre);
      }
    }
    return [...missing];
  }, [selected, byId]);

  const suggestions = useMemo(() => {
    const scores = new Map<string, number>();
    for (const slug of selected) {
      const node = byId.get(slug);
      if (!node) continue;
      for (const s of node.successors) if (!selected.includes(s)) scores.set(s, (scores.get(s) ?? 0) + 2);
      for (const c of node.complementary) if (!selected.includes(c)) scores.set(c, (scores.get(c) ?? 0) + 1);
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([slug]) => byId.get(slug))
      .filter((n): n is ComposerNode => Boolean(n));
  }, [selected, byId]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = nodes.filter((n) => !selected.includes(n.slug));
    if (!q) return pool.slice(0, 40);
    return pool
      .filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.slug.includes(q) ||
          n.categoryName.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q),
      )
      .slice(0, 40);
  }, [query, nodes, selected]);

  const add = useCallback((slug: string) => {
    setSelected((s) => (s.includes(slug) ? s : [...s, slug]));
    track({ name: "composer_add", slug });
  }, []);

  const remove = (slug: string) => setSelected((s) => s.filter((v) => v !== slug));

  const spec = useMemo(() => {
    const permissions = new Set<string>();
    const tools = new Set<string>();
    let highestRisk = "low";
    const rank = { low: 0, medium: 1, high: 2, critical: 3 } as const;
    for (const node of orderedNodes) {
      for (const p of node.permissions) permissions.add(p);
      for (const t of node.tools) tools.add(t);
      if (rank[node.riskLevel as keyof typeof rank] > rank[highestRisk as keyof typeof rank]) {
        highestRisk = node.riskLevel;
      }
    }
    return {
      workflow: {
        name,
        version: "0.1.0",
        composed_from: "agent-skills-compendium",
        aggregate_risk_level: highestRisk,
        required_permissions: [...permissions].sort(),
        tools: [...tools].sort(),
        steps: orderedNodes.map((node, i) => ({
          order: i + 1,
          skill: node.slug,
          layer: node.layer,
          category: node.category,
          trigger: node.trigger,
          required_inputs: node.requiredInputs,
          outputs: node.outputs,
        })),
      },
    };
  }, [orderedNodes, name]);

  const json = JSON.stringify(spec, null, 2);

  const copySpec = async () => {
    try {
      await navigator.clipboard.writeText(json);
      track({ name: "composer_export", count: orderedNodes.length });
    } catch {
      /* clipboard unavailable; the spec is displayed below for manual selection */
    }
  };

  const button =
    "border border-[var(--color-rule)] px-2.5 py-1.5 font-mono text-[0.6875rem] tracking-[0.06em] transition-colors hover:border-[var(--color-ink)]";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      {/* Picker */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-[var(--color-rule)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-rule)] px-4 py-3">
            <label htmlFor="composer-search" className="label">
              Add a skill
            </label>
            <input
              id="composer-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the registry…"
              className="mt-1.5 w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-[var(--color-ink-faint)]"
            />
          </div>
          <ul className="max-h-[26rem] divide-y divide-[var(--color-rule)] overflow-y-auto">
            {searchResults.map((node) => (
              <li key={node.slug}>
                <button
                  type="button"
                  onClick={() => add(node.slug)}
                  className="flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-[var(--color-raised)]"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full"
                    style={{ background: LAYER_VAR[node.layer] }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[0.875rem]">{node.name}</span>
                    <span className="label block truncate">{node.categoryName}</span>
                  </span>
                </button>
              </li>
            ))}
            {searchResults.length === 0 ? (
              <li className="px-4 py-6 text-center">
                <span className="label">No unselected skill matches</span>
              </li>
            ) : null}
          </ul>
        </div>

        {suggestions.length ? (
          <div className="mt-4 border border-[var(--color-rule)] p-4">
            <span className="label">Suggested next</span>
            <ul className="mt-2.5 space-y-1.5">
              {suggestions.map((node) => (
                <li key={node.slug}>
                  <button
                    type="button"
                    onClick={() => add(node.slug)}
                    className="text-left text-[0.875rem] text-[var(--color-accent)] hover:underline"
                  >
                    + {node.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Workflow */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3 border border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
          <div className="min-w-0 flex-1">
            <label htmlFor="workflow-name" className="label">
              Workflow name
            </label>
            <input
              id="workflow-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-transparent text-lg font-medium tracking-[-0.01em] outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" className={button} onClick={copySpec} disabled={!selected.length}>
              COPY SPEC
            </button>
            <button
              type="button"
              className={button}
              onClick={() => setSelected([])}
              disabled={!selected.length}
            >
              CLEAR
            </button>
          </div>
        </div>

        {missingPrereqs.length ? (
          <div className="mt-4 border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] p-4">
            <span className="label" style={{ color: "var(--color-accent-ink)" }}>
              Unmet prerequisites
            </span>
            <p className="mt-2 text-[0.875rem] text-[var(--color-accent-ink)]">
              This sequence depends on skills that are not in it.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {missingPrereqs.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => add(slug)}
                  className="border border-[var(--color-accent)]/50 bg-[var(--color-surface)] px-2.5 py-1 font-mono text-[0.6875rem] text-[var(--color-accent-ink)]"
                >
                  + {byId.get(slug)?.name ?? slug}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {orderedNodes.length === 0 ? (
          <div className="mt-4 border border-dashed border-[var(--color-rule-strong)] p-12 text-center">
            <p className="text-[0.9375rem] text-[var(--color-ink-muted)]">
              Add skills to compose a workflow.
            </p>
            <p className="label mt-2">
              Prerequisites are resolved automatically and ordered for execution
            </p>
          </div>
        ) : (
          <ol className="mt-4 divide-y divide-[var(--color-rule)] border border-[var(--color-rule)]">
            {orderedNodes.map((node, i) => (
              <li key={node.slug} className="grid gap-3 p-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]">
                <span className="font-mono text-[0.8125rem] tabular-nums text-[var(--color-ink-faint)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <Link
                    href={`/skills/${node.slug}`}
                    className="text-[0.9375rem] font-medium hover:text-[var(--color-accent)]"
                  >
                    {node.name}
                  </Link>
                  <p className="label mt-1">
                    {node.layer} · {node.categoryName} · risk {node.riskLevel}
                  </p>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
                    {node.description}
                  </p>
                  {node.requiredInputs.length ? (
                    <p className="mt-2 font-mono text-[0.75rem] text-[var(--color-ink-faint)]">
                      needs: {node.requiredInputs.join(", ")}
                    </p>
                  ) : null}
                  {node.outputs.length ? (
                    <p className="mt-1 font-mono text-[0.75rem] text-[var(--color-ink-faint)]">
                      produces: {node.outputs.join(", ")}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(node.slug)}
                  aria-label={`Remove ${node.name}`}
                  className="label self-start hover:text-[var(--color-ink)]"
                >
                  REMOVE
                </button>
              </li>
            ))}
          </ol>
        )}

        {orderedNodes.length ? (
          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="label">Agent specification</span>
              <span className="label">
                {spec.workflow.steps.length} steps · aggregate risk{" "}
                {spec.workflow.aggregate_risk_level}
              </span>
            </div>
            <pre className="mt-2 max-h-[26rem] overflow-auto border border-[var(--color-rule)] bg-[var(--color-raised)] p-4 font-mono text-[0.75rem] leading-relaxed">
              <code>{json}</code>
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
