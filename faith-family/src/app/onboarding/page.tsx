"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, ChevronRight } from "lucide-react";

const AVATAR_EMOJIS = ["👦", "👧", "🧒", "👶", "🌟", "🐑", "🦁", "🐬", "🌈", "🦋"];

interface ChildInput {
  name: string;
  age: string;
  avatar_emoji: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [familyName, setFamilyName] = useState("");
  const [children, setChildren] = useState<ChildInput[]>([
    { name: "", age: "", avatar_emoji: "👦" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addChild() {
    setChildren([...children, { name: "", age: "", avatar_emoji: "👧" }]);
  }

  function removeChild(i: number) {
    setChildren(children.filter((_, idx) => idx !== i));
  }

  function updateChild(i: number, field: keyof ChildInput, value: string) {
    setChildren(children.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!familyName.trim()) { setError("Digite o nome da família."); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Check if family already exists
    const { data: existing } = await supabase
      .from("families")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    let familyId = existing?.id;

    if (!familyId) {
      const { data: family, error: familyErr } = await supabase
        .from("families")
        .insert({ name: familyName.trim(), owner_id: user.id })
        .select("id")
        .single();
      if (familyErr) { setError(familyErr.message); setLoading(false); return; }
      familyId = family.id;

      // Create streak record
      await supabase.from("family_streaks").insert({
        family_id: familyId,
        current_streak: 0,
        longest_streak: 0,
      });

      // Create subscription (trial)
      await supabase.from("subscriptions").insert({
        user_id: user.id,
        status: "trialing",
        plan: "free",
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Add children
    const validChildren = children.filter((c) => c.name.trim() && c.age);
    if (validChildren.length > 0) {
      await supabase.from("children").insert(
        validChildren.map((c) => ({
          family_id: familyId,
          name: c.name.trim(),
          age: parseInt(c.age),
          avatar_emoji: c.avatar_emoji,
          points: 0,
          level: 1,
        }))
      );
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#1e2d6b] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏠</div>
          <h1 className="text-2xl font-bold font-playfair text-[#1e3a8a]">
            Configure sua Família
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 ? "Como se chama a sua família?" : "Quem são os seus filhos?"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-3 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit}>
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da família
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="Ex: Família Silva"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1e3a8a] hover:bg-[#1e2d6b] text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                Próximo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {children.map((child, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">Filho {i + 1}</span>
                    {children.length > 1 && (
                      <button type="button" onClick={() => removeChild(i)}>
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => updateChild(i, "name", e.target.value)}
                      placeholder="Nome"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                    <input
                      type="number"
                      value={child.age}
                      onChange={(e) => updateChild(i, "age", e.target.value)}
                      placeholder="Idade"
                      min={1}
                      max={18}
                      className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => updateChild(i, "avatar_emoji", emoji)}
                        className={`text-xl w-9 h-9 rounded-full flex items-center justify-center transition ${
                          child.avatar_emoji === emoji
                            ? "bg-[#1e3a8a] shadow-md scale-110"
                            : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addChild}
                className="w-full border-2 border-dashed border-gray-200 text-gray-400 hover:text-[#1e3a8a] hover:border-[#1e3a8a] py-3 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Adicionar filho
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e3a8a] hover:bg-[#1e2d6b] text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Começar a jornada! 🙏"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
