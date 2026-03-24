"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const SCENARIOS = [
  {
    id: 1,
    title: "O Chamado de Deus",
    text: "Deus apareceu para Noé e disse: 'Construa uma arca enorme, pois virá um grande dilúvio. Salve sua família e dois de cada animal.' Os vizinhos de Noé riram dele. O que Noé deve fazer?",
    options: [
      { text: "Obedecer a Deus e começar a construir a arca", correct: true, feedback: "Correto! Noé confiou em Deus mesmo quando os outros não acreditavam. A obediência é a chave da fé!" },
      { text: "Escutar os vizinhos e desistir", correct: false, feedback: "Quando Deus fala, devemos obedecer mesmo quando os outros não acreditam em nós." },
      { text: "Esperar para ver se vai chover primeiro", correct: false, feedback: "A fé age antes de ver! Noé começou a construir mesmo sem ver as nuvens." },
    ],
  },
  {
    id: 2,
    title: "Os Animais Chegando",
    text: "Noé construiu a arca por muitos anos. Finalmente, Deus enviou os animais para entrar na arca — dois de cada espécie. Há muito barulho e confusão! Um leão está assustando os outros animais. O que Noé deve fazer?",
    options: [
      { text: "Orar a Deus pedindo sabedoria para cuidar dos animais", correct: true, feedback: "Excelente! Deus nos dá sabedoria quando pedimos. Noé cuidou de todos os animais com a ajuda de Deus!" },
      { text: "Deixar o leão de fora da arca", correct: false, feedback: "Deus pediu dois de cada animal. Devemos cuidar de todos, mesmo dos difíceis!" },
      { text: "Entrar em pânico e correr", correct: false, feedback: "Com Deus ao nosso lado, não precisamos ter medo. A paz vem da confiança nEle." },
    ],
  },
  {
    id: 3,
    title: "A Chuva Começa",
    text: "As chuvas começaram! A água sobe rapidamente. Noé e sua família estão seguros dentro da arca. Por 40 dias e 40 noites choveu sem parar. A família estava com saudade de casa. O que a família deve fazer?",
    options: [
      { text: "Agradecer a Deus pela proteção e confiar no Seu plano", correct: true, feedback: "Perfeito! Mesmo em tempos difíceis, podemos confiar e agradecer a Deus. Ele nunca nos abandona!" },
      { text: "Reclamar e ficar triste o tempo todo", correct: false, feedback: "A gratidão transforma nosso coração. Mesmo na arca, havia muito para agradecer!" },
      { text: "Tentar abrir a arca e sair", correct: false, feedback: "Às vezes precisamos confiar no tempo de Deus, mesmo quando é difícil esperar." },
    ],
  },
  {
    id: 4,
    title: "O Arco-Íris da Promessa",
    text: "A chuva parou! Noé soltou uma pomba que voltou com um ramo de oliveira — sinal de terra seca. Em breve, a arca parou no monte Ararate. Deus fez uma aliança com Noé e colocou um arco-íris no céu. O que isso significa?",
    options: [
      { text: "O arco-íris é a promessa de Deus de nunca mais destruir a terra com água", correct: true, feedback: "Isso mesmo! O arco-íris é o símbolo da promessa e fidelidade de Deus. Ele sempre cumpre Suas promessas!" },
      { text: "O arco-íris é apenas um fenômeno do tempo", correct: false, feedback: "Para Noé e para nós, o arco-íris é um lembrete da fidelidade e das promessas de Deus!" },
      { text: "Significa que vai chover novamente", correct: false, feedback: "Pelo contrário! O arco-íris é a promessa de Deus de que não haverá mais um dilúvio universal." },
    ],
  },
];

interface Props {
  onBack: () => void;
}

export default function ArkAdventure({ onBack }: Props) {
  const [scene, setScene] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const scenario = SCENARIOS[scene];

  function handleChoice(idx: number) {
    if (chosen !== null) return;
    setChosen(idx);
    if (scenario.options[idx].correct) setScore((s) => s + 5);
  }

  function next() {
    if (scene + 1 >= SCENARIOS.length) {
      setFinished(true);
    } else {
      setScene((s) => s + 1);
      setChosen(null);
    }
  }

  function restart() {
    setScene(0);
    setChosen(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="px-4 pt-5 text-center">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="text-6xl mb-4">🌈</div>
        <h2 className="text-2xl font-bold font-playfair text-[#1e3a8a] mb-2">Aventura Completa!</h2>
        <p className="text-gray-500 text-sm mb-6">Você ajudou Noé a completar a jornada da arca!</p>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl p-6 mb-6">
          <p className="text-5xl font-bold mb-1">{score}</p>
          <p className="text-blue-100 text-sm">pontos + 20 de bônus</p>
        </div>
        <p className="text-[#1e3a8a] font-medium text-sm mb-6">
          "E acontecerá que, quando eu cobrir de nuvens a terra, o arco aparecerá nas nuvens." — Gênesis 9:14
        </p>
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
        <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
          ⛵ {scene + 1}/{SCENARIOS.length}
        </span>
      </div>

      <div className="text-center text-5xl mb-4">⛵</div>

      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl p-5 mb-5">
        <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide mb-2">
          Cena {scene + 1}
        </p>
        <h3 className="font-bold text-lg font-playfair mb-3">{scenario.title}</h3>
        <p className="text-blue-50 text-sm leading-relaxed">{scenario.text}</p>
      </div>

      <div className="space-y-3 mb-4">
        {scenario.options.map((opt, idx) => {
          let style = "bg-white border border-gray-200 text-gray-700";
          if (chosen !== null) {
            if (opt.correct) style = "bg-green-500 border-green-500 text-white";
            else if (idx === chosen) style = "bg-red-400 border-red-400 text-white";
          }
          return (
            <button
              key={idx}
              onClick={() => handleChoice(idx)}
              disabled={chosen !== null}
              className={cn(
                "w-full py-3.5 px-5 rounded-xl font-medium text-sm transition text-left",
                style,
                chosen === null && "hover:border-blue-400 hover:text-blue-700"
              )}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {chosen !== null && (
        <div
          className={cn(
            "rounded-xl p-4 mb-4 text-sm",
            scenario.options[chosen].correct
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-orange-50 border border-orange-200 text-orange-800"
          )}
        >
          <p className="font-semibold mb-1">
            {scenario.options[chosen].correct ? "✅ Correto!" : "🤔 Quase lá!"}
          </p>
          <p>{scenario.options[chosen].feedback}</p>
        </div>
      )}

      {chosen !== null && (
        <button
          onClick={next}
          className="w-full bg-[#1e3a8a] text-white font-semibold py-3 rounded-xl"
        >
          {scene + 1 >= SCENARIOS.length ? "Ver resultado →" : "Próxima cena →"}
        </button>
      )}
    </div>
  );
}
