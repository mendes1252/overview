"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PedidoCard } from "@/components/PedidoCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Pedido } from "@/types";

const STATUS_TABS = [
  { value: "todos", label: "Todos" },
  { value: "recebido", label: "Recebidos" },
  { value: "em_lavagem", label: "Em Lavagem" },
  { value: "pronto", label: "Prontos" },
  { value: "entregue", label: "Entregues" },
];

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const loadPedidos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
      });
      if (statusFilter !== "todos") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/pedidos?${params}`);
      const data = await res.json();
      setPedidos(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast({ title: "Erro ao carregar pedidos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, toast]);

  useEffect(() => {
    loadPedidos();
  }, [loadPedidos]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  async function handleStatusChange(pedidoId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/pedidos/${pedidoId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast({ title: `Status atualizado para "${newStatus}"` });
        loadPedidos();
      } else {
        toast({ title: "Erro ao atualizar status", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
            <Link href="/pedidos/novo">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-6">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por protocolo ou cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Pedidos Grid */}
          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidos.map((pedido) => (
                  <PedidoCard
                    key={pedido.id}
                    pedido={pedido}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>

              {pedidos.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  {search || statusFilter !== "todos"
                    ? "Nenhum pedido encontrado com os filtros aplicados"
                    : "Nenhum pedido ainda. Crie seu primeiro pedido!"}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-500">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
