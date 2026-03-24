import { createClient } from "@/lib/supabase/server";
import DiaryFeed from "@/components/diary/DiaryFeed";

export const dynamic = "force-dynamic";

export default async function DiarioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: family } = await supabase
    .from("families")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();

  const { data: entries } = await supabase
    .from("diary_entries")
    .select("*")
    .eq("family_id", family?.id ?? "")
    .order("entry_date", { ascending: false });

  return (
    <div className="px-4 pt-5">
      <h2 className="text-xl font-bold font-playfair text-[#1e3a8a] mb-1">
        Diário da Família
      </h2>
      <p className="text-gray-500 text-sm mb-5">
        Registre os momentos especiais de {family?.name}
      </p>
      <DiaryFeed entries={entries ?? []} familyId={family?.id ?? ""} />
    </div>
  );
}
