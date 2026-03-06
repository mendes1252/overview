"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Gift, Sparkles } from "lucide-react";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  isLastDay: boolean;
  nextDay: number | null;
  onNavigate: (path: string) => void;
}

export function CompletionModal({
  isOpen,
  onClose,
  dayNumber,
  isLastDay,
  nextDay,
  onNavigate,
}: CompletionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: [
                  "#4A9FFF",
                  "#6BB5FF",
                  "#10b981",
                  "#eab308",
                  "#f43f5e",
                ][i % 5],
                animation: `confettiFall ${2 + Math.random() * 2}s ease-in ${
                  Math.random() * 0.5
                }s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="relative bg-[#1A1A2E] border border-white/10 rounded-3xl p-8 max-w-md w-full animate-slideUp text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4A9FFF] to-[#6BB5FF] flex items-center justify-center mx-auto mb-6">
          {isLastDay ? (
            <Trophy className="w-10 h-10 text-white" />
          ) : (
            <Sparkles className="w-10 h-10 text-white" />
          )}
        </div>

        <h2 className="text-2xl font-medium text-white mb-2">
          {isLastDay
            ? "Desafio Completo!"
            : `Dia ${dayNumber} Concluido!`}
        </h2>

        <p className="text-white/60 font-light mb-6">
          {isLastDay
            ? "Parabens! Voce completou todos os 7 dias do desafio. Seu bonus exclusivo esta disponivel!"
            : `Excelente trabalho! O Dia ${nextDay} ja esta desbloqueado e esperando por voce.`}
        </p>

        <div className="space-y-3">
          {isLastDay ? (
            <Button
              className="w-full gap-2 bg-gradient-to-r from-[#4A9FFF] to-[#6BB5FF] hover:opacity-90"
              size="lg"
              onClick={() => onNavigate("/desafio/area-de-membros/bonus")}
            >
              <Gift className="w-5 h-5" />
              Ver Meu Bonus
            </Button>
          ) : (
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() =>
                onNavigate(`/desafio/area-de-membros/dia/${nextDay}`)
              }
            >
              Ir para o Dia {nextDay}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full text-white/50 hover:text-white hover:bg-white/5"
            onClick={() => onNavigate("/desafio/area-de-membros")}
          >
            Voltar ao Painel
          </Button>
        </div>
      </div>

      {/* Confetti keyframes */}
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
