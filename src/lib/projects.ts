import { z } from "zod";

import type {
  Project,
  ProjectStatus,
  ProjectType,
  ZoneId,
} from "@/content/projects";

const PROJECTS_API =
  process.env.ASW_PROJECTS_API_URL?.trim() ||
  "https://assetwise.co.th/wp-json/wp/v2/all-projects";

const REVALIDATE_SECONDS = 60 * 60;
const FETCH_TIMEOUT_MS = 8_000;

/** พิกัดกลางกรุงเทพฯ ที่ API ใส่ไว้เมื่อยังไม่มีที่ตั้งจริง */
const PLACEHOLDER_CENTER = { lat: 13.7563, lng: 100.5018 };

const FALLBACK_URL = "https://www.assetwise.co.th/project";

type MapZone = Exclude<ZoneId, "all">;

const wpLocationSchema = z.union([
  z.array(z.unknown()),
  z.object({
    name_th: z.string().optional().default(""),
    name_en: z.string().optional().default(""),
    key: z.string().optional().default(""),
  }),
]);

const wpProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  key: z.string(),
  webLink: z.string().optional().default(""),
  status: z.string().optional().default(""),
  type: z.string().optional().default("condominium"),
  coordinates: z.object({
    latitude: z.union([z.string(), z.number()]),
    longitude: z.union([z.string(), z.number()]),
  }),
  location: wpLocationSchema.optional(),
  price: z.union([z.string(), z.number()]).optional().default(""),
  address: z
    .object({
      th: z.string().optional().default(""),
      en: z.string().optional().default(""),
    })
    .optional(),
});

type WpProject = z.infer<typeof wpProjectSchema>;

const ZONE_BY_LOCATION_KEY: Record<string, MapZone> = {
  rangsit: "rangsit-pathumthani",
  "chaeng-phahon": "srisaman-chaengwattana",
  "donmueang-chaengwatthana": "srisaman-chaengwattana",
  "pak-kret": "srisaman-chaengwattana",
  phaholyothin: "kaset-phaholyothin",
  "เกษตร-ศรีปทุม": "kaset-phaholyothin",
  ramintra: "kaset-phaholyothin",
  "ramintra-watcharapol": "kaset-phaholyothin",
  ratchada: "ratchada-ladprao",
  ladprao: "ratchada-ladprao",
  "ลาดพร้าว-วังหิน": "ratchada-ladprao",
  bangpho: "ratchada-ladprao",
  บางโพ: "ratchada-ladprao",
  sukhumvit: "sukhumvit-bangna",
  bangna: "sukhumvit-bangna",
  bangmod: "sukhumvit-bangna",
  onnut: "sukhumvit-bangna",
  thipphawanstation: "sukhumvit-bangna",
  ladkrabang: "ladkrabang-srinakarin",
  srinakarin: "ladkrabang-srinakarin",
  minburi: "ladkrabang-srinakarin",
  มีนบุรี: "ladkrabang-srinakarin",
  ramkhamhaeng: "ladkrabang-srinakarin",
  praditmanutham: "ladkrabang-srinakarin",
  salaya: "salaya-nakhonpathom",
  ศาลายา: "salaya-nakhonpathom",
  "nakhon-pathom": "salaya-nakhonpathom",
  boromratchachonnani: "salaya-nakhonpathom",
  pattaya: "eec",
  bangsaen: "eec",
  rayong: "eec",
  sriracha: "eec",
};

const ZONE_BY_LOCATION_NAME: Record<string, MapZone> = {
  รังสิต: "rangsit-pathumthani",
  ปากเกร็ด: "srisaman-chaengwattana",
  "แจ้งวัฒนะ-พหลโยธิน": "srisaman-chaengwattana",
  "ดอนเมือง-แจ้งวัฒนะ": "srisaman-chaengwattana",
  พหลโยธิน: "kaset-phaholyothin",
  "เกษตร - ศรีปทุม": "kaset-phaholyothin",
  "เกษตร-ศรีปทุม": "kaset-phaholyothin",
  รามอินทรา: "kaset-phaholyothin",
  "รามอินทรา-วัชรพล": "kaset-phaholyothin",
  รัชดา: "ratchada-ladprao",
  ลาดพร้าว: "ratchada-ladprao",
  "ลาดพร้าว - วังหิน": "ratchada-ladprao",
  "ติด mrt บางโพ": "ratchada-ladprao",
  สุขุมวิท: "sukhumvit-bangna",
  บางนา: "sukhumvit-bangna",
  บางมด: "sukhumvit-bangna",
  อ่อนนุช: "sukhumvit-bangna",
  ทิพวัล: "sukhumvit-bangna",
  ลาดกระบัง: "ladkrabang-srinakarin",
  ศรีนครินทร์: "ladkrabang-srinakarin",
  มีนบุรี: "ladkrabang-srinakarin",
  รามคำแหง: "ladkrabang-srinakarin",
  ประดิษฐ์มนูธรรม: "ladkrabang-srinakarin",
  ศาลายา: "salaya-nakhonpathom",
  นครปฐม: "salaya-nakhonpathom",
  บรมราชชนนี: "salaya-nakhonpathom",
  พัทยา: "eec",
  บางแสน: "eec",
  ระยอง: "eec",
  ศรีราชา: "eec",
};

