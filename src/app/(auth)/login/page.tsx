"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast({
        title: "Erro ao entrar",
        description: "E-mail ou senha incorretos.",
      });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleMagicLink = async () => {
    const email = getValues("email");
    if (!email) {
      toast({ title: "Informe seu e-mail para continuar." });
      return;
    }

    setMagicLinkLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setMagicLinkLoading(false);

    if (error) {
      toast({ title: "Erro", description: error.message });
      return;
    }

    setMagicLinkSent(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1E3A5F] mb-1">
        Entrar no Steddi
      </h2>
      <p className="text-[#6E6E63] text-sm mb-7">
        Bem-vindo de volta. Acesse sua conta.
      </p>

      {magicLinkSent ? (
        <div className="bg-[#F0F3F9] border border-[#B8C6DE] rounded-lg p-4 text-sm text-[#1E3A5F]">
          <p className="font-semibold mb-1">Link enviado!</p>
          <p>Verifique seu e-mail e clique no link para entrar.</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#3D3D36] font-medium">
                  Senha
                </Label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-[#A07D2E] hover:underline font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
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
              className="w-full bg-[#1E3A5F] hover:bg-[#1A3254] text-white font-semibold h-10"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#D6D6CD]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[#8E8E83]">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={magicLinkLoading}
            onClick={handleMagicLink}
            className="w-full border-[#D6D6CD] text-[#1E3A5F] font-medium h-10 hover:bg-[#F5F5F2]"
          >
            {magicLinkLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Entrar com link mágico"
            )}
          </Button>
        </>
      )}

      <p className="text-center text-[#6E6E63] text-sm mt-6">
        Não tem uma conta?{" "}
        <Link
          href="/cadastro"
          className="text-[#A07D2E] hover:underline font-semibold"
        >
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  );
}
