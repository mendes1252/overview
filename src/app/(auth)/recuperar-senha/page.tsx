"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
});

type FormData = z.infer<typeof schema>;

export default function RecuperarSenhaPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    setLoading(false);

    if (error) {
      toast({ title: "Erro", description: error.message });
      return;
    }

    setSent(true);
  };

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-[#6E6E63] hover:text-[#1E3A5F] mb-6 transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Voltar
      </Link>

      <h2 className="text-2xl font-bold text-[#1E3A5F] mb-1">
        Recuperar senha
      </h2>
      <p className="text-[#6E6E63] text-sm mb-7">
        Informe seu e-mail e enviaremos um link para redefinir sua senha.
      </p>

      {sent ? (
        <div className="bg-[#F0F3F9] border border-[#B8C6DE] rounded-lg p-4 text-sm text-[#1E3A5F]">
          <p className="font-semibold mb-1">E-mail enviado!</p>
          <p>Verifique sua caixa de entrada e clique no link de recuperação.</p>
        </div>
      ) : (
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A5F] hover:bg-[#1A3254] text-white font-semibold h-10"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Enviar link de recuperação"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
