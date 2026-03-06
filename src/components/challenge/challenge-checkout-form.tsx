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

interface ChallengeCheckoutFormProps {
  price: number;
  challengeTitle: string;
}

export function ChallengeCheckoutForm({
  price,
  challengeTitle,
}: ChallengeCheckoutFormProps) {
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

  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [holderEmail, setHolderEmail] = useState("");
  const [holderPhone, setHolderPhone] = useState("");
  const [holderPostalCode, setHolderPostalCode] = useState("");
  const [holderAddressNumber, setHolderAddressNumber] = useState("");

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
    const maxAttempts = 60;

    const check = async () => {
      try {
        const res = await fetch(`/api/payments/status?paymentId=${paymentId}`);
        const data = await res.json();
        if (data.confirmed) {
          setPollingPayment(false);
          toast({ title: "Pagamento confirmado!" });
          router.push("/desafio/area-de-membros");
          return;
        }
      } catch {
        // ignore
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
          expiryYear:
            expiryYear?.length === 2 ? `20${expiryYear}` : expiryYear,
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

      const res = await fetch("/api/challenge/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.redirectTo) {
          router.push(data.redirectTo);
          return;
        }
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
        toast({ title: "Inscricao confirmada!" });
        router.push("/desafio/area-de-membros");
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

  // PIX success
  if (pixData) {
    return (
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
          <QrCode className="w-4 h-4" />
          Pague com Pix
        </div>
        <div className="bg-white/[0.05] border-2 border-dashed border-white/20 rounded-xl p-6">
          <div className="bg-white rounded-lg p-2 inline-block mb-4">
            <img
              src={`data:image/png;base64,${pixData.qrCodeImage}`}
              alt="QR Code Pix"
              className="w-48 h-48"
            />
          </div>
          <p className="text-sm text-white/60 mb-3">
            Escaneie o QR Code ou copie o codigo abaixo:
          </p>
          <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg p-3">
            <code className="text-xs flex-1 truncate text-white/70">
              {pixData.copyPaste}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyPix}
              className="border-white/20 hover:bg-white/10"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </Button>
          </div>
        </div>
        {pollingPayment && (
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <Loader2 className="w-4 h-4 animate-spin" />
            Aguardando confirmacao do pagamento...
          </div>
        )}
      </div>
    );
  }

  // Boleto success
  if (boletoData) {
    return (
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 bg-[#4A9FFF]/10 text-[#4A9FFF] px-4 py-2 rounded-full text-sm font-medium">
          <FileText className="w-4 h-4" />
          Boleto Gerado
        </div>
        <p className="text-white/60">
          Seu boleto foi gerado. Clique abaixo para visualizar e pagar.
        </p>
        <div className="space-y-3">
          {boletoData.boletoUrl && (
            <a
              href={boletoData.boletoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full">Ver Boleto</Button>
            </a>
          )}
          {boletoData.invoiceUrl && (
            <a
              href={boletoData.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 text-white"
              >
                Ver Fatura Completa
              </Button>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-[#4A9FFF]/5 border border-[#4A9FFF]/15 rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-white">{challengeTitle}</h3>
            <p className="text-sm text-white/50 font-light">
              Acesso imediato — pagamento unico
            </p>
          </div>
          <div className="text-2xl font-medium text-white">
            R${price.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div>
        <Label className="text-sm font-medium mb-3 block text-white">
          Forma de pagamento
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { type: "PIX" as const, icon: QrCode, label: "Pix", sub: "Aprovacao instantanea", subColor: "text-emerald-400" },
              { type: "CREDIT_CARD" as const, icon: CreditCard, label: "Cartao", sub: "Credito", subColor: "text-white/50" },
              { type: "BOLETO" as const, icon: FileText, label: "Boleto", sub: "3 dias uteis", subColor: "text-white/50" },
            ] as const
          ).map(({ type, icon: Icon, label, sub, subColor }) => (
            <button
              key={type}
              type="button"
              onClick={() => setBillingType(type)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                billingType === type
                  ? "border-primary bg-primary/5"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  billingType === type ? "text-primary" : "text-white/50"
                }`}
              />
              <span className="text-sm font-medium text-white">{label}</span>
              <span className={`text-xs ${subColor}`}>{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CPF */}
      <div>
        <Label htmlFor="cpfCnpj" className="text-white">
          CPF ou CNPJ
        </Label>
        <Input
          id="cpfCnpj"
          placeholder="000.000.000-00"
          value={cpfCnpj}
          onChange={(e) => setCpfCnpj(e.target.value)}
          className="mt-1 bg-white/[0.05] border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      {/* Credit card fields */}
      {billingType === "CREDIT_CARD" && (
        <div className="space-y-4 p-4 bg-white/[0.05] rounded-xl border border-white/10">
          <div>
            <Label htmlFor="cardNumber" className="text-white">Numero do cartao</Label>
            <Input id="cardNumber" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="mt-1 bg-white/[0.05] border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div>
            <Label htmlFor="cardName" className="text-white">Nome no cartao</Label>
            <Input id="cardName" placeholder="Nome como impresso" value={cardName} onChange={(e) => setCardName(e.target.value)} className="mt-1 bg-white/[0.05] border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cardExpiry" className="text-white">Validade</Label>
              <Input id="cardExpiry" placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="mt-1 bg-white/[0.05] border-white/10 text-white placeholder:text-white/30" />
            </div>
            <div>
              <Label htmlFor="cardCvv" className="text-white">CVV</Label>
              <Input id="cardCvv" placeholder="123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="mt-1 bg-white/[0.05] border-white/10 text-white placeholder:text-white/30" maxLength={4} />
            </div>
          </div>
          <div>
            <Label htmlFor="holderEmail" className="text-white">Email</Label>
            <Input id="holderEmail" type="email" placeholder="seu@email.com" value={holderEmail} onChange={(e) => setHolderEmail(e.target.value)} className="mt-1 bg-white/[0.05] border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div>
            <Label htmlFor="holderPhone" className="text-white">Telefone</Label>
            <Input id="holderPhone" placeholder="(11) 99999-9999" value={holderPhone} onChange={(e) => setHolderPhone(e.target.value)} className="mt-1 bg-white/[0.05] border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="holderPostalCode" className="text-white">CEP</Label>
              <Input id="holderPostalCode" placeholder="00000-000" value={holderPostalCode} onChange={(e) => setHolderPostalCode(e.target.value)} className="mt-1 bg-white/[0.05] border-white/10 text-white placeholder:text-white/30" />
            </div>
            <div>
              <Label htmlFor="holderAddressNumber" className="text-white">Numero</Label>
              <Input id="holderAddressNumber" placeholder="123" value={holderAddressNumber} onChange={(e) => setHolderAddressNumber(e.target.value)} className="mt-1 bg-white/[0.05] border-white/10 text-white placeholder:text-white/30" />
            </div>
          </div>
        </div>
      )}

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
          `Garantir acesso por R$${price.toFixed(2)}`
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-white/40">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Pagamento seguro
        </div>
        <div>Garantia de 7 dias</div>
      </div>
    </div>
  );
}
