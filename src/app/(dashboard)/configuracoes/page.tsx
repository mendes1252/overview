"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Settings } from "lucide-react";

const TIMEZONES = [
  { value: "America/Sao_Paulo", label: "Brasília (GMT-3)" },
  { value: "America/Manaus", label: "Manaus (GMT-4)" },
  { value: "America/Belem", label: "Belém (GMT-3)" },
  { value: "America/Fortaleza", label: "Fortaleza (GMT-3)" },
  { value: "America/Recife", label: "Recife (GMT-3)" },
  { value: "America/Cuiaba", label: "Cuiabá (GMT-4)" },
  { value: "America/Porto_Velho", label: "Porto Velho (GMT-4)" },
  { value: "America/Rio_Branco", label: "Rio Branco (GMT-5)" },
];

const COACH_TONES = [
  { value: "motivational", label: "Motivador e energético" },
  { value: "calm", label: "Calmo e reflexivo" },
  { value: "direct", label: "Direto e objetivo" },
  { value: "friendly", label: "Amigável e empático" },
];

const REPORT_TIMES = [
  { value: "08:00", label: "08:00 - Manhã" },
  { value: "12:00", label: "12:00 - Meio-dia" },
  { value: "18:00", label: "18:00 - Fim do dia" },
  { value: "21:00", label: "21:00 - Noite" },
];

interface UserProfile {
  timezone: string;
  weekStartsOn: number;
  reportTime: string;
  coachTone: string;
}

export default function ConfiguracoesPage() {
  const { status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<UserProfile>({
    timezone: "America/Sao_Paulo",
    weekStartsOn: 1,
    reportTime: "18:00",
    coachTone: "motivational",
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((profile) => {
          setData({
            timezone: profile.timezone || "America/Sao_Paulo",
            weekStartsOn: profile.weekStartsOn ?? 1,
            reportTime: profile.reportTime || "18:00",
            coachTone: profile.coachTone || "motivational",
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A9FFF]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#4A9FFF]/15 flex items-center justify-center">
          <Settings className="w-5 h-5 text-[#4A9FFF]" />
        </div>
        <h1 className="text-2xl font-medium text-white">Configurações</h1>
      </div>

      <div className="bg-white rounded-2xl border border-white/10 shadow-lg shadow-[#4A9FFF]/[0.04] p-6 space-y-6">
        <h2 className="text-lg font-medium text-[#1A1A2E]">Preferências</h2>

        <div>
          <Label className="text-[#1A1A2E]">Fuso horário</Label>
          <Select
            value={data.timezone}
            onValueChange={(v) => setData({ ...data, timezone: v })}
          >
            <SelectTrigger className="mt-2 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[#1A1A2E]">Início da semana</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => setData({ ...data, weekStartsOn: 0 })}
              className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                data.weekStartsOn === 0
                  ? "border-[#4A9FFF] bg-[#4A9FFF]/5 text-[#4A9FFF]"
                  : "border-black/[0.04] hover:border-[#4A9FFF]/30 text-[#718096]"
              }`}
            >
              Domingo
            </button>
            <button
              onClick={() => setData({ ...data, weekStartsOn: 1 })}
              className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                data.weekStartsOn === 1
                  ? "border-[#4A9FFF] bg-[#4A9FFF]/5 text-[#4A9FFF]"
                  : "border-black/[0.04] hover:border-[#4A9FFF]/30 text-[#718096]"
              }`}
            >
              Segunda-feira
            </button>
          </div>
        </div>

        <div>
          <Label className="text-[#1A1A2E]">Horário dos relatórios</Label>
          <Select
            value={data.reportTime}
            onValueChange={(v) => setData({ ...data, reportTime: v })}
          >
            <SelectTrigger className="mt-2 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TIMES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[#1A1A2E]">Tom do coach de IA</Label>
          <Select
            value={data.coachTone}
            onValueChange={(v) => setData({ ...data, coachTone: v })}
          >
            <SelectTrigger className="mt-2 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COACH_TONES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full gap-2 bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl h-11 transition-colors"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Salvar configurações
        </Button>
      </div>
    </div>
  );
}
