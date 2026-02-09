"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CreditCard,
  QrCode,
  FileText,
  CheckCircle,
  Copy,
  Shield,
} from "lucide-react";

type BillingType = "PIX" | "CREDIT_CARD" | "BOLETO";

interface CheckoutFormProps {
  plan: "pro" | "enterprise";
  planName: string;
  price: number;
  offerPrice?: number;
  campaignSlug?: string;
}

export function CheckoutForm({
  plan,
  planName,
  price,
  offerPrice,
}: CheckoutFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [billingType, setBillingType] = useState<BillingType>("PIX");
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCodeImage: string;
    copyPaste: string;
    paymentId: string;
  } | null>(null);
  const [boletoData, setBoletoData] = useState<{
    boletoUrl: string;
    invoiceUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [pollingPayment, setPollingPayment] = useState(false);

  // Credit card fields
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [holderEmail, setHolderEmail] = useState("");
  const [holderPhone, setHolderPhone] = useState("");
  const [holderPostalCode, setHolderPostalCode] = useState("");
  const [holderAddressNumber, setHolderAddressNumber] = useState("");

  const finalPrice = offerPrice ?? price;
  const discount = offerPrice ? Math.round(((price - offerPrice) / price) * 100) : 0;

  const handleCopyPix = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      toast({ title: "Codigo Pix copiado!" });
    }
  };

  const pollPaymentStatus = async (paymentId: string) => {
    setPollingPayment(true);
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes (every 5s)

    const check = async () => {
      try {
        const res = await fetch(
          `/api/payments/status?paymentId=${paymentId}`
        );
        const data = await res.json();
        if (data.confirmed) {
          setPollingPayment(false);
          toast({ title: "Pagamento confirmado!" });
          router.push("/dashboard");
          return;
        }
      } catch {
        // ignore polling errors
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(check, 5000);
      } else {
        setPollingPayment(false);
      }
    };
    check();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const body: Record<string, unknown> = {
        plan,
        billingType,
        cpfCnpj: cpfCnpj || undefined,
      };

      if (billingType === "CREDIT_CARD") {
        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
          toast({
            title: "Preencha todos os dados do cartao",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        const [expiryMonth, expiryYear] = cardExpiry.split("/");
        body.creditCard = {
          holderName: cardName,
          number: cardNumber.replace(/\s/g, ""),
          expiryMonth,
          expiryYear: expiryYear?.length === 2 ? `20${expiryYear}` : expiryYear,
          ccv: cardCvv,
        };
        body.creditCardHolderInfo = {
          name: cardName,
          email: holderEmail,
          cpfCnpj,
          postalCode: holderPostalCode,
          addressNumber: holderAddressNumber,
          phone: holderPhone,
        };
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Erro no checkout",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (billingType === "PIX" && data.pixData) {
        setPixData(data.pixData);
        pollPaymentStatus(data.pixData.paymentId);
      } else if (billingType === "BOLETO" && data.boletoData) {
        setBoletoData(data.boletoData);
      } else if (billingType === "CREDIT_CARD") {
        toast({ title: "Assinatura criada com sucesso!" });
        router.push("/dashboard");
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao processar pagamento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // PIX success view
  if (pixData) {
    return (
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          <QrCode className="w-4 h-4" />
          Pague com Pix
        </div>

        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6">
          <img
            src={`data:image/png;base64,${pixData.qrCodeImage}`}
            alt="QR Code Pix"
            className="mx-auto w-48 h-48 mb-4"
          />
          <p className="text-sm text-gray-600 mb-3">
            Escaneie o QR Code ou copie o codigo abaixo:
          </p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
            <code className="text-xs flex-1 truncate text-gray-700">
              {pixData.copyPaste}
            </code>
            <Button size="sm" variant="outline" onClick={handleCopyPix}>
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {pollingPayment && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Aguardando confirmacao do pagamento...
          </div>
        )}

        <p className="text-xs text-gray-500">
          O pagamento sera confirmado automaticamente em ate 30 segundos apos
          o Pix ser realizado.
        </p>
      </div>
    );
  }

  // Boleto success view
  if (boletoData) {
    return (
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          <FileText className="w-4 h-4" />
          Boleto Gerado
        </div>
        <p className="text-gray-600">
          Seu boleto foi gerado com sucesso. Clique abaixo para visualizar e pagar.
        </p>
        <div className="space-y-3">
          {boletoData.boletoUrl && (
            <a href={boletoData.boletoUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full">Ver Boleto</Button>
            </a>
          )}
          {boletoData.invoiceUrl && (
            <a href={boletoData.invoiceUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                Ver Fatura Completa
              </Button>
            </a>
          )}
        </div>
        <p className="text-xs text-gray-500">
          O boleto vence em 3 dias uteis. Apos o pagamento, seu plano sera
          ativado em ate 2 dias uteis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">Plano {planName}</h3>
            <p className="text-sm text-gray-600">Cobranca mensal</p>
          </div>
          <div className="text-right">
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                R${price.toFixed(2)}
              </span>
            )}
            <div className="text-2xl font-bold text-gray-900">
              R${finalPrice.toFixed(2)}
              <span className="text-sm font-normal text-gray-600">/mes</span>
            </div>
            {discount > 0 && (
              <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                -{discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Forma de pagamento
        </Label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setBillingType("PIX")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              billingType === "PIX"
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <QrCode
              className={`w-6 h-6 ${
                billingType === "PIX" ? "text-primary" : "text-gray-500"
              }`}
            />
            <span className="text-sm font-medium">Pix</span>
            <span className="text-xs text-green-600">Aprovacao instantanea</span>
          </button>

          <button
            type="button"
            onClick={() => setBillingType("CREDIT_CARD")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              billingType === "CREDIT_CARD"
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <CreditCard
              className={`w-6 h-6 ${
                billingType === "CREDIT_CARD"
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            />
            <span className="text-sm font-medium">Cartao</span>
            <span className="text-xs text-gray-500">Credito</span>
          </button>

          <button
            type="button"
            onClick={() => setBillingType("BOLETO")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              billingType === "BOLETO"
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FileText
              className={`w-6 h-6 ${
                billingType === "BOLETO" ? "text-primary" : "text-gray-500"
              }`}
            />
            <span className="text-sm font-medium">Boleto</span>
            <span className="text-xs text-gray-500">3 dias uteis</span>
          </button>
        </div>
      </div>

      {/* CPF/CNPJ - always required */}
      <div>
        <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
        <Input
          id="cpfCnpj"
          placeholder="000.000.000-00"
          value={cpfCnpj}
          onChange={(e) => setCpfCnpj(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Credit Card Fields */}
      {billingType === "CREDIT_CARD" && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <Label htmlFor="cardNumber">Numero do cartao</Label>
            <Input
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cardName">Nome no cartao</Label>
            <Input
              id="cardName"
              placeholder="Nome como impresso no cartao"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cardExpiry">Validade</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/AA"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cardCvv">CVV</Label>
              <Input
                id="cardCvv"
                placeholder="123"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                className="mt-1"
                maxLength={4}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="holderEmail">Email</Label>
            <Input
              id="holderEmail"
              type="email"
              placeholder="seu@email.com"
              value={holderEmail}
              onChange={(e) => setHolderEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="holderPhone">Telefone</Label>
            <Input
              id="holderPhone"
              placeholder="(11) 99999-9999"
              value={holderPhone}
              onChange={(e) => setHolderPhone(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="holderPostalCode">CEP</Label>
              <Input
                id="holderPostalCode"
                placeholder="00000-000"
                value={holderPostalCode}
                onChange={(e) => setHolderPostalCode(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="holderAddressNumber">Numero</Label>
              <Input
                id="holderAddressNumber"
                placeholder="123"
                value={holderAddressNumber}
                onChange={(e) => setHolderAddressNumber(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          `Assinar por R$${finalPrice.toFixed(2)}/mes`
        )}
      </Button>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Pagamento seguro
        </div>
        <div>Processado por Asaas</div>
        <div>Cancele quando quiser</div>
      </div>
    </div>
  );
}
