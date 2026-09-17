import { register as registerContent } from "@/content/register";
import { findMapProject } from "@/lib/projects";
import type { RegisterLead } from "@/lib/validation";

/**
 * ทุกอย่างที่เกี่ยวกับการคุยกับ CIS อยู่ในไฟล์นี้ไฟล์เดียว
 * เมื่อต้องปรับ shape ของ payload ให้แก้ที่ `toCisPayload()`
 * โดยไม่ต้องแตะ route handler หรือฟอร์ม
 */

/** Web Site */
export const CONTACT_CHANNEL_ID = 21;
/** Register */
export const CONTACT_TYPE_ID = 35;
/** Follow up = Yes */
export const FOLLOW_UP_ID = 42;
/** รหัสช่องทางใหม่ของแคมเปญ — เปลี่ยนได้ด้วย CIS_REF_ID */
export const DEFAULT_REF_ID = 5345;
export const REF_DETAIL = "Happiness Never Retires";

const TIME_ZONE = "Asia/Bangkok";
const DEFAULT_APPOINT_TIME = "08:00";
const DEFAULT_APPOINT_TIME_END = "20:00";

export type CisConfig = {
  endpoint: string | null;
  apiKey: string | null;
  refId: number;
  environment: "production" | "uat";
};

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/** `Authorization: Basic <CIS_API_KEY>` — ถ้าค่าใน env มีคำว่า Basic อยู่แล้วจะไม่ซ้ำ */
function basicAuthorization(apiKey: string): string {
  const token = apiKey.replace(/^Basic\s+/i, "").trim();
  return `Basic ${token}`;
}

export function resolveCisConfig(): CisConfig {
  const isProduction = process.env.APP_ENV === "production";
  const endpoint = isProduction
    ? process.env.CIS_ENDPOINT_PROD
    : process.env.CIS_ENDPOINT_UAT;

  return {
    endpoint: endpoint?.trim() || null,
    apiKey: process.env.CIS_API_KEY?.trim() || null,
    refId: envInt("CIS_REF_ID", DEFAULT_REF_ID),
    environment: isProduction ? "production" : "uat",
  };
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
    RefID: resolveCisConfig().refId,
    Fname,
    Lname,
    Tel: tel || null,
    Email: null,
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

export type CisResult =
  | { status: "delivered" }
  | { status: "not-configured" }
  | { status: "rejected"; httpStatus: number; detail: string }
  | { status: "unreachable"; detail: string };

export async function submitLeadToCis(lead: RegisterLead): Promise<CisResult> {
  const config = resolveCisConfig();
  const payload = toCisPayload(lead);

  if (!payload) {
    return {
      status: "rejected",
      httpStatus: 400,
      detail: "missing cis_project_id",
    };
  }

  if (!config.endpoint || !config.apiKey) {
    return { status: "not-configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: basicAuthorization(config.apiKey),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = (await response.text().catch(() => "")).slice(0, 500);
      return { status: "rejected", httpStatus: response.status, detail };
    }

    return { status: "delivered" };
  } catch (error) {
    return {
      status: "unreachable",
      detail: error instanceof Error ? error.message : "unknown error",
    };
  } finally {
    clearTimeout(timeout);
  }
}
