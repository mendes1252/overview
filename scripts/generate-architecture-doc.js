const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, TabStopType, TabStopPosition
} = require("docx");

// ── Colors ──
const C = {
  primary: "1A1A2E",    // dark navy
  accent: "4361EE",     // blue
  accent2: "7209B7",    // purple
  success: "06D6A0",    // green
  warning: "FFD166",    // yellow
  light: "F8F9FA",      // light gray bg
  medium: "E9ECEF",     // medium gray
  dark: "495057",       // dark gray text
  white: "FFFFFF",
  black: "212529",
};

const border = { style: BorderStyle.SINGLE, size: 1, color: "DEE2E6" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// ── Helpers ──
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, children: [new TextRun(text)] });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ font: "Arial", size: 22, color: C.dark, ...opts.run, text })],
  });
}

function boldPara(label, text) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ font: "Arial", size: 22, bold: true, color: C.black, text: label }),
      new TextRun({ font: "Arial", size: 22, color: C.dark, text }),
    ],
  });
}

function spacer(h = 200) {
  return new Paragraph({ spacing: { after: h }, children: [] });
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 4 } },
    children: [new TextRun({ font: "Arial", size: 28, bold: true, color: C.accent, text })],
  });
}

function subSection(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ font: "Arial", size: 24, bold: true, color: C.accent2, text })],
  });
}

function bullet(text, ref = "bullets", level = 0) {
  return new Paragraph({
    numbering: { reference: ref, level },
    spacing: { after: 60 },
    children: [new TextRun({ font: "Arial", size: 22, color: C.dark, text })],
  });
}

function numberItem(text, ref = "numbers", level = 0) {
  return new Paragraph({
    numbering: { reference: ref, level },
    spacing: { after: 60 },
    children: [new TextRun({ font: "Arial", size: 22, color: C.dark, text })],
  });
}

function boldBullet(label, text, ref = "bullets", level = 0) {
  return new Paragraph({
    numbering: { reference: ref, level },
    spacing: { after: 60 },
    children: [
      new TextRun({ font: "Arial", size: 22, bold: true, color: C.black, text: label }),
      new TextRun({ font: "Arial", size: 22, color: C.dark, text }),
    ],
  });
}

function codeBlock(lines) {
  return lines.map((line) =>
    new Paragraph({
      spacing: { after: 20 },
      shading: { fill: "F1F3F5", type: ShadingType.CLEAR },
      indent: { left: 360 },
      children: [new TextRun({ font: "Courier New", size: 18, color: C.dark, text: line })],
    })
  );
}

function makeHeaderRow(cells, colWidths) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((text, i) =>
      new TableCell({
        borders,
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill: C.accent, type: ShadingType.CLEAR },
        margins: cellMargins,
        verticalAlign: "center",
        children: [new Paragraph({ children: [new TextRun({ font: "Arial", size: 20, bold: true, color: C.white, text })] })],
      })
    ),
  });
}

function makeRow(cells, colWidths, shade = false) {
  return new TableRow({
    children: cells.map((text, i) =>
      new TableCell({
        borders,
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: shade ? { fill: C.light, type: ShadingType.CLEAR } : undefined,
        margins: cellMargins,
        children: [new Paragraph({ children: [new TextRun({ font: "Arial", size: 20, color: C.dark, text })] })],
      })
    ),
  });
}

function makeTable(headers, rows, colWidths) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      makeHeaderRow(headers, colWidths),
      ...rows.map((row, i) => makeRow(row, colWidths, i % 2 === 1)),
    ],
  });
}

