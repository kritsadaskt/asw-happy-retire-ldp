import { z } from "zod";

import type {
  Project,
  ProjectStatus,
  ProjectType,
  Zone,
  ZoneId,
} from "@/content/projects";
import { zones } from "@/content/projects";
import allProjects from "@/data/all-projects.json";

/** พิกัดกลางกรุงเทพฯ ที่ API ใส่ไว้เมื่อยังไม่มีที่ตั้งจริง */
const PLACEHOLDER_CENTER = { lat: 13.7563, lng: 100.5018 };

const FALLBACK_URL = "https://www.assetwise.co.th/";

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
  cis_project_id: z.union([z.string(), z.number()]).optional(),
  price: z.union([z.string(), z.number()]).optional().default(""),
  address: z
    .object({
      th: z.string().optional().default(""),
      en: z.string().optional().default(""),
    })
    .optional(),
});

type WpProject = z.infer<typeof wpProjectSchema>;

/** โซนตามลิสต์ Location ของแคมเปญ — โครงการที่ไม่อยู่ในนี้จะไม่แสดงบนแผนที่ */
const ZONE_BY_PROJECT_KEY: Record<string, MapZone> = {
  "kave-embryo": "rangsit-pathumthani",
  "atmoz-kanaal-rangsit": "rangsit-pathumthani",
  "modiz-avantgarde": "rangsit-pathumthani",
  kavalon: "rangsit-pathumthani",
  "kave-wonderland": "rangsit-pathumthani",
  "kave-carnival-rangsit": "rangsit-pathumthani",
  "esta-rangsit-klong2": "rangsit-pathumthani",
  "the-arbor-donmueang": "rangsit-pathumthani",
  "wisehouse-rangsit": "rangsit-pathumthani",

  "atmoz-portrait-srisaman": "srisaman-chaengwattana",

  "modiz-vault-kaset-sripatum": "kaset-phaholyothin",
  "kave-ally-chaengwattana": "kaset-phaholyothin",

  "atmoz-palacio-ladprao-wanghin": "ratchada-ladprao",
  maroonratchada32: "ratchada-ladprao",
  "kave-playground": "ratchada-ladprao",
  "modiz-collection-bangpho": "ratchada-ladprao",

  "modiz-sukhumvit50": "sukhumvit-bangna",
  "atmoz-oasis-onnut": "sukhumvit-bangna",
  "atmoz-bangna": "sukhumvit-bangna",
  "atmoz-de-sol-thipphawanstation": "sukhumvit-bangna",

  "atmoz-season-ladkrabang": "ladkrabang-srinakarin",
  "atmoz-flow-minburi": "ladkrabang-srinakarin",
  "modiz-rhyme": "ladkrabang-srinakarin",
  "modiz-voyage-srinakarin": "ladkrabang-srinakarin",

  "kave-pop-salaya": "salaya-nakhonpathom",
  "kave-genesis": "salaya-nakhonpathom",
  "kave-luminous-bangmod": "salaya-nakhonpathom",
  "esta-serenity-boromratchachonnani": "salaya-nakhonpathom",
  "chann-theriverside": "salaya-nakhonpathom",

  "kave-coco-bangsaen": "eec",
  "kave-univers-bangsaen": "eec",
  "atmoz-serene-sriracha": "eec",
  "atmoz-canvas-rayong": "eec",
  "aquarous-jomtien-pattaya": "eec",

  "the-arbor-ramintra": "ramintra-watcharapol",
  "the-honor-yothinpattana": "ramintra-watcharapol",
};

/** API ใส่พิกัดกลางกรุงเทพฯ ไว้เมื่อยังไม่มีที่ตั้งจริง */
const COORDINATE_OVERRIDES: Record<string, { lat: number; lng: number }> = {
  "esta-rangsit-klong2": { lat: 14.0164, lng: 100.6612 },
  "wisehouse-rangsit": { lat: 13.9905, lng: 100.6082 },
};

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

function toCisProjectId(value: string | number | undefined): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function toMapProject(item: WpProject): Project | null {
  const zone = ZONE_BY_PROJECT_KEY[item.key];
  if (!zone) return null;

  const status = toProjectStatus(item.status);
  if (!status) return null;

  const override = COORDINATE_OVERRIDES[item.key];
  const lat = override?.lat ?? Number(item.coordinates.latitude);
  const lng = override?.lng ?? Number(item.coordinates.longitude);
  if (!hasRealCoordinates(lat, lng)) return null;

  return {
    id: item.key || String(item.id),
    name: projectName(item.title),
    zone,
    status,
    type: toProjectType(item.type),
    location: projectLocation(item),
    priceFrom: formatPrice(item.price),
    url: item.webLink.trim() || FALLBACK_URL,
    cisProjectId: toCisProjectId(item.cis_project_id),
    position: { lat, lng },
  };
}

export function parseMapProjects(payload: unknown): Project[] {
  if (!Array.isArray(payload)) {
    throw new Error("projects snapshot is not an array");
  }

  return payload
    .flatMap((item) => {
      const parsed = wpProjectSchema.safeParse(item);
      if (!parsed.success) return [];
      const project = toMapProject(parsed.data);
      return project ? [project] : [];
    })
    .sort((a, b) => {
      const rankA = STATUS_RANK[a.status] ?? 2;
      const rankB = STATUS_RANK[b.status] ?? 2;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name, "th");
    });
}

/**
 * Pins for the map, parsed once from the bundled snapshot at
 * `src/data/all-projects.json` (copy of `/wp-json/wp/v2/all-projects`).
 */
export const mapProjects = parseMapProjects(allProjects);

export type ProjectSelectGroup = {
  label: string;
  options: { value: string; label: string }[];
};

export function getProjectSelectGroups(
  projects: Project[],
): ProjectSelectGroup[] {
  const byZone = new Map<Exclude<ZoneId, "all">, { value: string; label: string }[]>();

  for (const project of [...projects].sort((a, b) =>
    a.name.localeCompare(b.name, "th"),
  )) {
    const list = byZone.get(project.zone) ?? [];
    if (!project.cisProjectId) continue;
    list.push({ value: project.id, label: project.name });
    byZone.set(project.zone, list);
  }

  return zones
    .filter((zone): zone is Zone & { id: Exclude<ZoneId, "all"> } => zone.id !== "all")
    .map((zone) => ({
      label: zone.label,
      options: byZone.get(zone.id) ?? [],
    }))
    .filter((group) => group.options.length > 0);
}

export function findMapProject(id: string, projects: Project[] = mapProjects) {
  return projects.find((project) => project.id === id) ?? null;
}
