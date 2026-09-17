import { register as registerContent } from "@/content/register";
import type { RegisterLead } from "@/lib/validation";

/**
 * ทุกอย่างที่เกี่ยวกับการคุยกับ n8n อยู่ในไฟล์นี้ไฟล์เดียว
 * เมื่อต้องปรับ shape ของ webhook ให้แก้ที่ `toN8nPayload()`
 * โดยไม่ต้องแตะ route handler หรือฟอร์ม
 */

export const CAMPAIGN = "happy-retire";
export const SOURCE = "assetwise.co.th/happyretire";

export type N8nConfig = {
  webhookUrl: string | null;
  environment: "production" | "uat";
};

export function resolveN8nConfig(): N8nConfig {
  const isProduction = process.env.APP_ENV === "production";

  return {
    webhookUrl: process.env.N8N_WEBHOOK_URL?.trim() || null,
    environment: isProduction ? "production" : "uat",
  };
}

const labelOf = (
  options: readonly { value: string; label: string }[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? "";

export type N8nPayload = {
  campaign: string;
  source: string;
  fullName: string;
  phone: string;
  residenceType: string;
  residenceTypeLabel: string;
  budget: string;
  budgetLabel: string;
  visitDate: string;
  acceptedTerms: boolean;
  submittedAt: string;
};

export function toN8nPayload(lead: RegisterLead): N8nPayload {
  const { residenceType, budget } = registerContent.fields;

  return {
    campaign: CAMPAIGN,
    source: SOURCE,
    fullName: lead.fullName,
    phone: lead.phone.replace(/\D/g, ""),
    residenceType: lead.residenceType,
    residenceTypeLabel: labelOf(residenceType.options, lead.residenceType),
    budget: lead.budget,
    budgetLabel: labelOf(budget.options, lead.budget),
    visitDate: lead.visitDate,
    acceptedTerms: lead.acceptedTerms,
    submittedAt: new Date().toISOString(),
  };
}

export type N8nResult =
  | { status: "delivered" }
  | { status: "not-configured" }
  | { status: "rejected"; httpStatus: number; detail: string }
  | { status: "unreachable"; detail: string };

export async function submitLeadToN8n(lead: RegisterLead): Promise<N8nResult> {
  const config = resolveN8nConfig();

  if (!config.webhookUrl) {
    return { status: "not-configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(config.webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(toN8nPayload(lead)),
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
