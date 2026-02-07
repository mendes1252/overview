import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from: "PULSO <noreply@pulso.app>",
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

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

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu Relatório Semanal - PULSO</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366F1; margin: 0;">PULSO</h1>
    <p style="color: #666; margin-top: 5px;">Seu Relatório Semanal</p>
  </div>

  <p style="font-size: 18px;">Olá, ${userName}!</p>

  <p>${reportData.summary}</p>

  <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h2 style="margin-top: 0; font-size: 16px; opacity: 0.9;">Números da Semana</h2>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center;">
      <div>
        <div style="font-size: 28px; font-weight: bold;">${completionRate}%</div>
        <div style="font-size: 12px; opacity: 0.8;">Tarefas</div>
      </div>
      <div>
        <div style="font-size: 28px; font-weight: bold;">${Math.round(reportData.habitsConsistency)}%</div>
        <div style="font-size: 12px; opacity: 0.8;">Hábitos</div>
      </div>
      <div>
        <div style="font-size: 28px; font-weight: bold;">${reportData.goalsAchieved}/${reportData.goalsTotal}</div>
        <div style="font-size: 12px; opacity: 0.8;">Metas</div>
      </div>
    </div>
  </div>

  <div style="background: #F3F4F6; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #6366F1;">✨ Destaques</h3>
    <ul style="margin: 0; padding-left: 20px;">
      ${reportData.highlights.split("|").map(h => `<li>${h.trim()}</li>`).join("")}
    </ul>
  </div>

  <div style="background: #FEF3C7; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #D97706;">💡 Insights</h3>
    <ul style="margin: 0; padding-left: 20px;">
      ${reportData.insights.split("|").map(i => `<li>${i.trim()}</li>`).join("")}
    </ul>
  </div>

  <div style="background: #DBEAFE; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #2563EB;">🎯 Recomendações para Próxima Semana</h3>
    <ul style="margin: 0; padding-left: 20px;">
      ${reportData.recommendations.split("|").map(r => `<li>${r.trim()}</li>`).join("")}
    </ul>
  </div>

  <div style="text-align: center; margin-top: 30px;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/relatorios"
       style="display: inline-block; background: #6366F1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
      Ver Relatório Completo
    </a>
  </div>

  <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

  <p style="color: #666; font-size: 12px; text-align: center;">
    Você está recebendo este email porque está inscrito no PULSO.<br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/configuracoes" style="color: #6366F1;">Gerenciar preferências de email</a>
  </p>
</body>
</html>
  `;
}

export function generatePasswordResetEmail(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redefinir Senha - PULSO</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #6366F1; margin: 0;">PULSO</h1>
  </div>

  <h2>Redefinir sua senha</h2>

  <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha:</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetUrl}"
       style="display: inline-block; background: #6366F1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
      Redefinir Senha
    </a>
  </div>

  <p style="color: #666; font-size: 14px;">
    Se você não solicitou esta redefinição, pode ignorar este email.<br>
    Este link expira em 1 hora.
  </p>
</body>
</html>
  `;
}
