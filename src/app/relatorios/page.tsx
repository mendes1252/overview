"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, BarChart3 } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Pedido } from "@/types";
import * as XLSX from "xlsx";

interface Totais {
  totalPedidos: number;
  valorTotal: number;
  ticketMedio: number;
}

export default function RelatoriosPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [totais, setTotais] = useState<Totais | null>(null);
  const [generated, setGenerated] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dataInicio) params.set("dataInicio", dataInicio);
      if (dataFim) params.set("dataFim", dataFim);
      if (statusFilter !== "todos") params.set("status", statusFilter);

      const res = await fetch(`/api/relatorios/pedidos?${params}`);
      const result = await res.json();

      if (res.ok) {
        setPedidos(result.data || []);
        setTotais(result.totais || null);
        setGenerated(true);
      } else {
        toast({ title: "Erro ao gerar relatório", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro ao gerar relatório", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function handleExportExcel() {
    if (!pedidos.length) return;

    const worksheetData = pedidos.map((p) => ({
      Protocolo: p.protocolo,
      Cliente: p.cliente?.nome || "-",
      Data: formatDate(p.createdAt),
      Status: p.status,
      "Valor Total": Number(p.valorTotal),
      Desconto: Number(p.desconto),
      "Valor Final": Number(p.valorFinal),
      Pago: p.pago ? "Sim" : "Não",
      "Forma Pagamento": p.formaPagamento || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

    // Auto-width columns
    const colWidths = Object.keys(worksheetData[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...worksheetData.map((row) =>
          String(row[key as keyof typeof row]).length
        )
      ),
    }));
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, `relatorio-pedidos-${new Date().toISOString().split("T")[0]}.xlsx`);
    toast({ title: "Relatório exportado com sucesso!" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Relatórios</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Relatório de Pedidos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Data Fim</Label>
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="recebido">Recebido</SelectItem>
                    <SelectItem value="em_lavagem">Em Lavagem</SelectItem>
                    <SelectItem value="pronto">Pronto</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleGenerate} disabled={loading} className="w-full">
                  {loading ? "Gerando..." : "Gerar Relatório"}
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading && <LoadingSpinner className="py-12" />}

          {generated && !loading && (
            <>
              {/* Summary Cards */}
              {totais && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-sm text-gray-500">Total de Pedidos</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {totais.totalPedidos}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-sm text-gray-500">Valor Total</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(totais.valorTotal)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-sm text-gray-500">Ticket Médio</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {formatCurrency(totais.ticketMedio)}
                    </p>
                  </div>
                </div>
              )}

              {/* Export Button */}
              {pedidos.length > 0 && (
                <div className="flex justify-end mb-4">
                  <Button onClick={handleExportExcel} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              )}

              {/* Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Pago
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-blue-600">
                            {pedido.protocolo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {pedido.cliente?.nome || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(pedido.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={pedido.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            {formatCurrency(Number(pedido.valorFinal))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <span
                              className={
                                pedido.pago ? "text-green-600" : "text-red-600"
                              }
                            >
                              {pedido.pago ? "Sim" : "Não"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {pedidos.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            Nenhum pedido encontrado para os filtros selecionados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
