import { createClient } from "@/lib/supabase/server";
import { getTodayDate, formatDate } from "@/lib/utils";
import DevotionalView from "@/components/devotional/DevotionalView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const today = getTodayDate();

  // Fetch family
  const { data: family } = await supabase
    .from("families")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  // Fetch today's devotional
  const { data: devotional } = await supabase
    .from("devotionals")
    .select("*")
    .eq("date", today)
    .single();

  // Fetch streak
  const { data: streak } = await supabase
    .from("family_streaks")
    .select("*")
    .eq("family_id", family?.id)
    .single();

  // Check if completed today
  const { data: completion } = await supabase
    .from("devotional_completions")
    .select("id")
    .eq("family_id", family?.id)
    .gte("completed_at", `${today}T00:00:00`)
    .single();

  return (
    <div className="px-4 pt-5">
      {/* Date + streak banner */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Devocional de hoje</p>
          <p className="text-gray-700 font-medium text-sm">{formatDate(today)}</p>
        </div>
        {streak && streak.current_streak > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
            <span className="text-lg">🔥</span>
            <span className="text-amber-700 font-bold text-sm">{streak.current_streak}</span>
            <span className="text-amber-600 text-xs">dias</span>
          </div>
        )}
      </div>

      <DevotionalView
        devotional={devotional ?? null}
        familyId={family?.id ?? ""}
        alreadyCompleted={!!completion}
        today={today}
      />
    </div>
  );
}
