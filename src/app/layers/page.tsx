import type { Metadata } from "next";
import Link from "next/link";
import { repository } from "@/lib/content-store";
import { LAYER_VAR } from "@/lib/format";
import { Label, LayerTag } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Architectural layers",
  description:
    "The five architectural layers of agent capability: cognitive, knowledge, action, domain and agentic.",
};

export default async function LayersPage() {
  const [layers, skills] = await Promise.all([repository.listLayers(), repository.listSkills()]);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="border-b border-[var(--color-rule)] pb-8">
        <Label>Architecture</Label>
        <h1 className="mt-2 text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          Five architectural layers
        </h1>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          The layer a skill belongs to determines what kind of failure it can produce and therefore
          what verification is appropriate. A cognitive failure shows up as bad downstream work; an
          action failure shows up in the world.
        </p>
      </header>

      <div className="mt-8 space-y-px border border-[var(--color-rule)] bg-[var(--color-rule)]">
        {layers.map((layer) => {
          const members = skills.filter((s) => s.layer === layer.id);
          return (
            <article key={layer.id} className="bg-[var(--color-surface)] p-6 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <span
                    aria-hidden
                    className="block h-1 w-10"
                    style={{ background: LAYER_VAR[layer.id] }}
                  />
                  <div className="mt-4 flex flex-wrap items-baseline gap-3">
                    <h2 className="text-2xl font-medium tracking-[-0.015em]">
                      <Link
                        href={`/layers/${layer.slug}`}
                        className="hover:text-[var(--color-accent)]"
                      >
                        {layer.id} · {layer.name}
                      </Link>
                    </h2>
                    <Label>{members.length} skills</Label>
                  </div>
                  <p className="mt-2 text-[0.9375rem] text-[var(--color-ink-muted)]">
                    {layer.tagline}
                  </p>
                  <p className="mt-4 max-w-[68ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                    {layer.description}
                  </p>
                  <p className="mt-4 border-l-2 pl-4 text-[0.9375rem] italic" style={{ borderColor: LAYER_VAR[layer.id] }}>
                    {layer.question}
                  </p>
                </div>
                <div className="border border-[var(--color-rule)] p-4">
                  <Label>Characteristics</Label>
                  <ul className="mt-2.5 space-y-1.5 text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
                    {layer.characteristics.map((c) => (
                      <li key={c}>— {c}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/layers/${layer.slug}`}
                    className="mt-4 inline-block font-mono text-[0.75rem] tracking-[0.04em] text-[var(--color-accent)]"
                  >
                    Browse {layer.id} skills →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {layers.map((l) => (
          <LayerTag key={l.id} layer={l.id} />
        ))}
      </div>
    </div>
  );
}
