"use client";

import { useState } from "react";
import QuizGame from "@/components/games/QuizGame";
import MemoryGame from "@/components/games/MemoryGame";
import ArkAdventure from "@/components/games/ArkAdventure";
import { Trophy, Brain, Anchor } from "lucide-react";

type GameId = "quiz" | "memory" | "ark" | null;

export default function JogosPage() {
  const [activeGame, setActiveGame] = useState<GameId>(null);

  if (activeGame === "quiz") return <QuizGame onBack={() => setActiveGame(null)} />;
  if (activeGame === "memory") return <MemoryGame onBack={() => setActiveGame(null)} />;
  if (activeGame === "ark") return <ArkAdventure onBack={() => setActiveGame(null)} />;

  return (
    <div className="px-4 pt-5">
      <h2 className="text-xl font-bold font-playfair text-[#1e3a8a] mb-1">
        Jogos em Família
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Aprendam juntos de forma divertida!
      </p>

      <div className="space-y-4">
        <GameCard
          icon={<Trophy className="w-7 h-7 text-amber-500" />}
          emoji="🏆"
          title="Quiz Heróis da Fé"
          description="Teste seu conhecimento sobre os heróis bíblicos. 15 perguntas com pontuação."
          color="from-amber-400 to-orange-500"
          points="+10 pts por acerto"
          onPlay={() => setActiveGame("quiz")}
        />
        <GameCard
          icon={<Brain className="w-7 h-7 text-purple-500" />}
          emoji="🧠"
          title="Memória Bíblica"
          description="Encontre os pares de personagens bíblicos. Treine a memória com a família!"
          color="from-purple-400 to-pink-500"
          points="+25 pts ao completar"
          onPlay={() => setActiveGame("memory")}
        />
        <GameCard
          icon={<Anchor className="w-7 h-7 text-blue-500" />}
          emoji="⛵"
          title="Aventura da Arca"
          description="Ajude Noé a preparar a arca! Uma aventura de escolhas e aprendizado."
          color="from-blue-400 to-cyan-500"
          points="+20 pts ao finalizar"
          onPlay={() => setActiveGame("ark")}
        />
      </div>
    </div>
  );
}

function GameCard({
  emoji,
  title,
  description,
  color,
  points,
  onPlay,
}: {
  icon: React.ReactNode;
  emoji: string;
  title: string;
  description: string;
  color: string;
  points: string;
  onPlay: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${color} p-4 flex items-center gap-3`}>
        <span className="text-4xl">{emoji}</span>
        <div>
          <h3 className="font-bold text-white text-base">{title}</h3>
          <span className="text-white/80 text-xs">{points}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <button
          onClick={onPlay}
          className="w-full bg-[#1e3a8a] hover:bg-[#1e2d6b] text-white font-semibold py-2.5 rounded-xl transition text-sm"
        >
          Jogar agora →
        </button>
      </div>
    </div>
  );
}
