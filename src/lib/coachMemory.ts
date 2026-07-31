import { supabase } from "@/lib/supabaseClient";

export interface CoachMemoryRecord {
  user_id: string;
  coach: string;
  goals: string[];
  strengths: string[];
  weaknesses: string[];
  milestones: string[];
  habits: string[];
  achievements: string[];
  last_focus: string | null;
  plans: string[];
  updated_at: string;
}

export async function loadCoachMemory(userId: string, coach: string) {
  const { data } = await supabase
    .from("coach_memories")
    .select("*")
    .eq("user_id", userId)
    .eq("coach", coach)
    .maybeSingle();

  return data as CoachMemoryRecord | null;
}

export async function saveCoachMemory(userId: string, coach: string, memory: Partial<CoachMemoryRecord>) {
  try {
    const { error } = await supabase.from("coach_memories").upsert(
      {
        user_id: userId,
        coach,
        ...memory,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,coach" }
    );

    if (error) {
      console.warn("Could not save coach memory", error.message);
    }
  } catch (err) {
    console.warn("Coach memory save skipped", err);
  }
}

// Progress and streak calculations were intentionally moved to server-side
// completion event processing in /api/progress/* to guarantee deterministic,
// idempotent updates and consistent values across pages.
