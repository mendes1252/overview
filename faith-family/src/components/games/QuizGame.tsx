"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  { id: 1, hero: "Abraão", question: "Quem Deus pediu que sacrificasse seu filho único?", options: ["Moisés", "Abraão", "Davi", "Jacó"], correct_index: 1 },
  { id: 2, hero: "Moisés", question: "Quem Deus usou para libertar Israel do Egito?", options: ["Josué", "Abraão", "Moisés", "Sansão"], correct_index: 2 },
  { id: 3, hero: "Davi", question: "Quem derrotou o gigante Golias com uma pedra?", options: ["Elias", "Sansão", "Noé", "Davi"], correct_index: 3 },
  { id: 4, hero: "Ester", question: "Quem salvou o povo judeu sendo rainha da Pérsia?", options: ["Rute", "Ester", "Débora", "Maria"], correct_index: 1 },
  { id: 5, hero: "Daniel", question: "Quem foi jogado na cova dos leões e saiu ileso?", options: ["Jeremias", "Ezequiel", "Daniel", "Isaías"], correct_index: 2 },
  { id: 6, hero: "Noé", question: "Quem construiu uma arca para salvar sua família do dilúvio?", options: ["Noé", "Enoque", "Lamaque", "Jafé"], correct_index: 0 },
  { id: 7, hero: "Pedro", question: "Qual discípulo andou sobre as águas com Jesus?", options: ["João", "Tiago", "Pedro", "André"], correct_index: 2 },
  { id: 8, hero: "Paulo", question: "Quem foi convertido no caminho de Damasco?", options: ["Barnabé", "Estêvão", "Silas", "Paulo"], correct_index: 3 },
  { id: 9, hero: "Rute", question: "Quem disse 'onde tu morreres, eu morrerei' para sua sogra?", options: ["Ester", "Rute", "Débora", "Ana"], correct_index: 1 },
  { id: 10, hero: "José", question: "Quem foi vendido como escravo por seus irmãos e se tornou governador do Egito?", options: ["Benjamim", "Rubem", "José", "Dã"], correct_index: 2 },
  { id: 11, hero: "Elias", question: "Quem foi arrebatado ao céu em um carro de fogo?", options: ["Eliseu", "Elias", "Ezequiel", "Isaías"], correct_index: 1 },
  { id: 12, hero: "Sansão", question: "Quem tinha uma força sobrenatural nos cabelos e derrubou o templo dos filisteus?", options: ["Gideão", "Jeftá", "Sansão", "Otniel"], correct_index: 2 },
  { id: 13, hero: "Maria", question: "Quem foi escolhida por Deus para ser a mãe de Jesus?", options: ["Isabel", "Maria", "Ana", "Marta"], correct_index: 1 },
  { id: 14, hero: "João Batista", question: "Quem batizou Jesus no rio Jordão?", options: ["Pedro", "Tiago", "André", "João Batista"], correct_index: 3 },
  { id: 15, hero: "Josué", question: "Quem liderou Israel na conquista de Canaã após a morte de Moisés?", options: ["Calebe", "Josué", "Rúben", "Levi"], correct_index: 1 },
];

interface Props {
  onBack: () => void;
}

export default function QuizGame({ onBack }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const q = QUESTIONS[current];

  function handleAnswer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.correct_index;
    if (correct) setScore((s) => s + 10);
    setAnswers((prev) => [...prev, correct]);

    setTimeout(() => {
      if (current + 1 >= QUESTIONS.length) {
        setFinished(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 1200);
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  }

  if (finished) {
    const pct = Math.round((score / (QUESTIONS.length * 10)) * 100);
    return (
      <div className="px-4 pt-5">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "⭐" : "📖"}</div>
          <h2 className="text-2xl font-bold font-playfair text-[#1e3a8a] mb-2">
            Quiz Finalizado!
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Você acertou {answers.filter(Boolean).length} de {QUESTIONS.length} perguntas
          </p>
          <div className="bg-[#1e3a8a] text-white rounded-2xl p-6 mb-6">
            <p className="text-5xl font-bold mb-1">{score}</p>
            <p className="text-blue-200 text-sm">pontos ganhos</p>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-8">
            {answers.map((correct, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center",
                  correct ? "bg-green-100" : "bg-red-100"
                )}
              >
                {correct ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={restart}
              className="flex-1 border border-[#1e3a8a] text-[#1e3a8a] font-semibold py-3 rounded-xl"
            >
              Jogar novamente
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-[#1e3a8a] text-white font-semibold py-3 rounded-xl"
            >
              Voltar aos jogos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 text-sm">
          <ArrowLeft className="w-4 h-4" /> Sair
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {current + 1}/{QUESTIONS.length}
          </span>
          <span className="bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1 rounded-full">
            ⭐ {score}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
        <div
          className="bg-[#1e3a8a] h-2 rounded-full transition-all"
          style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Hero badge */}
      <div className="text-center mb-4">
        <span className="bg-[#1e3a8a]/10 text-[#1e3a8a] text-xs font-semibold px-3 py-1 rounded-full">
          Herói: {q.hero}
        </span>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <p className="text-gray-800 font-semibold text-base text-center leading-relaxed">
          {q.question}
        </p>
      </div>

      <div className="space-y-3">
        {q.options.map((option, idx) => {
          let style = "bg-white border border-gray-200 text-gray-700";
          if (selected !== null) {
            if (idx === q.correct_index) style = "bg-green-500 border-green-500 text-white";
            else if (idx === selected) style = "bg-red-400 border-red-400 text-white";
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selected !== null}
              className={cn(
                "w-full py-3.5 px-5 rounded-xl font-medium text-sm transition text-left",
                style,
                selected === null && "hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
