import { createClient } from "@/lib/supabase/server";
import { calculateLevel, getLevelTitle, pointsToNextLevel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FamiliaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: family } = await supabase
    .from("families")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("family_id", family?.id)
    .order("points", { ascending: false });

  const { data: streak } = await supabase
    .from("family_streaks")
    .select("*")
    .eq("family_id", family?.id)
    .single();

  // Last 30 completions
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: completions } = await supabase
    .from("devotional_completions")
    .select("completed_at")
    .eq("family_id", family?.id)
    .gte("completed_at", thirtyDaysAgo);

  const completionRate = Math.round(((completions?.length ?? 0) / 30) * 100);

  const { data: familyBadges } = await supabase
    .from("family_badges")
    .select("*, badge:badges(*)")
    .eq("family_id", family?.id);

  const totalPoints = (children ?? []).reduce((sum, c) => sum + c.points, 0);
  const level = calculateLevel(totalPoints);
  const levelTitle = getLevelTitle(level);
  const toNext = pointsToNextLevel(totalPoints);

  return (
    <div className="px-4 pt-5 pb-6 space-y-4">
      <h2 className="text-xl font-bold font-playfair text-[#1e3a8a]">
        Família {family?.name}
      </h2>

      {/* Streak + Level */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl p-4 text-white">
          <div className="text-3xl mb-1">🔥</div>
          <p className="text-3xl font-bold">{streak?.current_streak ?? 0}</p>
          <p className="text-orange-100 text-xs">dias seguidos</p>
          <p className="text-white/80 text-xs mt-1">
            Recorde: {streak?.longest_streak ?? 0} dias
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e2d6b] rounded-2xl p-4 text-white">
          <div className="text-3xl mb-1">⭐</div>
          <p className="text-3xl font-bold">{totalPoints}</p>
          <p className="text-blue-200 text-xs">pontos totais</p>
          <p className="text-white/80 text-xs mt-1">Nível {level} · {toNext} pts p/ próx.</p>
        </div>
      </div>

      {/* Level progress */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-gray-700 text-sm">🏆 {levelTitle}</p>
          <p className="text-xs text-gray-400">Nível {level}</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-[#1e3a8a] h-2.5 rounded-full transition-all"
            style={{ width: `${Math.min(100 - (toNext / 100) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {completionRate}% de consistência nos últimos 30 dias
        </p>
      </div>

      {/* Children progress */}
      {children && children.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-800 text-sm mb-4">👧 Progresso dos Filhos</p>
          <div className="space-y-4">
            {children.map((child) => {
              const childLevel = calculateLevel(child.points);
              const childPct = 100 - (pointsToNextLevel(child.points) / 100) * 100;
              return (
                <div key={child.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{child.avatar_emoji}</span>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{child.name}</p>
                        <p className="text-xs text-gray-400">
                          {child.age} anos · Nível {childLevel} · {child.points} pts
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(childPct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="font-bold text-gray-800 text-sm mb-4">🏅 Conquistas</p>
        {familyBadges && familyBadges.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {familyBadges.map((fb) => (
              <div
                key={fb.id}
                className="flex flex-col items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl p-3"
              >
                <span className="text-3xl">{fb.badge?.icon_emoji}</span>
                <p className="text-xs font-semibold text-amber-800 text-center leading-tight">
                  {fb.badge?.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm">
              Complete devocionais para ganhar conquistas! 🌟
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
