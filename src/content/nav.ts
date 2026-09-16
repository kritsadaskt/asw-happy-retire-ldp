import type { LinkContent } from "./types";

/** เมนูหลัก 4 รายการ — href ต้องตรงกับ id ของ section ในหน้าแรก */
export const mainNav: LinkContent[] = [
  { label: "ลงทะเบียน", href: "#register" },
  { label: "ค้นหาโครงการ", href: "#projects" },
  { label: "ติดต่อเรา", href: "#contact" },
];

export const navCta = {
  label: "โทรเลย",
  srLabel: "โทรติดต่อเจ้าหน้าที่",
};
