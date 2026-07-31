import { supabase } from "@/lib/supabaseClient";
import type { ProgressCompletePayload, ProgressSummary } from "@/lib/progress/types";

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export async function fetchProgressSummary(): Promise<ProgressSummary | null> {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  const response = await fetch("/api/progress/summary", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return (data?.summary ?? null) as ProgressSummary | null;
}

export async function submitProgressCompletion(payload: ProgressCompletePayload): Promise<{
  summary: ProgressSummary | null;
  duplicate: boolean;
}> {
  const token = await getAccessToken();
  if (!token) {
    return { summary: null, duplicate: false };
  }

  const response = await fetch("/api/progress/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return { summary: null, duplicate: false };
  }

  const data = await response.json();
  return {
    summary: (data?.summary ?? null) as ProgressSummary | null,
    duplicate: Boolean(data?.duplicate),
  };
}
