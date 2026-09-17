import Image, { type ImageProps } from "next/image";

import { withBasePath } from "@/lib/paths";

/**
 * `next/image` does not prefix a string `src` from `public/` with `basePath`.
 * SVG is served unoptimized (the browser requests `/images/...` as-is) and
 * the optimizer fetches raster files internally at that same URL — both 404
 * under `/happyretire` unless we prepend it here.
 */
export function PublicImage({ src, ...props }: ImageProps) {
  return (
    <Image src={typeof src === "string" ? withBasePath(src) : src} {...props} />
  );
}
