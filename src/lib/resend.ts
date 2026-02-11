import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

export function getEmailConfirmacaoRecebimento(params: {
  nomeCliente: string;
  protocolo: string;
  valorTotal: string;
  dataPrevisaoEntrega: string;
}) {
  return {
    subject: `Pedido ${params.protocolo} - Confirmação de Recebimento`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: #2563eb; color: white; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 24px; }
    .info-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
    .label { color: #64748b; font-size: 14px; }
    .value { font-weight: bold; color: #1e293b; }
    .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Predileta Lavanderia</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${params.nomeCliente}</strong>!</p>
      <p>Recebemos suas roupas com sucesso. Aqui estão os detalhes do seu pedido:</p>
      <div class="info-box">
        <div class="info-row">
          <span class="label">Protocolo:</span>
          <span class="value">${params.protocolo}</span>
        </div>
        <div class="info-row">
          <span class="label">Valor Total:</span>
          <span class="value">${params.valorTotal}</span>
        </div>
        <div class="info-row">
          <span class="label">Previsão de Entrega:</span>
          <span class="value">${params.dataPrevisaoEntrega}</span>
        </div>
      </div>
      <p>Avisaremos quando suas roupas estiverem prontas para retirada.</p>
      <p>Obrigado por escolher a Predileta Lavanderia!</p>
    </div>
    <div class="footer">
      <p>Predileta Lavanderia</p>
      <p>Horário de atendimento: Seg-Sex 7h-19h | Sáb 8h-14h</p>
    </div>
  </div>
</body>
</html>`,
  };
}

export function getEmailRoupasProntas(params: {
  nomeCliente: string;
  protocolo: string;
}) {
  return {
    subject: `Pedido ${params.protocolo} - Suas roupas estão prontas!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: #16a34a; color: white; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 24px; }
    .highlight { background: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 20px; margin: 16px 0; text-align: center; }
    .highlight p { font-size: 18px; font-weight: bold; color: #166534; margin: 0; }
    .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Predileta Lavanderia</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${params.nomeCliente}</strong>!</p>
      <div class="highlight">
        <p>Suas roupas do pedido ${params.protocolo} estão PRONTAS para retirada!</p>
      </div>
      <p>Venha buscar suas roupas no nosso horário de atendimento.</p>
      <p>Obrigado por escolher a Predileta Lavanderia!</p>
    </div>
    <div class="footer">
      <p>Predileta Lavanderia</p>
      <p>Horário de atendimento: Seg-Sex 7h-19h | Sáb 8h-14h</p>
    </div>
  </div>
</body>
</html>`,
  };
}

export function getEmailLembreteRetirada(params: {
  nomeCliente: string;
  protocolo: string;
}) {
  return {
    subject: `Lembrete - Pedido ${params.protocolo} aguarda retirada`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: #ca8a04; color: white; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 24px; }
    .reminder { background: #fefce8; border: 2px solid #fde047; border-radius: 8px; padding: 20px; margin: 16px 0; text-align: center; }
    .reminder p { font-size: 16px; color: #854d0e; margin: 0; }
    .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Predileta Lavanderia</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${params.nomeCliente}</strong>!</p>
      <div class="reminder">
        <p>Suas roupas do pedido <strong>${params.protocolo}</strong> estão prontas e aguardando retirada.</p>
      </div>
      <p>Por favor, retire suas roupas no nosso horário de atendimento.</p>
      <p>Obrigado!</p>
    </div>
    <div class="footer">
      <p>Predileta Lavanderia</p>
      <p>Horário de atendimento: Seg-Sex 7h-19h | Sáb 8h-14h</p>
    </div>
  </div>
</body>
</html>`,
  };
}

export async function enviarEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const client = getResendClient();
    if (!client) {
      console.warn("RESEND_API_KEY não configurada - email não enviado");
      return { success: false, error: "RESEND_API_KEY não configurada" };
    }
    const result = await client.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return { success: false, error: String(error) };
  }
}
