export const PLANOS = [
  {
    nome: "Free",
    preco: 0,
    descricao: "Conheça a plataforma sem compromisso.",
    items: [
      "1 laudo técnico completo",
      "Análise de imagens de campo",
      "Referências ABNT inclusas",
      "Export em PDF",
    ],
    cta: "Começar grátis",
    destaque: false,
    nota: null,
  },
  {
    nome: "Profissional",
    preco: 247,
    descricao: "Para quem elabora laudos com regularidade.",
    items: [
      "5 laudos por ciclo mensal",
      "Laudos adicionais R$ 30/un.",
      "Análise ilimitada de imagens",
      "Histórico completo de laudos",
      "Suporte técnico prioritário",
    ],
    cta: "Assinar agora",
    destaque: true,
    nota: "Créditos reiniciam a cada ciclo mensal",
  },
];

export const FEATURES = [
  {
    icon: "🔍",
    titulo: "Análise de imagens",
    descricao:
      "Fissuras, infiltrações, corrosão de armaduras e eflorescências identificados automaticamente.",
  },
  {
    icon: "📋",
    titulo: "Redação assistida",
    descricao:
      "Trechos técnicos prontos para adaptar com linguagem normativa adequada.",
  },
  {
    icon: "📐",
    titulo: "Referências ABNT/NBR",
    descricao:
      "NBR 6118, 9575, 15575, 16747 e outras citadas automaticamente no laudo.",
  },
  {
    icon: "⚡",
    titulo: "Agilidade real",
    descricao:
      "Reduza horas de trabalho por laudo sem abrir mão do rigor técnico CONFEA/CAU.",
  },
  {
    icon: "🔒",
    titulo: "Responsabilidade preservada",
    descricao:
      "A plataforma apoia, nunca substitui o julgamento técnico habilitado.",
  },
  {
    icon: "📊",
    titulo: "Histórico organizado",
    descricao:
      "Laudos por obra, cliente e data. Fácil reutilização de referências.",
  },
];

export const FAQ_ITEMS = [
  {
    pergunta: "O Vistoria Aí substitui o profissional habilitado?",
    resposta:
      "Não. É uma ferramenta de apoio. A responsabilidade pelo laudo, incluindo ART ou RRT, permanece com o profissional habilitado.",
  },
  {
    pergunta: "Os laudos gerados têm validade técnica e jurídica?",
    resposta:
      "O conteúdo gerado serve como base técnica estruturada. A validade jurídica depende da revisão e assinatura com emissão de ART/RRT.",
  },
  {
    pergunta: "Os créditos não utilizados acumulam para o próximo mês?",
    resposta:
      "Não. Os créditos reiniciam com cada renovação mensal.",
  },
  {
    pergunta: "Posso cancelar a assinatura a qualquer momento?",
    resposta:
      "Sim. Sem fidelidade ou multa. Acesso mantido até o fim do período pago.",
  },
  {
    pergunta: "A plataforma funciona bem no celular, em campo?",
    resposta:
      "Sim. Responsivo, projetado para uso em campo via navegador mobile.",
  },
];

export const DEPOIMENTOS = [
  {
    iniciais: "RC",
    nome: "Rodrigo Carvalho",
    cargo: "Eng. Civil · CREA/SP",
    texto:
      "Reduzi o tempo de elaboração dos meus laudos em mais de 60%. A fundamentação normativa automática é o diferencial que faltava.",
  },
  {
    iniciais: "AM",
    nome: "Ana Mello",
    cargo: "Arquiteta · CAU/RJ",
    texto:
      "A análise de imagens é impressionante. Identifica fissuras que eu já havia mapeado e complementa com causas que não havia considerado.",
  },
  {
    iniciais: "FS",
    nome: "Felipe Souza",
    cargo: "Eng. Civil · CREA/MG",
    texto:
      "Finalmente uma ferramenta pensada para quem trabalha com patologia de verdade. Entende o que o laudo técnico precisa ter.",
  },
];

export const STEPS = [
  {
    numero: "1",
    titulo: "Registre a patologia",
    descricao:
      "Descreva ou envie fotos da manifestação em campo. Quanto mais contexto, melhor o diagnóstico.",
  },
  {
    numero: "2",
    titulo: "O Vistoria Aí analisa",
    descricao:
      "A plataforma identifica a patologia, indica causas e mecanismos de degradação com embasamento em normas ABNT vigentes.",
    ativo: true,
  },
  {
    numero: "3",
    titulo: "Exporte o laudo",
    descricao:
      "Documento estruturado, pronto para revisão, assinatura e emissão de ART/RRT pelo profissional habilitado.",
  },
];

export const PROBLEMAS = [
  {
    icon: "⏱",
    titulo: "Horas gastas por laudo",
    descricao:
      "Estruturar, redigir e referenciar normas consome tempo que poderia estar em campo ou em novos projetos.",
  },
  {
    icon: "📐",
    titulo: "Diagnósticos sem respaldo",
    descricao:
      "Falta de fundamentação normativa expõe o profissional a questionamentos técnicos e jurídicos desnecessários.",
  },
  {
    icon: "🔄",
    titulo: "Cada laudo do zero",
    descricao:
      "Sem padronização, cada documento vira trabalho manual repetitivo com risco de inconsistência entre laudos.",
  },
];
