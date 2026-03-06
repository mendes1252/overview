import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY?.trim());
  }
  return _resend;
}

// --- Email Configuration Validation ---

export interface EmailConfigStatus {
  isConfigured: boolean;
  issues: string[];
  warnings: string[];
}

export function validateEmailConfig(): EmailConfigStatus {
  const issues: string[] = [];
  const warnings: string[] = [];

  if (!process.env.RESEND_API_KEY) {
    issues.push("RESEND_API_KEY is not set. Email sending will fail.");
  } else if (!process.env.RESEND_API_KEY.startsWith("re_")) {
    issues.push("RESEND_API_KEY does not start with 're_'. This may not be a valid Resend API key.");
  }

  const from = process.env.EMAIL_FROM || "";
  if (!from) {
    warnings.push("EMAIL_FROM is not set. Defaulting to 'pulse <onboarding@resend.dev>'.");
  }

  if (from.includes("onboarding@resend.dev") || from.includes("resend.dev") || !from) {
    warnings.push(
      "Using Resend sandbox address (onboarding@resend.dev). " +
      "Emails can ONLY be sent to the email registered on your Resend account. " +
      "To send to any address, verify your domain at https://resend.com/domains"
    );
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    warnings.push("NEXT_PUBLIC_APP_URL is not set. Email links will default to http://localhost:3000.");
  }

  return {
    isConfigured: issues.length === 0,
    issues,
    warnings,
  };
}

// --- Email Sending ---

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

let _configLogged = false;

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const from = (process.env.EMAIL_FROM || "pulse <onboarding@resend.dev>").trim();

  // Log config warnings on first call
  if (!_configLogged) {
    _configLogged = true;
    const config = validateEmailConfig();
    if (config.issues.length > 0) {
      console.warn("[EMAIL CONFIG] Issues:", config.issues.join(" | "));
    }
    if (config.warnings.length > 0) {
      console.warn("[EMAIL CONFIG] Warnings:", config.warnings.join(" | "));
    }
  }

  console.log(`[EMAIL] Sending to=${to} from=${from} subject="${subject}"`);

  try {
    const data = await getResend().emails.send({
      from,
      to,
      subject,
      html,
    });
    console.log("[EMAIL] Sent successfully:", JSON.stringify(data));
    return { success: true, data };
  } catch (error: any) {
    console.error("[EMAIL] Failed to send:", error?.message || error);
    console.error("[EMAIL] Full error:", JSON.stringify(error, null, 2));

    // Actionable hints for common errors
    if (error?.message?.includes("not a verified") || error?.message?.includes("not verified") || error?.message?.includes("verify")) {
      console.error(
        "[EMAIL] HINT: Your sender domain is not verified in Resend. " +
        "Go to https://resend.com/domains to add and verify your domain. " +
        "Until then, you can only send to the email registered on your Resend account."
      );
    }
    if (error?.message?.includes("API key") || error?.statusCode === 401 || error?.statusCode === 403) {
      console.error("[EMAIL] HINT: Check that RESEND_API_KEY is correct and starts with 're_'.");
    }

    return { success: false, error };
  }
}

// --- Email Templates (pulse Design System) ---

