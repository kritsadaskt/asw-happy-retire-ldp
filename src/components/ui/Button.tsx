import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { IconKey } from "@/lib/icons";

type Variant = "primary" | "outline" | "cream" | "ghost" | "line";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-3 rounded-full font-bold whitespace-nowrap transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white shadow-card hover:bg-navy-deep active:translate-y-px",
  outline:
    "border-2 border-navy/25 bg-white/90 text-navy hover:border-navy hover:bg-white",
  cream: "bg-cream text-navy hover:bg-cream-deep",
  ghost: "text-navy hover:bg-navy/5",
  line: "bg-line-green text-white shadow-card hover:brightness-95 focus-visible:outline-line-green",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

type SharedProps = {
  variant?: Variant;
  size?: Size;
  icon?: IconKey;
  trailingIcon?: IconKey;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: Pick<SharedProps, "variant" | "size" | "className">) {
  return cn(base, variants[variant], sizes[size], className);
}

function Inner({
  icon,
  trailingIcon,
  loading,
  children,
}: Pick<SharedProps, "icon" | "trailingIcon" | "loading" | "children">) {
  return (
    <>
      {loading ? (
        <Icon name="spinner" className="animate-spin text-[0.9em]" />
      ) : icon ? (
        <Icon name={icon} className="text-[0.9em]" />
      ) : null}
      <span>{children}</span>
      {!loading && trailingIcon ? (
        <Icon
          name={trailingIcon}
          className="text-[0.85em] transition-transform duration-200 group-hover:translate-x-1"
        />
      ) : null}
    </>
  );
}

type ButtonProps = SharedProps &
  Omit<ComponentProps<"button">, "className" | "children">;

export function Button({
  variant,
  size,
  icon,
  trailingIcon,
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={buttonClass({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <Inner icon={icon} trailingIcon={trailingIcon} loading={loading}>
        {children}
      </Inner>
    </button>
  );
}

type ButtonLinkProps = SharedProps & {
  href: string;
  external?: boolean;
  ariaLabel?: string;
};

export function ButtonLink({
  href,
  external,
  ariaLabel,
  variant,
  size,
  icon,
  trailingIcon,
  className,
  children,
}: ButtonLinkProps) {
  const inner = (
    <Inner icon={icon} trailingIcon={trailingIcon}>
      {children}
    </Inner>
  );
  const classes = buttonClass({ variant, size, className });

  // Anchor links, tel: and external URLs bypass the router; keep them as <a>
  // so no client-side navigation is attempted.
  if (external || href.startsWith("#") || !href.startsWith("/")) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={classes}>
      {inner}
    </Link>
  );
}
