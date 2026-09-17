export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Record<UtmKey, string>;

const STORAGE_KEY = "happyretire-utm";

export function emptyUtm(): UtmParams {
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  };
}

function sanitize(value: string): string {
  return value.trim().slice(0, 200);
}

export function readUtmParams(search: string): UtmParams {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const utm = emptyUtm();

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = sanitize(value);
  }

  return utm;
}

function hasUtm(utm: UtmParams): boolean {
  return UTM_KEYS.some((key) => utm[key] !== "");
}

/** อ่าน UTM จาก URL ถ้ามี แล้วจำไว้ใน session เพื่อไม่ให้หายตอนเปลี่ยน hash */
export function captureUtmParams(): UtmParams {
  if (typeof window === "undefined") return emptyUtm();

  const fromUrl = readUtmParams(window.location.search);
  if (hasUtm(fromUrl)) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {
      // private mode / quota — still return URL values
    }
    return fromUrl;
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyUtm();
    const parsed = JSON.parse(stored) as Partial<UtmParams>;
    return {
      ...emptyUtm(),
      ...Object.fromEntries(
        UTM_KEYS.map((key) => [key, sanitize(String(parsed[key] ?? ""))]),
      ),
    };
  } catch {
    return emptyUtm();
  }
}
