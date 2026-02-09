// Asaas API Integration
// Docs: https://docs.asaas.com/reference

const ASAAS_API_URL = process.env.ASAAS_SANDBOX === "true"
  ? "https://sandbox.asaas.com/api/v3"
  : "https://api.asaas.com/api/v3";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;

async function asaasRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${ASAAS_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Asaas API error: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  return response.json();
}

// --- Plans ---

export const PLANS = {
  free: {
    name: "Gratuito",
    description: "Para comecar sua jornada de produtividade",
    price: 0,
    features: [
      "Ate 10 tarefas ativas",
      "Ate 3 habitos",
      "1 meta por periodo",
      "Relatorios basicos mensais",
    ],
    limits: {
      tasks: 10,
      habits: 3,
      goals: 1,
      reports: "monthly" as const,
    },
  },
  pro: {
    name: "Pro",
    description: "Para quem leva produtividade a serio",
    price: 29.9,
    features: [
      "Tarefas ilimitadas",
      "Habitos ilimitados",
      "Metas ilimitadas",
      "Relatorios semanais com IA",
      "Coach de IA personalizado",
      "Exportacao de dados",
      "Suporte prioritario",
    ],
    limits: {
      tasks: Infinity,
      habits: Infinity,
      goals: Infinity,
      reports: "weekly" as const,
    },
  },
  enterprise: {
    name: "Enterprise",
    description: "Para times e empresas",
    price: 99.9,
    features: [
      "Tudo do plano Pro",
      "Dashboard de time",
      "Relatorios consolidados",
      "API access",
      "SSO",
      "Suporte dedicado",
    ],
    limits: {
      tasks: Infinity,
      habits: Infinity,
      goals: Infinity,
      reports: "daily" as const,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;

// --- Customer Management ---

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj?: string;
}

export async function createCustomer(data: {
  name: string;
  email: string;
  cpfCnpj?: string;
}): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCustomer(
  customerId: string
): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>(`/customers/${customerId}`);
}

// --- Subscription Management ---

interface AsaasSubscription {
  id: string;
  customer: string;
  billingType: string;
  value: number;
  cycle: string;
  status: string;
  nextDueDate: string;
}

export async function createSubscription(data: {
  customer: string;
  billingType: "PIX" | "CREDIT_CARD" | "BOLETO";
  value: number;
  cycle: "MONTHLY";
  description: string;
  nextDueDate: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}): Promise<AsaasSubscription> {
  return asaasRequest<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<{ id: string; deleted: boolean }> {
  return asaasRequest(`/subscriptions/${subscriptionId}`, {
    method: "DELETE",
  });
}

export async function getSubscription(
  subscriptionId: string
): Promise<AsaasSubscription> {
  return asaasRequest<AsaasSubscription>(
    `/subscriptions/${subscriptionId}`
  );
}

// --- Single Payment (for upsell / one-time) ---

interface AsaasPayment {
  id: string;
  customer: string;
  billingType: string;
  value: number;
  status: string;
  invoiceUrl: string;
  bankSlipUrl?: string;
  dueDate: string;
}

interface AsaasPixQrCode {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

export async function createPayment(data: {
  customer: string;
  billingType: "PIX" | "CREDIT_CARD" | "BOLETO";
  value: number;
  dueDate: string;
  description: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>("/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPixQrCode(
  paymentId: string
): Promise<AsaasPixQrCode> {
  return asaasRequest<AsaasPixQrCode>(`/payments/${paymentId}/pixQrCode`);
}

export async function getPaymentStatus(
  paymentId: string
): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>(`/payments/${paymentId}`);
}

// --- Webhook verification ---

export function verifyWebhookToken(token: string): boolean {
  return token === process.env.ASAAS_WEBHOOK_TOKEN;
}
