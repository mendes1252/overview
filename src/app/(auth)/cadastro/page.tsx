"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

const signupSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function CadastroPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      toast({ title: "Erro ao criar conta", description: error.message });
      return;
    }

    setEmailSent(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1E3A5F] mb-1">
        Criar conta grátis
      </h2>
      <p className="text-[#6E6E63] text-sm mb-7">
        7 dias de acesso Pro completo. Sem cartão de crédito.
      </p>

      {emailSent ? (
        <div className="bg-[#F0F3F9] border border-[#B8C6DE] rounded-lg p-4 text-sm text-[#1E3A5F]">
          <p className="font-semibold mb-1">Verifique seu e-mail!</p>
          <p>
            Enviamos um link de confirmação para você. Clique nele para ativar
            sua conta.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#3D3D36] font-medium">
              Seu nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="João Silva"
              {...register("name")}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-xs text-[#1E3A5F] mt-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-[#3D3D36] font-medium">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-xs text-[#1E3A5F] mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-[#3D3D36] font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register("password")}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-xs text-[#1E3A5F] mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A07D2E] hover:bg-[#886A27] text-white font-semibold h-10"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Criar conta grátis"
            )}
          </Button>
        </form>
      )}

      <p className="text-center text-[#6E6E63] text-sm mt-6">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="text-[#A07D2E] hover:underline font-semibold"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
