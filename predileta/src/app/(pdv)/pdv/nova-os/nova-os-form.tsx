"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerSearch, type CustomerOption } from "@/components/orders/customer-search";
import { ServiceSelector, type OrderItemInput, type ServiceOption } from "@/components/orders/service-selector";
import { PrintSlip } from "@/components/orders/print-slip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, UserPlus } from "lucide-react";

interface Props {
  services: ServiceOption[];
  createdById: string;
  createdByName: string;
}

type Step = "customer" | "services" | "review";

interface CreatedOrder {
  id: string;
  orderNumber: number;
  customer: { name: string; phone?: string | null; document?: string | null };
  items: Array<{ serviceName: string; quantity: number; unit: string; unitPrice: number; total: number }>;
  subtotal: number;
  discount: number;
  total: number;
  estimatedDelivery?: string | null;
  notes?: string | null;
  createdAt: string;
}

export function NovaOsForm({ services: initialServices, createdById, createdByName }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("customer");

  // Customer state
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerType, setNewCustomerType] = useState<"b2b" | "b2c">("b2c");
  const [newCustomerDoc, setNewCustomerDoc] = useState("");

  // Services state
  const [items, setItems] = useState<OrderItemInput[]>([]);
  const [discount, setDiscount] = useState(0);
  const [services, setServices] = useState<ServiceOption[]>(initialServices);

  // Order details
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [notes, setNotes] = useState("");

  // Submit state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);

  const handleSelectCustomer = async (customer: CustomerOption) => {
    setSelectedCustomer(customer);
    setShowNewCustomerForm(false);
    // Reload services with custom pricing for this customer
    const res = await fetch(`/api/services?customerId=${customer.id}`);
    if (res.ok) {
      const data = await res.json();
      setServices(data);
    }
  };

  const handleCreateNewCustomer = async () => {
    if (!newCustomerName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCustomerName,
          phone: newCustomerPhone || undefined,
          type: newCustomerType,
          document: newCustomerDoc || undefined,
        }),
      });
      const customer = await res.json();
      if (!res.ok) throw new Error(customer.error ?? "Erro ao criar cliente");
      await handleSelectCustomer(customer);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          items: items.map((i) => ({
            serviceId: i.serviceId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          discount,
          estimatedDelivery: estimatedDelivery || undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao criar OS");

      setCreatedOrder({
        ...data,
        items: data.items.map((i: { service: { name: string; unit: string }; quantity: number; unitPrice: number; total: number }) => ({
          serviceName: i.service.name,
          unit: i.service.unit,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.total,
        })),
      });
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const total = Math.max(0, subtotal - discount);

  // Success screen
  if (createdOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle2 className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold">OS #{createdOrder.orderNumber} criada!</h2>
            <p className="text-muted-foreground text-sm">
              {createdOrder.customer.name} · {formatCurrency(createdOrder.total)}
            </p>
          </div>
        </div>

        <PrintSlip
          order={{
            ...createdOrder,
            estimatedDelivery: createdOrder.estimatedDelivery,
            createdAt: createdOrder.createdAt,
            createdByName,
          }}
        />

        <div className="flex gap-3 no-print">
          <Button variant="outline" onClick={() => router.push("/pdv/producao")}>
            Ver produção
          </Button>
          <Button onClick={() => { setCreatedOrder(null); setStep("customer"); setSelectedCustomer(null); setItems([]); setDiscount(0); setNotes(""); setEstimatedDelivery(""); }}>
            Nova OS
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        {(["customer", "services", "review"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${step === s ? "text-primary font-medium" : s === "customer" && step !== "customer" ? "text-muted-foreground" : step === "review" && s === "services" ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                {i + 1}
              </div>
              {s === "customer" ? "Cliente" : s === "services" ? "Serviços" : "Revisão"}
            </div>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step: Customer */}
      {step === "customer" && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Selecionar Cliente</h2>

          {!showNewCustomerForm ? (
            <>
              <CustomerSearch
                onSelect={handleSelectCustomer}
                onCreateNew={(name) => { setNewCustomerName(name); setShowNewCustomerForm(true); }}
                selectedCustomer={selectedCustomer}
                onClear={() => setSelectedCustomer(null)}
              />

              {selectedCustomer && (
                <Button onClick={() => setStep("services")} className="w-full">
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </>
          ) : (
            <div className="space-y-4 border rounded-xl p-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Novo Cliente</h3>
                <button onClick={() => setShowNewCustomerForm(false)} className="ml-auto text-muted-foreground hover:text-foreground text-sm">
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Nome completo / Razão social *</Label>
                  <Input value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Telefone / WhatsApp</Label>
                  <Input value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value)} placeholder="(11) 99999-9999" className="mt-1" />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <select
                    value={newCustomerType}
                    onChange={(e) => setNewCustomerType(e.target.value as "b2b" | "b2c")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  >
                    <option value="b2c">Pessoa física (B2C)</option>
                    <option value="b2b">Empresa (B2B)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label>CPF / CNPJ (opcional)</Label>
                  <Input value={newCustomerDoc} onChange={(e) => setNewCustomerDoc(e.target.value)} className="mt-1" />
                </div>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button onClick={handleCreateNewCustomer} disabled={loading || !newCustomerName.trim()} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cadastrar e continuar"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step: Services */}
      {step === "services" && selectedCustomer && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Serviços</h2>
            <p className="text-sm text-muted-foreground">
              Cliente: <strong>{selectedCustomer.name}</strong>
            </p>
          </div>

          <ServiceSelector
            services={services}
            items={items}
            onChange={setItems}
            discount={discount}
            onDiscountChange={setDiscount}
          />

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("customer")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <Button onClick={() => setStep("review")} disabled={items.length === 0} className="flex-1">
              Revisar OS <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Review */}
      {step === "review" && selectedCustomer && (
        <div className="space-y-5">
          <h2 className="font-semibold text-lg">Revisão da OS</h2>

          <div className="border rounded-xl p-4 space-y-3 bg-card">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Cliente</p>
              <p className="font-medium">{selectedCustomer.name}</p>
              {selectedCustomer.phone && <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>}
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Serviços</p>
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-0.5">
                  <span>{item.serviceName} × {item.quantity}</span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 py-0.5">
                  <span>Desconto</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t mt-1 pt-1">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Previsão de entrega</Label>
              <Input
                type="datetime-local"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Manchas, peças especiais, instruções do cliente..."
              rows={3}
              className="mt-1"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("services")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1 h-11">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
              ) : (
                <>Criar OS — {formatCurrency(total)}</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
