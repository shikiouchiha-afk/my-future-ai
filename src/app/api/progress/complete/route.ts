import { NextResponse } from "next/server";
import {
  getBearerToken,
  getServerSupabaseClient,
  getServiceRoleSupabaseClient,
} from "@/lib/supabaseServer";
import { recordCompletionAndRecalculate } from "@/lib/progress/server";

export async function POST(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authClient = getServerSupabaseClient();
    const serviceClient = getServiceRoleSupabaseClient();

    if (!authClient || !serviceClient) {
      return NextResponse.json({ error: "Server is not configured" }, { status: 500 });
    }

    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const completionId = String(body?.completionId ?? "");
    const actionType = String(body?.actionType ?? "");
    const source = typeof body?.source === "string" ? body.source : "unknown";
    const metadata = body?.metadata && typeof body.metadata === "object" ? body.metadata : {};
    const occurredAt = typeof body?.occurredAt === "string" ? body.occurredAt : undefined;

    const result = await recordCompletionAndRecalculate({
      supabase: serviceClient,
      payload: {
        userId: authData.user.id,
        completionId,
        actionType,
        source,
        metadata,
        occurredAt,
      },
    });

    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      summary: result.summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    if (message.startsWith("Invalid ")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error("Progress completion error:", error);
    return NextResponse.json({ error: "Could not record completion" }, { status: 500 });
  }
}
