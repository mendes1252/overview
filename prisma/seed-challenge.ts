import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CHALLENGE_SLUG = "desafio-produtividade-7-dias";

const challengeData = {
  slug: CHALLENGE_SLUG,
  title: "Desafio de Produtividade em 7 Dias",
  description:
    "Transforme sua produtividade em apenas 7 dias com nosso método passo a passo. Vídeos diários, materiais de apoio e desafios práticos para você executar e ver resultados reais.",
  price: 97.0,
  active: true,
};

const daysData = [
  {
    dayNumber: 1,
    title: "Clareza de Propósito",
    description:
      "Descubra o que realmente importa para você e defina suas prioridades com clareza.",
    videoUrl: "", // YouTube unlisted URL placeholder
    pdfUrl: "",
    content: `## Bem-vindo ao Dia 1!

Hoje é o dia de criar **clareza absoluta** sobre o que você quer alcançar.

A maioria das pessoas não é improdutiva por falta de ferramentas — é por falta de **direção**. Sem saber para onde ir, qualquer caminho parece válido, e você acaba ocupado sem ser produtivo.

### O que você vai aprender:
- Como distinguir **ocupação** de **produtividade**
- O framework de 3 camadas para definir prioridades
- Como criar metas que realmente movem a agulha

### Conceito-chave: A Regra do 3
Em vez de uma lista infinita de objetivos, defina apenas **3 metas principais** para os próximos 90 dias. Essas metas devem ser:
1. **Específicas** — "Aumentar vendas em 20%" em vez de "vender mais"
2. **Mensuráveis** — você precisa saber quando chegou lá
3. **Significativas** — conectadas ao que realmente importa para você`,
    taskTitle: "Defina suas 3 metas para 90 dias",
    taskDescription: `Pegue papel e caneta (ou abra um documento) e responda:

1. **Qual é a meta #1** que, se alcançada, mudaria significativamente sua vida ou negócio nos próximos 90 dias?
2. **Qual é a meta #2** que complementa ou apoia a meta #1?
3. **Qual é a meta #3** na área da sua vida que mais precisa de atenção (saúde, relacionamentos, finanças, carreira)?

Para cada meta, escreva:
- O resultado específico que você quer
- Como você vai medir o progresso
- Por que essa meta é importante para você

**Tempo estimado: 30 minutos**`,
  },
  {
    dayNumber: 2,
    title: "Auditoria de Tempo",
    description:
      "Entenda como você realmente gasta seu tempo e identifique onde estão os vazamentos.",
    videoUrl: "",
    pdfUrl: "",
    content: `## Dia 2: Para onde vai seu tempo?

A percepção que temos de como usamos nosso tempo é **muito diferente** da realidade. Estudos mostram que superestimamos o tempo gasto em trabalho produtivo em até 40%.

### O problema invisível
Você provavelmente perde 2-3 horas por dia sem perceber:
- Checando redes sociais "só por 5 minutinhos"
- Em reuniões que poderiam ser um email
- Alternando entre tarefas sem foco real
- Respondendo mensagens não urgentes

### O exercício de hoje vai revelar a verdade
Ao registrar cada atividade em blocos de 30 minutos, você vai descobrir padrões que nunca percebeu. É desconfortável, mas transformador.`,
    taskTitle: "Registre todas as atividades do dia em blocos de 30min",
    taskDescription: `Hoje seu desafio é fazer uma **auditoria completa do seu tempo**:

1. Crie uma tabela simples com duas colunas: **Horário** e **Atividade**
2. A cada 30 minutos, anote exatamente o que você fez
3. Comece quando acordar e vá até dormir
4. Seja brutalmente honesto — inclua tempo no celular, procrastinação, etc.

No final do dia, classifique cada bloco:
- 🟢 **Produtivo** — moveu suas metas para frente
- 🟡 **Necessário** — obrigações que precisam ser feitas
- 🔴 **Desperdício** — não agregou valor

**Meta: identificar pelo menos 2 horas "invisíveis" que podem ser recuperadas.**`,
  },
  {
    dayNumber: 3,
    title: "Sistema de Prioridades",
    description:
      "Aprenda a separar o urgente do importante e nunca mais se perca em tarefas irrelevantes.",
    videoUrl: "",
    pdfUrl: "",
    content: `## Dia 3: Nem tudo que é urgente é importante

A Matriz de Eisenhower é uma das ferramentas mais poderosas de produtividade. Ela divide suas tarefas em 4 quadrantes:

| | Urgente | Não Urgente |
|---|---|---|
| **Importante** | Q1: Fazer agora | Q2: Agendar |
| **Não Importante** | Q3: Delegar | Q4: Eliminar |

### O segredo dos produtivos
Pessoas altamente produtivas passam a maior parte do tempo no **Quadrante 2** — atividades importantes mas não urgentes. É onde estão:
- Planejamento estratégico
- Desenvolvimento pessoal
- Construção de relacionamentos
- Prevenção de problemas

### Por que vivemos no Q1?
Quando não priorizamos o Q2, tudo vira urgência. É um ciclo vicioso que só quebra com **intencionalidade**.`,
    taskTitle: "Categorize suas tarefas com a Matriz de Eisenhower",
    taskDescription: `Usando a lista de tarefas que você tem hoje (ou da semana):

1. **Liste todas as tarefas** pendentes (mínimo 10)
2. **Classifique cada uma** nos 4 quadrantes:
   - Q1 (Urgente + Importante): Crises, prazos
   - Q2 (Não Urgente + Importante): Planejamento, saúde, aprendizado
   - Q3 (Urgente + Não Importante): Interrupções, emails triviais
   - Q4 (Não Urgente + Não Importante): Redes sociais, fofoca
3. **Ação para cada quadrante:**
   - Q1: Execute hoje
   - Q2: Agende horário fixo na agenda
   - Q3: Delegue ou simplifique
   - Q4: Elimine sem culpa

**Reflexão: Quanto do seu tempo está no Q2 versus Q1?**`,
  },
  {
    dayNumber: 4,
    title: "Rotina Matinal",
    description:
      "Projete uma rotina matinal que prepare seu cérebro para alta performance.",
    videoUrl: "",
    pdfUrl: "",
    content: `## Dia 4: Ganhe o dia nas primeiras horas

Sua rotina matinal define o tom do dia inteiro. Não precisa ser complexa — precisa ser **consistente**.

### Os 3 pilares de uma rotina matinal eficaz:

**1. Corpo** (15-30 min)
Movimento físico, hidratação, exposição à luz natural.

**2. Mente** (10-20 min)
Meditação, journaling, leitura ou visualização.

**3. Foco** (15-30 min)
Revisar metas, planejar o dia, identificar as 3 tarefas mais importantes.

### O erro mais comum
Tentar fazer uma rotina de 2 horas desde o primeiro dia. Comece com 30 minutos e vá expandindo.

### Dica de ouro
A melhor rotina matinal começa na noite anterior. Prepare tudo antes de dormir: roupa, café, materiais de trabalho.`,
    taskTitle: "Projete e execute sua rotina matinal ideal",
    taskDescription: `Hoje você vai criar e testar sua rotina matinal:

1. **Defina seu horário de acordar** (realista, não idealista)
2. **Monte sua rotina em 3 blocos:**
   - Corpo: escolha 1 atividade (exercício, alongamento, caminhada)
   - Mente: escolha 1 atividade (meditação, journaling, leitura)
   - Foco: revise suas metas e defina as 3 prioridades do dia
3. **Execute amanhã de manhã** exatamente como planejou
4. **Avalie no final do dia:** como foi? O que ajustar?

**Regras:**
- Sem celular nos primeiros 30 minutos
- Máximo 60 minutos de rotina total
- Anote como se sentiu durante o dia comparado a dias normais`,
  },
  {
    dayNumber: 5,
    title: "Deep Work",
    description:
      "Domine a arte do trabalho profundo e multiplique seus resultados.",
    videoUrl: "",
    pdfUrl: "",
    content: `## Dia 5: Foco é seu superpoder

Cal Newport define Deep Work como: atividade profissional realizada em estado de concentração total que amplia suas habilidades cognitivas ao limite.

### Por que Deep Work é raro e valioso?
Em um mundo de notificações constantes, a capacidade de focar profundamente se tornou a habilidade mais valiosa da economia do conhecimento.

### O framework dos blocos de 90 minutos
Nosso cérebro opera em ciclos ultradianos de ~90 minutos. Use isso a seu favor:

1. **Bloco de 90 min** — foco total em UMA tarefa complexa
2. **Pausa de 15-20 min** — descanso real (sem telas)
3. **Repita** — máximo 2-3 blocos por dia

### As 4 regras do Deep Work:
1. Trabalhe com profundidade (sem multitasking)
2. Abrace o tédio (treine seu cérebro a não buscar estímulo)
3. Abandone as redes sociais (ou limite drasticamente)
4. Elimine o superficial (automatize/delegue tarefas triviais)`,
    taskTitle: "Realize 2 blocos de 90 minutos de trabalho focado",
    taskDescription: `Hoje você vai experimentar o poder do Deep Work:

**Preparação:**
- Escolha a tarefa mais importante/complexa que você precisa fazer
- Desligue notificações do celular e computador
- Avise colegas/família que você estará indisponível
- Prepare água e ambiente confortável

**Execução:**
1. **Bloco 1 (90 min):** Foco total na tarefa escolhida
   - Timer de 90 minutos
   - Sem exceções: nada de email, WhatsApp, redes sociais
   - Se a mente divagar, anote o pensamento e volte ao foco
2. **Pausa (20 min):** Caminhe, alongue, tome água — SEM telas
3. **Bloco 2 (90 min):** Continue a tarefa ou inicie outra importante

**Reflexão ao final:**
- Quanto você produziu comparado a um dia normal?
- O que tentou te distrair?
- Como se sentiu durante e depois?`,
  },
  {
    dayNumber: 6,
    title: "Hábitos Atômicos",
    description:
      "Construa micro-hábitos que se mantêm no longo prazo usando ciência comportamental.",
    videoUrl: "",
    pdfUrl: "",
    content: `## Dia 6: Pequenos hábitos, grandes resultados

James Clear, autor de "Hábitos Atômicos", nos ensina que mudanças de 1% por dia resultam em melhorias de 37x ao longo de um ano.

### As 4 Leis da Mudança de Comportamento:

**1. Torne óbvio** (Dica)
Vincule o novo hábito a algo que você já faz: "Depois de [HÁBITO ATUAL], eu vou [NOVO HÁBITO]."

**2. Torne atraente** (Desejo)
Associe o hábito a algo prazeroso: "Depois de [NOVO HÁBITO], eu posso [RECOMPENSA]."

**3. Torne fácil** (Resposta)
Regra dos 2 minutos: reduza o hábito até que leve menos de 2 minutos para começar.

**4. Torne satisfatório** (Recompensa)
Rastreie seu progresso visualmente. A satisfação de manter a sequência é poderosa.

### Empilhamento de hábitos
O segredo não é adicionar hábitos isolados, mas empilhá-los em sequências naturais que fluem um após o outro.`,
    taskTitle: "Defina 3 micro-hábitos e vincule-os a gatilhos existentes",
    taskDescription: `Usando o framework de Hábitos Atômicos:

1. **Escolha 3 micro-hábitos** que apoiam suas metas dos 90 dias:
   - Cada hábito deve levar menos de 5 minutos
   - Deve ser tão fácil que é impossível falhar

2. **Para cada hábito, defina:**
   - O gatilho (o que já faz antes): "Depois de ________"
   - A ação (o micro-hábito): "eu vou ________"
   - A recompensa: "e depois posso ________"

3. **Exemplos:**
   - "Depois de servir o café, vou escrever 3 coisas pelas quais sou grato"
   - "Depois de almoçar, vou caminhar 10 minutos"
   - "Depois de sentar na mesa de trabalho, vou revisar minhas 3 prioridades"

4. **Configure o rastreamento:** Use o Pulse para criar esses 3 hábitos e acompanhar seu progresso.

**Comece hoje mesmo — execute pelo menos 1 dos 3 hábitos hoje!**`,
  },
  {
    dayNumber: 7,
    title: "Seu Sistema Pessoal",
    description:
      "Monte seu sistema de produtividade completo e sustentável usando o Pulse.",
    videoUrl: "",
    pdfUrl: "",
    content: `## Dia 7: Tudo junto, funcionando

Parabéns por chegar até aqui! Hoje é o dia de integrar tudo que você aprendeu em um **sistema pessoal de produtividade**.

### Os 5 pilares do seu sistema:

**1. Captura** — Um lugar único para todas as ideias e tarefas
**2. Priorização** — Matriz de Eisenhower aplicada semanalmente
**3. Execução** — Blocos de Deep Work diários
**4. Hábitos** — Micro-hábitos rastreados diariamente
**5. Revisão** — Check-in semanal de 30 minutos

### O ritual semanal de revisão
Todo domingo (ou segunda de manhã):
1. Revise as metas dos 90 dias — ainda relevantes?
2. Avalie o progresso da semana — o que funcionou?
3. Planeje a próxima semana — quais são as 3 prioridades?
4. Ajuste hábitos — precisa adicionar, remover ou modificar?

### O Pulse como seu hub central
Agora é hora de colocar tudo dentro do Pulse e deixar a tecnologia trabalhar a seu favor.`,
    taskTitle: "Configure seu sistema completo no Pulse",
    taskDescription: `Este é o desafio final — montar seu sistema no Pulse:

1. **Tarefas:** Adicione suas tarefas prioritárias da semana (use a Matriz de Eisenhower do Dia 3)

2. **Hábitos:** Configure os 3 micro-hábitos que você definiu no Dia 6 + sua rotina matinal do Dia 4

3. **Metas:** Cadastre suas 3 metas de 90 dias do Dia 1

4. **Rotina semanal:** Agende um horário fixo para sua revisão semanal

5. **Compromisso:** Escreva uma frase de compromisso com seu sistema:
   "Eu me comprometo a usar meu sistema de produtividade diariamente porque ________"

**Ao concluir este dia, você terá acesso ao seu bônus exclusivo!**`,
  },
];

