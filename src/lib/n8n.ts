import { findMapProject } from "@/lib/projects";
import { toCisPayload, type CisPayload } from "@/lib/cis";
import type { RegisterLead } from "@/lib/validation";

/**
 * ทุกอย่างที่เกี่ยวกับการคุยกับ n8n อยู่ในไฟล์นี้ไฟล์เดียว
 * payload ตามเอกสาร CIS + ฟิลด์ช่วย map ใน workflow
 */

export const CAMPAIGN = "happy-retire";
export const CAMPAIGN_KEY = "HappinessNeverRetires";
export const SOURCE = "assetwise.co.th/happiness-never-retires";

export type N8nConfig = {
  webhookUrl: string | null;
  environment: "production" | "uat";
};

export function resolveN8nConfig(): N8nConfig {
  return {
    webhookUrl: process.env.N8N_WEBHOOK_URL?.trim() || null,
    environment: process.env.APP_ENV === "production" ? "production" : "uat",
  };
}

export type N8nPayload = CisPayload & {
  campaign: string;
  campaign_key: string;
  source: string;
  projectKey: string;
  projectLabel: string;
  submittedAt: string;
};

export function toN8nPayload(lead: RegisterLead): N8nPayload | null {
  const cis = toCisPayload(lead);
  if (!cis) return null;

  const project = findMapProject(lead.project);

  return {
    ...cis,
    campaign: CAMPAIGN,
    campaign_key: CAMPAIGN_KEY,
    source: SOURCE,
    projectKey: lead.project,
    projectLabel: project?.name ?? "",
    submittedAt: new Date().toISOString(),
  };
}

export type N8nResult = {
  status: "delivered" | "not-configured" | "rejected" | "unreachable";
  payload: N8nPayload | null;
  httpStatus?: number;
  detail?: string;
};

function logN8n(event: string, data: Record<string, unknown>) {
  console.info(`[register] ${event}`, data);
}

export async function submitLeadToN8n(lead: RegisterLead): Promise<N8nResult> {
  const config = resolveN8nConfig();
  const payload = toN8nPayload(lead);

  if (!payload) {
    logN8n("n8n payload missing cis_project_id", { project: lead.project });
    return {
      status: "rejected",
      payload: null,
      httpStatus: 400,
      detail: "missing cis_project_id",
    };
  }

  logN8n("n8n payload", payload);

  if (!config.webhookUrl) {
    logN8n("n8n skipped — N8N_WEBHOOK_URL is not set", {
      environment: config.environment,
    });
    return { status: "not-configured", payload };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(config.webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });

    const detail = (await response.text().catch(() => "")).slice(0, 2000);

    logN8n("n8n response", {
      httpStatus: response.status,
      ok: response.ok,
      body: detail || "(empty)",
    });

    if (!response.ok) {
      return {
        status: "rejected",
        payload,
        httpStatus: response.status,
        detail,
      };
    }

    return {
      status: "delivered",
      payload,
      httpStatus: response.status,
      detail,
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown error";
    logN8n("n8n unreachable", { detail });
    return { status: "unreachable", payload, detail };
  } finally {
    clearTimeout(timeout);
  }
}
