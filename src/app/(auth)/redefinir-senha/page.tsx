"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Lock, CheckCircle, AlertTriangle } from "lucide-react";

const resetSchema = z
  .object({
    password: z.string().min(6, "Senha deve ter no minimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas nao coincidem",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  // No token or email — invalid link
  if (!token || !email) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-medium text-[#1A1A2E] mb-2">Link invalido</h2>
        <p className="text-[#718096] font-light mb-6">
          Este link de recuperacao e invalido ou esta incompleto.
          Solicite um novo link.
        </p>
        <Link href="/recuperar-senha">
          <Button className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl">
            Solicitar novo link
          </Button>
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-[#4A9FFF]" />
        </div>
        <h2 className="text-2xl font-medium text-[#1A1A2E] mb-2">Senha redefinida</h2>
        <p className="text-[#718096] font-light mb-6">
          Sua senha foi alterada com sucesso. Voce ja pode fazer login com a nova senha.
        </p>
        <Link href="/login">
          <Button className="bg-[#4A9FFF] hover:bg-[#6BB5FF] text-white rounded-xl gap-2">
            Ir para o login
          </Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Erro",
          description: result.error || "Nao foi possivel redefinir a senha",
          variant: "destructive",
        });
        return;
      }

      setIsSuccess(true);
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <Lock className="w-6 h-6 text-[#4A9FFF]" />
      </div>

      <h2 className="text-2xl font-medium text-[#1A1A2E] mb-2">Nova senha</h2>
      <p className="text-[#718096] font-light mb-8">
        Defina uma nova senha para sua conta.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimo 6 caracteres"
            {...register("password")}
            className="mt-1 rounded-xl"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repita a nova senha"
            {...register("confirmPassword")}
            className="mt-1 rounded-xl"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
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
              Redefinindo...
            </>
          ) : (
            "Redefinir senha"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9FFF]" />
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  );
}
