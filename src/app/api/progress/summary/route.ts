import { NextResponse } from "next/server";
import {
  getBearerToken,
  getServerSupabaseClient,
  getServiceRoleSupabaseClient,
} from "@/lib/supabaseServer";
import { recalculateAndPersistProgress } from "@/lib/progress/server";

export async function GET(req: Request) {
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

    const { summary } = await recalculateAndPersistProgress({
      supabase: serviceClient,
      userId: authData.user.id,
    });

    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    console.error("Progress summary error:", error);
    return NextResponse.json({ error: "Could not load progress" }, { status: 500 });
  }
}
