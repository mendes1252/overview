import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

export function pointsToNextLevel(points: number): number {
  return 100 - (points % 100);
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: "Aprendiz da Fé",
    2: "Servo Fiel",
    3: "Guerreiro de Oração",
    4: "Discípulo Dedicado",
    5: "Herói da Fé",
    6: "Guardião da Palavra",
    7: "Campeão do Reino",
    8: "Embaixador Celestial",
    9: "Ungido do Senhor",
    10: "Coluna da Igreja",
  };
  return titles[Math.min(level, 10)] ?? "Mestre da Fé";
}
