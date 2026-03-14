"use client";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { Copy, CheckCircle2, Loader2 } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: number;
  totalDue: number;
  customerName: string;
  customerEmail?: string | null;
  customerDocument?: string | null;
  onSuccess: () => void;
}

export function PaymentModal({
  open,
  onClose,
  orderId,
  orderNumber,
  totalDue,
  customerName,
  customerEmail,
  customerDocument,
  onSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [pixResult, setPixResult] = useState<{ qrCode: string; qrCodeBase64: string } | null>(null);
  const [cashAmount, setCashAmount] = useState(totalDue.toFixed(2));
  const [payerEmail, setPayerEmail] = useState(customerEmail ?? "");
  const [payerDoc, setPayerDoc] = useState(customerDocument ?? "");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCashPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount: parseFloat(cashAmount) }),
      });
      if (!res.ok) throw new Error("Falha no pagamento");
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handlePixPayment = async () => {
    if (!payerEmail) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          method: "pix",
          amount: totalDue,
          payerEmail,
          payerName: customerName,
          payerDocument: payerDoc || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha ao gerar Pix");
      setPixResult(data.mpResult);
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (pixResult?.qrCode) {
      navigator.clipboard.writeText(pixResult.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center py-6 gap-3">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="font-semibold text-lg">Pagamento registrado!</p>
            <p className="text-muted-foreground text-sm">OS #{orderNumber}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento — OS #{orderNumber}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            {customerName} · Valor: <strong>{formatCurrency(totalDue)}</strong>
          </p>
        </DialogHeader>

        <Tabs defaultValue="cash">
          <TabsList className="w-full">
            <TabsTrigger value="cash" className="flex-1">Dinheiro</TabsTrigger>
            <TabsTrigger value="pix" className="flex-1">Pix</TabsTrigger>
            <TabsTrigger value="boleto" className="flex-1">Boleto</TabsTrigger>
          </TabsList>

          {/* Cash */}
          <TabsContent value="cash" className="space-y-4 pt-2">
            <div>
              <Label>Valor recebido (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleCashPayment} disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar pagamento em dinheiro"}
            </Button>
          </TabsContent>

          {/* Pix */}
          <TabsContent value="pix" className="space-y-4 pt-2">
            {!pixResult ? (
              <>
                <div>
                  <Label>E-mail do pagador *</Label>
                  <Input
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>CPF (opcional)</Label>
                  <Input
                    value={payerDoc}
                    onChange={(e) => setPayerDoc(e.target.value)}
                    placeholder="000.000.000-00"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handlePixPayment} disabled={loading || !payerEmail} className="w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Gerar Pix — ${formatCurrency(totalDue)}`}
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-center font-medium">Escaneie o QR code ou copie o código</p>
                {pixResult.qrCodeBase64 && (
                  <img
                    src={`data:image/png;base64,${pixResult.qrCodeBase64}`}
                    alt="QR Code Pix"
                    className="w-48 h-48 mx-auto rounded-lg border"
                  />
                )}
                <Button variant="outline" onClick={copyPixCode} className="w-full gap-2">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copiado!" : "Copiar código Pix"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  O pagamento será confirmado automaticamente via webhook.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Boleto */}
          <TabsContent value="boleto" className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Para gerar boleto via Mercado Pago é necessário CPF do cliente.
            </p>
            <div>
              <Label>E-mail *</Label>
              <Input type="email" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>CPF *</Label>
              <Input value={payerDoc} onChange={(e) => setPayerDoc(e.target.value)} placeholder="000.000.000-00" className="mt-1" />
            </div>
            <Button
              disabled={loading || !payerEmail || !payerDoc}
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await fetch("/api/payments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      orderId, method: "boleto", amount: totalDue,
                      payerEmail, payerName: customerName, payerDocument: payerDoc,
                      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error);
                  if (data.mpResult?.boletoUrl) window.open(data.mpResult.boletoUrl, "_blank");
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gerar boleto"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
