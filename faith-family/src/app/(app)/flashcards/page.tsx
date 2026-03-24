import { createClient } from "@/lib/supabase/server";
import FlashcardsView from "@/components/flashcards/FlashcardsView";

export const dynamic = "force-dynamic";

export default async function FlashcardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: family } = await supabase
    .from("families")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  const { data: flashcards } = await supabase
    .from("flashcards")
    .select("*")
    .order("difficulty", { ascending: true });

  const { data: progress } = await supabase
    .from("flashcard_progress")
    .select("*")
    .eq("family_id", family?.id ?? "");

  const masteredIds = new Set(
    (progress ?? []).filter((p) => p.mastered).map((p) => p.flashcard_id)
  );

  return (
    <div className="px-4 pt-5">
      <h2 className="text-xl font-bold font-playfair text-[#1e3a8a] mb-1">
        Versículos para Memorizar
      </h2>
      <p className="text-gray-500 text-sm mb-5">
        {masteredIds.size} de {flashcards?.length ?? 0} decorados
      </p>
      <FlashcardsView
        flashcards={flashcards ?? []}
        masteredIds={[...masteredIds]}
        familyId={family?.id ?? ""}
      />
    </div>
  );
}
