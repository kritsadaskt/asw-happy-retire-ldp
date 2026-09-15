import { config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getIcon, type IconKey } from "@/lib/icons";

// The FontAwesome stylesheet is imported once from globals.css, so the runtime
// must not inject a duplicate copy into <head>.
config.autoAddCss = false;

type IconProps = {
  name: IconKey;
  className?: string;
  /** decorative icons stay hidden from screen readers */
  title?: string;
};

export function Icon({ name, className, title }: IconProps) {
  return (
    <FontAwesomeIcon
      icon={getIcon(name)}
      className={className}
      title={title}
      aria-hidden={title ? undefined : true}
    />
  );
}
