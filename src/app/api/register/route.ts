import { NextResponse } from "next/server";

import { register as registerContent } from "@/content/register";
import { resolveCisConfig, submitLeadToCis } from "@/lib/cis";
import { submitLeadToN8n } from "@/lib/n8n";
import { registerSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FieldErrors = Partial<Record<string, string>>;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }

    return NextResponse.json(
      { ok: false, message: registerContent.errors.submitFailed, fieldErrors },
      { status: 400 },
    );
  }

  const [cis, n8n] = await Promise.all([
    submitLeadToCis(parsed.data),
    submitLeadToN8n(parsed.data),
  ]);

  const cisOk = cis.status === "delivered";
  const n8nOk = n8n.status === "delivered";
  const isProduction = resolveCisConfig().environment === "production";
  const debug = isProduction
    ? {}
    : {
        cisPayload: cis.payload,
        cisStatus: cis.httpStatus ?? cis.status,
        cisBody: cis.detail ?? null,
        n8nStatus: n8n.httpStatus ?? n8n.status,
        n8nBody: n8n.detail ?? null,
      };

  // CIS เป็นต้นทาง, n8n เป็นสำเนา/สำรอง — สำเร็จถ้าอย่างน้อยฝั่งหนึ่งรับได้
  if (cisOk || n8nOk) {
    if (!cisOk) {
      console.warn("[register] CIS missed the lead — stored in n8n backup", {
        cis: cis.status,
        n8n: n8n.status,
      });
    }
    return NextResponse.json({
      ok: true,
      delivered: cisOk,
      backup: n8nOk,
      ...debug,
    });
  }

  if (cis.status === "not-configured" && n8n.status === "not-configured") {
    if (isProduction) {
      console.error(
        "[register] CIS and n8n are not configured — lead was not delivered",
      );
      return NextResponse.json(
        { ok: false, message: registerContent.errors.submitFailed },
        { status: 503 },
      );
    }

    console.warn(
      "[register] CIS and n8n are not configured — lead accepted locally only",
      { fullName: parsed.data.fullName, phone: parsed.data.phone },
    );
    return NextResponse.json({
      ok: true,
      delivered: false,
      backup: false,
      ...debug,
    });
  }

  console.error("[register] CIS and n8n both failed", {
    cis: { status: cis.status, httpStatus: cis.httpStatus, detail: cis.detail },
    n8n: { status: n8n.status, httpStatus: n8n.httpStatus, detail: n8n.detail },
  });

  const status =
    cis.status === "unreachable" && n8n.status === "unreachable" ? 504 : 502;

  return NextResponse.json(
    {
      ok: false,
      message: registerContent.errors.submitFailed,
      ...debug,
    },
    { status },
  );
}
