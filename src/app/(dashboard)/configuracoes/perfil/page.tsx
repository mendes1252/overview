"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, User } from "lucide-react";

interface Profile {
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  _count: {
    tasks: number;
    habits: number;
    goals: number;
  };
}

export default function PerfilPage() {
  const { data: session, status, update } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setName(data.name || "");
        })
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  const handleSave = async () => {
    if (name.length < 2) {
      toast({
        title: "Nome muito curto",
        description: "O nome deve ter pelo menos 2 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error();

      // Update the session with new name
      await update({ name });

      toast({
        title: "Perfil atualizado",
        description: "Seu nome foi atualizado com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials =
    (profile?.name || "U")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const createdDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <div className="flex items-center gap-3 mb-8">
        <User className="w-7 h-7 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
      </div>

      {/* Avatar and info */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.image || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{profile?.name}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Membro desde {createdDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{profile?._count.tasks || 0}</p>
            <p className="text-xs text-gray-500">Tarefas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{profile?._count.habits || 0}</p>
            <p className="text-xs text-gray-500">Habitos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{profile?._count.goals || 0}</p>
            <p className="text-xs text-gray-500">Metas</p>
          </div>
        </div>
      </div>

      {/* Edit name */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar perfil</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email || ""}
              disabled
              className="mt-2 bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-1">O email nao pode ser alterado.</p>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2">
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Salvar alteracoes
          </Button>
        </div>
      </div>
    </div>
  );
}
