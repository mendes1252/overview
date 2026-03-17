export interface BlogPost {
  slug: string;
  titulo: string;
  tag: string;
  data: string;
  resumo: string;
  conteudo: string;
  thumbnailColor: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "fissuras-em-alvenaria-nbr-6118",
    titulo: "Fissuras em alvenaria: classificação e critérios da NBR 6118",
    tag: "Patologias",
    data: "12 mar. 2026",
    resumo:
      "Entenda como classificar fissuras em estruturas de concreto armado conforme a NBR 6118, critérios de aceitabilidade e quando a intervenção é obrigatória.",
    thumbnailColor: "#001bab",
    conteudo: `
# Fissuras em alvenaria: classificação e critérios da NBR 6118

As fissuras são uma das manifestações patológicas mais comuns em edificações e podem indicar desde acomodação estrutural até comprometimento grave da estrutura. A NBR 6118 estabelece critérios claros para sua classificação e os limites de aceitabilidade.

## Tipos de fissuras

### Fissuras de retração
Causadas pela retração da argamassa ou concreto durante o processo de cura. Geralmente superficiais e com padrão mapeado (map cracking).

### Fissuras por sobrecarga
Ocorrem quando a estrutura é submetida a cargas além de sua capacidade de projeto. A orientação da fissura indica o tipo de esforço predominante.

### Fissuras por movimentação higroscópica
Resultam da variação dimensional dos materiais em resposta a mudanças de umidade. Comuns em alvenaria de vedação.

## Critérios da NBR 6118

A norma define abertura máxima de fissuras conforme a classe de agressividade ambiental:

- **Classe I (fraca):** w ≤ 0,4 mm
- **Classe II (moderada):** w ≤ 0,3 mm
- **Classe III (forte):** w ≤ 0,2 mm
- **Classe IV (muito forte):** w ≤ 0,1 mm

## Quando intervir

Fissuras ativas (que se movimentam) exigem monitoramento sistemático antes de qualquer intervenção. Fissuras passivas podem ser tratadas após identificação da causa raiz.

*Este artigo não substitui a análise de profissional habilitado. Emissão de laudo técnico requer ART/RRT.*
    `.trim(),
  },
  {
    slug: "laudo-de-patologia-o-que-deve-conter",
    titulo: "O que um laudo de patologia das construções deve conter",
    tag: "Laudos",
    data: "5 mar. 2026",
    resumo:
      "Estrutura mínima de um laudo técnico de patologia: das informações da edificação ao diagnóstico, referências normativas e recomendações de intervenção.",
    thumbnailColor: "#dba914",
    conteudo: `
# O que um laudo de patologia das construções deve conter

Um laudo de patologia bem estruturado é um documento técnico-jurídico que protege o profissional e orienta as decisões de manutenção ou recuperação da edificação. Veja o que não pode faltar.

## Estrutura mínima

### 1. Identificação
- Dados do contratante
- Endereço completo da edificação
- Data de vistoria
- Profissional responsável (CREA/CAU)

### 2. Objetivo e escopo
Delimitar claramente o que foi analisado e quais sistemas construtivos entraram no escopo.

### 3. Metodologia
Descrever os métodos de inspeção utilizados: visual, instrumental (trena, esclerômetro, etc.), fotográfica.

### 4. Diagnóstico
- Identificação das manifestações patológicas
- Localização (planta ou croqui)
- Classificação por gravidade

### 5. Causas prováveis
Análise das causas imediatas e originárias.

### 6. Referências normativas
NBR 6118, NBR 9575, NBR 15575, NBR 16747 e outras aplicáveis.

### 7. Recomendações
Intervenções necessárias, prazo, prioridade e profissional indicado.

## Responsabilidade técnica

O laudo deve ser assinado com emissão de ART (CONFEA/CREA) ou RRT (CAU), que confere responsabilidade técnica ao profissional.
    `.trim(),
  },
  {
    slug: "nbr-16747-inspecao-predial",
    titulo: "NBR 16747: o que muda na inspeção predial",
    tag: "ABNT",
    data: "25 fev. 2026",
    resumo:
      "A NBR 16747 normatiza a inspeção predial no Brasil. Entenda o que ela exige, quem pode realizá-la e como se relaciona com os laudos de patologia.",
    thumbnailColor: "#111111",
    conteudo: `
# NBR 16747: o que muda na inspeção predial

Publicada em 2020, a NBR 16747 — Inspeção Predial — estabelece os requisitos mínimos para a realização de inspeções em edificações, com foco na segurança, habitabilidade e manutenção.

## O que é a inspeção predial

É a avaliação das condições técnicas, de uso e de manutenção de uma edificação, com emissão de laudo por profissional habilitado.

## Quem pode realizar

Engenheiros civis e arquitetos com registro ativo no CREA ou CAU, respectivamente. A norma exige competência técnica comprovada na área de manutenção predial.

## Classificação por grau de risco

A norma classifica as anomalias por grau de risco:

- **Crítico:** risco à segurança ou de comprometimento estrutural. Intervenção imediata.
- **Regular:** redução da vida útil da edificação. Intervenção a curto prazo.
- **Mínimo:** não compromete a segurança imediata. Planejamento de manutenção.

## Periodicidade recomendada

A NBR 16747 sugere inspeção a cada 5 anos para edificações com até 10 anos, e a cada 3 anos para edificações mais antigas.

## Relação com a NBR 5674

A inspeção predial é complementar ao plano de manutenção exigido pela NBR 5674, que normatiza a manutenção de edificações.
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
