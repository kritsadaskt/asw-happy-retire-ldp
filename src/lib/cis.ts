import { register as registerContent } from "@/content/register";
import { findMapProject } from "@/lib/projects";
import type { RegisterLead } from "@/lib/validation";

/**
 * ชุดฟิลด์ตามเอกสาร CIS SaveOtherSource
 * เว็บไม่ยิง CIS ตรงแล้ว — n8n รับ payload นี้แล้วค่อยส่งต่อ
 */

/** Web Site */
export const CONTACT_CHANNEL_ID = 21;
/** Register */
export const CONTACT_TYPE_ID = 35;
/** Follow up = Yes */
export const FOLLOW_UP_ID = 42;
/** รหัสช่องทางใหม่ของแคมเปญ — เปลี่ยนได้ด้วย CIS_REF_ID */
export const DEFAULT_REF_ID = 20260917;
export const REF_DETAIL = "Happiness Never Retires";
export const FALLBACK_EMAIL = "no-email@assetwise.co.th";

const TIME_ZONE = "Asia/Bangkok";
const DEFAULT_APPOINT_TIME = "08:00";
const DEFAULT_APPOINT_TIME_END = "20:00";

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function resolveRefId(): number {
  return envInt("CIS_REF_ID", DEFAULT_REF_ID);
}

const labelOf = (
  options: readonly { value: string; label: string }[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? "";

function pad(value: string | undefined): string {
  return (value ?? "").padStart(2, "0");
}

function formatBangkokParts(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );

  return {
    date: `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`,
    time: `${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`,
  };
}

/** CIS ใช้รูปแบบ `YYYY-MM-DD HH:mm:ss` ตามเวลาไทย */
export function formatRefDate(date = new Date()): string {
  const { date: day, time } = formatBangkokParts(date);
  return `${day} ${time}`;
}

export function splitFullName(fullName: string): {
  Fname: string;
  Lname: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    Fname: parts[0] ?? "",
    Lname: parts.slice(1).join(" ") || "-",
  };
}

export type CisPayload = {
  ProjectID: number;
  ContactChannelID: number;
  ContactTypeID: number;
  RefID: number;
  Fname: string;
  Lname: string;
  Tel: string | null;
  Email: string | null;
  Ref: string;
  RefDate: string;
  FollowUpID: number;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  PriceInterest: string;
  ModelInterest: string;
  PromoCode: string;
  PurchasePurpose: string;
  FlagPersonalAccept: boolean;
  FlagContactAccept: boolean;
  AppointDate: string;
  AppointTime: string;
  AppointTimeEnd: string;
  LineID: string;
};

export function toCisPayload(
  lead: RegisterLead,
  now = new Date(),
): CisPayload | null {
  const project = findMapProject(lead.project);
  if (!project?.cisProjectId) return null;

  const { residenceType, budget } = registerContent.fields;
  const { Fname, Lname } = splitFullName(lead.fullName);
  const tel = lead.phone.replace(/\D/g, "");
  const hasVisitDate = Boolean(lead.visitDate);

  return {
    ProjectID: project.cisProjectId,
    ContactChannelID: CONTACT_CHANNEL_ID,
    ContactTypeID: CONTACT_TYPE_ID,
    RefID: resolveRefId(),
    Fname,
    Lname,
    Tel: tel || null,
    Email: FALLBACK_EMAIL,
    Ref: REF_DETAIL,
    RefDate: formatRefDate(now),
    FollowUpID: FOLLOW_UP_ID,
    utm_source: lead.utm_source,
    utm_medium: lead.utm_medium,
    utm_campaign: lead.utm_campaign,
    utm_term: lead.utm_term,
    utm_content: lead.utm_content,
    PriceInterest: labelOf(budget.options, lead.budget),
    ModelInterest: labelOf(residenceType.options, lead.residenceType),
    PromoCode: "",
    PurchasePurpose: "",
    FlagPersonalAccept: lead.acceptedTerms,
    FlagContactAccept: lead.acceptedTerms,
    AppointDate: hasVisitDate ? lead.visitDate : "",
    AppointTime: hasVisitDate ? DEFAULT_APPOINT_TIME : "",
    AppointTimeEnd: hasVisitDate ? DEFAULT_APPOINT_TIME_END : "",
    LineID: "",
  };
}
