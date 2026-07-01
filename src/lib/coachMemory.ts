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

export async function loadOrCreateStreak(userId: string) {
  const { data, error: selectError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError) {
    console.warn("Could not read progress", selectError.message);
  }

  if (data) return data;

  const { data: createdData, error: insertError } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        last_active_date: null,
        completed_missions: [],
        total_progress: 0,
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .maybeSingle();

  if (insertError) {
    console.warn("Progress initialization unavailable", insertError.message);
    return null;
  }

  return createdData ?? null;
}

export async function updateStreak(userId: string, completedMissions: string[] = []) {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return;

  const lastActive = data.last_active_date;
  const lastDate = lastActive ? new Date(lastActive).toISOString().slice(0, 10) : null;

  let currentStreak = data.current_streak || 0;
  if (lastDate === today) {
    currentStreak = data.current_streak || 0;
  } else if (lastDate && new Date(today).getTime() - new Date(lastDate).getTime() === 86400000) {
    currentStreak += 1;
  } else {
    currentStreak = 1;
  }

  const longestStreak = Math.max(data.longest_streak || 0, currentStreak);

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_active_date: today,
      completed_missions: completedMissions,
      total_progress: data.total_progress || 0,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Could not update streak", error);
  }
}
