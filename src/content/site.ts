import type { IconLinkContent, ImageContent } from "./types";

/**
 * ข้อมูลกลางของแบรนด์ — โลโก้ เบอร์โทร ช่องทางติดต่อ และ SEO
 * แก้ไขได้ที่ไฟล์นี้ไฟล์เดียว
 */
export const site = {
  brandName: "AssetWise",
  campaignName: "Happy Retire",

  logo: {
    src: "/images/1200x129_navy.svg",
    alt: "AssetWise - We Build Happiness",
    width: 300,
    height: 32,
  } satisfies ImageContent,

  phone: {
    display: "02-168-0000",
    href: "tel:+66216800000",
    label: "โทรสอบถามเจ้าหน้าที่",
  },

  officeHours: "ตั้งแต่เวลา 08.00 - 20.00 น.",

  /** เปลี่ยนเป็นลิงก์ LINE OA / Messenger จริงเมื่อได้ข้อมูลมา */
  line: {
    label: "ปรึกษาผ่าน LINE",
    caption: "แอดเป็นเพื่อนกันได้เลย",
    href: "https://line.me/R/ti/p/@assetwise",
    icon: "line",
    external: true,
  } satisfies IconLinkContent,

  messenger: {
    label: "แชตผ่าน Messenger",
    caption: "ตอบกลับภายในเวลาทำการ",
    href: "https://m.me/assetwise",
    icon: "messenger",
    external: true,
  } satisfies IconLinkContent,

  allProjectsUrl: "https://www.assetwise.co.th/project",

  seo: {
    title: "Happiness Never Retires | ความสุข..ไม่มีวันเกษียณ",
    description:
      "ความสุข..ไม่มีวันเกษียณ ลงทะเบียนรับข้อมูลและนัดหมายเยี่ยมชมโครงการ AssetWise ทำเลดีทั่วกรุงเทพฯ ปริมณฑล และ EEC",
    keywords: [
      "AssetWise",
      "Happiness Never Retires",
      "คอนโดหลังเกษียณ",
      "คอนโดผู้สูงอายุ",
      "คอนโดพร้อมอยู่",
    ],
    ogImage: {
      src: "/images/happiness-never-retires_og.webp",
      alt: "AssetWise Happy Retire",
      width: 1200,
      height: 630,
    } satisfies ImageContent,
  },
} as const;
