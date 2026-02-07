import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type CoachTone = "motivational" | "calm" | "direct" | "friendly";

const tonePrompts: Record<CoachTone, string> = {
  motivational: `Você é um coach de produtividade energético e motivador. Use linguagem positiva e encorajadora,
    celebre conquistas e incentive o progresso. Seja entusiasmado e use expressões que motivem a ação.`,
  calm: `Você é um coach de produtividade calmo e reflexivo. Use linguagem serena e ponderada,
    incentive a reflexão e o autoconhecimento. Seja paciente e compreensivo.`,
  direct: `Você é um coach de produtividade direto e objetivo. Vá direto ao ponto,
    forneça feedback honesto e acionável. Seja conciso e focado em resultados.`,
  friendly: `Você é um coach de produtividade amigável e empático. Use linguagem acolhedora,
    demonstre compreensão e crie conexão. Seja acessível e compreensivo com os desafios.`,
};

export function getCoachSystemPrompt(tone: CoachTone): string {
  return `${tonePrompts[tone]}

Você está analisando dados de produtividade de um usuário brasileiro do sistema PULSO.
Responda sempre em português brasileiro.
Seja específico nas análises e sugestões, usando os dados fornecidos.
Mantenha suas respostas focadas e úteis.`;
}

export interface WeeklyData {
  tasksCompleted: number;
  tasksTotal: number;
  tasksByPriority: { high: number; medium: number; low: number };
  habitsConsistency: { habitName: string; daysCompleted: number; totalDays: number }[];
  goalsProgress: { title: string; progress: number; achieved: boolean }[];
  averageTaskCompletionTime?: number;
  mostProductiveDay?: string;
  leastProductiveDay?: string;
}

export function generateReportPrompt(data: WeeklyData, userName: string): string {
  return `Analise os dados de produtividade da semana de ${userName} e gere um relatório personalizado.

DADOS DA SEMANA:
- Tarefas concluídas: ${data.tasksCompleted} de ${data.tasksTotal}
- Tarefas por prioridade: Alta (${data.tasksByPriority.high}), Média (${data.tasksByPriority.medium}), Baixa (${data.tasksByPriority.low})
- Consistência de hábitos:
${data.habitsConsistency.map(h => `  * ${h.habitName}: ${h.daysCompleted}/${h.totalDays} dias`).join("\n")}
- Progresso das metas:
${data.goalsProgress.map(g => `  * ${g.title}: ${g.progress}% ${g.achieved ? "(alcançada!)" : ""}`).join("\n")}
${data.mostProductiveDay ? `- Dia mais produtivo: ${data.mostProductiveDay}` : ""}
${data.leastProductiveDay ? `- Dia menos produtivo: ${data.leastProductiveDay}` : ""}

Gere um relatório em formato JSON com a seguinte estrutura:
{
  "summary": "Resumo geral da semana em 2-3 frases",
  "insights": "3-4 insights específicos sobre os padrões observados, separados por |",
  "recommendations": "3-4 recomendações acionáveis para a próxima semana, separadas por |",
  "highlights": "2-3 destaques positivos da semana, separados por |"
}

Responda APENAS com o JSON, sem markdown ou texto adicional.`;
}
