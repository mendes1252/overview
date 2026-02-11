"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clienteSchema, type ClienteFormData, CATEGORIAS_CLIENTE } from "@/lib/validations";
import { Sidebar } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NovoClientePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      categoria: "regular",
    },
  });

  async function onSubmit(data: ClienteFormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast({ title: "Cliente cadastrado com sucesso!" });
        router.push("/clientes");
      } else {
        toast({
          title: result.error || "Erro ao cadastrar cliente",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Erro ao cadastrar cliente", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/clientes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input id="nome" {...register("nome")} className="mt-1" />
                {errors.nome && (
                  <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  {...register("telefone")}
                  className="mt-1"
                />
                {errors.telefone && (
                  <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  {...register("cpf")}
                  className="mt-1"
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500 mt-1">{errors.cpf.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="(11) 99999-9999"
                  {...register("whatsapp")}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  {...register("dataNascimento")}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Categoria</Label>
                <Select
                  defaultValue="regular"
                  onValueChange={(value) => setValue("categoria", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS_CLIENTE.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" {...register("endereco")} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                {...register("observacoes")}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Cliente"}
              </Button>
              <Link href="/clientes">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
