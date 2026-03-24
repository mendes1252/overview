"use client";

import { useState, useCallback } from "react";
import { Volume2, CheckCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { Devotional } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  devotional: Devotional | null;
  familyId: string;
  alreadyCompleted: boolean;
  today: string;
}

export default function DevotionalView({ devotional: initial, familyId, alreadyCompleted, today }: Props) {
  const [devotional, setDevotional] = useState<Devotional | null>(initial);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [expandStory, setExpandStory] = useState(false);
  const [expandParent, setExpandParent] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [customTheme, setCustomTheme] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const loadDevotional = useCallback(async (theme?: string) => {
    setLoading(true);
    const res = await fetch("/api/devotional/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today, theme }),
    });
    if (res.ok) {
      const data = await res.json();
      setDevotional(data);
    }
    setLoading(false);
  }, [today]);

  async function handleComplete() {
    if (!devotional || !familyId || completed) return;
    setCompleting(true);
    const res = await fetch("/api/devotional/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devotional_id: devotional.id, family_id: familyId }),
    });
    if (res.ok) setCompleted(true);
    setCompleting(false);
  }

  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-[#1e3a8a] animate-spin" />
        <p className="text-gray-500 text-sm">Gerando devocional com IA...</p>
      </div>
    );
  }

  if (!devotional) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-5">📖</div>
        <h2 className="text-xl font-bold font-playfair text-[#1e3a8a] mb-3">
          Nenhum devocional hoje
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Gere um devocional personalizado com IA para a sua família.
        </p>

        {showCustom && (
          <div className="mb-4 flex gap-2">
            <input
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              placeholder="Ex: medo, perdão, gratidão..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
            <button
              onClick={() => loadDevotional(customTheme || undefined)}
              className="bg-[#1e3a8a] text-white px-4 py-2 rounded-xl text-sm font-medium"
            >
              Gerar
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => loadDevotional()}
            className="w-full bg-[#1e3a8a] hover:bg-[#1e2d6b] text-white font-semibold py-3 rounded-xl transition"
          >
            ✨ Gerar devocional do dia
          </button>
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="w-full border border-[#1e3a8a] text-[#1e3a8a] font-medium py-3 rounded-xl transition hover:bg-blue-50"
          >
            🎯 Personalizar tema
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Theme badge */}
      <div className="flex items-center gap-2">
        <span className="bg-[#1e3a8a]/10 text-[#1e3a8a] text-xs font-semibold px-3 py-1 rounded-full">
          {devotional.theme}
        </span>
        {devotional.generated_by_ai && (
          <span className="bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-full">✨ IA</span>
        )}
      </div>

      {/* Verse card */}
      <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e2d6b] text-white rounded-2xl p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="text-blue-200 text-xs font-semibold uppercase tracking-wide">
            Versículo do dia
          </span>
          <button
            onClick={() => speak(devotional.verse)}
            className={cn(
              "p-2 rounded-full transition",
              speaking ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
            )}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <blockquote className="text-lg leading-relaxed font-medium mb-3 italic">
          "{devotional.verse}"
        </blockquote>
        <p className="text-amber-300 font-semibold text-sm">— {devotional.verse_reference}</p>
      </div>

      {/* Children's story */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setExpandStory(!expandStory)}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <div className="text-left">
              <p className="font-bold text-gray-800 text-sm">História para as Crianças</p>
              <p className="text-gray-400 text-xs">Toque para {expandStory ? "fechar" : "ler"}</p>
            </div>
          </div>
          {expandStory ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {expandStory && (
          <div className="mt-4 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {devotional.children_story}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💬</span>
          <p className="font-bold text-gray-800 text-sm">Perguntas para Discussão</p>
        </div>
        <ol className="space-y-3">
          {devotional.questions.map((q, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1e3a8a] text-white rounded-full text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <p className="text-gray-700 text-sm leading-relaxed">{q}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Parent explanation */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setExpandParent(!expandParent)}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨‍👩‍👧</span>
            <div className="text-left">
              <p className="font-bold text-gray-800 text-sm">Para os Pais</p>
              <p className="text-gray-400 text-xs">Contexto e aplicação bíblica</p>
            </div>
          </div>
          {expandParent ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {expandParent && (
          <div className="mt-4 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {devotional.parent_explanation}
          </div>
        )}
      </div>

      {/* Prayer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🙏</span>
          <p className="font-bold text-amber-800 text-sm">Oração em Família</p>
        </div>
        <p className="text-amber-700 text-sm leading-relaxed italic">"{devotional.prayer}"</p>
      </div>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        disabled={completed || completing || !familyId}
        className={cn(
          "w-full py-4 rounded-2xl font-bold text-base transition flex items-center justify-center gap-3",
          completed
            ? "bg-green-500 text-white cursor-default"
            : "bg-[#1e3a8a] hover:bg-[#1e2d6b] text-white active:scale-95"
        )}
      >
        {completing ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Registrando...</>
        ) : completed ? (
          <><CheckCircle className="w-5 h-5" /> Devocional concluído! +50 pts</>
        ) : (
          <>✅ Concluir em Família (+50 pts)</>
        )}
      </button>

      <div className="pb-4" />
    </div>
  );
}
