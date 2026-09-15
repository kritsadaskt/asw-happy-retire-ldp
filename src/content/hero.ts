import type {
  FeatureContent,
  IconKey,
  ImageContent,
  LinkContent,
} from "./types";

/**
 * Hero Banner
 * ภาพ key visual และโลโก้ Happy Retire ยังเป็น placeholder
 * เปลี่ยนรูปได้โดยวางไฟล์ทับใน public/images/ หรือแก้ path ด้านล่าง
 */
export const hero = {

  desktop: {
    src: "/images/mockup-hero-desktop.webp",
    alt: "AssetWise - Happy Retire",
    width: 1920,
    height: 1024,
  } satisfies ImageContent,

  
  eyebrow: "ASSETWISE",

  /** โลโก้ลายมือ “Happy Retire” วางซ้อนบนภาพ */
  lockup: {
    src: "/images/hero-happy-retire.png",
    alt: "AssetWise Happy Retire",
    width: 900,
    height: 400,
  } satisfies ImageContent,

  /** ใช้เป็น <h1> สำหรับ SEO และ screen reader (ซ่อนด้วย sr-only) */
  srHeading: "AssetWise Happy Retire — คอนโดเพื่อชีวิตหลังเกษียณ",

  quote: {
    lines: ["“ให้คอนโดหลังใหญ่", "เป็นจุดหมายใหม่ของชีวิต"],
    accent: "สำราญ”",
  },

  background: {
    src: "/images/hero-key-visual.jpg",
    alt: "ภาพบรรยากาศชีวิตหลังเกษียณกับ AssetWise Happy Retire",
    width: 1920,
    height: 1080,
  } satisfies ImageContent,

  sideWords: ["LIVE", "MORE", "WORRY", "LESS"],

  doorQuote: "ชีวิตดี ๆ รอคุณอยู่ในทุกวัน",

  promoBadge: {
    lead: "รับแพ็กเกจท่องเที่ยว",
    highlight: "สวิตเซอร์แลนด์",
    icon: "award" as IconKey,
  },

  highlights: [
    {
      icon: "gem",
      title: "พื้นที่ที่ตอบโจทย์",
      caption: "ในทุกช่วงชีวิต",
    },
    {
      icon: "spa",
      title: "Wellness",
      caption: "& Lifestyle",
    },
    {
      icon: "people-roof",
      title: "สังคมคุณภาพ",
      caption: "ที่เข้าใจกัน",
    },
    {
      icon: "house",
      title: "มูลค่าที่ประเมิน",
      caption: "จาก AssetWise",
    },
  ] satisfies FeatureContent[],

  price: {
    prefix: "เริ่ม",
    value: "1.51",
    unit: "ลบ.*",
  },

  cta: {
    label: "ดูโครงการทั้งหมด",
    href: "#projects",
  } satisfies LinkContent,

  secondaryCta: {
    label: "ลงทะเบียนรับข้อมูล",
    href: "#register",
  } satisfies LinkContent,

  disclaimer: "*ราคาเริ่มต้นและเงื่อนไขเป็นไปตามที่บริษัทกำหนด",
};