// ── Document ──
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: C.primary },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: C.accent },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: C.accent2 },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }, {
          level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers2",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers3",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers4",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "bullets2",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "bullets3",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [
    // ════════════════════════════════════════════
    // COVER PAGE
    // ════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        spacer(2400),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ font: "Arial", size: 56, bold: true, color: C.primary, text: "PREDILETA LAVANDERIA" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.accent, space: 8 } },
          children: [new TextRun({ font: "Arial", size: 32, color: C.accent, text: "Documento de Arquitetura de Sistemas" })],
        }),
        spacer(200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ font: "Arial", size: 24, color: C.dark, text: "Sistema PDV + Sistema de Gest\u00E3o" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ font: "Arial", size: 24, color: C.dark, text: "Arquitetura, Modelo de Dados e Roadmap de Implementa\u00E7\u00E3o" })],
        }),
        spacer(1200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ font: "Arial", size: 22, color: C.dark, text: "Vers\u00E3o 1.0 \u2014 Mar\u00E7o 2026" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ font: "Arial", size: 22, color: C.dark, text: "Stack: Next.js \u00B7 Node/Express \u00B7 PostgreSQL \u00B7 Asaas \u00B7 Resend" })],
        }),
      ],
    },

    // ════════════════════════════════════════════
    // MAIN CONTENT
    // ════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [
              new TextRun({ font: "Arial", size: 16, color: "999999", text: "Predileta Lavanderia \u2014 Arquitetura de Sistemas" }),
              new TextRun({ font: "Arial", size: 16, color: "999999", text: "\tv1.0" }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "DEE2E6", space: 4 } },
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ font: "Arial", size: 16, color: "999999", text: "P\u00E1gina " }),
              new TextRun({ font: "Arial", size: 16, color: "999999", children: [PageNumber.CURRENT] }),
            ],
          })],
        }),
      },
      children: [
        // ──────────────────────────────────────
        // 1. VISÃO GERAL
        // ──────────────────────────────────────
        sectionTitle("1. Vis\u00E3o Geral da Arquitetura"),
        para("A solu\u00E7\u00E3o consiste em dois sistemas web distintos que compartilham o mesmo banco de dados PostgreSQL e uma API unificada. O PDV \u00E9 a interface operacional do balc\u00E3o (utilizada por 2-3 funcion\u00E1rios), e o Sistema de Gest\u00E3o \u00E9 o painel administrativo/estrat\u00E9gico (utilizado pelo gestor)."),
        spacer(100),

        subSection("Diagrama de Alto N\u00EDvel"),
        ...codeBlock([
          "\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510     \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
          "\u2502   PDV (Balc\u00E3o)     \u2502     \u2502  Gest\u00E3o (Admin)  \u2502",
          "\u2502   Next.js App     \u2502     \u2502  Next.js App     \u2502",
          "\u2502   :3000           \u2502     \u2502  :3001           \u2502",
          "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518     \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
          "          \u2502                       \u2502",
          "          \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
          "                    \u2502",
          "          \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
          "          \u2502  API Unificada   \u2502",
          "          \u2502  Node/Express    \u2502",
          "          \u2502  :4000           \u2502",
          "          \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
          "                  \u2502",
          "    \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2534\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
          "    \u2502           \u2502   \u2502           \u2502",
          "\u250C\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2510 \u250C\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2510 \u250C\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2510 \u250C\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2510",
          "\u2502 Postgre\u2502 \u2502  Asaas \u2502 \u2502 Resend \u2502 \u2502  Whats \u2502",
          "\u2502  SQL   \u2502 \u2502  API  \u2502 \u2502  API  \u2502 \u2502  API  \u2502",
          "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
        ]),
        spacer(100),

        subSection("Princ\u00EDpios Arquiteturais"),
        boldBullet("Banco \u00FAnico: ", "Ambos os sistemas leem/escrevem no mesmo PostgreSQL, garantindo consist\u00EAncia de dados em tempo real."),
        boldBullet("API compartilhada: ", "Uma \u00FAnica API Node/Express serve ambos os frontends. Rotas protegidas por role-based access (RBAC)."),
        boldBullet("Separa\u00E7\u00E3o de frontends: ", "Dois projetos Next.js independentes, cada um otimizado para seu contexto de uso (balc\u00E3o vs. admin)."),
        boldBullet("Integra\u00E7\u00F5es via servi\u00E7os: ", "Asaas, Resend e WhatsApp s\u00E3o encapsulados em service layers na API, reutiliz\u00E1veis por ambos os sistemas."),
        spacer(100),

        // ──────────────────────────────────────
        // 2. SISTEMA PDV
        // ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("2. Sistema PDV (Ponto de Venda)"),
        para("O PDV \u00E9 a interface de opera\u00E7\u00E3o di\u00E1ria da lavanderia, utilizado pelos funcion\u00E1rios do balc\u00E3o para registrar servi\u00E7os, gerenciar clientes, acompanhar produ\u00E7\u00E3o e processar pagamentos."),
        spacer(100),

        subSection("2.1 M\u00F3dulos do PDV"),
        spacer(60),

        // Module table
        makeTable(
          ["M\u00F3dulo", "Funcionalidades Principais", "Prioridade"],
          [
            ["Lan\u00E7amento de Servi\u00E7os", "Nova OS, sele\u00E7\u00E3o de servi\u00E7os/pe\u00E7as, tabela de pre\u00E7os B2B/B2C, c\u00E1lculo autom\u00E1tico, impress\u00E3o de comanda", "Sprint 1"],
            ["CRM Embutido", "Cadastro de clientes (PF/PJ), hist\u00F3rico de servi\u00E7os, segmenta\u00E7\u00E3o, anota\u00E7\u00F5es, datas especiais", "Sprint 1"],
            ["Controle de Produ\u00E7\u00E3o", "Status da OS (recebido/lavando/secando/passando/pronto/entregue), prazos, alertas de atraso, vis\u00E3o kanban", "Sprint 2"],
            ["Pagamentos", "Cobran\u00E7a via Asaas (Pix/Boleto/Cart\u00E3o), status de pagamento, parcialmente pago, segunda via", "Sprint 2"],
            ["Comunica\u00E7\u00E3o", "Notifica\u00E7\u00F5es WhatsApp (status OS, cobran\u00E7a), e-mail marketing via Resend, templates pr\u00E9-definidos", "Sprint 3"],
            ["Marketing", "Campanhas segmentadas, cupons de desconto, programa de fidelidade b\u00E1sico, hist\u00F3rico de envios", "Sprint 3"],
          ],
          [2200, 5200, 1960]
        ),
        spacer(200),

        subSection("2.2 Fluxo Operacional do PDV"),
        para("O fluxo principal de uma Ordem de Servi\u00E7o (OS) segue este caminho:"),
        spacer(60),
        numberItem("Cliente chega ao balc\u00E3o \u2192 funcion\u00E1rio busca ou cadastra no CRM", "numbers"),
        numberItem("Funcion\u00E1rio seleciona servi\u00E7os e pe\u00E7as \u2192 sistema calcula valor (tabela B2B ou B2C)", "numbers"),
        numberItem("OS \u00E9 criada com prazo estimado \u2192 comanda \u00E9 impressa", "numbers"),
        numberItem("OS entra no kanban de produ\u00E7\u00E3o \u2192 equipe atualiza status em tempo real", "numbers"),
        numberItem("Ao finalizar: notifica\u00E7\u00E3o autom\u00E1tica via WhatsApp para o cliente", "numbers"),
        numberItem("Cliente retira \u2192 pagamento processado via Asaas \u2192 OS fechada", "numbers"),
        spacer(200),

        subSection("2.3 Telas do PDV"),
        para("Interface otimizada para opera\u00E7\u00E3o r\u00E1pida em tablet/desktop no balc\u00E3o:"),
        spacer(60),
        boldBullet("Dashboard: ", "Vis\u00E3o r\u00E1pida do dia (OS abertas, atrasadas, prontas, faturamento do dia)."),
        boldBullet("Nova OS: ", "Formul\u00E1rio de lan\u00E7amento com busca de cliente, sele\u00E7\u00E3o de servi\u00E7os (autocomplete), e resumo com valor total."),
        boldBullet("Kanban de Produ\u00E7\u00E3o: ", "Colunas com drag-and-drop para cada etapa (Recebido > Lavando > Secando > Passando > Pronto > Entregue)."),
        boldBullet("Lista de Clientes: ", "Busca, filtros (B2B/B2C, \u00FAltima visita, valor acumulado), acesso r\u00E1pido ao hist\u00F3rico."),
        boldBullet("Caixa/Pagamentos: ", "Cobran\u00E7as pendentes, registro de recebimentos, integra\u00E7\u00E3o Asaas."),

        // ──────────────────────────────────────
        // 3. SISTEMA DE GESTÃO
        // ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("3. Sistema de Gest\u00E3o"),
        para("O painel administrativo consome os mesmos dados do PDV e adiciona camadas de an\u00E1lise, controle financeiro, operacional e ferramentas de growth. \u00C9 o sistema estrat\u00E9gico do neg\u00F3cio."),
        spacer(100),

        subSection("3.1 M\u00F3dulos de Gest\u00E3o"),
        spacer(60),
        makeTable(
          ["\u00C1rea", "M\u00F3dulo", "Funcionalidades"],
          [
            ["Financeiro", "Fluxo de Caixa", "Receitas/despesas, DRE simplificado, contas a receber/pagar, concilia\u00E7\u00E3o Asaas"],
            ["Financeiro", "Relat\u00F3rios", "Faturamento por per\u00EDodo, ticket m\u00E9dio, receita por cliente, comparativos"],
            ["Operacional", "Performance", "Tempo m\u00E9dio por etapa, produtividade por funcion\u00E1rio, taxa de atraso"],
            ["Operacional", "Capacidade", "Volume di\u00E1rio, previs\u00E3o de demanda, gargalos de produ\u00E7\u00E3o"],
            ["Growth", "M\u00E9tricas", "Novos clientes, reten\u00E7\u00E3o, churn, LTV, frequ\u00EAncia de retorno"],
            ["Growth", "Segmenta\u00E7\u00E3o", "Clientes inativos, VIPs, rec\u00E9m-chegados, an\u00E1lise RFM"],
            ["Marketing", "Campanhas", "Disparos de e-mail/WhatsApp, an\u00E1lise de resultados, A/B testing"],
            ["Marketing", "Fidelidade", "Pontos acumulados, resgates, impacto no retorno"],
          ],
          [1800, 2200, 5360]
        ),
        spacer(200),

        subSection("3.2 Integra\u00E7\u00E3o PDV \u2192 Gest\u00E3o"),
        para("O Sistema de Gest\u00E3o consome dados do PDV em tempo real atrav\u00E9s da API compartilhada. N\u00E3o existe replica\u00E7\u00E3o \u2014 ambos acessam as mesmas tabelas PostgreSQL:"),
        spacer(60),
        boldBullet("Dados transacionais: ", "Toda OS criada no PDV aparece automaticamente nos relat\u00F3rios financeiros e operacionais."),
        boldBullet("Dados de clientes: ", "O CRM do PDV alimenta as an\u00E1lises de growth/segmenta\u00E7\u00E3o da gest\u00E3o."),
        boldBullet("Dados de pagamento: ", "Webhooks do Asaas atualizam o status em tempo real para ambos os sistemas."),
        boldBullet("Dados de comunica\u00E7\u00E3o: ", "Hist\u00F3rico de disparos (WhatsApp/e-mail) \u00E9 vis\u00EDvel em ambos, com analytics apenas na gest\u00E3o."),

        // ──────────────────────────────────────
        // 4. MODELO DE DADOS
        // ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("4. Modelo de Dados (PostgreSQL)"),
        para("Abaixo o esquema principal do banco compartilhado. Todas as tabelas utilizam UUID como primary key e incluem created_at/updated_at com timestamps."),
        spacer(100),

        subSection("4.1 Tabelas Core"),
        spacer(60),

        // users
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "users" })] }),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["name", "VARCHAR(255)", "Nome completo"],
            ["email", "VARCHAR(255) UNIQUE", "E-mail de login"],
            ["password_hash", "TEXT", "Senha (bcrypt)"],
            ["role", "ENUM", "admin, manager, operator"],
            ["active", "BOOLEAN", "Status ativo/inativo"],
          ],
          [2400, 2800, 4160]
        ),
        spacer(160),

        // customers
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "customers" })] }),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["type", "ENUM", "b2b, b2c"],
            ["name", "VARCHAR(255)", "Nome / Raz\u00E3o social"],
            ["document", "VARCHAR(20)", "CPF ou CNPJ"],
            ["email", "VARCHAR(255)", "E-mail para contato/marketing"],
            ["phone", "VARCHAR(20)", "Telefone/WhatsApp"],
            ["address", "JSONB", "Endere\u00E7o completo"],
            ["notes", "TEXT", "Observa\u00E7\u00F5es internas"],
            ["tags", "TEXT[]", "Tags de segmenta\u00E7\u00E3o"],
            ["asaas_customer_id", "VARCHAR(100)", "ID do cliente no Asaas"],
            ["loyalty_points", "INTEGER DEFAULT 0", "Pontos de fidelidade"],
            ["special_dates", "JSONB", "Anivers\u00E1rio, etc."],
          ],
          [2600, 2800, 3960]
        ),
        spacer(160),

        // services
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "services" })] }),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["name", "VARCHAR(255)", "Nome do servi\u00E7o (ex: Lavar + Passar)"],
            ["category", "VARCHAR(100)", "Categoria (roupa, cama, mesa, etc)"],
            ["price_b2c", "DECIMAL(10,2)", "Pre\u00E7o para pessoa f\u00EDsica"],
            ["price_b2b_default", "DECIMAL(10,2)", "Pre\u00E7o base para empresas"],
            ["unit", "ENUM", "piece, kg, m2"],
            ["estimated_hours", "INTEGER", "Tempo estimado (horas)"],
            ["active", "BOOLEAN", "Dispon\u00EDvel para sele\u00E7\u00E3o"],
          ],
          [2600, 2800, 3960]
        ),
        spacer(160),

        // custom_price_tables
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "custom_price_tables" })] }),
        para("Tabelas de pre\u00E7o personalizadas para clientes B2B (similar ao que j\u00E1 existe no Predileta System V2):"),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["customer_id", "UUID FK", "Refer\u00EAncia ao cliente B2B"],
            ["service_id", "UUID FK", "Refer\u00EAncia ao servi\u00E7o"],
            ["custom_price", "DECIMAL(10,2)", "Pre\u00E7o negociado"],
            ["valid_until", "DATE", "Data de vig\u00EAncia (NULL = sem prazo)"],
          ],
          [2400, 2400, 4560]
        ),
        spacer(160),

        new Paragraph({ children: [new PageBreak()] }),

        // orders (OS)
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "orders (Ordem de Servi\u00E7o)" })] }),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["order_number", "SERIAL", "N\u00FAmero sequencial da OS"],
            ["customer_id", "UUID FK", "Cliente vinculado"],
            ["created_by", "UUID FK", "Funcion\u00E1rio que criou"],
            ["status", "ENUM", "received, washing, drying, ironing, ready, delivered, cancelled"],
            ["production_status", "ENUM", "on_time, delayed, critical"],
            ["estimated_delivery", "TIMESTAMP", "Data/hora estimada de entrega"],
            ["actual_delivery", "TIMESTAMP", "Data/hora real de entrega"],
            ["subtotal", "DECIMAL(10,2)", "Valor dos servi\u00E7os"],
            ["discount", "DECIMAL(10,2)", "Desconto aplicado"],
            ["total", "DECIMAL(10,2)", "Valor final"],
            ["payment_status", "ENUM", "pending, partial, paid, overdue, refunded"],
            ["notes", "TEXT", "Observa\u00E7\u00F5es da OS"],
          ],
          [2600, 2600, 4160]
        ),
        spacer(160),

        // order_items
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "order_items" })] }),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["order_id", "UUID FK", "Refer\u00EAncia \u00E0 OS"],
            ["service_id", "UUID FK", "Servi\u00E7o contratado"],
            ["quantity", "DECIMAL(10,2)", "Quantidade (pe\u00E7as ou kg)"],
            ["unit_price", "DECIMAL(10,2)", "Pre\u00E7o unit\u00E1rio aplicado"],
            ["total", "DECIMAL(10,2)", "Subtotal do item"],
            ["notes", "TEXT", "Observa\u00E7\u00F5es do item"],
          ],
          [2400, 2400, 4560]
        ),
        spacer(160),

        // payments
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "payments" })] }),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["order_id", "UUID FK", "Refer\u00EAncia \u00E0 OS"],
            ["asaas_payment_id", "VARCHAR(100)", "ID da cobran\u00E7a no Asaas"],
            ["method", "ENUM", "pix, boleto, credit_card, debit_card, cash"],
            ["amount", "DECIMAL(10,2)", "Valor pago"],
            ["status", "ENUM", "pending, confirmed, overdue, refunded"],
            ["paid_at", "TIMESTAMP", "Data/hora da confirma\u00E7\u00E3o"],
            ["due_date", "DATE", "Data de vencimento"],
          ],
          [2600, 2600, 4160]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        subSection("4.2 Tabelas de Suporte"),
        spacer(60),

        // communication_logs
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "communication_logs" })] }),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["customer_id", "UUID FK", "Cliente destinat\u00E1rio"],
            ["channel", "ENUM", "whatsapp, email, sms"],
            ["type", "ENUM", "order_status, payment, marketing, reminder"],
            ["template_id", "VARCHAR(100)", "Template utilizado"],
            ["content", "TEXT", "Conte\u00FAdo enviado"],
            ["status", "ENUM", "sent, delivered, read, failed"],
            ["sent_at", "TIMESTAMP", "Data/hora do envio"],
            ["metadata", "JSONB", "Dados extras (campaign_id, etc)"],
          ],
          [2400, 2400, 4560]
        ),
        spacer(160),

        // campaigns
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "campaigns" })] }),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["name", "VARCHAR(255)", "Nome da campanha"],
            ["channel", "ENUM", "whatsapp, email"],
            ["segment_filter", "JSONB", "Filtros de segmenta\u00E7\u00E3o (tags, tipo, RFM, etc)"],
            ["template_content", "TEXT", "Conte\u00FAdo/template"],
            ["status", "ENUM", "draft, scheduled, sent, cancelled"],
            ["scheduled_at", "TIMESTAMP", "Data/hora agendada"],
            ["sent_count", "INTEGER", "Total de envios"],
            ["open_rate", "DECIMAL(5,2)", "Taxa de abertura (email)"],
          ],
          [2400, 2600, 4360]
        ),
        spacer(160),

        // financial_entries (gestão)
        new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ font: "Courier New", size: 22, bold: true, color: C.accent, text: "financial_entries" })] }),
        para("Tabela exclusiva do sistema de gest\u00E3o para controle de despesas e receitas n\u00E3o vinculadas a OS:"),
        makeTable(
          ["Coluna", "Tipo", "Descri\u00E7\u00E3o"],
          [
            ["id", "UUID PK", "Identificador \u00FAnico"],
            ["type", "ENUM", "income, expense"],
            ["category", "VARCHAR(100)", "Categoria (aluguel, insumos, sal\u00E1rios, etc)"],
            ["description", "TEXT", "Descri\u00E7\u00E3o"],
            ["amount", "DECIMAL(10,2)", "Valor"],
            ["date", "DATE", "Data da movimenta\u00E7\u00E3o"],
            ["recurrent", "BOOLEAN", "Despesa recorrente?"],
            ["recurrence_rule", "JSONB", "Regra de recorr\u00EAncia"],
          ],
          [2400, 2600, 4360]
        ),

        // ──────────────────────────────────────
        // 5. ESTRUTURA DE PASTAS
        // ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("5. Estrutura do Projeto (Monorepo)"),
        para("A estrutura utiliza um monorepo com tr\u00EAs pacotes principais: a API compartilhada e os dois frontends Next.js."),
        spacer(100),

        ...codeBlock([
          "predileta/",
          "\u251C\u2500\u2500 packages/",
          "\u2502   \u251C\u2500\u2500 api/                    # API Node/Express compartilhada",
          "\u2502   \u2502   \u251C\u2500\u2500 src/",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 routes/         # Rotas (orders, customers, payments...)",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 controllers/    # L\u00F3gica de neg\u00F3cio",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 services/       # Asaas, Resend, WhatsApp",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 middleware/     # Auth (JWT), RBAC, validation",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 models/         # Prisma ou Knex schemas",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 webhooks/       # Handlers (Asaas, WhatsApp)",
          "\u2502   \u2502   \u2502   \u2514\u2500\u2500 utils/          # Helpers, formatters",
          "\u2502   \u2502   \u251C\u2500\u2500 prisma/",
          "\u2502   \u2502   \u2502   \u2514\u2500\u2500 schema.prisma   # Schema do banco",
          "\u2502   \u2502   \u2514\u2500\u2500 package.json",
          "\u2502   \u2502",
          "\u2502   \u251C\u2500\u2500 pdv/                    # Frontend PDV (Next.js)",
          "\u2502   \u2502   \u251C\u2500\u2500 src/",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 app/            # App Router (pages)",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 components/     # UI components",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 hooks/          # Custom hooks",
          "\u2502   \u2502   \u2502   \u251C\u2500\u2500 lib/            # API client, utils",
          "\u2502   \u2502   \u2502   \u2514\u2500\u2500 types/          # TypeScript types",
          "\u2502   \u2502   \u2514\u2500\u2500 package.json",
          "\u2502   \u2502",
          "\u2502   \u2514\u2500\u2500 gestao/                 # Frontend Gest\u00E3o (Next.js)",
          "\u2502       \u251C\u2500\u2500 src/",
          "\u2502       \u2502   \u251C\u2500\u2500 app/            # App Router (pages)",
          "\u2502       \u2502   \u251C\u2500\u2500 components/     # Dashboards, charts, reports",
          "\u2502       \u2502   \u251C\u2500\u2500 hooks/",
          "\u2502       \u2502   \u251C\u2500\u2500 lib/",
          "\u2502       \u2502   \u2514\u2500\u2500 types/",
          "\u2502       \u2514\u2500\u2500 package.json",
          "\u2502",
          "\u251C\u2500\u2500 docker-compose.yml          # PostgreSQL + API + PDV + Gest\u00E3o",
          "\u251C\u2500\u2500 package.json                # Workspace root",
          "\u2514\u2500\u2500 .env                        # Vari\u00E1veis de ambiente",
        ]),

        // ──────────────────────────────────────
        // 6. API ROUTES
        // ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("6. Endpoints da API"),
        para("Todos os endpoints requerem autentica\u00E7\u00E3o JWT. O middleware de RBAC restringe acesso conforme o role do usu\u00E1rio."),
        spacer(100),

        subSection("6.1 Autentica\u00E7\u00E3o"),
        makeTable(
          ["M\u00E9todo", "Rota", "Descri\u00E7\u00E3o", "Acesso"],
          [
            ["POST", "/auth/login", "Login (retorna JWT)", "P\u00FAblico"],
            ["POST", "/auth/refresh", "Renovar token", "Autenticado"],
            ["GET", "/auth/me", "Dados do usu\u00E1rio logado", "Autenticado"],
          ],
          [1200, 2400, 3360, 2400]
        ),
        spacer(160),

        subSection("6.2 Clientes (CRM)"),
        makeTable(
          ["M\u00E9todo", "Rota", "Descri\u00E7\u00E3o", "Acesso"],
          [
            ["GET", "/customers", "Listar (filtros, pagina\u00E7\u00E3o, busca)", "Operator+"],
            ["GET", "/customers/:id", "Detalhes + hist\u00F3rico", "Operator+"],
            ["POST", "/customers", "Criar cliente", "Operator+"],
            ["PUT", "/customers/:id", "Atualizar dados", "Operator+"],
            ["GET", "/customers/:id/orders", "Hist\u00F3rico de OS", "Operator+"],
            ["GET", "/customers/segments", "Segmenta\u00E7\u00E3o (RFM, tags)", "Manager+"],
            ["GET", "/customers/analytics", "M\u00E9tricas (churn, LTV)", "Admin"],
          ],
          [1200, 2800, 3160, 2200]
        ),
        spacer(160),

        subSection("6.3 Ordens de Servi\u00E7o"),
        makeTable(
          ["M\u00E9todo", "Rota", "Descri\u00E7\u00E3o", "Acesso"],
          [
            ["GET", "/orders", "Listar OS (filtros, status, per\u00EDodo)", "Operator+"],
            ["GET", "/orders/:id", "Detalhes da OS", "Operator+"],
            ["POST", "/orders", "Criar nova OS", "Operator+"],
            ["PATCH", "/orders/:id/status", "Atualizar status (produ\u00E7\u00E3o)", "Operator+"],
            ["POST", "/orders/:id/print", "Gerar comanda para impress\u00E3o", "Operator+"],
            ["GET", "/orders/kanban", "Vis\u00E3o kanban (agrupado por status)", "Operator+"],
            ["GET", "/orders/analytics", "M\u00E9tricas operacionais", "Manager+"],
          ],
          [1200, 2800, 3160, 2200]
        ),
        spacer(160),

        subSection("6.4 Pagamentos"),
        makeTable(
          ["M\u00E9todo", "Rota", "Descri\u00E7\u00E3o", "Acesso"],
          [
            ["POST", "/payments", "Criar cobran\u00E7a (Asaas)", "Operator+"],
            ["GET", "/payments/:id", "Status da cobran\u00E7a", "Operator+"],
            ["POST", "/payments/cash", "Registrar pagamento em dinheiro", "Operator+"],
            ["POST", "/webhooks/asaas", "Webhook Asaas (confirma\u00E7\u00F5es)", "Sistema"],
            ["GET", "/payments/report", "Relat\u00F3rio financeiro", "Manager+"],
          ],
          [1200, 2800, 3160, 2200]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        subSection("6.5 Comunica\u00E7\u00E3o"),
        makeTable(
          ["M\u00E9todo", "Rota", "Descri\u00E7\u00E3o", "Acesso"],
          [
            ["POST", "/notifications/whatsapp", "Enviar notifica\u00E7\u00E3o WhatsApp", "Sistema"],
            ["POST", "/notifications/email", "Enviar e-mail (Resend)", "Sistema"],
            ["GET", "/communications/:customerId", "Hist\u00F3rico de mensagens", "Operator+"],
            ["POST", "/campaigns", "Criar campanha", "Manager+"],
            ["POST", "/campaigns/:id/send", "Disparar campanha", "Manager+"],
            ["GET", "/campaigns/:id/analytics", "Resultados da campanha", "Manager+"],
          ],
          [1200, 3000, 2960, 2200]
        ),
        spacer(160),

        subSection("6.6 Financeiro (Gest\u00E3o)"),
        makeTable(
          ["M\u00E9todo", "Rota", "Descri\u00E7\u00E3o", "Acesso"],
          [
            ["GET", "/finance/cashflow", "Fluxo de caixa (per\u00EDodo)", "Admin"],
            ["GET", "/finance/dre", "DRE simplificado", "Admin"],
            ["POST", "/finance/entries", "Lan\u00E7ar receita/despesa", "Admin"],
            ["GET", "/finance/receivables", "Contas a receber", "Manager+"],
            ["GET", "/finance/payables", "Contas a pagar", "Admin"],
          ],
          [1200, 2800, 3160, 2200]
        ),

        // ──────────────────────────────────────
        // 7. INTEGRAÇÕES
        // ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("7. Integra\u00E7\u00F5es Externas"),
        spacer(60),

        subSection("7.1 Asaas (Pagamentos)"),
        para("A integra\u00E7\u00E3o com o Asaas j\u00E1 \u00E9 familiar do ecossistema Pulse. Aqui ser\u00E1 usada para cobran\u00E7as operacionais da lavanderia:"),
        boldBullet("Cria\u00E7\u00E3o de cliente: ", "Sincronizar customers do banco com a API Asaas no primeiro pagamento."),
        boldBullet("Cobran\u00E7as: ", "Gerar Pix, boleto ou cobran\u00E7a no cart\u00E3o via POST /v3/payments."),
        boldBullet("Webhooks: ", "Receber confirma\u00E7\u00F5es em /webhooks/asaas. Eventos: PAYMENT_CONFIRMED, PAYMENT_OVERDUE, PAYMENT_REFUNDED."),
        boldBullet("Concilia\u00E7\u00E3o: ", "Job di\u00E1rio para sincronizar status de pagamentos pendentes."),
        spacer(100),

        subSection("7.2 WhatsApp (Notifica\u00E7\u00F5es)"),
        para("Para notifica\u00E7\u00F5es transacionais ao cliente. Duas op\u00E7\u00F5es de implementa\u00E7\u00E3o:"),
        boldBullet("Op\u00E7\u00E3o A \u2014 Evolution API: ", "Solu\u00E7\u00E3o self-hosted, gratuita, integra\u00E7\u00E3o via REST API. Ideal para come\u00E7ar sem custo."),
        boldBullet("Op\u00E7\u00E3o B \u2014 WhatsApp Business API: ", "Via provedor (ex: Twilio, Z-API). Mais confi\u00E1vel para alto volume."),
        spacer(60),
        para("Templates de notifica\u00E7\u00E3o autom\u00E1tica:"),
        bullet("OS criada: \"Ol\u00E1 {nome}, recebemos sua roupa! Previs\u00E3o de entrega: {data}.\""),
        bullet("OS pronta: \"Sua roupa est\u00E1 pronta para retirada! Hor\u00E1rio de funcionamento: {hor\u00E1rio}.\""),
        bullet("Cobran\u00E7a gerada: \"Sua cobran\u00E7a de R${valor} est\u00E1 dispon\u00EDvel: {link_asaas}.\""),
        bullet("Lembrete de retirada: \"Sua roupa est\u00E1 pronta h\u00E1 {dias} dias. Retire at\u00E9 {data_limite}.\""),
        spacer(100),

        subSection("7.3 Resend (E-mail Marketing)"),
        para("Utilizado para campanhas de marketing e comunica\u00E7\u00F5es n\u00E3o-urgentes:"),
        boldBullet("Transacionais: ", "Confirma\u00E7\u00E3o de OS, recibos de pagamento."),
        boldBullet("Marketing: ", "Campanhas segmentadas, promo\u00E7\u00F5es, programa de fidelidade."),
        boldBullet("Dom\u00EDnio: ", "Configurar dom\u00EDnio pr\u00F3prio (ex: @predileta.com.br) para melhor deliverability."),
        spacer(100),

        subSection("7.4 Impress\u00E3o de Comanda/Recibo"),
        para("A impress\u00E3o ser\u00E1 feita via browser print API com layout otimizado para impressoras t\u00E9rmicas 80mm:"),
        boldBullet("Comanda: ", "Dados do cliente, itens da OS, c\u00F3digo de barras/QR code, prazo estimado."),
        boldBullet("Recibo: ", "Dados de pagamento, forma de pagamento, valor."),
        boldBullet("Implementa\u00E7\u00E3o: ", "CSS @media print com largura fixa de 80mm. Componente React dedicado com window.print()."),

        // ──────────────────────────────────────
        // 8. AUTENTICAÇÃO E RBAC
        // ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("8. Autentica\u00E7\u00E3o e Controle de Acesso"),
        spacer(60),

        subSection("8.1 JWT + Roles"),
        para("O sistema utiliza JWT com refresh tokens. Cada usu\u00E1rio possui um role que define suas permiss\u00F5es:"),
        spacer(60),
        makeTable(
          ["Role", "PDV", "Gest\u00E3o", "Descri\u00E7\u00E3o"],
          [
            ["operator", "Acesso total", "Sem acesso", "Funcion\u00E1rios do balc\u00E3o. Criam OS, atualizam status, registram pagamentos."],
            ["manager", "Acesso total", "Parcial (operacional + marketing)", "Gerente operacional. Tudo do operator + relat\u00F3rios e campanhas."],
            ["admin", "Acesso total", "Acesso total", "Dono/gestor. Acesso completo a ambos os sistemas, incluindo financeiro."],
          ],
          [1600, 2000, 2800, 2960]
        ),
        spacer(160),

        subSection("8.2 Middleware de RBAC"),
        para("Implementa\u00E7\u00E3o no Express com middleware que valida role antes de cada rota:"),
        spacer(60),
        ...codeBlock([
          "// middleware/rbac.js",
          "const authorize = (...roles) => (req, res, next) => {",
          "  if (!roles.includes(req.user.role)) {",
          "    return res.status(403).json({ error: 'Acesso negado' });",
          "  }",
          "  next();",
          "};",
          "",
          "// Uso nas rotas:",
          "router.get('/finance/dre', authorize('admin'), dre);",
          "router.get('/orders', authorize('operator','manager','admin'), list);",
        ]),

        // ──────────────────────────────────────
        // 9. ROADMAP
        // ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("9. Roadmap de Implementa\u00E7\u00E3o"),
        para("Desenvolvimento priorizado: PDV primeiro (Sprints 1-4), depois Gest\u00E3o (Sprints 5-7). Cada sprint tem dura\u00E7\u00E3o estimada de 2 semanas."),
        spacer(100),

        subSection("Fase 1 \u2014 PDV Core (Sprints 1-2)"),
        spacer(60),
        makeTable(
          ["Sprint", "Entrega", "Detalhamento"],
          [
            ["Sprint 1\n(Sem. 1-2)", "Infraestrutura + CRM + Servi\u00E7os", "Setup monorepo, Docker, PostgreSQL, Prisma. CRUD de clientes (B2B/B2C). Cadastro de servi\u00E7os e tabelas de pre\u00E7o. Autentica\u00E7\u00E3o JWT + RBAC b\u00E1sico. UI base do PDV (layout, navega\u00E7\u00E3o)."],
            ["Sprint 2\n(Sem. 3-4)", "OS + Produ\u00E7\u00E3o + Pagamentos", "Cria\u00E7\u00E3o de OS com c\u00E1lculo autom\u00E1tico. Kanban de produ\u00E7\u00E3o com drag-and-drop. Impress\u00E3o de comanda (t\u00E9rmica 80mm). Integra\u00E7\u00E3o Asaas (cobran\u00E7as + webhooks). Dashboard do dia."],
          ],
          [1600, 2800, 4960]
        ),
        spacer(160),

        subSection("Fase 2 \u2014 PDV Completo (Sprints 3-4)"),
        spacer(60),
        makeTable(
          ["Sprint", "Entrega", "Detalhamento"],
          [
            ["Sprint 3\n(Sem. 5-6)", "Comunica\u00E7\u00E3o + Marketing", "Integra\u00E7\u00E3o WhatsApp (notifica\u00E7\u00F5es autom\u00E1ticas de status). Integra\u00E7\u00E3o Resend (e-mails transacionais). Templates de mensagem. Hist\u00F3rico de comunica\u00E7\u00E3o no CRM."],
            ["Sprint 4\n(Sem. 7-8)", "Refino + Fidelidade", "Programa de fidelidade (pontos). Cupons de desconto. Alertas de atraso na produ\u00E7\u00E3o. Polimento de UX, performance, testes."],
          ],
          [1600, 2800, 4960]
        ),
        spacer(160),

        subSection("Fase 3 \u2014 Sistema de Gest\u00E3o (Sprints 5-7)"),
        spacer(60),
        makeTable(
          ["Sprint", "Entrega", "Detalhamento"],
          [
            ["Sprint 5\n(Sem. 9-10)", "Financeiro", "Dashboard financeiro. Fluxo de caixa (auto com dados do PDV + manual). DRE simplificado. Contas a receber/pagar. Concilia\u00E7\u00E3o Asaas."],
            ["Sprint 6\n(Sem. 11-12)", "Operacional + Growth", "M\u00E9tricas de produ\u00E7\u00E3o (tempo m\u00E9dio, gargalos). Performance por funcion\u00E1rio. An\u00E1lise de clientes (reten\u00E7\u00E3o, churn, LTV). Segmenta\u00E7\u00E3o RFM."],
            ["Sprint 7\n(Sem. 13-14)", "Marketing + Relat\u00F3rios", "Campanhas segmentadas (WhatsApp + e-mail). A/B testing b\u00E1sico. Relat\u00F3rios export\u00E1veis (PDF). Dashboard executivo consolidado."],
          ],
          [1600, 2800, 4960]
        ),

        // ──────────────────────────────────────
        // 10. DECISÕES TÉCNICAS
        // ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("10. Decis\u00F5es T\u00E9cnicas e Conven\u00E7\u00F5es"),
        spacer(60),

        subSection("10.1 Stack Detalhado"),
        boldBullet("Frontend: ", "Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui"),
        boldBullet("Backend: ", "Node.js + Express, TypeScript, Prisma ORM"),
        boldBullet("Banco: ", "PostgreSQL 16 (um \u00FAnico banco, schemas separados se necess\u00E1rio)"),
        boldBullet("Pagamentos: ", "Asaas API v3 (Pix, Boleto, Cart\u00E3o)"),
        boldBullet("E-mail: ", "Resend (transacional + marketing)"),
        boldBullet("WhatsApp: ", "Evolution API (self-hosted) ou Z-API"),
        boldBullet("Deploy: ", "Vercel (frontends) + Railway/Render (API + PostgreSQL)"),
        boldBullet("Monorepo: ", "npm workspaces ou Turborepo"),
        spacer(100),

        subSection("10.2 Conven\u00E7\u00F5es de C\u00F3digo"),
        boldBullet("Naming: ", "camelCase para vari\u00E1veis/fun\u00E7\u00F5es, PascalCase para componentes, snake_case para banco de dados."),
        boldBullet("API responses: ", "Padr\u00E3o { data, error, meta } com pagina\u00E7\u00E3o cursor-based."),
        boldBullet("Valida\u00E7\u00E3o: ", "Zod para valida\u00E7\u00E3o de input em todas as rotas."),
        boldBullet("Erros: ", "Classes de erro customizadas (AppError, ValidationError, NotFoundError)."),
        boldBullet("Logs: ", "Winston com n\u00EDveis (info, warn, error) e contexto estruturado."),
        spacer(100),

        subSection("10.3 Design de Refer\u00EAncia"),
        para("Seguindo o padr\u00E3o est\u00E9tico j\u00E1 estabelecido nos projetos Pulse \u2014 clean, minimal, com refer\u00EAncias Notion/Nubank/Asaas:"),
        boldBullet("PDV: ", "Interface limpa, bot\u00F5es grandes para toque em tablet, alto contraste, foco em velocidade de opera\u00E7\u00E3o."),
        boldBullet("Gest\u00E3o: ", "Dashboard com cards, gr\u00E1ficos Recharts, tabelas com filtros avan\u00E7ados, sidebar de navega\u00E7\u00E3o."),
        boldBullet("Paleta: ", "Tons neutros (cinza/branco) com cor de destaque \u00FAnica (azul Predileta). Dark mode opcional."),

        // ──────────────────────────────────────
        // 11. PRÓXIMOS PASSOS
        // ──────────────────────────────────────
        spacer(200),
        sectionTitle("11. Pr\u00F3ximos Passos Imediatos"),
        para("Com este documento aprovado, a execu\u00E7\u00E3o come\u00E7a pelo Sprint 1 do PDV:"),
        spacer(60),
        numberItem("Criar reposit\u00F3rio monorepo com estrutura de pastas definida na se\u00E7\u00E3o 5.", "numbers2"),
        numberItem("Setup Docker Compose (PostgreSQL + API + PDV dev servers).", "numbers2"),
        numberItem("Configurar Prisma com schema inicial (tabelas da se\u00E7\u00E3o 4).", "numbers2"),
        numberItem("Implementar autentica\u00E7\u00E3o JWT + middleware RBAC.", "numbers2"),
        numberItem("Construir CRUD de clientes (CRM) com interface PDV.", "numbers2"),
        numberItem("Cadastro de servi\u00E7os e tabelas de pre\u00E7o B2B/B2C.", "numbers2"),
        spacer(100),
        para("Cada item pode ser desenvolvido como uma task isolada, ideal para execu\u00E7\u00E3o com Claude Code seguindo o padr\u00E3o de prompts estruturados."),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/user/overview/predileta-arquitetura-sistemas.docx", buffer);
  console.log("Document created successfully!");
});
