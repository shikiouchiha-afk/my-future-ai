import { getActionConfig, isProgressActionType } from "@/lib/progress/constants";
import { calculateProgressSummaryFromEvents } from "@/lib/progress/engine";
import type { ProgressActionType } from "@/lib/progress/constants";
import type { ProgressEventRecord, ProgressSummary } from "@/lib/progress/types";

// Progress architecture:
// 1) Accept a validated completion event with a unique completion_id.
// 2) Upsert the event idempotently (duplicates are ignored server-side).
// 3) Recompute all summary values from stored events, then persist the snapshot.
// This keeps progress deterministic across retries, refreshes, and navigation.

type SupabaseLike = {
  from: (table: string) => {
    select: (fields: string) => any;
    upsert: (values: Record<string, unknown>, options?: Record<string, unknown>) => any;
    update: (values: Record<string, unknown>) => any;
    insert: (values: Record<string, unknown>) => any;
  };
};

type CompletionPayload = {
  userId: string;
  completionId: string;
  actionType: string;
  source?: string;
  metadata?: Record<string, unknown>;
  occurredAt?: string;
};

function toDateParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return "1970-01-01";
  }

  return `${year}-${month}-${day}`;
}

export function toLocalDateKey(date: Date, timeZone: string) {
  return toDateParts(date, timeZone);
}

function normalizeTimezone(value: string | null | undefined) {
  if (!value) {
    return "UTC";
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return value;
  } catch {
    return "UTC";
  }
}

async function getUserTimezone(supabase: SupabaseLike, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", userId)
    .maybeSingle();

  return normalizeTimezone(data?.timezone);
}

function mapDbEvents(rows: Array<Record<string, unknown>>): ProgressEventRecord[] {
  return rows.map((row) => ({
    completionId: String(row.completion_id ?? ""),
    actionType: String(row.action_type ?? "task_completed") as ProgressActionType,
    localDate: String(row.local_date ?? "1970-01-01"),
    occurredAt: String(row.occurred_at ?? new Date(0).toISOString()),
    xpEarned: Number(row.xp_earned ?? 0),
    dailyPoints: Number(row.daily_points ?? 0),
  }));
}

async function saveProgressSummary(
  supabase: SupabaseLike,
  userId: string,
  summary: ProgressSummary,
  nowIso: string
) {
  await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        current_streak: summary.currentStreak,
        longest_streak: summary.longestStreak,
        last_active_date: summary.currentStreak > 0 ? summary.localDate : null,
        total_progress: summary.totalCompletions,
        daily_progress: summary.dailyProgress,
        completion_percentage: summary.completionPercentage,
        last_recalculated_at: nowIso,
        updated_at: nowIso,
      },
      { onConflict: "user_id" }
    );

  await supabase
    .from("profiles")
    .update({
      xp: summary.xp,
      level: summary.level,
      streak: summary.currentStreak,
    })
    .eq("id", userId);
}

export async function recalculateAndPersistProgress(params: {
  supabase: SupabaseLike;
  userId: string;
  now?: Date;
}): Promise<{ summary: ProgressSummary; timezone: string }> {
  const now = params.now ?? new Date();
  const timezone = await getUserTimezone(params.supabase, params.userId);
  const localDate = toLocalDateKey(now, timezone);

  const { data: rows } = await params.supabase
    .from("completion_events")
    .select("completion_id, action_type, local_date, occurred_at, xp_earned, daily_points")
    .eq("user_id", params.userId)
    .order("occurred_at", { ascending: true });

  const events = mapDbEvents((rows ?? []) as Array<Record<string, unknown>>);
  const summary = calculateProgressSummaryFromEvents({
    timezone,
    localDate,
    events,
  });

  await saveProgressSummary(params.supabase, params.userId, summary, now.toISOString());
  return { summary, timezone };
}

export async function recordCompletionAndRecalculate(params: {
  supabase: SupabaseLike;
  payload: CompletionPayload;
}): Promise<{ summary: ProgressSummary; duplicate: boolean }> {
  const { supabase, payload } = params;

  if (!payload.completionId || payload.completionId.length > 120) {
    throw new Error("Invalid completionId.");
  }

  if (!isProgressActionType(payload.actionType)) {
    throw new Error("Invalid actionType.");
  }

  const occurredAtDate = payload.occurredAt ? new Date(payload.occurredAt) : new Date();
  if (Number.isNaN(occurredAtDate.getTime())) {
    throw new Error("Invalid occurredAt.");
  }

  const timezone = await getUserTimezone(supabase, payload.userId);
  const localDate = toLocalDateKey(occurredAtDate, timezone);
  const actionConfig = getActionConfig(payload.actionType);

  const { data: inserted, error: insertError } = await supabase
    .from("completion_events")
    .upsert(
      {
        user_id: payload.userId,
        completion_id: payload.completionId,
        action_type: payload.actionType,
        source: payload.source || "unknown",
        metadata: payload.metadata || {},
        occurred_at: occurredAtDate.toISOString(),
        local_date: localDate,
        xp_earned: actionConfig.xp,
        daily_points: actionConfig.dailyPoints,
      },
      { onConflict: "user_id,completion_id", ignoreDuplicates: true }
    )
    .select("id")
    .maybeSingle();

  if (insertError) {
    throw insertError;
  }

  const duplicate = !inserted;

  const { data: previousProgress } = await supabase
    .from("user_progress")
    .select("daily_progress, completion_percentage, current_streak, longest_streak, total_progress")
    .eq("user_id", payload.userId)
    .maybeSingle();

  const { summary } = await recalculateAndPersistProgress({
    supabase,
    userId: payload.userId,
  });

  await supabase.from("progress_audit_logs").insert({
    user_id: payload.userId,
    completion_id: payload.completionId,
    action_type: payload.actionType,
    source: payload.source || "unknown",
    was_duplicate: duplicate,
    reason: duplicate
      ? "Duplicate completion_id ignored; summary recomputed from stored events."
      : "Completion event accepted; summary recomputed from stored events.",
    previous_snapshot: previousProgress || {},
    next_snapshot: {
      daily_progress: summary.dailyProgress,
      completion_percentage: summary.completionPercentage,
      current_streak: summary.currentStreak,
      longest_streak: summary.longestStreak,
      total_progress: summary.totalCompletions,
      xp: summary.xp,
      level: summary.level,
    },
    event_local_date: localDate,
    created_at: new Date().toISOString(),
  });

  return { summary, duplicate };
}
