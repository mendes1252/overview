"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Clock, ChevronRight } from "lucide-react";
import type { Report } from "@prisma/client";

interface NextReportCardProps {
  report: Report | null;
}

export function NextReportCard({ report }: NextReportCardProps) {
  // Calculate days until next Friday
  const now = new Date();
  const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
  const nextFriday = new Date(now);
  nextFriday.setDate(now.getDate() + daysUntilFriday);

  return (
    <Card className="overflow-hidden">
      <div className="gradient-primary p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5" />
          <span className="font-semibold">Proximo Relatorio IA</span>
        </div>
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <Clock className="w-4 h-4" />
          <span>
            {daysUntilFriday === 0
              ? "Hoje!"
              : `Em ${daysUntilFriday} dia${daysUntilFriday > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        {report ? (
          <>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {report.summary.substring(0, 150)}...
            </p>
            <Link href="/relatorios">
              <Button variant="ghost" size="sm" className="gap-1 w-full">
                Ver Relatorios <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-3">
              Seu primeiro relatorio sera gerado na proxima sexta-feira com
              base nos seus dados da semana.
            </p>
            <div className="text-xs text-gray-400">
              Continue registrando suas atividades para receber insights
              personalizados.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
