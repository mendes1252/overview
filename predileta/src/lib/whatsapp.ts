interface SendMessageResult {
  messageId: string;
  status: string;
}

export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<SendMessageResult> {
  if (!process.env.EVOLUTION_API_URL) {
    console.log(`[WhatsApp STUB] To: ${phone} | ${message}`);
    return { messageId: `stub_${Date.now()}`, status: "stubbed" };
  }

  try {
    const res = await fetch(
      `${process.env.EVOLUTION_API_URL}/message/sendText/predileta`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.EVOLUTION_API_KEY ?? "",
        },
        body: JSON.stringify({ number: phone, text: message }),
      }
    );
    const data = await res.json();
    return { messageId: data?.key?.id ?? `mp_${Date.now()}`, status: "sent" };
  } catch (err) {
    console.error("[WhatsApp] send failed:", err);
    return { messageId: `err_${Date.now()}`, status: "failed" };
  }
}

export const WHATSAPP_TEMPLATES = {
  orderReceived: (orderNumber: number, customerName: string, estimatedDate: string) =>
    `Olá ${customerName}! ✅ Recebemos suas peças. OS #${orderNumber}. Previsão de entrega: ${estimatedDate}.`,

  orderReady: (orderNumber: number, customerName: string) =>
    `Olá ${customerName}! 🎉 Sua OS #${orderNumber} está pronta para retirada!`,

  orderDelivered: (orderNumber: number, customerName: string) =>
    `Olá ${customerName}! Sua OS #${orderNumber} foi entregue. Obrigado pela preferência! 💙`,

  paymentPending: (orderNumber: number, amount: string) =>
    `Lembrete: sua OS #${orderNumber} no valor de ${amount} aguarda pagamento.`,
};
