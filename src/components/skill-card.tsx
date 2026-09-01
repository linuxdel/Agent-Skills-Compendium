import Link from "next/link";
import { Label, LayerTag, Meter } from "./primitives";
import type { Category, Skill } from "@/lib/schema";

export function SkillCard({
  skill,
  category,
  compact = false,
}: {
  skill: Skill;
  category?: Category;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group flex h-full flex-col justify-between gap-4 border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-rule-strong)] focus-visible:border-[var(--color-accent)]"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span aria-hidden className="text-lg leading-none text-[var(--color-ink-faint)]">
            {category?.glyph ?? "◆"}
          </span>
          <LayerTag layer={skill.layer} withName={false} />
        </div>
        <h3 className="mt-4 text-pretty text-base font-medium leading-snug tracking-[-0.01em] group-hover:text-[var(--color-accent)]">
          {skill.name}
        </h3>
        {!compact ? (
          <p className="mt-2 line-clamp-3 text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
            {skill.description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-rule)] pt-3">
        <Label className="truncate">{category?.name ?? skill.category}</Label>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1" title={`Build speed ${skill.build_speed} of 3`}>
            <Label>BUILD</Label>
            <Meter value={skill.build_speed} label="Build speed" />
          </span>
          <span
            className="flex items-center gap-1"
            title={`Shareability ${skill.shareability} of 3`}
          >
            <Label>SHARE</Label>
            <Meter
              value={skill.shareability}
              label="Shareability"
              color="var(--color-accent)"
            />
          </span>
        </span>
      </div>
    </Link>
  );
}
