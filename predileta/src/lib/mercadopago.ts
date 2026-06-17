import MercadoPagoConfig, { Payment, Customer } from "mercadopago";
import crypto from "crypto";

function getClient() {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error("MP_ACCESS_TOKEN is not set");
  return new MercadoPagoConfig({ accessToken });
}

export interface MpPixResult {
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  status: string;
}

export interface MpBoletoResult {
  paymentId: string;
  boletoUrl: string;
  barcode: string;
  dueDate: string;
  status: string;
}

export async function createPixPayment(data: {
  orderId: string;
  amount: number;
  description: string;
  payerEmail: string;
  payerName: string;
  payerDocument?: string;
}): Promise<MpPixResult> {
  const client = getClient();
  const payment = new Payment(client);

  const result = await payment.create({
    body: {
      transaction_amount: data.amount,
      description: data.description,
      payment_method_id: "pix",
      payer: {
        email: data.payerEmail,
        first_name: data.payerName,
        identification: data.payerDocument
          ? { type: "CPF", number: data.payerDocument.replace(/\D/g, "") }
          : undefined,
      },
      external_reference: data.orderId,
    },
  });

  if (!result.id) throw new Error("Falha ao criar pagamento Pix no MP");

  const txData = result.point_of_interaction?.transaction_data;
  return {
    paymentId: String(result.id),
    qrCode: txData?.qr_code ?? "",
    qrCodeBase64: txData?.qr_code_base64 ?? "",
    status: result.status ?? "pending",
  };
}

export async function createBoletoPayment(data: {
  orderId: string;
  amount: number;
  description: string;
  payerEmail: string;
  payerName: string;
  payerDocument: string;
  dueDate: string; // YYYY-MM-DD
}): Promise<MpBoletoResult> {
  const client = getClient();
  const payment = new Payment(client);

  const result = await payment.create({
    body: {
      transaction_amount: data.amount,
      description: data.description,
      payment_method_id: "bolbradesco",
      payer: {
        email: data.payerEmail,
        first_name: data.payerName,
        identification: { type: "CPF", number: data.payerDocument.replace(/\D/g, "") },
      },
      date_of_expiration: `${data.dueDate}T23:59:59.000-03:00`,
      external_reference: data.orderId,
    },
  });

  if (!result.id) throw new Error("Falha ao criar boleto no MP");

  return {
    paymentId: String(result.id),
    boletoUrl: result.transaction_details?.external_resource_url ?? "",
    barcode: result.barcode?.content ?? "",
    dueDate: data.dueDate,
    status: result.status ?? "pending",
  };
}

export async function getMpPayment(paymentId: string) {
  const client = getClient();
  const payment = new Payment(client);
  return payment.get({ id: parseInt(paymentId) });
}

export function verifyWebhookSignature(
  xSignature: string,
  xRequestId: string,
  dataId: string
): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // skip verification in dev if secret not set

  try {
    const parts = xSignature.split(",");
    const ts = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
    const v1 = parts.find((p) => p.startsWith("v1="))?.split("=")[1];
    if (!ts || !v1) return false;

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const hash = crypto
      .createHmac("sha256", secret)
      .update(manifest)
      .digest("hex");

    return hash === v1;
  } catch {
    return false;
  }
}