function normalizePlace(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\s+/g, " ");
}

function decodeLocationKey(key: string): string {
  try {
    return decodeURIComponent(key).trim().toLowerCase();
  } catch {
    return key.trim().toLowerCase();
  }
}

function zoneFromCoordinates(lat: number, lng: number): MapZone {
  if (lat < 13.35 && lng > 100.8) return "eec";
  if (lng < 100.4) return "salaya-nakhonpathom";
  if (lat > 13.95) return "rangsit-pathumthani";
  if (lat > 13.86 && lng < 100.62) return "srisaman-chaengwattana";
  if (lat > 13.83 && lng < 100.65) return "kaset-phaholyothin";
  if (lat < 13.72) return "sukhumvit-bangna";
  if (lng > 100.63) return "ladkrabang-srinakarin";
  return "ratchada-ladprao";
}

function resolveZone(item: WpProject, lat: number, lng: number): MapZone {
  if (item.location && !Array.isArray(item.location)) {
    if (item.location.key) {
      const byKey = ZONE_BY_LOCATION_KEY[decodeLocationKey(item.location.key)];
      if (byKey) return byKey;
    }
    if (item.location.name_th) {
      const byName = ZONE_BY_LOCATION_NAME[normalizePlace(item.location.name_th)];
      if (byName) return byName;
    }
  }
  return zoneFromCoordinates(lat, lng);
}

const STATUS_RANK: Record<string, number> = {
  new_project: 0,
  ready_project: 1,
};

function hasRealCoordinates(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  return !(
    Math.abs(lat - PLACEHOLDER_CENTER.lat) < 0.00015 &&
    Math.abs(lng - PLACEHOLDER_CENTER.lng) < 0.00015
  );
}

function decodeHtml(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCharCode(parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");
}

function projectName(title: string): string {
  const cleaned = decodeHtml(title)
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const primary = cleaned.split("|")[0]?.trim() || cleaned;

  if (primary.length <= 48) return primary;

  const latin = primary.match(/^[A-Za-z0-9][A-Za-z0-9 .'\-/–—]*/);
  if (latin && latin[0].trim().length >= 3) return latin[0].trim();

  return `${primary.slice(0, 48).trimEnd()}…`;
}

function projectLocation(item: WpProject): string {
  if (item.location && !Array.isArray(item.location) && item.location.name_th) {
    return item.location.name_th.trim();
  }
  return item.address?.th?.trim() ?? "";
}

function formatPrice(price: string | number): string {
  const raw = String(price).trim();
  if (!raw) return "";
  return `เริ่ม ${raw} ลบ.`;
}

function toProjectStatus(status: string): ProjectStatus | null {
  if (status === "ready_project" || status === "new_project") return status;
  return null;
}

function toProjectType(type: string): ProjectType {
  return type === "house" ? "house" : "condominium";
}

function toMapProject(item: WpProject): Project | null {
  const status = toProjectStatus(item.status);
  if (!status) return null;

  const lat = Number(item.coordinates.latitude);
  const lng = Number(item.coordinates.longitude);
  if (!hasRealCoordinates(lat, lng)) return null;

  return {
    id: item.key || String(item.id),
    name: projectName(item.title),
    zone: resolveZone(item, lat, lng),
    status,
    type: toProjectType(item.type),
    location: projectLocation(item),
    priceFrom: formatPrice(item.price),
    url: item.webLink.trim() || FALLBACK_URL,
    position: { lat, lng },
  };
}

export async function getMapProjects(): Promise<Project[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(PROJECTS_API, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(`[projects] API ${response.status} ${response.statusText}`);
      return [];
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) return [];

    const projects = payload.flatMap((item) => {
      const parsed = wpProjectSchema.safeParse(item);
      if (!parsed.success) return [];
      const project = toMapProject(parsed.data);
      return project ? [project] : [];
    });

    return projects.sort((a, b) => {
      const rankA = STATUS_RANK[a.status] ?? 2;
      const rankB = STATUS_RANK[b.status] ?? 2;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name, "th");
    });
  } catch (error) {
    console.error(
      "[projects] failed to load all-projects",
      error instanceof Error ? error.message : error,
    );
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
