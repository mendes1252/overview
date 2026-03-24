"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/types";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface Props {
  flashcards: Flashcard[];
  masteredIds: string[];
  familyId: string;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

export default function FlashcardsView({ flashcards, masteredIds: initialMastered, familyId }: Props) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set(initialMastered));
  const [filter, setFilter] = useState<"all" | "unmastered">("unmastered");

  const filtered = filter === "unmastered"
    ? flashcards.filter((f) => !mastered.has(f.id))
    : flashcards;

  const card = filtered[current];

  async function markMastered() {
    if (!card) return;
    const newMastered = new Set(mastered);
    newMastered.add(card.id);
    setMastered(newMastered);

    const supabase = createClient();
    await supabase.from("flashcard_progress").upsert(
      { family_id: familyId, flashcard_id: card.id, mastered: true, review_count: 1, last_reviewed: new Date().toISOString() },
      { onConflict: "family_id,flashcard_id" }
    );

    // Move to next or stay
    if (current >= filtered.length - 1) setCurrent(Math.max(0, filtered.length - 2));
    setFlipped(false);
  }

  function prev() {
    setCurrent((c) => (c - 1 + filtered.length) % filtered.length);
    setFlipped(false);
  }

  function next() {
    setCurrent((c) => (c + 1) % filtered.length);
    setFlipped(false);
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-lg font-bold font-playfair text-[#1e3a8a] mb-2">
          {filter === "unmastered" ? "Todos decorados!" : "Nenhum versículo"}
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          {filter === "unmastered"
            ? "Você decorou todos os versículos disponíveis! Parabéns!"
            : "Nenhum versículo disponível."}
        </p>
        {filter === "unmastered" && (
          <button
            onClick={() => { setFilter("all"); setCurrent(0); }}
            className="bg-[#1e3a8a] text-white font-semibold px-6 py-3 rounded-xl"
          >
            Revisar todos
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["unmastered", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setCurrent(0); setFlipped(false); }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition",
              filter === f
                ? "bg-[#1e3a8a] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#1e3a8a]"
            )}
          >
            {f === "unmastered" ? `A estudar (${flashcards.length - mastered.size})` : `Todos (${flashcards.length})`}
          </button>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mb-3">
        {current + 1} / {filtered.length} · Toque no cartão para revelar
      </p>

      {/* Flip card */}
      <div
        className="flip-card h-56 mb-5 cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={cn("flip-card-inner h-full", flipped && "flipped")}>
          {/* Front: reference */}
          <div className="flip-card-front bg-gradient-to-br from-[#1e3a8a] to-[#1e2d6b] text-white rounded-2xl flex flex-col items-center justify-center p-6 text-center">
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-3">
              {card.category}
            </p>
            <p className="text-3xl font-bold font-playfair mb-2">{card.reference}</p>
            <span className={cn("text-xs px-2 py-1 rounded-full", DIFFICULTY_COLORS[card.difficulty])}>
              {DIFFICULTY_LABELS[card.difficulty]}
            </span>
            <p className="text-blue-200 text-xs mt-4">Toque para revelar ↓</p>
          </div>

          {/* Back: verse text */}
          <div className="flip-card-back bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-sm">
            <p className="text-amber-500 font-semibold text-sm mb-3">{card.reference}</p>
            <p className="text-gray-800 text-base leading-relaxed italic">
              "{card.verse}"
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={prev}
          className="flex-1 flex items-center justify-center gap-1 border border-gray-200 py-3 rounded-xl text-gray-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        <button
          onClick={next}
          className="flex-1 flex items-center justify-center gap-1 border border-gray-200 py-3 rounded-xl text-gray-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition"
        >
          Próximo <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {flipped && !mastered.has(card.id) && (
        <button
          onClick={markMastered}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Já decorei este versículo! ✨
        </button>
      )}

      {mastered.has(card.id) && (
        <div className="w-full bg-green-50 border border-green-200 text-green-700 font-medium py-3 rounded-xl text-center text-sm">
          ✅ Versículo decorado!
        </div>
      )}
    </div>
  );
}
