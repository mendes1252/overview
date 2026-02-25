"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, UserPlus } from "lucide-react";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter no minimo 2 caracteres"),
    email: z.string().email("Email invalido"),
    password: z.string().min(6, "Senha deve ter no minimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas nao conferem",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Erro ao criar conta",
          description: result.error || "Tente novamente",
          variant: "destructive",
        });
        return;
      }

      // Auto login after registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          title: "Conta criada!",
          description: "Faca login para continuar",
        });
        router.push("/login");
      } else {
        router.push("/onboarding");
        router.refresh();
      }
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar sua conta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/onboarding" });
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao entrar com Google",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div>
      <div className="w-12 h-12 rounded-2xl bg-[#4A9FFF]/10 flex items-center justify-center mb-6">
        <UserPlus className="w-6 h-6 text-[#4A9FFF]" />
      </div>

      <h2 className="text-2xl font-medium text-[#1A1A2E] mb-2">Crie sua conta</h2>
      <p className="text-[#718096] font-light mb-6">
        Comece sua jornada de produtividade hoje
      </p>

      {plan === "pro" && (
        <div className="bg-[#4A9FFF]/5 border border-[#4A9FFF]/15 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-[#4A9FFF] font-medium mb-1">
            <CheckCircle className="w-5 h-5" />
            Plano Pro selecionado
          </div>
          <p className="text-sm text-[#718096] font-light">
            Apos criar sua conta, voce sera direcionado para o pagamento.
          </p>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full mb-6 rounded-xl h-11 border-black/[0.08] hover:bg-[#F5F7FA] transition-colors"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Continuar com Google
      </Button>

      <div className="relative mb-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-[#718096] font-light">
          ou
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-[#1A1A2E]">Nome completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome"
            {...register("name")}
            className="mt-1 rounded-xl"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-[#1A1A2E]">Email</Label>
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

        <div>
          <Label htmlFor="password" className="text-[#1A1A2E]">Senha</Label>
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
          <Label htmlFor="confirmPassword" className="text-[#1A1A2E]">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repita a senha"
            {...register("confirmPassword")}
            className="mt-1 rounded-xl"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
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
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>

      <p className="text-center text-[#718096] mt-6 font-light">
        Ja tem uma conta?{" "}
        <Link href="/login" className="text-[#4A9FFF] hover:text-[#6BB5FF] hover:underline font-medium transition-colors">
          Entrar
        </Link>
      </p>

      <p className="text-center text-xs text-[#718096]/70 mt-4 font-light">
        Ao criar uma conta, voce concorda com nossos{" "}
        <Link href="/termos" className="text-[#4A9FFF] hover:underline">
          Termos de Uso
        </Link>{" "}
        e{" "}
        <Link href="/privacidade" className="text-[#4A9FFF] hover:underline">
          Politica de Privacidade
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