async function main() {
  console.log("Seeding challenge data...");

  const existing = await prisma.challenge.findUnique({
    where: { slug: CHALLENGE_SLUG },
  });

  if (existing) {
    console.log("Challenge already exists, deleting to re-seed...");
    await prisma.challenge.delete({ where: { slug: CHALLENGE_SLUG } });
  }

  const challenge = await prisma.challenge.create({
    data: {
      ...challengeData,
      days: {
        create: daysData,
      },
    },
    include: { days: true },
  });

  console.log(`Created challenge: ${challenge.title} (${challenge.id})`);
  console.log(`Created ${challenge.days.length} challenge days`);

  // Seed UpsellCampaign for the final offer
  const campaignSlug = "desafio-7dias-pro";
  const existingCampaign = await prisma.upsellCampaign.findUnique({
    where: { slug: campaignSlug },
  });

  if (!existingCampaign) {
    await prisma.upsellCampaign.create({
      data: {
        name: "Desafio 7 Dias - Oferta Pro",
        slug: campaignSlug,
        active: true,
        headline: "Oferta exclusiva para quem completou o Desafio!",
        description:
          "Você provou que leva produtividade a sério. Agora leve seu sistema ao próximo nível com o Pulse Pro — com desconto exclusivo para desafiantes.",
        badgeText: "EXCLUSIVO DESAFIANTES",
        originalPrice: 297,
        offerPrice: 197,
        targetPlan: "pro",
      },
    });
    console.log("Created UpsellCampaign: desafio-7dias-pro");
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
