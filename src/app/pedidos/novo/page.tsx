"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { ClienteSearch } from "@/components/ClienteSearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Plus, X, Check } from "lucide-react";
import { TIPOS_SERVICO, FORMAS_PAGAMENTO } from "@/lib/validations";
import { addBusinessDays, formatCurrency } from "@/lib/utils";
import type { Cliente, PedidoItem } from "@/types";

interface ItemForm {
  descricao: string;
  tipoServico: string;
  quantidade: number;
  precoUnitario: number;
  cor: string;
  defeitos: string;
}

const emptyItem: ItemForm = {
  descricao: "",
  tipoServico: "Lavagem",
  quantidade: 1,
  precoUnitario: 0,
  cor: "",
  defeitos: "",
};

export default function NovoPedidoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 - Cliente
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showNewClienteForm, setShowNewClienteForm] = useState(false);
  const [newClienteData, setNewClienteData] = useState({ nome: "", telefone: "", email: "" });

  // Step 2 - Items
  const [itens, setItens] = useState<ItemForm[]>([{ ...emptyItem }]);

  // Step 3 - Finalize
  const [desconto, setDesconto] = useState(0);
  const [observacoes, setObservacoes] = useState("");
  const [dataPrevisao, setDataPrevisao] = useState(
    addBusinessDays(new Date(), 2).toISOString().split("T")[0]
  );
  const [formaPagamento, setFormaPagamento] = useState("");

  const valorTotal = itens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );
  const valorFinal = valorTotal - desconto;

  function updateItem(index: number, field: keyof ItemForm, value: string | number) {
    setItens((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addItem() {
    setItens((prev) => [...prev, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    if (itens.length <= 1) return;
    setItens((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreateNewCliente() {
    if (!newClienteData.nome || !newClienteData.telefone) {
      toast({ title: "Nome e telefone são obrigatórios", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClienteData),
      });

      const result = await res.json();
      if (res.ok) {
        setSelectedCliente(result.data);
        setShowNewClienteForm(false);
        toast({ title: "Cliente cadastrado!" });
      } else {
        toast({ title: result.error || "Erro ao cadastrar", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro ao cadastrar cliente", variant: "destructive" });
    }
  }

  async function handleSubmit() {
    if (!selectedCliente) return;

    const invalidItems = itens.some((item) => !item.descricao || item.precoUnitario <= 0);
    if (invalidItems) {
      toast({
        title: "Preencha a descrição e preço de todos os itens",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const pedidoData = {
        clienteId: selectedCliente.id,
        itens: itens.map((item) => ({
          descricao: item.descricao,
          tipoServico: item.tipoServico,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          cor: item.cor || null,
          defeitos: item.defeitos || null,
        })) as PedidoItem[],
        desconto,
        observacoes,
        dataPrevisaoEntrega: dataPrevisao,
        formaPagamento: formaPagamento || undefined,
      };

      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoData),
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: `Pedido ${result.data.protocolo} criado com sucesso!`,
        });
        router.push("/pedidos");
      } else {
        toast({
          title: result.error || "Erro ao criar pedido",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Erro ao criar pedido", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/pedidos">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Pedido</h1>
              <p className="text-sm text-gray-500">Passo {step} de 3</p>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s === step
                      ? "bg-blue-600 text-white"
                      : s < step
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s < step ? <Check className="h-4 w-4" /> : s}
                </div>
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {s === 1 ? "Cliente" : s === 2 ? "Peças" : "Finalizar"}
                </span>
                {s < 3 && <div className="w-8 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </div>

          {/* Step 1 - Select Client */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold">Selecionar Cliente</h2>

              <ClienteSearch
                onSelect={setSelectedCliente}
                selectedCliente={selectedCliente}
                onClear={() => setSelectedCliente(null)}
              />

              {!selectedCliente && (
                <div className="pt-2">
                  {!showNewClienteForm ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowNewClienteForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Novo Cliente
                    </Button>
                  ) : (
                    <div className="border rounded-lg p-4 space-y-3">
                      <h3 className="font-medium">Cadastro Rápido</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label>Nome *</Label>
                          <Input
                            value={newClienteData.nome}
                            onChange={(e) =>
                              setNewClienteData((prev) => ({ ...prev, nome: e.target.value }))
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Telefone *</Label>
                          <Input
                            value={newClienteData.telefone}
                            onChange={(e) =>
                              setNewClienteData((prev) => ({
                                ...prev,
                                telefone: e.target.value,
                              }))
                            }
                            placeholder="(11) 99999-9999"
                            className="mt-1"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={newClienteData.email}
                            onChange={(e) =>
                              setNewClienteData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateNewCliente} size="sm">
                          Cadastrar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewClienteForm(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedCliente}
                >
                  Próximo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 - Add Items */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold">Adicionar Peças</h2>

              {itens.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 relative"
                >
                  {itens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <Label>Descrição *</Label>
                      <Input
                        placeholder="Ex: Camisa Social Branca"
                        value={item.descricao}
                        onChange={(e) =>
                          updateItem(index, "descricao", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Tipo de Serviço</Label>
                      <Select
                        value={item.tipoServico}
                        onValueChange={(v) => updateItem(index, "tipoServico", v)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_SERVICO.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Qtd</Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantidade}
                          onChange={(e) =>
                            updateItem(index, "quantidade", parseInt(e.target.value) || 1)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Preço Unit.</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.precoUnitario}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "precoUnitario",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Cor</Label>
                      <Input
                        placeholder="Ex: Branca"
                        value={item.cor}
                        onChange={(e) =>
                          updateItem(index, "cor", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Defeitos/Observações</Label>
                      <Input
                        placeholder="Ex: Mancha na gola"
                        value={item.defeitos}
                        onChange={(e) =>
                          updateItem(index, "defeitos", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-500">
                    Subtotal: {formatCurrency(item.precoUnitario * item.quantidade)}
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Peça
              </Button>

              <div className="text-right text-lg font-bold pt-2">
                Total: {formatCurrency(valorTotal)}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={itens.some((i) => !i.descricao || i.precoUnitario <= 0)}
                >
                  Próximo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 - Finalize */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold">Finalizar Pedido</h2>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">Cliente:</span>{" "}
                  {selectedCliente?.nome}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">Itens:</span>{" "}
                  {itens.length} peça(s)
                </p>
                {itens.map((item, i) => (
                  <p key={i} className="text-xs text-gray-400 pl-4">
                    - {item.descricao} ({item.tipoServico}) x{item.quantidade} ={" "}
                    {formatCurrency(item.precoUnitario * item.quantidade)}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Desconto (R$)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={desconto}
                    onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Data de Previsão de Entrega</Label>
                  <Input
                    type="date"
                    value={dataPrevisao}
                    onChange={(e) => setDataPrevisao(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Forma de Pagamento</Label>
                  <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMAS_PAGAMENTO.map((forma) => (
                        <SelectItem key={forma} value={forma}>
                          {forma}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Observações</Label>
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Total */}
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-600">Valor Final</p>
                <p className="text-3xl font-bold text-blue-800">
                  {formatCurrency(valorFinal)}
                </p>
                {desconto > 0 && (
                  <p className="text-xs text-blue-500">
                    Subtotal: {formatCurrency(valorTotal)} - Desconto:{" "}
                    {formatCurrency(desconto)}
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Criando..." : "Finalizar Pedido"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
