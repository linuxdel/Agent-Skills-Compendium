import Link from "next/link";
import { repository } from "@/lib/content-store";
import { LAYER_NAMES } from "@/lib/format";
import { SearchDialog, type SearchEntry } from "./search-dialog";

const NAV = [
  { href: "/skills", label: "Skills" },
  { href: "/categories", label: "Categories" },
  { href: "/layers", label: "Layers" },
  { href: "/compose", label: "Composer" },
  { href: "/contribute", label: "Contribute" },
];

async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [skills, categories, layers] = await Promise.all([
    repository.listSkills(),
    repository.listCategories(),
    repository.listLayers(),
  ]);

  const entries: SearchEntry[] = [];
  for (const layer of layers) {
    entries.push({
      kind: "layer",
      slug: layer.slug,
      href: `/layers/${layer.slug}`,
      name: `${layer.id} · ${layer.name}`,
      context: layer.tagline,
      haystack: `${layer.name} ${layer.tagline} ${layer.description}`.toLowerCase(),
    });
  }
  for (const category of categories) {
    entries.push({
      kind: "category",
      slug: category.slug,
      href: `/categories/${category.slug}`,
      name: category.name,
      context: `${skills.filter((s) => s.category === category.slug).length} skills`,
      haystack: `${category.name} ${category.description}`.toLowerCase(),
    });
  }
  for (const skill of skills) {
    entries.push({
      kind: "skill",
      slug: skill.slug,
      href: `/skills/${skill.slug}`,
      name: skill.name,
      context: `${skill.layer} ${LAYER_NAMES[skill.layer]} · ${skill.category.replace(/-/g, " ")}`,
      haystack:
        `${skill.name} ${skill.slug} ${skill.description} ${skill.purpose} ${skill.tags.join(" ")} ${skill.tools.join(" ")}`.toLowerCase(),
    });
  }
  return entries;
}

export async function SiteHeader() {
  const entries = await buildSearchIndex();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[var(--color-paper)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex min-w-0 items-baseline gap-2.5">
          <span aria-hidden className="font-mono text-sm text-[var(--color-accent)]">
            ⁂
          </span>
          <span className="truncate text-[0.9375rem] font-medium tracking-[-0.01em]">
            Agent Skills Compendium
          </span>
        </Link>
        <nav className="hidden shrink-0 items-center gap-6 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[0.75rem] tracking-[0.04em] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SearchDialog entries={entries} />
      </div>
      <nav
        className="flex gap-5 overflow-x-auto border-t border-[var(--color-rule)] px-5 py-2 lg:hidden"
        aria-label="Primary mobile"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap font-mono text-[0.75rem] tracking-[0.04em] text-[var(--color-ink-muted)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export async function SiteFooter() {
  const [skills, categories, layers] = await Promise.all([
    repository.listSkills(),
    repository.listCategories(),
    repository.listLayers(),
  ]);

  return (
    <footer className="mt-24 border-t border-[var(--color-rule)]">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="label">Registry</span>
          <p className="mt-3 text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
            {skills.length} specified skills across {categories.length} categories and{" "}
            {layers.length} architectural layers. Every definition is machine-readable.
          </p>
        </div>
        <div>
          <span className="label">Browse</span>
          <ul className="mt-3 space-y-1.5 text-[0.875rem]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="label">Machine interface</span>
          <ul className="mt-3 space-y-1.5 font-mono text-[0.8125rem] text-[var(--color-ink-muted)]">
            <li>
              <Link href="/api/skills" className="hover:text-[var(--color-ink)]">
                GET /api/skills
              </Link>
            </li>
            <li>
              <Link href="/api/categories" className="hover:text-[var(--color-ink)]">
                GET /api/categories
              </Link>
            </li>
            <li>
              <Link href="/api/layers" className="hover:text-[var(--color-ink)]">
                GET /api/layers
              </Link>
            </li>
            <li>
              <Link href="/api/search?q=incident" className="hover:text-[var(--color-ink)]">
                GET /api/search
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <span className="label">Definition</span>
          <p className="mt-3 text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
            A tool is something an agent can use. A skill is something an agent knows how to
            accomplish — and how to verify that it did.
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--color-rule)]">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-5 py-5">
          <span className="label">
            Created and originally architected by{" "}
            <a
              href="https://jersonboydmilan.com/"
              rel="author noopener noreferrer"
              target="_blank"
              className="text-[var(--color-ink-muted)] underline decoration-[var(--color-rule-strong)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
            >
              Jerson Boyd Milan
            </a>
          </span>
          <span className="label">© 2026 Jerson Boyd Milan · Definitions CC-BY-4.0</span>
        </div>
      </div>
    </footer>
  );
}
