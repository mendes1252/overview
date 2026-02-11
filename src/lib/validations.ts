import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$|^\d{10,11}$/, "Formato de telefone inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  cpf: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  dataNascimento: z.string().optional().or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
  categoria: z.string().optional().or(z.literal("regular")),
  observacoes: z.string().optional().or(z.literal("")),
});

export type ClienteFormData = z.input<typeof clienteSchema>;

export const pedidoItemSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tipoServico: z.string().min(1, "Tipo de serviço é obrigatório"),
  quantidade: z.number().min(1, "Quantidade mínima é 1"),
  precoUnitario: z.number().min(0, "Preço deve ser positivo"),
  cor: z.string().optional().or(z.literal("")),
  defeitos: z.string().optional().or(z.literal("")),
});

export const pedidoSchema = z.object({
  clienteId: z.string().uuid("Selecione um cliente"),
  itens: z.array(pedidoItemSchema).min(1, "Adicione pelo menos um item"),
  desconto: z.number().min(0).default(0),
  observacoes: z.string().optional().or(z.literal("")),
  dataPrevisaoEntrega: z.string().min(1, "Data de previsão é obrigatória"),
  formaPagamento: z.string().optional().or(z.literal("")),
});

export type PedidoFormData = z.infer<typeof pedidoSchema>;

export const loginSchema = z.object({
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const TIPOS_SERVICO = [
  "Lavagem",
  "Lavagem a Seco",
  "Passagem",
  "Lavagem e Passagem",
  "Tingimento",
  "Costura/Reparo",
  "Outro",
];

export const FORMAS_PAGAMENTO = [
  "Dinheiro",
  "Cartão de Crédito",
  "Cartão de Débito",
  "PIX",
  "Transferência",
];

export const CATEGORIAS_CLIENTE = [
  { value: "regular", label: "Regular" },
  { value: "vip", label: "VIP" },
  { value: "empresarial", label: "Empresarial" },
];
