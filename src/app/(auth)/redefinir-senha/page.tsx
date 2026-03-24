"use client";

import { useState } from "react";
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

const schema = z
  .object({
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    setLoading(false);

    if (error) {
      toast({ title: "Erro ao atualizar senha", description: error.message });
      return;
    }

    toast({ title: "Senha atualizada com sucesso!" });
    router.push("/login");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1E3A5F] mb-1">Nova senha</h2>
      <p className="text-[#6E6E63] text-sm mb-7">
        Escolha uma senha segura para sua conta.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="password" className="text-[#3D3D36] font-medium">
            Nova senha
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

        <div>
          <Label htmlFor="confirm" className="text-[#3D3D36] font-medium">
            Confirmar senha
          </Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Repita a senha"
            {...register("confirm")}
            className="mt-1"
          />
          {errors.confirm && (
            <p className="text-xs text-[#1E3A5F] mt-1 font-medium">
              {errors.confirm.message}
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
            "Salvar nova senha"
          )}
        </Button>
      </form>
    </div>
  );
}
