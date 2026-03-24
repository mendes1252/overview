"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const PAIRS = [
  { id: 1, emoji: "🌊", name: "Moisés" },
  { id: 2, emoji: "⚓", name: "Noé" },
  { id: 3, emoji: "🦁", name: "Daniel" },
  { id: 4, emoji: "⭐", name: "José" },
  { id: 5, emoji: "🗡️", name: "Davi" },
  { id: 6, emoji: "🌹", name: "Ester" },
  { id: 7, emoji: "🐑", name: "Abraão" },
  { id: 8, emoji: "🎯", name: "Josué" },
];

interface Card {
  uid: string;
  pairId: number;
  content: string;
  type: "emoji" | "name";
  flipped: boolean;
  matched: boolean;
}

function buildCards(): Card[] {
  const cards: Card[] = [];
  PAIRS.forEach((p) => {
    cards.push({ uid: `e-${p.id}`, pairId: p.id, content: p.emoji, type: "emoji", flipped: false, matched: false });
    cards.push({ uid: `n-${p.id}`, pairId: p.id, content: p.name, type: "name", flipped: false, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}

interface Props {
  onBack: () => void;
}

export default function MemoryGame({ onBack }: Props) {
  const [cards, setCards] = useState<Card[]>(buildCards);
  const [selected, setSelected] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [finished, startTime]);

  const handleFlip = useCallback((uid: string) => {
    if (selected.length === 2) return;
    const card = cards.find((c) => c.uid === uid);
    if (!card || card.flipped || card.matched) return;

    const newSelected = [...selected, uid];
    setCards((prev) => prev.map((c) => (c.uid === uid ? { ...c, flipped: true } : c)));
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected.map((id) => cards.find((c) => c.uid === id)!);
      if (a.pairId === b.pairId) {
        // Match!
        setCards((prev) =>
          prev.map((c) =>
            c.uid === a.uid || c.uid === b.uid ? { ...c, matched: true } : c
          )
        );
        setSelected([]);
        // Check if all matched
        const allMatched = cards.filter((c) => !c.matched).length === 2;
        if (allMatched) setTimeout(() => setFinished(true), 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uid === a.uid || c.uid === b.uid ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
        }, 900);
      }
    }
  }, [cards, selected]);

  function restart() {
    setCards(buildCards());
    setSelected([]);
    setMoves(0);
    setFinished(false);
    setElapsed(0);
  }

  const matched = cards.filter((c) => c.matched).length / 2;

  if (finished) {
    return (
      <div className="px-4 pt-5 text-center">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="text-6xl mb-4">🧠</div>
        <h2 className="text-2xl font-bold font-playfair text-[#1e3a8a] mb-2">Parabéns!</h2>
        <p className="text-gray-500 text-sm mb-6">Você encontrou todos os pares bíblicos!</p>
        <div className="bg-[#1e3a8a] text-white rounded-2xl p-6 mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-bold">{moves}</p>
            <p className="text-blue-200 text-xs">jogadas</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{elapsed}s</p>
            <p className="text-blue-200 text-xs">tempo</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={restart} className="flex-1 border border-[#1e3a8a] text-[#1e3a8a] font-semibold py-3 rounded-xl">
            Jogar de novo
          </button>
          <button onClick={onBack} className="flex-1 bg-[#1e3a8a] text-white font-semibold py-3 rounded-xl">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 text-sm">
          <ArrowLeft className="w-4 h-4" /> Sair
        </button>
        <div className="flex gap-3 text-sm text-gray-500">
          <span>⏱ {elapsed}s</span>
          <span>🎯 {matched}/{PAIRS.length}</span>
          <span>👆 {moves}</span>
        </div>
      </div>

      <h2 className="text-lg font-bold font-playfair text-[#1e3a8a] mb-4">Memória Bíblica</h2>
      <p className="text-gray-500 text-xs mb-4">Combine o emoji com o nome do herói bíblico!</p>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.uid}
            onClick={() => handleFlip(card.uid)}
            className={cn(
              "aspect-square rounded-xl text-center flex items-center justify-center transition-all font-medium text-sm",
              card.matched
                ? "bg-green-100 border-2 border-green-400"
                : card.flipped
                ? "bg-[#1e3a8a] text-white"
                : "bg-white border border-gray-200 hover:border-[#1e3a8a]"
            )}
          >
            {card.flipped || card.matched ? (
              <span className={card.type === "emoji" ? "text-2xl" : "text-xs font-bold"}>
                {card.content}
              </span>
            ) : (
              <span className="text-2xl text-gray-300">✝</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
