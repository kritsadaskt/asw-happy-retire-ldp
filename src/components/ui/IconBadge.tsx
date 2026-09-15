import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { IconKey } from "@/lib/icons";

type IconBadgeProps = {
  name: IconKey;
  tone?: "cream" | "navy" | "outline" | "plain";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const tones = {
  cream: "bg-cream text-navy",
  navy: "bg-navy text-cream",
  outline: "border border-navy/15 bg-white text-navy",
  plain: "text-navy",
} as const;

const sizes = {
  sm: "size-9 text-sm",
  md: "size-12 text-lg",
  lg: "size-14 text-xl",
} as const;

export function IconBadge({
  name,
  tone = "cream",
  size = "md",
  className,
}: IconBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      <Icon name={name} />
    </span>
  );
}
