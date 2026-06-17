"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentModal } from "@/components/payments/payment-modal";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote } from "lucide-react";

interface Props {
  orderId: string;
  orderNumber: number;
  customerName: string;
  customerPhone?: string | null;
  remaining: number;
  total: number;
  customerEmail?: string | null;
  customerDocument?: string | null;
}

export function CaixaPaymentActions({
  orderId,
  orderNumber,
  customerName,
  customerPhone,
  remaining,
  total,
  customerEmail,
  customerDocument,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingCash, setLoadingCash] = useState(false);

  const handleCashPayment = async () => {
    setLoadingCash(true);
    try {
      const res = await fetch("/api/payments/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount: remaining }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoadingCash(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCashPayment}
        disabled={loadingCash}
      >
        <Banknote className="w-4 h-4 mr-1.5" />
        {loadingCash ? "Registrando..." : "Dinheiro"}
      </Button>

      <Button size="sm" onClick={() => setOpen(true)}>
        <CreditCard className="w-4 h-4 mr-1.5" />
        Pix / Cartão / Boleto
      </Button>

      <PaymentModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          router.refresh();
        }}
        orderId={orderId}
        orderNumber={orderNumber}
        customerName={customerName}
        customerEmail={customerEmail}
        customerDocument={customerDocument}
        totalDue={remaining}
      />
    </div>
  );
}
