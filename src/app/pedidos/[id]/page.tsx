"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Clock } from "lucide-react";
import { formatDate, formatCurrency, getStatusLabel } from "@/lib/utils";
import type { Pedido, Notificacao } from "@/types";

const STATUS_OPTIONS = [
  { value: "recebido", label: "Recebido" },
  { value: "em_lavagem", label: "Em Lavagem" },
  { value: "pronto", label: "Pronto" },
  { value: "entregue", label: "Entregue" },
];

export default function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    async function loadPedido() {
      try {
        const res = await fetch(`/api/pedidos/${id}`);
        const result = await res.json();

        if (res.ok && result.data) {
          setPedido(result.data);
          setNotificacoes(result.data.notificacoes || []);
        } else {
          toast({ title: "Pedido não encontrado", variant: "destructive" });
          router.push("/pedidos");
        }
      } catch {
        toast({ title: "Erro ao carregar pedido", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }

    loadPedido();
  }, [id, router, toast]);

  async function handleStatusChange(newStatus: string) {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/pedidos/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const result = await res.json();
        setPedido((prev) =>
          prev ? { ...prev, status: result.data.status } : null
        );
        toast({ title: `Status atualizado para "${getStatusLabel(newStatus)}"` });

        // Reload to get updated notifications
        const reloadRes = await fetch(`/api/pedidos/${id}`);
        const reloadResult = await reloadRes.json();
        if (reloadRes.ok) {
          setNotificacoes(reloadResult.data.notificacoes || []);
        }
      } else {
        toast({ title: "Erro ao atualizar status", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleCancel() {
    if (!confirm("Deseja realmente cancelar este pedido?")) return;

    try {
      const res = await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Pedido cancelado" });
        router.push("/pedidos");
      }
    } catch {
      toast({ title: "Erro ao cancelar pedido", variant: "destructive" });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!pedido) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/pedidos">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-mono">{pedido.protocolo}</h1>
                <StatusBadge status={pedido.status} />
              </div>
              <p className="text-sm text-gray-500">
                Criado em {formatDate(pedido.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" /> Cliente
                </h2>
                {pedido.cliente && (
                  <div className="space-y-1">
                    <p className="font-medium">{pedido.cliente.nome}</p>
                    <p className="text-sm text-gray-500">{pedido.cliente.telefone}</p>
                    {pedido.cliente.email && (
                      <p className="text-sm text-gray-500">{pedido.cliente.email}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Itens do Pedido</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Descrição
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Serviço
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                          Qtd
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Unit.
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pedido.itens?.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 text-sm">
                            {item.descricao}
                            {item.cor && (
                              <span className="text-xs text-gray-400 block">
                                Cor: {item.cor}
                              </span>
                            )}
                            {item.defeitos && (
                              <span className="text-xs text-red-400 block">
                                {item.defeitos}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.tipoServico}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {item.quantidade}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {formatCurrency(Number(item.precoUnitario))}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            {formatCurrency(Number(item.precoTotal))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notifications Timeline */}
              {notificacoes.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" /> Notificações Enviadas
                  </h2>
                  <div className="space-y-3">
                    {notificacoes.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex items-start gap-3 text-sm border-l-2 border-blue-200 pl-3"
                      >
                        <div>
                          <p className="font-medium">{notif.tipo}</p>
                          <p className="text-gray-500">{notif.mensagem}</p>
                          <p className="text-xs text-gray-400">
                            {formatDate(notif.enviadoEm)} -{" "}
                            <span
                              className={
                                notif.status === "enviado"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {notif.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Values */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Valores</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(Number(pedido.valorTotal))}</span>
                  </div>
                  {Number(pedido.desconto) > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Desconto</span>
                      <span>-{formatCurrency(Number(pedido.desconto))}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(Number(pedido.valorFinal))}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500">Pagamento</span>
                    <span
                      className={pedido.pago ? "text-green-600" : "text-red-600"}
                    >
                      {pedido.pago ? "Pago" : "Pendente"}
                    </span>
                  </div>
                  {pedido.formaPagamento && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Forma</span>
                      <span>{pedido.formaPagamento}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Datas</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Criação</span>
                    <span>{formatDate(pedido.createdAt)}</span>
                  </div>
                  {pedido.dataPrevisaoEntrega && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Previsão</span>
                      <span>{formatDate(pedido.dataPrevisaoEntrega)}</span>
                    </div>
                  )}
                  {pedido.dataEntrega && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Entrega</span>
                      <span>{formatDate(pedido.dataEntrega)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Ações</h3>
                <div className="space-y-3">
                  {pedido.status !== "cancelado" && pedido.status !== "entregue" && (
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">
                        Atualizar Status
                      </label>
                      <Select
                        value={pedido.status}
                        onValueChange={handleStatusChange}
                        disabled={updatingStatus}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {pedido.observacoes && (
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">
                        Observações
                      </label>
                      <p className="text-sm bg-gray-50 rounded p-2">
                        {pedido.observacoes}
                      </p>
                    </div>
                  )}

                  {pedido.status !== "cancelado" && pedido.status !== "entregue" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={handleCancel}
                    >
                      Cancelar Pedido
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
