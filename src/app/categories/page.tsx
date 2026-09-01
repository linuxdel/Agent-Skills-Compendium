import type { Metadata } from "next";
import Link from "next/link";
import { repository } from "@/lib/content-store";
import { Label, LayerTag } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "The twenty categories of the Agent Skills Compendium, from research and engineering through to agent security and deployment.",
};

export default async function CategoriesPage() {
  const [categories, skills] = await Promise.all([
    repository.listCategories(),
    repository.listSkills(),
  ]);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="border-b border-[var(--color-rule)] pb-8">
        <Label>Skill universe</Label>
        <h1 className="mt-2 text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          {categories.length} categories
        </h1>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          Categories describe the domain of work. Layers describe the kind of work. A skill has
          exactly one of each, and the taxonomy is stored as data so it can grow without a code
          change.
        </p>
      </header>

      <div className="mt-8 grid gap-px border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2">
        {categories.map((category) => {
          const members = skills.filter((s) => s.category === category.slug);
          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex flex-col justify-between gap-5 bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-raised)]"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <span aria-hidden className="text-xl text-[var(--color-ink-faint)]">
                    {category.glyph}
                  </span>
                  <span className="label tabular-nums">{members.length} skills</span>
                </div>
                <h2 className="mt-4 text-lg font-medium tracking-[-0.01em] group-hover:text-[var(--color-accent)]">
                  {category.name}
                </h2>
                <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {category.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-rule)] pt-3">
                {category.primary_layers.map((layer) => (
                  <LayerTag key={layer} layer={layer} />
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
