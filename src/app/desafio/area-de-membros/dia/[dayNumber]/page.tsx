"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CompletionModal } from "@/components/challenge/completion-modal";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Play,
  FileDown,
  Target,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface DayData {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  videoUrl: string | null;
  pdfUrl: string | null;
  content: string | null;
  taskTitle: string;
  taskDescription: string;
}

interface EnrollmentResponse {
  enrolled: boolean;
  enrollment?: {
    status: string;
    completedDayNumbers: number[];
  };
  challenge?: {
    days: Array<DayData & { isCompleted: boolean; isUnlocked: boolean }>;
  };
}

export default function DayPage({
  params,
}: {
  params: Promise<{ dayNumber: string }>;
}) {
  const { dayNumber: dayNumberStr } = use(params);
  const dayNumber = parseInt(dayNumberStr);
  const router = useRouter();
  const { toast } = useToast();
  const [day, setDay] = useState<DayData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    isLastDay: boolean;
    nextDay: number | null;
  }>({ isLastDay: false, nextDay: null });

  useEffect(() => {
    fetch("/api/challenge/enrollment")
      .then((r) => r.json())
      .then((data: EnrollmentResponse) => {
        if (!data.enrolled || !data.challenge) {
          router.push("/desafio/checkout");
          return;
        }
        const dayData = data.challenge.days.find(
          (d) => d.dayNumber === dayNumber
        );
        if (!dayData) {
          router.push("/desafio/area-de-membros");
          return;
        }
        if (!dayData.isUnlocked && !dayData.isCompleted) {
          router.push("/desafio/area-de-membros");
          return;
        }
        setDay(dayData);
        setIsCompleted(dayData.isCompleted);
      })
      .catch(() => router.push("/desafio/area-de-membros"));
  }, [dayNumber, router]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/challenge/complete-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayNumber, notes: notes || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      setIsCompleted(true);
      setModalData({
        isLastDay: data.isLastDay,
        nextDay: data.nextDay,
      });
      setShowModal(true);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao concluir o dia",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!day) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-white/50">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      {/* Back link */}
      <Link
        href="/desafio/area-de-membros"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao painel
      </Link>

      {/* Day header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-[#4A9FFF]">
            Dia {day.dayNumber}
          </span>
          {isCompleted && (
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
              Concluido
            </span>
          )}
        </div>
        <h1 className="text-2xl font-medium text-white mb-2">{day.title}</h1>
        <p className="text-white/50 font-light">{day.description}</p>
      </div>

      {/* Video */}
      {day.videoUrl && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Play className="w-4 h-4 text-[#4A9FFF]" />
            <h3 className="text-sm font-medium text-white uppercase tracking-wider">
              Video-aula
            </h3>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10">
            <iframe
              src={day.videoUrl}
              title={`Dia ${day.dayNumber}: ${day.title}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Video placeholder if no URL */}
      {!day.videoUrl && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Play className="w-4 h-4 text-[#4A9FFF]" />
            <h3 className="text-sm font-medium text-white uppercase tracking-wider">
              Video-aula
            </h3>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 aspect-video flex items-center justify-center">
            <div className="text-center">
              <Play className="w-12 h-12 text-white/20 mx-auto mb-2" />
              <p className="text-sm text-white/30 font-light">
                Video sera disponibilizado em breve
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PDF download */}
      {day.pdfUrl && (
        <div className="mb-8">
          <a
            href={day.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/[0.08] hover:text-white transition-all"
          >
            <FileDown className="w-4 h-4 text-[#4A9FFF]" />
            Baixar material de apoio (PDF)
          </a>
        </div>
      )}

      {/* Text content */}
      {day.content && (
        <div className="mb-8 bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-medium prose-headings:text-white prose-p:text-white/60 prose-p:font-light prose-strong:text-white prose-li:text-white/60 prose-li:font-light">
            <div
              dangerouslySetInnerHTML={{
                __html: day.content
                  .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                  .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(
                    /^\d+\. (.*$)/gm,
                    "<li>$1</li>"
                  )
                  .replace(
                    /^- (.*$)/gm,
                    "<li>$1</li>"
                  )
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/^(?!<[hlo])/gm, "<p>")
                  .replace(/(?<![>])$/gm, "</p>"),
              }}
            />
          </div>
        </div>
      )}

      {/* Execution challenge */}
      <div className="bg-gradient-to-br from-[#4A9FFF]/10 to-[#4A9FFF]/5 border border-[#4A9FFF]/20 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#4A9FFF]" />
          <h3 className="font-medium text-white">Desafio de Execucao</h3>
        </div>
        <h4 className="text-lg font-medium text-white mb-3">
          {day.taskTitle}
        </h4>
        <div className="text-sm text-white/60 font-light whitespace-pre-line leading-relaxed">
          {day.taskDescription}
        </div>
      </div>

      {/* Notes & completion */}
      {!isCompleted ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">
              Reflexao / Anotacoes (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escreva suas reflexoes sobre o desafio de hoje..."
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/30 font-light resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#4A9FFF]/30"
            />
          </div>
          <Button
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-[#4A9FFF] to-[#6BB5FF] hover:opacity-90"
            onClick={handleComplete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Concluindo...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Concluir Dia {day.dayNumber}
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-400">
              Dia {day.dayNumber} concluido!
            </p>
            <p className="text-xs text-white/50 font-light">
              Voce pode revisitar este conteudo quando quiser.
            </p>
          </div>
        </div>
      )}

      {/* Completion modal */}
      <CompletionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        dayNumber={dayNumber}
        isLastDay={modalData.isLastDay}
        nextDay={modalData.nextDay}
        onNavigate={(path) => {
          setShowModal(false);
          router.push(path);
        }}
      />
    </div>
  );
}
