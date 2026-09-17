import type { IconKey } from "./types";

export type ZoneId =
  | "all"
  | "rangsit-pathumthani"
  | "srisaman-chaengwattana"
  | "kaset-phaholyothin"
  | "ratchada-ladprao"
  | "sukhumvit-bangna"
  | "ladkrabang-srinakarin"
  | "salaya-nakhonpathom"
  | "eec"
  | "ramintra-watcharapol";

export type Zone = {
  id: ZoneId;
  label: string;
  caption?: string;
  icon: IconKey;
};

export type ProjectStatus = "new_project" | "ready_project";

export type ProjectType = "condominium" | "house";

export type Project = {
  id: string;
  name: string;
  zone: Exclude<ZoneId, "all">;
  status: ProjectStatus;
  type: ProjectType;
  /** ทำเล / จุดเด่นสั้น ๆ ที่แสดงในกล่องลิสต์ */
  location: string;
  priceFrom: string;
  /** ลิงก์ไปหน้าโครงการจริง เปิดในแท็บใหม่ */
  url: string;
  /** รหัสโครงการใน CIS (`cis_project_id` จาก snapshot) */
  cisProjectId: number | null;
  /** พิกัดจาก snapshot `src/data/all-projects.json` */
  position: { lat: number; lng: number };
};

export const projectTypeMeta: Record<
  ProjectType,
  { icon: IconKey; label: string }
> = {
  condominium: { icon: "building", label: "คอนโด" },
  house: { icon: "house", label: "บ้าน" },
};

export function getProjectTypeMeta(type: string | undefined) {
  return type === "house" ? projectTypeMeta.house : projectTypeMeta.condominium;
}

export const zones: Zone[] = [
  { id: "all", label: "ทุกโซน", icon: "grid" },
  { id: "rangsit-pathumthani", label: "รังสิต–ปทุมธานี", icon: "train" },
  { id: "srisaman-chaengwattana", label: "ศรีสมาน–แจ้งวัฒนะ", icon: "pin" },
  { id: "kaset-phaholyothin", label: "เกษตร–พหลโยธิน", icon: "leaf" },
  { id: "ratchada-ladprao", label: "รัชดา–ลาดพร้าว–บางโพ", icon: "building" },
  { id: "sukhumvit-bangna", label: "สุขุมวิท–บางนา", icon: "gem" },
  { id: "ladkrabang-srinakarin", label: "ลาดกระบัง–ศรีนครินทร์", icon: "city" },
  { id: "salaya-nakhonpathom", label: "ศาลายา–นครปฐม", icon: "tree-city" },
  { id: "eec", label: "EEC", icon: "sun" },
  { id: "ramintra-watcharapol", label: "รามอินทรา–วัชรพล", icon: "map" },
];

export const projectsSection = {
  eyebrow: "PROJECT LOCATION",
  title: "ค้นหาโครงการที่ใช่ ใกล้คุณ",
  subtitle: "เลือกทำเลที่ตอบโจทย์ไลฟ์สไตล์ให้ใช้ชีวิตในแบบคุณ",

  zoneSelectLabel: "ค้นหาโครงการตามทำเล",

  allProjectsCta: {
    label: "ดูโครงการทั้งหมด",
    href: "https://www.assetwise.co.th/",
    external: true,
  },

  fullMapCta: {
    label: "ดูแผนที่แบบเต็มจอ",
    href: "https://www.google.com/maps/search/assetwise",
    external: true,
  },

  quote: {
    lines: ["“ทำเลที่ดี", "คือ จุดเริ่มต้นของชีวิตที่ดีกว่า”"],
  },

  listTitle: "โครงการในโซนนี้",
  emptyState: "ยังไม่มีโครงการในโซนนี้ กรุณาเลือกโซนอื่น",
  projectCountSuffix: "โครงการ",
  viewProjectLabel: "ดูรายละเอียดโครงการ",

  /** ค่าเริ่มต้นของแผนที่ (กรุงเทพฯ และปริมณฑล) */
  mapDefaults: {
    center: { lat: 13.7563, lng: 100.5018 },
    zoom: 10,
    focusZoom: 14,
  },

  /** แสดงเมื่อยังไม่ได้ตั้งค่า NEXT_PUBLIC_GOOGLE_MAPS_API_KEY */
  mapFallback: {
    image: {
      src: "/images/map-fallback.jpg",
      alt: "แผนที่ตัวอย่างแสดงทำเลโครงการ AssetWise",
      width: 1600,
      height: 900,
    },
    title: "แผนที่จะแสดงเมื่อตั้งค่า Google Maps API Key",
    description:
      "เพิ่ม NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (และ NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID) ในไฟล์ .env.local หรือบน Vercel แล้ว deploy ใหม่ ระหว่างนี้ยังเลือกดูรายการโครงการได้ตามปกติ",
  },
};
