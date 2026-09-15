import type { IconKey } from "./types";

export type ZoneId =
  | "all"
  | "bkk-north"
  | "bkk-east"
  | "bkk-central"
  | "bkk-south"
  | "perimeter"
  | "eec";

export type Zone = {
  id: ZoneId;
  label: string;
  caption?: string;
  icon: IconKey;
};

export type Project = {
  id: string;
  name: string;
  zone: Exclude<ZoneId, "all">;
  /** ทำเล / จุดเด่นสั้น ๆ ที่แสดงในกล่องลิสต์ */
  location: string;
  priceFrom: string;
  /** โลโก้โครงการ ใช้เป็นหมุดบนแผนที่ (ตอนนี้เป็น placeholder) */
  logo: string;
  /** ลิงก์ไปหน้าโครงการจริง เปิดในแท็บใหม่ */
  url: string;
  /**
   * พิกัดหมุด — ตอนนี้เป็น PLACEHOLDER (ปัดเป็นทำเลโดยรวม ไม่ใช่ที่ตั้งจริง)
   * แทนที่ด้วย lat/lng จริงจาก Google Maps ได้เลย
   */
  position: { lat: number; lng: number };
};

export const zones: Zone[] = [
  { id: "all", label: "ทุกโซน", icon: "grid" },
  {
    id: "bkk-north",
    label: "กรุงเทพฯ ตอนเหนือ",
    caption: "(รังสิต - ดอนเมือง)",
    icon: "train",
  },
  {
    id: "bkk-east",
    label: "กรุงเทพฯ ตะวันออก",
    caption: "(ลาดกระบัง - มีนบุรี)",
    icon: "pin",
  },
  {
    id: "bkk-central",
    label: "กรุงเทพฯ ตอนกลาง",
    caption: "(รัชดา - ลาดพร้าว)",
    icon: "chart",
  },
  {
    id: "bkk-south",
    label: "กรุงเทพฯ ตอนใต้",
    caption: "(สุขุมวิท - บางนา)",
    icon: "gem",
  },
  {
    id: "perimeter",
    label: "ปริมณฑล",
    caption: "(ศาลายา - นครปฐม)",
    icon: "tree-city",
  },
  {
    id: "eec",
    label: "EEC",
    caption: "(ชลบุรี - ศรีราชา - ระยอง)",
    icon: "city",
  },
];

/** พิกัดทั้งหมดด้านล่างเป็น PLACEHOLDER — รอพิกัดจริงของแต่ละโครงการ */
export const projects: Project[] = [
  {
    id: "atmoz-rangsit",
    name: "แอทโมซ รังสิต",
    zone: "bkk-north",
    location: "ติดถนนพหลโยธิน ใกล้ฟิวเจอร์พาร์ค รังสิต",
    priceFrom: "เริ่ม 1.51 ลบ.",
    logo: "/images/projects/atmoz-rangsit.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.9894, lng: 100.6135 },
  },
  {
    id: "kave-donmueang",
    name: "เคฟ ดอนเมือง",
    zone: "bkk-north",
    location: "ใกล้สนามบินดอนเมือง และสถานีรถไฟฟ้าสายสีแดง",
    priceFrom: "เริ่ม 1.79 ลบ.",
    logo: "/images/projects/kave-donmueang.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.9256, lng: 100.5989 },
  },
  {
    id: "modiz-ratchada",
    name: "โมดิซ รัชดา",
    zone: "bkk-central",
    location: "ใกล้ MRT รัชดาภิเษก เดินทางเข้าเมืองสะดวก",
    priceFrom: "เริ่ม 2.49 ลบ.",
    logo: "/images/projects/modiz-ratchada.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.7712, lng: 100.5738 },
  },
  {
    id: "atmoz-ladprao",
    name: "แอทโมซ ลาดพร้าว",
    zone: "bkk-central",
    location: "ใกล้ MRT ลาดพร้าว รอบล้อมด้วยคอมมูนิตี้มอลล์",
    priceFrom: "เริ่ม 2.29 ลบ.",
    logo: "/images/projects/atmoz-ladprao.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.8163, lng: 100.5747 },
  },
  {
    id: "kave-ladkrabang",
    name: "เคฟ ลาดกระบัง",
    zone: "bkk-east",
    location: "ใกล้สนามบินสุวรรณภูมิ และ ARL ลาดกระบัง",
    priceFrom: "เริ่ม 1.69 ลบ.",
    logo: "/images/projects/kave-ladkrabang.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.7274, lng: 100.7804 },
  },
  {
    id: "atmoz-minburi",
    name: "แอทโมซ มีนบุรี",
    zone: "bkk-east",
    location: "ใกล้สถานีรถไฟฟ้าสายสีชมพู มีนบุรี",
    priceFrom: "เริ่ม 1.59 ลบ.",
    logo: "/images/projects/atmoz-minburi.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.8129, lng: 100.7318 },
  },
  {
    id: "modiz-sukhumvit",
    name: "โมดิซ สุขุมวิท",
    zone: "bkk-south",
    location: "ใกล้ BTS สายสุขุมวิท ใจกลางแหล่งไลฟ์สไตล์",
    priceFrom: "เริ่ม 3.19 ลบ.",
    logo: "/images/projects/modiz-sukhumvit.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.7108, lng: 100.6009 },
  },
  {
    id: "atmoz-bangna",
    name: "แอทโมซ บางนา",
    zone: "bkk-south",
    location: "ติดถนนบางนา - ตราด ใกล้เมกาบางนา",
    priceFrom: "เริ่ม 1.89 ลบ.",
    logo: "/images/projects/atmoz-bangna.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.6684, lng: 100.6461 },
  },
  {
    id: "kave-salaya",
    name: "เคฟ ศาลายา",
    zone: "perimeter",
    location: "ใกล้มหาวิทยาลัยมหิดล ศาลายา จ.นครปฐม",
    priceFrom: "เริ่ม 1.45 ลบ.",
    logo: "/images/projects/kave-salaya.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.7929, lng: 100.3246 },
  },
  {
    id: "atmoz-sriracha",
    name: "แอทโมซ ศรีราชา",
    zone: "eec",
    location: "ใจกลางศรีราชา จ.ชลบุรี ใกล้ทะเลและนิคมฯ",
    priceFrom: "เริ่ม 1.69 ลบ.",
    logo: "/images/projects/atmoz-sriracha.png",
    url: "https://www.assetwise.co.th/project",
    position: { lat: 13.1739, lng: 100.9301 },
  },
];

export const projectsSection = {
  eyebrow: "PROJECT LOCATION",
  title: "ค้นหาโครงการที่ใช่ ใกล้คุณ",
  subtitle: "เลือกทำเลที่ตอบโจทย์ไลฟ์สไตล์ให้ใช้ชีวิตในแบบคุณ",

  zoneSelectLabel: "ค้นหาโครงการตามทำเล",

  allProjectsCta: {
    label: "ดูโครงการทั้งหมด",
    href: "https://www.assetwise.co.th/project",
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
