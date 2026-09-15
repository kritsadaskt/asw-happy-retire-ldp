import type { IconLinkContent, LinkContent } from "./types";

export const footer = {
  /** ลิงก์ในแถบ footer (แยกจากเมนูหลักได้ ถ้าต้องการลิงก์ออกนอกเว็บ) */
  links: [
    { label: "หน้าแรก", href: "#home" },
    { label: "ลงทะเบียน", href: "#register" },
    { label: "ค้นหาโครงการ", href: "#projects" },
    {
      label: "เว็บไซต์ AssetWise",
      href: "https://www.assetwise.co.th",
      external: true,
    },
  ] satisfies LinkContent[],

  socials: [
    {
      label: "LINE Official",
      href: "https://line.me/R/ti/p/@assetwise",
      icon: "line",
      external: true,
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/assetwise",
      icon: "facebook",
      external: true,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/assetwise",
      icon: "instagram",
      external: true,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@assetwise",
      icon: "youtube",
      external: true,
    },
  ] satisfies IconLinkContent[],

  copyright: "© AssetWise Public Company Limited. All rights reserved.",
};
