"use client";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface SlipItem {
  serviceName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface PrintSlipProps {
  order: {
    orderNumber: number;
    customer: { name: string; phone?: string | null; document?: string | null };
    items: SlipItem[];
    subtotal: number;
    discount: number;
    total: number;
    estimatedDelivery?: Date | string | null;
    notes?: string | null;
    createdAt: Date | string;
    createdByName: string;
  };
}

const unitLabel = (unit: string) => {
  if (unit === "kg") return "kg";
  if (unit === "m2") return "m²";
  return "pç";
};

export function PrintSlip({ order }: PrintSlipProps) {
  const handlePrint = () => window.print();

  return (
    <>
      {/* Print trigger button — hidden during print */}
      <Button
        type="button"
        variant="outline"
        onClick={handlePrint}
        className="no-print gap-2"
      >
        <Printer className="w-4 h-4" />
        Imprimir comanda
      </Button>

      {/* Slip — hidden on screen, visible on print */}
      <div className="print-slip hidden print:block">
        <div className="slip-logo">PREDILETA LAVANDERIA</div>
        <div className="text-center text-xs">Sua roupa em boas mãos</div>
        <div className="slip-divider" />

        <p className="text-center font-bold text-sm">OS #{order.orderNumber}</p>
        <p className="text-xs">Data: {formatDateTime(order.createdAt)}</p>
        <p className="text-xs">Atendente: {order.createdByName}</p>

        <div className="slip-divider" />
        <p className="text-xs font-bold">Cliente:</p>
        <p className="text-xs">{order.customer.name}</p>
        {order.customer.phone && <p className="text-xs">Tel: {order.customer.phone}</p>}
        {order.customer.document && <p className="text-xs">CPF/CNPJ: {order.customer.document}</p>}

        <div className="slip-divider" />
        <p className="text-xs font-bold mb-1">Serviços:</p>
        {order.items.map((item, i) => (
          <div key={i} className="text-xs mb-0.5">
            <div className="slip-row">
              <span className="flex-1">{item.serviceName}</span>
              <span>{formatCurrency(item.total)}</span>
            </div>
            <span className="text-xs opacity-70 pl-2">
              {item.quantity} {unitLabel(item.unit)} × {formatCurrency(item.unitPrice)}
            </span>
          </div>
        ))}

        <div className="slip-divider" />
        <div className="slip-row text-xs">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="slip-row text-xs">
            <span>Desconto</span>
            <span>- {formatCurrency(order.discount)}</span>
          </div>
        )}
        <div className="slip-row font-bold text-sm mt-1">
          <span>TOTAL</span>
          <span>{formatCurrency(order.total)}</span>
        </div>

        {order.estimatedDelivery && (
          <>
            <div className="slip-divider" />
            <p className="text-xs font-bold">Previsão de entrega:</p>
            <p className="text-xs">{formatDateTime(order.estimatedDelivery)}</p>
          </>
        )}

        {order.notes && (
          <>
            <div className="slip-divider" />
            <p className="text-xs font-bold">Obs:</p>
            <p className="text-xs">{order.notes}</p>
          </>
        )}

        <div className="slip-divider" />
        <p className="text-center text-xs">Obrigado pela preferência! ♥</p>
        <p className="text-center text-xs opacity-70">Predileta Lavanderia</p>
      </div>
    </>
  );
}
