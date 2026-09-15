import type { FeatureContent, LinkContent } from "./types";

export const thankYou = {
  eyebrow: "THANK YOU",
  title: "ขอบคุณที่ลงทะเบียน",
  subtitle: "ทีมงาน AssetWise Happy Retire ได้รับข้อมูลของคุณแล้ว",
  description:
    "เจ้าหน้าที่จะติดต่อกลับภายใน 1 วันทำการ เพื่อยืนยันนัดหมายและแนะนำโครงการที่ตรงกับความต้องการของคุณ",

  steps: [
    {
      icon: "check-circle",
      title: "ได้รับข้อมูลแล้ว",
      caption: "ระบบบันทึกการลงทะเบียนเรียบร้อย",
    },
    {
      icon: "headset",
      title: "รอรับสาย",
      caption: "เจ้าหน้าที่ติดต่อกลับภายใน 1 วันทำการ",
    },
    {
      icon: "calendar",
      title: "นัดหมายเยี่ยมชม",
      caption: "เลือกวันและโครงการที่สะดวก",
    },
  ] satisfies FeatureContent[],

  primaryCta: { label: "กลับไปหน้าแรก", href: "/" } satisfies LinkContent,
  secondaryCta: {
    label: "ดูโครงการทั้งหมด",
    href: "https://www.assetwise.co.th/project",
    external: true,
  } satisfies LinkContent,

  contactTitle: "ต้องการคุยกับเจ้าหน้าที่ทันที",
};