// Sanitize app URL — remove trailing whitespace/newlines from env vars
const getAppUrl = () => (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").trim().replace(/\/+$/, "");

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Roboto, sans-serif; line-height: 1.8; color: #1A1A2E; max-width: 600px; margin: 0 auto; padding: 0; background: #F5F7FA;">
  <div style="background: linear-gradient(135deg, #0F1419 0%, #1A1A2E 100%); padding: 32px; text-align: center;">
    <span style="color: white; font-size: 24px; font-weight: 300; letter-spacing: -0.5px;">pulse</span>
  </div>
  <div style="padding: 32px; background: white;">
    ${content}
  </div>
  <div style="padding: 24px; text-align: center; background: #F5F7FA;">
    <p style="color: #718096; font-size: 12px; margin: 0; font-weight: 300;">
      pulse — Produtividade Intencional<br>
      <a href="${getAppUrl()}/configuracoes" style="color: #4A9FFF; text-decoration: none;">Gerenciar preferencias</a>
    </p>
  </div>
</body>
</html>
`;

const pulseButton = (url: string, text: string) =>
  `<div style="text-align: center; margin: 28px 0;">
    <a href="${url}" style="display: inline-block; background: #4A9FFF; color: white; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 500; font-size: 14px;">${text}</a>
  </div>`;

// Welcome email
export function generateWelcomeEmail(userName: string): string {
  return emailWrapper(`
    <h2 style="font-weight: 400; font-size: 22px; color: #1A1A2E; margin-top: 0;">Bem-vindo ao pulse, ${userName}!</h2>
    <p style="color: #718096; font-weight: 300;">Estamos felizes em te ter aqui. O pulse foi feito para ajudar voce a transformar produtividade em intencao.</p>

    <div style="background: #F5F7FA; border-radius: 16px; padding: 24px; margin: 24px 0;">
      <h3 style="font-weight: 500; font-size: 14px; color: #1A1A2E; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">Proximos passos</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #4A9FFF; font-weight: 500; width: 24px;">1</td>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Adicione sua primeira tarefa</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4A9FFF; font-weight: 500;">2</td>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Crie um habito para acompanhar</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4A9FFF; font-weight: 500;">3</td>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Defina uma meta para a semana</td>
        </tr>
      </table>
    </div>

    ${pulseButton(`${getAppUrl()}/dashboard`, "Ir para o Dashboard")}
  `);
}

// Payment confirmed email
export function generatePaymentConfirmedEmail(
  userName: string,
  plan: string,
  value: string,
  billingType: string
): string {
  return emailWrapper(`
    <h2 style="font-weight: 400; font-size: 22px; color: #1A1A2E; margin-top: 0;">Pagamento confirmado!</h2>
    <p style="color: #718096; font-weight: 300;">Ola, ${userName}. Seu pagamento foi confirmado com sucesso.</p>

    <div style="background: #F5F7FA; border-radius: 16px; padding: 24px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Plano</td>
          <td style="padding: 8px 0; color: #1A1A2E; font-weight: 500; text-align: right;">${plan}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Valor</td>
          <td style="padding: 8px 0; color: #1A1A2E; font-weight: 500; text-align: right;">R$ ${value}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Metodo</td>
          <td style="padding: 8px 0; color: #1A1A2E; font-weight: 500; text-align: right;">${billingType}</td>
        </tr>
      </table>
    </div>

    <p style="color: #718096; font-weight: 300;">Seus recursos premium ja estao disponiveis. Aproveite!</p>

    ${pulseButton(`${getAppUrl()}/dashboard`, "Acessar Dashboard")}
  `);
}

// Weekly report email
export function generateWeeklyReportEmail(
  userName: string,
  reportData: {
    summary: string;
    insights: string;
    recommendations: string;
    highlights: string;
    tasksCompleted: number;
    tasksTotal: number;
    habitsConsistency: number;
    goalsAchieved: number;
    goalsTotal: number;
  }
): string {
  const completionRate = reportData.tasksTotal > 0
    ? Math.round((reportData.tasksCompleted / reportData.tasksTotal) * 100)
    : 0;

  return emailWrapper(`
    <h2 style="font-weight: 400; font-size: 22px; color: #1A1A2E; margin-top: 0;">Seu Relatorio Semanal</h2>
    <p style="color: #718096; font-weight: 300;">Ola, ${userName}. Aqui esta o resumo da sua semana.</p>

    <p style="color: #1A1A2E; font-weight: 300;">${reportData.summary}</p>

    <!-- Stats -->
    <div style="background: linear-gradient(135deg, #0F1419 0%, #1A1A2E 100%); color: white; padding: 24px; border-radius: 16px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr>
          <td style="padding: 8px;">
            <div style="font-size: 32px; font-weight: 300;">${completionRate}%</div>
            <div style="font-size: 11px; opacity: 0.5; font-weight: 300;">Tarefas</div>
          </td>
          <td style="padding: 8px;">
            <div style="font-size: 32px; font-weight: 300;">${Math.round(reportData.habitsConsistency)}%</div>
            <div style="font-size: 11px; opacity: 0.5; font-weight: 300;">Habitos</div>
          </td>
          <td style="padding: 8px;">
            <div style="font-size: 32px; font-weight: 300;">${reportData.goalsAchieved}/${reportData.goalsTotal}</div>
            <div style="font-size: 11px; opacity: 0.5; font-weight: 300;">Metas</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Highlights -->
    <div style="background: #F5F7FA; padding: 20px; border-radius: 16px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1A1A2E; font-weight: 500; font-size: 14px;">Destaques</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${reportData.highlights.split("|").map(h => `<li style="color: #718096; font-weight: 300; margin-bottom: 4px;">${h.trim()}</li>`).join("")}
      </ul>
    </div>

    <!-- Insights -->
    <div style="background: #EFF6FF; padding: 20px; border-radius: 16px; margin: 20px 0; border-left: 3px solid #4A9FFF;">
      <h3 style="margin-top: 0; color: #1A1A2E; font-weight: 500; font-size: 14px;">Insights</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${reportData.insights.split("|").map(i => `<li style="color: #718096; font-weight: 300; margin-bottom: 4px;">${i.trim()}</li>`).join("")}
      </ul>
    </div>

    ${pulseButton(`${getAppUrl()}/relatorios`, "Ver Relatorio Completo")}
  `);
}

// Challenge welcome email
export function generateChallengeWelcomeEmail(userName: string, memberAreaUrl: string): string {
  return emailWrapper(`
    <h2 style="font-weight: 400; font-size: 22px; color: #1A1A2E; margin-top: 0;">Seu Desafio de 7 Dias comeca agora!</h2>
    <p style="color: #718096; font-weight: 300;">Ola, ${userName}! Seu pagamento foi confirmado e o Desafio de Produtividade em 7 Dias ja esta disponivel.</p>

    <div style="background: #F5F7FA; border-radius: 16px; padding: 24px; margin: 24px 0;">
      <h3 style="font-weight: 500; font-size: 14px; color: #1A1A2E; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">Como funciona</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #4A9FFF; font-weight: 500; width: 24px;">1</td>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Assista a video-aula do dia</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4A9FFF; font-weight: 500;">2</td>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Leia o conteudo complementar</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4A9FFF; font-weight: 500;">3</td>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Execute o desafio pratico do dia</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4A9FFF; font-weight: 500;">4</td>
          <td style="padding: 8px 0; color: #718096; font-weight: 300;">Marque como concluido para desbloquear o proximo</td>
        </tr>
      </table>
    </div>

    <p style="color: #718096; font-weight: 300;">O Dia 1 ja esta disponivel. Comece agora!</p>

    ${pulseButton(memberAreaUrl, "Comecar o Dia 1")}
  `);
}

// Challenge completion email
export function generateChallengeCompletionEmail(userName: string, bonusUrl: string): string {
  return emailWrapper(`
    <h2 style="font-weight: 400; font-size: 22px; color: #1A1A2E; margin-top: 0;">Parabens! Desafio Completo!</h2>
    <p style="color: #718096; font-weight: 300;">Incrivel, ${userName}! Voce completou todos os 7 dias do Desafio de Produtividade. Isso mostra comprometimento real.</p>

    <div style="background: linear-gradient(135deg, #0F1419 0%, #1A1A2E 100%); color: white; padding: 24px; border-radius: 16px; margin: 24px 0; text-align: center;">
      <div style="font-size: 48px; font-weight: 300;">7/7</div>
      <div style="font-size: 14px; opacity: 0.6; font-weight: 300;">Dias Completos</div>
    </div>

    <p style="color: #718096; font-weight: 300;">Seu bonus exclusivo esta disponivel. Acesse agora para ver o que preparamos para voce!</p>

    ${pulseButton(bonusUrl, "Ver Meu Bonus")}
  `);
}

// Password reset email
export function generatePasswordResetEmail(resetUrl: string): string {
  return emailWrapper(`
    <h2 style="font-weight: 400; font-size: 22px; color: #1A1A2E; margin-top: 0;">Redefinir senha</h2>
    <p style="color: #718096; font-weight: 300;">Voce solicitou a redefinicao da sua senha. Clique no botao abaixo para criar uma nova.</p>

    ${pulseButton(resetUrl, "Redefinir Senha")}

    <p style="color: #718096; font-size: 13px; font-weight: 300;">Se voce nao solicitou, pode ignorar este email. O link expira em 1 hora.</p>
  `);
}
