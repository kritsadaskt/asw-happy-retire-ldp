import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  tone?: "paper" | "cream" | "cream-soft" | "navy";
  className?: string;
  innerClassName?: string;
  /** false = full-bleed content (used by the map section) */
  contained?: boolean;
  children: ReactNode;
};

const tones = {
  paper: "bg-paper text-navy",
  cream: "bg-cream text-navy",
  "cream-soft": "bg-cream-soft text-navy",
  navy: "bg-navy text-white",
} as const;

export function Section({
  id,
  tone = "paper",
  className,
  innerClassName,
  contained = true,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-14 md:py-20", tones[tone], className)}
    >
      {contained ? (
        <div className={cn("shell", innerClassName)}>{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="eyebrow text-navy/55">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-lg font-medium text-navy/80 md:text-xl">
          {subtitle}
        </p>
      ) : null}
      {description ? (
        <p className="mt-2 text-sm text-navy/65 md:text-base">{description}</p>
      ) : null}
    </div>
  );
}
