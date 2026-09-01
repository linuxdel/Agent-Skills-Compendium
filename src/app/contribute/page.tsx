import type { Metadata } from "next";
import Link from "next/link";
import { repository } from "@/lib/content-store";
import { Label } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "The admission standard for the Agent Skills Compendium, the canonical schema, and how a skill is added, versioned and retired.",
};

const TEN_QUESTIONS = [
  ["What does it do?", "description and purpose"],
  ["When should it be used?", "trigger"],
  ["What does it need?", "inputs and prerequisites"],
  ["What tools may it use?", "tools and dependencies"],
  ["How does it execute?", "procedure and decision rules"],
  ["How does it validate the result?", "validation"],
  ["What goes wrong?", "failure modes"],
  ["When should it stop?", "escalation"],
  ["What does it produce?", "outputs"],
  ["What does it connect to?", "related skills"],
];

export default async function ContributePage() {
  const [skills, categories] = await Promise.all([
    repository.listSkills(),
    repository.listCategories(),
  ]);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-12">
      <header className="border-b border-[var(--color-rule)] pb-8">
        <Label>Contribution standard</Label>
        <h1 className="mt-2 text-3xl font-medium tracking-[-0.02em] sm:text-4xl">Add a capability</h1>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          The registry admits capabilities, not prompts. A submission is a YAML document that
          validates against the canonical schema and answers ten questions completely. Incomplete
          entries are not published in a weaker form — they are returned.
        </p>
      </header>

      <section className="py-10">
        <div className="mb-5 border-t border-[var(--color-rule)] pt-5">
          <h2 className="text-lg font-medium">The ten questions</h2>
        </div>
        <ol className="grid gap-px border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2">
          {TEN_QUESTIONS.map(([question, field], i) => (
            <li key={question} className="bg-[var(--color-surface)] p-4">
              <span className="font-mono text-[0.75rem] tabular-nums text-[var(--color-ink-faint)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1.5 text-[0.9375rem]">{question}</p>
              <p className="label mt-1">{field}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-10">
        <div className="mb-5 border-t border-[var(--color-rule)] pt-5">
          <h2 className="text-lg font-medium">Admission rules</h2>
        </div>
        <ul className="divide-y divide-[var(--color-rule)] border border-[var(--color-rule)]">
          {[
            [
              "It must be a capability, not an instruction",
              "If the entry cannot state how it validates its own output, it is a prompt and belongs elsewhere.",
            ],
            [
              "Failure modes must be real",
              "Each failure mode must be one that has actually occurred or that follows from the procedure, with a mitigation that changes the procedure.",
            ],
            [
              "Escalation must be specific",
              "Name the condition and the recipient. 'Escalate if unsure' is not an escalation rule.",
            ],
            [
              "Relationships must resolve",
              "Every referenced skill must exist. The validator rejects dangling edges before publication.",
            ],
            [
              "Restricted actions are mandatory where risk is non-trivial",
              "Any skill above low risk must name what it may not do, in terms a runtime could enforce.",
            ],
            [
              "One skill, one outcome",
              "A submission covering two outcomes is split. Composite work belongs in the composer, not in a skill.",
            ],
          ].map(([title, body]) => (
            <li key={title} className="p-4">
              <p className="text-[0.9375rem] font-medium">{title}</p>
              <p className="mt-1.5 max-w-[70ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-10">
        <div className="mb-5 border-t border-[var(--color-rule)] pt-5">
          <h2 className="text-lg font-medium">How to submit</h2>
        </div>
        <ol className="space-y-4 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          <li>
            <span className="text-[var(--color-ink)]">1.</span> Copy an existing definition as a
            starting shape — every published skill exposes its YAML from its own page.
          </li>
          <li>
            <span className="text-[var(--color-ink)]">2.</span> Write the file to{" "}
            <code className="font-mono text-[0.875rem] text-[var(--color-ink)]">
              content/skills/&lt;slug&gt;.yaml
            </code>
            . The filename must match the slug.
          </li>
          <li>
            <span className="text-[var(--color-ink)]">3.</span> Run{" "}
            <code className="font-mono text-[0.875rem] text-[var(--color-ink)]">
              npm run validate:content
            </code>
            . It enforces the schema, resolves every relationship, checks that categories and layers
            exist and that every referenced tool is registered.
          </li>
          <li>
            <span className="text-[var(--color-ink)]">4.</span> Set the version. New skills start at{" "}
            <code className="font-mono text-[0.875rem] text-[var(--color-ink)]">1.0.0</code>; a
            procedure change is a minor bump; a change to inputs, outputs or validation is a major
            bump because it breaks consumers.
          </li>
        </ol>
      </section>

      <section className="py-10">
        <div className="mb-5 border-t border-[var(--color-rule)] pt-5">
          <h2 className="text-lg font-medium">Where coverage is thin</h2>
        </div>
        <div className="grid gap-px border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-4">
          {categories
            .map((c) => ({ c, count: skills.filter((s) => s.category === c.slug).length }))
            .sort((a, b) => a.count - b.count)
            .slice(0, 8)
            .map(({ c, count }) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-raised)]"
              >
                <span className="label tabular-nums">{count} skills</span>
                <span className="mt-1.5 block text-[0.9375rem]">{c.name}</span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
