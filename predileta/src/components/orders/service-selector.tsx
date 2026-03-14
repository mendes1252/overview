"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

export interface ServiceOption {
  id: string;
  name: string;
  category: string;
  unit: "piece" | "kg" | "m2";
  resolvedPrice: number;
  priceB2c: number;
  priceB2bDefault: number;
  hasCustomPrice?: boolean;
}

export interface OrderItemInput {
  serviceId: string;
  serviceName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Props {
  services: ServiceOption[];
  items: OrderItemInput[];
  onChange: (items: OrderItemInput[]) => void;
  discount: number;
  onDiscountChange: (discount: number) => void;
}

export function ServiceSelector({ services, items, onChange, discount, onDiscountChange }: Props) {
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const unitLabel = (unit: string) => {
    if (unit === "kg") return "kg";
    if (unit === "m2") return "m²";
    return "pç";
  };

  const addItem = () => {
    if (!selectedServiceId) return;
    const service = services.find((s) => s.id === selectedServiceId);
    if (!service) return;

    // If already in list, just increment quantity
    const existing = items.findIndex((i) => i.serviceId === selectedServiceId);
    if (existing >= 0) {
      const updated = [...items];
      updated[existing].quantity += 1;
      updated[existing].total = updated[existing].quantity * updated[existing].unitPrice;
      onChange(updated);
    } else {
      onChange([
        ...items,
        {
          serviceId: service.id,
          serviceName: service.name,
          unit: service.unit,
          quantity: 1,
          unitPrice: service.resolvedPrice,
          total: service.resolvedPrice,
        },
      ]);
    }
    setSelectedServiceId("");
  };

  const updateItem = (index: number, field: "quantity" | "unitPrice", value: number) => {
    const updated = [...items];
    updated[index][field] = value;
    updated[index].total = updated[index].quantity * updated[index].unitPrice;
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const total = Math.max(0, subtotal - discount);

  // Group services by category
  const grouped = services.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, ServiceOption[]>);

  return (
    <div className="space-y-4">
      {/* Add service row */}
      <div className="flex gap-2">
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Selecionar serviço...</option>
          {Object.entries(grouped).map(([cat, svcs]) => (
            <optgroup key={cat} label={cat}>
              {svcs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {formatCurrency(s.resolvedPrice)}/{unitLabel(s.unit)}
                  {s.hasCustomPrice ? " ★" : ""}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <Button type="button" onClick={addItem} disabled={!selectedServiceId} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Items table */}
      {items.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Serviço</th>
                <th className="text-center p-3 font-medium w-24">Qtd</th>
                <th className="text-right p-3 font-medium w-28">Preço unit.</th>
                <th className="text-right p-3 font-medium w-24">Total</th>
                <th className="w-10 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{item.serviceName}</p>
                      <p className="text-xs text-muted-foreground">{unitLabel(item.unit)}</p>
                    </div>
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min="0.1"
                      step={item.unit === "kg" ? "0.1" : "1"}
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", parseFloat(e.target.value) || 0)}
                      className="text-center h-8 text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(i, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="text-right h-8 text-sm"
                    />
                  </td>
                  <td className="p-3 text-right font-medium">{formatCurrency(item.total)}</td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="bg-muted/30 border-t p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm gap-4">
              <span className="text-muted-foreground">Desconto (R$)</span>
              <Input
                type="number"
                min="0"
                step="0.50"
                value={discount}
                onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
                className="w-28 h-7 text-right text-sm"
              />
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg">
          Nenhum serviço adicionado. Use o seletor acima para adicionar.
        </div>
      )}
    </div>
  );
}
