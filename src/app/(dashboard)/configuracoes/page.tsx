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
  { value: "America/Sao_Paulo", label: "Brasilia (GMT-3)" },
  { value: "America/Manaus", label: "Manaus (GMT-4)" },
  { value: "America/Belem", label: "Belem (GMT-3)" },
  { value: "America/Fortaleza", label: "Fortaleza (GMT-3)" },
  { value: "America/Recife", label: "Recife (GMT-3)" },
  { value: "America/Cuiaba", label: "Cuiaba (GMT-4)" },
  { value: "America/Porto_Velho", label: "Porto Velho (GMT-4)" },
  { value: "America/Rio_Branco", label: "Rio Branco (GMT-5)" },
];

const COACH_TONES = [
  { value: "motivational", label: "Motivador e energetico" },
  { value: "calm", label: "Calmo e reflexivo" },
  { value: "direct", label: "Direto e objetivo" },
  { value: "friendly", label: "Amigavel e empatico" },
];

const REPORT_TIMES = [
  { value: "08:00", label: "08:00 - Manha" },
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
        title: "Configuracoes salvas",
        description: "Suas preferencias foram atualizadas com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel salvar as configuracoes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-7 h-7 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Configuracoes</h1>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Preferencias</h2>

        <div>
          <Label>Fuso horario</Label>
          <Select
            value={data.timezone}
            onValueChange={(v) => setData({ ...data, timezone: v })}
          >
            <SelectTrigger className="mt-2">
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
          <Label>Inicio da semana</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => setData({ ...data, weekStartsOn: 0 })}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                data.weekStartsOn === 0
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              Domingo
            </button>
            <button
              onClick={() => setData({ ...data, weekStartsOn: 1 })}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                data.weekStartsOn === 1
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              Segunda-feira
            </button>
          </div>
        </div>

        <div>
          <Label>Horario dos relatorios</Label>
          <Select
            value={data.reportTime}
            onValueChange={(v) => setData({ ...data, reportTime: v })}
          >
            <SelectTrigger className="mt-2">
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
          <Label>Tom do coach de IA</Label>
          <Select
            value={data.coachTone}
            onValueChange={(v) => setData({ ...data, coachTone: v })}
          >
            <SelectTrigger className="mt-2">
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

        <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2">
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Salvar configuracoes
        </Button>
      </div>
    </div>
  );
}
