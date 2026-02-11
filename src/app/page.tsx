"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  DollarSign,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DashboardData } from "@/types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const monthStart = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        )
          .toISOString()
          .split("T")[0];

        const [pedidosHojeRes, pedidosProntosRes, pedidosAndamentoRes, receitaRes, ultimosRes] =
          await Promise.all([
            fetch(`/api/relatorios/pedidos?dataInicio=${today}&dataFim=${today}`),
            fetch(`/api/pedidos?status=pronto&pageSize=999`),
            fetch(`/api/pedidos?status=recebido&pageSize=999`),
            fetch(`/api/relatorios/pedidos?dataInicio=${monthStart}&dataFim=${today}`),
            fetch(`/api/pedidos?pageSize=5`),
          ]);

        const [pedidosHoje, pedidosProntos, pedidosAndamento, receita, ultimos] =
          await Promise.all([
            pedidosHojeRes.json(),
            pedidosProntosRes.json(),
            pedidosAndamentoRes.json(),
            receitaRes.json(),
            ultimosRes.json(),
          ]);

        const emLavagemRes = await fetch(`/api/pedidos?status=em_lavagem&pageSize=999`);
        const emLavagem = await emLavagemRes.json();

        setData({
          pedidosHoje: pedidosHoje.totais?.totalPedidos || 0,
          pedidosProntos: pedidosProntos.total || 0,
          pedidosEmAndamento: (pedidosAndamento.total || 0) + (emLavagem.total || 0),
          receitaMes: receita.totais?.valorTotal || 0,
          ultimosPedidos: ultimos.data || [],
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">
                Visão geral do dia - {formatDate(new Date())}
              </p>
            </div>
            <Link href="/pedidos/novo">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pedidos Hoje</p>
                  <p className="text-2xl font-bold">{data?.pedidosHoje || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prontos p/ Retirada</p>
                  <p className="text-2xl font-bold">{data?.pedidosProntos || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Em Andamento</p>
                  <p className="text-2xl font-bold">{data?.pedidosEmAndamento || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Receita do Mês</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(data?.receitaMes || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Últimos Pedidos</h2>
              <Link
                href="/pedidos"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Protocolo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.ultimosPedidos.map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/pedidos/${pedido.id}`}
                          className="font-mono text-sm text-blue-600 hover:underline"
                        >
                          {pedido.protocolo}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pedido.cliente?.nome || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(pedido.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={pedido.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(Number(pedido.valorFinal))}
                      </td>
                    </tr>
                  ))}
                  {(!data?.ultimosPedidos || data.ultimosPedidos.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Nenhum pedido ainda. Crie seu primeiro pedido!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Link
              href="/pedidos/novo"
              className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-8 w-8 mb-2" />
              <h3 className="font-semibold text-lg">Novo Pedido</h3>
              <p className="text-blue-100 text-sm">Criar um novo pedido de serviço</p>
            </Link>
            <Link
              href="/pedidos"
              className="bg-white border rounded-lg p-6 hover:border-blue-300 transition-colors"
            >
              <ShoppingBag className="h-8 w-8 mb-2 text-blue-600" />
              <h3 className="font-semibold text-lg">Ver Pedidos</h3>
              <p className="text-gray-500 text-sm">Gerenciar todos os pedidos</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
