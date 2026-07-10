import { NextResponse } from "next/server";
import {
  getBearerToken,
  getServerSupabaseClient,
  getServiceRoleSupabaseClient,
} from "@/lib/supabaseServer";

export async function POST(req: Request) {
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

  const userId = authData.user.id;

  const { data: profile, error: profileError } = await serviceClient
    .from("profiles")
    .select("is_premium, is_admin")
    .eq("id", userId)
    .single();

  if (profileError || (!profile?.is_premium && !profile?.is_admin)) {
    return NextResponse.json({ error: "Premium access required" }, { status: 403 });
  }

  const { error: updateError } = await serviceClient
    .from("profiles")
    .update({ has_seen_premium_animation: true })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: "Failed to save activation state" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
