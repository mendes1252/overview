"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { DiaryEntry } from "@/types";
import { formatDate } from "@/lib/utils";
import { Plus, X } from "lucide-react";

const EMOJIS = ["🙏", "❤️", "🌟", "🎉", "📖", "⛪", "👨‍👩‍👧", "🌈", "✝️", "🕊️", "🌸", "🎵"];

interface Props {
  entries: DiaryEntry[];
  familyId: string;
}

export default function DiaryFeed({ entries: initial, familyId }: Props) {
  const router = useRouter();
  const [entries, setEntries] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    emoji: "🙏",
    entry_date: new Date().toISOString().split("T")[0],
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("diary_entries")
      .insert({ ...form, family_id: familyId })
      .select("*")
      .single();

    if (!error && data) {
      setEntries([data, ...entries]);
      setShowForm(false);
      setForm({ title: "", description: "", emoji: "🙏", entry_date: new Date().toISOString().split("T")[0] });
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div>
      {/* Add button */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-2 bg-[#1e3a8a] hover:bg-[#1e2d6b] text-white font-semibold py-3 rounded-xl mb-5 transition"
      >
        <Plus className="w-4 h-4" /> Adicionar Momento
      </button>

      {/* Add form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-[#1e3a8a] text-lg font-playfair">
                Novo Momento
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setForm({ ...form, emoji: em })}
                      className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center transition ${
                        form.emoji === em
                          ? "bg-[#1e3a8a] shadow-md scale-110"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="Ex: Nossa oração em família"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] resize-none"
                  placeholder="Descreva este momento especial..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={form.entry_date}
                  onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#1e3a8a] text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar momento 💾"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Entries feed */}
      {entries.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📖</div>
          <p className="text-gray-500 text-sm">
            Nenhum momento registrado ainda. Comece documentando a jornada de fé da sua família!
          </p>
        </div>
      ) : (
        <div className="space-y-4 pb-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#1e3a8a]/10 rounded-xl flex items-center justify-center text-2xl">
                {entry.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm leading-tight mb-1">
                  {entry.title}
                </p>
                {entry.description && (
                  <p className="text-gray-500 text-xs leading-relaxed mb-2">
                    {entry.description}
                  </p>
                )}
                <p className="text-gray-300 text-xs">{formatDate(entry.entry_date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
