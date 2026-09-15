import { register as registerContent } from "@/content/register";
import type { RegisterLead } from "@/lib/validation";

/**
 * ทุกอย่างที่เกี่ยวกับการคุยกับ CIS อยู่ในไฟล์นี้ไฟล์เดียว
 * payload ยังเป็น "ร่าง" — เมื่อได้สเปคจริงจาก CIS ให้แก้ที่ `toCisPayload()`
 * โดยไม่ต้องแตะ route handler หรือฟอร์ม
 */

export const CAMPAIGN = "happy-retire";
export const SOURCE = "assetwise.co.th/happyretire";

export type CisConfig = {
  endpoint: string | null;
  apiKey: string | null;
  environment: "production" | "uat";
};

export function resolveCisConfig(): CisConfig {
  const isProduction = process.env.APP_ENV === "production";
  const endpoint = isProduction
    ? process.env.CIS_ENDPOINT_PROD
    : process.env.CIS_ENDPOINT_UAT;

  return {
    endpoint: endpoint?.trim() || null,
    apiKey: process.env.CIS_API_KEY?.trim() || null,
    environment: isProduction ? "production" : "uat",
  };
}

const labelOf = (
  options: readonly { value: string; label: string }[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? "";

export type CisPayload = {
  campaign: string;
  source: string;
  fullName: string;
  phone: string;
  residenceType: string;
  residenceTypeLabel: string;
  budget: string;
  budgetLabel: string;
  visitDate: string;
  submittedAt: string;
};

export function toCisPayload(lead: RegisterLead): CisPayload {
  const { residenceType, budget } = registerContent.fields;

  return {
    campaign: CAMPAIGN,
    source: SOURCE,
    fullName: lead.fullName,
    // CIS ต้องการตัวเลขล้วน
    phone: lead.phone.replace(/\D/g, ""),
    residenceType: lead.residenceType,
    residenceTypeLabel: labelOf(residenceType.options, lead.residenceType),
    budget: lead.budget,
    budgetLabel: labelOf(budget.options, lead.budget),
    visitDate: lead.visitDate,
    submittedAt: new Date().toISOString(),
  };
}

export type CisResult =
  | { status: "delivered" }
  | { status: "not-configured" }
  | { status: "rejected"; httpStatus: number; detail: string }
  | { status: "unreachable"; detail: string };

export async function submitLeadToCis(lead: RegisterLead): Promise<CisResult> {
  const config = resolveCisConfig();

  // ยังไม่ได้ตั้งค่า endpoint — ไม่ throw เพื่อให้หน้าเว็บใช้งานได้ตามปกติ
  if (!config.endpoint) {
    return { status: "not-configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(config.apiKey ? { "x-api-key": config.apiKey } : {}),
      },
      body: JSON.stringify(toCisPayload(lead)),
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
