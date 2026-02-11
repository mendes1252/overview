export interface Cliente {
  id: string;
  nome: string;
  cpf: string | null;
  telefone: string;
  whatsapp: string | null;
  email: string | null;
  dataNascimento: string | null;
  endereco: string | null;
  categoria: string;
  totalGasto: number;
  totalPedidos: number;
  observacoes: string | null;
  ativo: boolean;
  createdAt: string;
}

export type PedidoStatus = "recebido" | "em_lavagem" | "pronto" | "entregue" | "cancelado";

export interface PedidoItem {
  id?: string;
  pedidoId?: string;
  descricao: string;
  tipoServico: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  cor: string | null;
  defeitos: string | null;
}

export interface Pedido {
  id: string;
  protocolo: string;
  clienteId: string;
  status: PedidoStatus;
  valorTotal: number;
  desconto: number;
  valorFinal: number;
  observacoes: string | null;
  dataPrevisaoEntrega: string | null;
  dataEntrega: string | null;
  formaPagamento: string | null;
  pago: boolean;
  createdAt: string;
  updatedAt: string;
  cliente?: Cliente;
  itens?: PedidoItem[];
}

export interface Notificacao {
  id: string;
  clienteId: string | null;
  pedidoId: string | null;
  tipo: string | null;
  canal: string;
  mensagem: string | null;
  status: string | null;
  erroDescricao: string | null;
  enviadoEm: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RelatorioFilters {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  clienteId?: string;
}

export interface RelatorioTotais {
  totalPedidos: number;
  valorTotal: number;
  ticketMedio: number;
}

export interface DashboardData {
  pedidosHoje: number;
  pedidosProntos: number;
  pedidosEmAndamento: number;
  receitaMes: number;
  ultimosPedidos: Pedido[];
}
