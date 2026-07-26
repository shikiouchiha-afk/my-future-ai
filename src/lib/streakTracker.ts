'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function updateUserStreak(userId: string) {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials not configured');
    return { streak: 0, xp: 0, updated: false };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('streak, last_message_date, xp')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      console.error('Error fetching profile:', fetchError);
      return { streak: 0, xp: 0 };
    }

    const now = new Date();
    const lastMessageDate = profile.last_message_date ? new Date(profile.last_message_date) : null;

    let newStreak = profile.streak || 0;
    let newXp = profile.xp || 0;

    if (lastMessageDate) {
      const timeDiffHours = (now.getTime() - lastMessageDate.getTime()) / (1000 * 60 * 60);

      // If less than 24 hours have passed, keep streak same
      if (timeDiffHours < 24) {
        // Same day message, no streak change
      } 
      // If 24-48 hours have passed, increment streak
      else if (timeDiffHours >= 24 && timeDiffHours < 48) {
        newStreak = (newStreak || 0) + 1;
      } 
      // If more than 48 hours, reset streak to 1
      else {
        newStreak = 1;
      }
    } else {
      // First message, start streak
      newStreak = 1;
    }

    // Update profile with new streak and last message date
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        last_message_date: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    }

    return {
      streak: newStreak,
      xp: newXp,
      updated: true,
    };
  } catch (error) {
    console.error('updateUserStreak error:', error);
    return { streak: 0, xp: 0, updated: false };
  }
}
