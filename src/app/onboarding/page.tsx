"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  Settings,
  Rocket,
  CheckCircle,
  Loader2,
} from "lucide-react";

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

const GOALS = [
  { value: "work", label: "Aumentar produtividade no trabalho" },
  { value: "habits", label: "Criar habitos saudaveis" },
  { value: "balance", label: "Equilibrar vida pessoal e profissional" },
  { value: "study", label: "Estudar com consistencia" },
  { value: "other", label: "Outro" },
];

const COACH_TONES = [
  { value: "motivational", label: "Motivador e energetico", emoji: "⚡" },
  { value: "calm", label: "Calmo e reflexivo", emoji: "🧘" },
  { value: "direct", label: "Direto e objetivo", emoji: "🎯" },
  { value: "friendly", label: "Amigavel e empatico", emoji: "💬" },
];

const REPORT_TIMES = [
  { value: "08:00", label: "08:00 - Manha" },
  { value: "12:00", label: "12:00 - Meio-dia" },
  { value: "18:00", label: "18:00 - Fim do dia" },
  { value: "21:00", label: "21:00 - Noite" },
];

interface OnboardingData {
  name: string;
  timezone: string;
  primaryGoal: string;
  otherGoal: string;
  weekStartsOn: number;
  reportTime: string;
  coachTone: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    timezone: "America/Sao_Paulo",
    primaryGoal: "",
    otherGoal: "",
    weekStartsOn: 1,
    reportTime: "18:00",
    coachTone: "motivational",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user?.name) {
      setData((prev) => ({ ...prev, name: session.user?.name || "" }));
    }
    // Auto-detect timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const matchedTimezone = TIMEZONES.find((tz) => tz.value === detectedTimezone);
    if (matchedTimezone) {
      setData((prev) => ({ ...prev, timezone: matchedTimezone.value }));
    }
  }, [session, status, router]);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          timezone: data.timezone,
          primaryGoal: data.primaryGoal === "other" ? data.otherGoal : data.primaryGoal,
          weekStartsOn: data.weekStartsOn,
          reportTime: data.reportTime,
          coachTone: data.coachTone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save onboarding data");
      }

      toast({
        title: "Configuracao concluida!",
        description: "Bem-vindo ao PULSO. Vamos comecar!",
        variant: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel salvar suas configuracoes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipTour = () => {
    handleComplete();
  };

  const canProceed = () => {
    switch (step) {
      case 2:
        return data.name.length >= 2;
      case 3:
        return true;
      default:
        return true;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">PULSO</span>
            </div>
            <span className="text-sm text-gray-500">Passo {step} de 4</span>
          </div>
          <Progress value={(step / 4) * 100} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-8">
        <div className="w-full max-w-xl">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bem-vindo ao PULSO!
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Estamos muito felizes em te-lo aqui. Vamos configurar sua conta
                em poucos passos para personalizar sua experiencia.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="p-4 rounded-xl bg-blue-50 text-center">
                  <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Gerencie tarefas</span>
                </div>
                <div className="p-4 rounded-xl bg-green-50 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Construa habitos</span>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 text-center">
                  <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Alcance metas</span>
                </div>
              </div>
              <Button size="lg" onClick={handleNext} className="gap-2">
                Vamos comecar <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Perfil Basico
                  </h2>
                  <p className="text-gray-600">Conte-nos um pouco sobre voce</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Como podemos te chamar?</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) =>
                      setData({ ...data, name: e.target.value })
                    }
                    placeholder="Seu nome"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Seu fuso horario</Label>
                  <Select
                    value={data.timezone}
                    onValueChange={(value) =>
                      setData({ ...data, timezone: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione seu fuso horario" />
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
                  <Label>Qual seu objetivo principal?</Label>
                  <Select
                    value={data.primaryGoal}
                    onValueChange={(value) =>
                      setData({ ...data, primaryGoal: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione seu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOALS.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {data.primaryGoal === "other" && (
                    <Input
                      value={data.otherGoal}
                      onChange={(e) =>
                        setData({ ...data, otherGoal: e.target.value })
                      }
                      placeholder="Descreva seu objetivo"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Preferencias
                  </h2>
                  <p className="text-gray-600">
                    Personalize sua experiencia
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Dia de inicio da semana</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => setData({ ...data, weekStartsOn: 0 })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        data.weekStartsOn === 0
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium">Domingo</span>
                    </button>
                    <button
                      onClick={() => setData({ ...data, weekStartsOn: 1 })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        data.weekStartsOn === 1
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium">Segunda-feira</span>
                    </button>
                  </div>
                </div>

                <div>
                  <Label>Horario para receber relatorios</Label>
                  <Select
                    value={data.reportTime}
                    onValueChange={(value) =>
                      setData({ ...data, reportTime: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_TIMES.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tom do coach de IA</Label>
                  <p className="text-sm text-gray-500 mt-1 mb-3">
                    Escolha como voce prefere receber feedback e sugestoes
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {COACH_TONES.map((tone) => (
                      <button
                        key={tone.value}
                        onClick={() => setData({ ...data, coachTone: tone.value })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          data.coachTone === tone.value
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{tone.emoji}</span>
                        <span className="font-medium text-sm">{tone.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button onClick={handleNext}>
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Tour / Finish */}
          {step === 4 && (
            <div className="animate-fadeIn text-center">
              <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tudo pronto, {data.name.split(" ")[0]}!
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Sua conta esta configurada. Agora voce pode comecar a usar o
                PULSO para transformar sua produtividade.
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Proximos passos sugeridos:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium mt-0.5">
                      1
                    </div>
                    <span className="text-gray-600">
                      Adicione sua primeira tarefa para hoje
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium mt-0.5">
                      2
                    </div>
                    <span className="text-gray-600">
                      Crie um habito que deseja construir
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium mt-0.5">
                      3
                    </div>
                    <span className="text-gray-600">
                      Defina uma meta para a semana
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Ir para o Dashboard <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>

              <button
                onClick={handleSkipTour}
                className="text-sm text-gray-500 hover:text-gray-700 mt-4 underline"
              >
                Pular tour e comecar a usar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
