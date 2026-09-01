import Link from "next/link";
import type { ReactNode } from "react";
import { LAYER_NAMES, LAYER_VAR } from "@/lib/format";
import type { LayerId } from "@/lib/schema";

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`label ${className}`}>{children}</span>;
}

export function LayerTag({ layer, withName = true }: { layer: LayerId; withName?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span
        aria-hidden
        className="inline-block size-1.5 rounded-full"
        style={{ background: LAYER_VAR[layer] }}
      />
      <span className="label" style={{ color: LAYER_VAR[layer] }}>
        {layer}
        {withName ? ` ${LAYER_NAMES[layer]}` : ""}
      </span>
    </span>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "quiet";
}) {
  const tones = {
    default: "border-[var(--color-rule)] text-[var(--color-ink-muted)]",
    accent:
      "border-[var(--color-accent)]/35 bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]",
    quiet: "border-transparent bg-[var(--color-raised)] text-[var(--color-ink-faint)]",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[0.6875rem] tracking-[0.06em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Rating meter: three slots, filled to `value`. Used for build speed and shareability. */
export function Meter({
  value,
  max = 3,
  label,
  color,
}: {
  value: number;
  max?: number;
  label: string;
  color?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${label}: ${value} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block h-2.5 w-1 rounded-[1px]"
          style={{
            background: i < value ? (color ?? "var(--color-ink)") : "var(--color-rule-strong)",
            opacity: i < value ? 1 : 0.5,
          }}
        />
      ))}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-t border-[var(--color-rule)] pt-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <Label>{eyebrow}</Label>
        <h2 className="mt-2 text-balance text-2xl font-medium tracking-[-0.015em] sm:text-3xl">
          {title}
        </h2>
        {lead ? (
          <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
            {lead}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 font-mono text-[0.75rem] tracking-[0.04em] text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-ink)] ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-tight max-w-[68ch] text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
      {children}
    </div>
  );
}
