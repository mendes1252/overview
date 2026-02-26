"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Brain,
  Loader2,
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
  Zap,
  Calendar,
  Crown,
} from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  weekStart: string;
  weekEnd: string;
  summary: string;
  insights: string;
  recommendations: string;
  highlights: string;
  tasksCompleted: number;
  tasksTotal: number;
  habitsConsistency: number;
  goalsAchieved: number;
  goalsTotal: number;
  createdAt: string;
}

export default function RelatoriosPage() {
  const { status } = useSession();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/reports")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setReports(data);
            if (data.length > 0) setSelectedReport(data[0]);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/reports", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "PLAN_LIMIT_REACHED") {
          toast({
            title: "Limite do plano",
            description: data.error,
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setReports((prev) => [data, ...prev]);
      setSelectedReport(data);
      toast({ title: "Relatório gerado!", description: "Seu relatório semanal está pronto." });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório. Verifique se há dados suficientes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A9FFF]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-white">Relatórios</h1>
          <p className="text-white/50 font-light">Análise semanal com inteligência artificial</p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl btn-pulse gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Gerar Relatório
            </>
          )}
        </Button>
      </div>

      {reports.length === 0 && !selectedReport ? (
        /* Empty state */
        <div className="bg-white rounded-3xl border border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-8 h-8 text-[#4A9FFF]" />
          </div>
          <h2 className="text-xl font-medium text-[#1A1A2E] mb-3">Nenhum relatório ainda</h2>
          <p className="text-[#718096] font-light max-w-md mx-auto mb-6">
            Gere seu primeiro relatório semanal. Nossa IA vai analisar suas tarefas,
            hábitos e metas para criar insights personalizados.
          </p>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl btn-pulse gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Gerar Primeiro Relatório
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Report list */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider px-1">Histórico</h3>
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  selectedReport?.id === report.id
                    ? "border-[#4A9FFF] bg-white shadow-lg shadow-[#4A9FFF]/[0.06]"
                    : "border-white/10 bg-white/[0.95] hover:border-[#4A9FFF]/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-4 h-4 text-[#4A9FFF]" />
                  <span className="text-sm font-medium text-[#1A1A2E]">
                    {formatDate(report.weekStart)} — {formatDate(report.weekEnd)}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-[#718096] font-light">
                  <span>{report.tasksCompleted}/{report.tasksTotal} tarefas</span>
                  <span>{Math.round(report.habitsConsistency)}% hábitos</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected report detail */}
          {selectedReport && (
            <div className="lg:col-span-2 space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#4A9FFF]" />
                    <span className="text-xs text-[#718096] font-light">Tarefas</span>
                  </div>
                  <div className="text-3xl font-light text-[#1A1A2E]">
                    {selectedReport.tasksTotal > 0
                      ? Math.round((selectedReport.tasksCompleted / selectedReport.tasksTotal) * 100)
                      : 0}%
                  </div>
                  <div className="text-xs text-[#718096] font-light mt-1">
                    {selectedReport.tasksCompleted} de {selectedReport.tasksTotal}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#4A9FFF]" />
                    <span className="text-xs text-[#718096] font-light">Hábitos</span>
                  </div>
                  <div className="text-3xl font-light text-[#1A1A2E]">
                    {Math.round(selectedReport.habitsConsistency)}%
                  </div>
                  <div className="text-xs text-[#718096] font-light mt-1">consistência</div>
                </div>
                <div className="bg-white rounded-2xl border border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-[#4A9FFF]" />
                    <span className="text-xs text-[#718096] font-light">Metas</span>
                  </div>
                  <div className="text-3xl font-light text-[#1A1A2E]">
                    {selectedReport.goalsAchieved}/{selectedReport.goalsTotal}
                  </div>
                  <div className="text-xs text-[#718096] font-light mt-1">alcançadas</div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl border border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-[#4A9FFF]" />
                  <h3 className="font-medium text-[#1A1A2E]">Resumo da Semana</h3>
                </div>
                <p className="text-[#718096] font-light leading-relaxed">{selectedReport.summary}</p>
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-2xl border border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#4A9FFF]" />
                  <h3 className="font-medium text-[#1A1A2E]">Destaques</h3>
                </div>
                <ul className="space-y-3">
                  {selectedReport.highlights.split("|").map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                      <span className="text-[#718096] font-light">{h.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Insights */}
              <div className="bg-white rounded-2xl border border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-[#4A9FFF]" />
                  <h3 className="font-medium text-[#1A1A2E]">Insights</h3>
                </div>
                <ul className="space-y-3">
                  {selectedReport.insights.split("|").map((ins, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#4A9FFF]/10 flex items-center justify-center mt-0.5 shrink-0">
                        <span className="text-xs text-[#4A9FFF] font-medium">{i + 1}</span>
                      </div>
                      <span className="text-[#718096] font-light">{ins.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="gradient-hero rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-[#4A9FFF]" />
                  <h3 className="font-medium text-white">Recomendações para Próxima Semana</h3>
                </div>
                <ul className="space-y-3">
                  {selectedReport.recommendations.split("|").map((rec, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mt-0.5 shrink-0">
                        <span className="text-xs text-[#4A9FFF] font-medium">{i + 1}</span>
                      </div>
                      <span className="text-white/70 font-light">{rec.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
