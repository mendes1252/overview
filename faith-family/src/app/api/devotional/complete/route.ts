import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getTodayDate } from "@/lib/utils";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { devotional_id, family_id } = await request.json();

  // Check not already completed today
  const today = getTodayDate();
  const { data: existing } = await supabase
    .from("devotional_completions")
    .select("id")
    .eq("family_id", family_id)
    .gte("completed_at", `${today}T00:00:00`)
    .single();

  if (existing) {
    return NextResponse.json({ message: "Already completed today", alreadyDone: true });
  }

  const POINTS = 50;

  // Save completion
  await supabase.from("devotional_completions").insert({
    family_id,
    devotional_id,
    points_earned: POINTS,
  });

  // Update streak
  const { data: streak } = await supabase
    .from("family_streaks")
    .select("*")
    .eq("family_id", family_id)
    .single();

  if (streak) {
    const lastDate = streak.last_completed_date;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak =
      lastDate === yesterday ? streak.current_streak + 1 : 1;

    await supabase
      .from("family_streaks")
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak),
        last_completed_date: today,
      })
      .eq("family_id", family_id);

    // Check streak badges
    await checkAndAwardBadges(supabase, family_id, newStreak);
  }

  // Award points to all children
  try {
    await supabase.rpc("award_family_points", { p_family_id: family_id, p_points: POINTS });
  } catch {
    // Non-critical: ignore if RPC fails
  }

  return NextResponse.json({ success: true, points: POINTS });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function checkAndAwardBadges(supabase: any, familyId: string, streak: number) {
  const streakBadgeThresholds = [1, 7, 30, 100];
  for (const threshold of streakBadgeThresholds) {
    if (streak === threshold) {
      const { data: badge } = await supabase
        .from("badges")
        .select("id")
        .eq("condition_type", "streak")
        .eq("condition_value", threshold)
        .single();
      if (badge) {
        await supabase
          .from("family_badges")
          .upsert({ family_id: familyId, badge_id: badge.id }, { onConflict: "family_id,badge_id" });
      }
    }
  }
}
