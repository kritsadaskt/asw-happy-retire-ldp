import { NextResponse } from "next/server";

import { register as registerContent } from "@/content/register";
import { resolveN8nConfig, submitLeadToN8n } from "@/lib/n8n";
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

  const result = await submitLeadToN8n(parsed.data);

  switch (result.status) {
    case "delivered":
      return NextResponse.json({ ok: true, delivered: true });

    case "not-configured": {
      const { environment } = resolveN8nConfig();

      // On a preview/dev deploy without a webhook the form still has to work
      // end to end, so the lead is logged and the visitor continues to the
      // thank-you page. In production a missing webhook is a real fault.
      if (environment === "production") {
        console.error(
          "[register] N8N_WEBHOOK_URL is not set — lead was not delivered",
        );
        return NextResponse.json(
          { ok: false, message: registerContent.errors.submitFailed },
          { status: 503 },
        );
      }

      console.warn(
        "[register] n8n webhook is not configured — lead accepted locally only",
        { fullName: parsed.data.fullName, phone: parsed.data.phone },
      );
      return NextResponse.json({ ok: true, delivered: false });
    }

    case "rejected":
      console.error("[register] n8n rejected the lead", {
        httpStatus: result.httpStatus,
        detail: result.detail,
      });
      return NextResponse.json(
        { ok: false, message: registerContent.errors.submitFailed },
        { status: 502 },
      );

    case "unreachable":
      console.error("[register] n8n is unreachable", result.detail);
      return NextResponse.json(
        { ok: false, message: registerContent.errors.submitFailed },
        { status: 504 },
      );
  }
}
