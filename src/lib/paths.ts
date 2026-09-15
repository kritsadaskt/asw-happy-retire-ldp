/**
 * The app is served from https://assetwise.co.th/happyretire in production.
 * `next/link`, `next/image` and route handlers get the `basePath` prefix
 * automatically — use this helper for the handful of places that build a URL
 * by hand (plain <img>, CSS url(), og:image, JSON-LD, ...).
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://assetwise.co.th";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (!basePath) return path;
  if (path.startsWith(`${basePath}/`) || path === basePath) return path;
  return `${basePath}${path}`;
}

export function absoluteUrl(path: string): string {
  return new URL(withBasePath(path), siteOrigin).toString();
}
