"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Email invalido"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function RecuperarSenhaPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar email");
      }

      setEmailSent(true);
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel processar sua solicitacao. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-[#4A9FFF]" />
        </div>
        <h2 className="text-2xl font-medium text-[#1A1A2E] mb-2">Email enviado</h2>
        <p className="text-[#718096] font-light mb-6">
          Se o email <strong className="font-medium text-[#1A1A2E]">{getValues("email")}</strong> estiver
          cadastrado, voce recebera um link para redefinir sua senha. Verifique tambem a pasta de spam.
        </p>
        <p className="text-sm text-[#718096] font-light mb-8">
          O link expira em 1 hora.
        </p>
        <Link href="/login">
          <Button variant="outline" className="gap-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-[#718096] hover:text-[#1A1A2E] text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao login
      </Link>

      <div className="w-12 h-12 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mb-6">
        <Mail className="w-6 h-6 text-[#4A9FFF]" />
      </div>

      <h2 className="text-2xl font-medium text-[#1A1A2E] mb-2">Recuperar senha</h2>
      <p className="text-[#718096] font-light mb-8">
        Informe seu email e enviaremos um link para redefinir sua senha.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register("email")}
            className="mt-1 rounded-xl"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl h-11 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar link de recuperacao"
          )}
        </Button>
      </form>
    </div>
  );
}
