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
    <Card className="overflow-hidden rounded-2xl border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] bg-white">
      <div className="gradient-hero p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5" />
          <span className="font-medium">Próximo Relatório IA</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm font-light">
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
            <p className="text-sm text-[#718096] font-light mb-3 line-clamp-3">
              {report.summary.substring(0, 150)}...
            </p>
            <Link href="/relatorios">
              <Button variant="ghost" size="sm" className="gap-1 w-full text-[#4A9FFF]">
                Ver Relatórios <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-[#718096] font-light mb-3">
              Seu primeiro relatório será gerado na próxima sexta-feira com
              base nos seus dados da semana.
            </p>
            <div className="text-xs text-[#718096]/60 font-light">
              Continue registrando suas atividades para receber insights
              personalizados.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
