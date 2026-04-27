"use client";

import { useState } from "react";
import { AffiliateStorefront } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Check } from "lucide-react";

interface Props {
  initial: AffiliateStorefront | null;
}

export function StorefrontSettings({ initial }: Props) {
  const [form, setForm] = useState({
    username: initial?.username ?? "",
    title: initial?.title ?? "",
    bio: initial?.bio ?? "",
    avatarUrl: initial?.avatarUrl ?? "",
    themeColor: initial?.themeColor ?? "#6366f1",
    customDomain: initial?.customDomain ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const bioUrl = form.username
    ? `${process.env.NEXT_PUBLIC_APP_URL}/bio/${form.username}`
    : null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/affiliate/storefront", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erro ao salvar"); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurar Vitrine</h1>
        <p className="text-sm text-white/60 mt-1">Personalize como sua vitrine aparece para os visitantes</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="username"
                  value={form.username}
                  onChange={set("username")}
                  required
                  placeholder="seunome"
                  pattern="[a-zA-Z0-9_-]+"
                  title="Apenas letras, números, _ e -"
                />
                {bioUrl && (
                  <a href={bioUrl} target="_blank" rel="noopener noreferrer">
                    <Button type="button" size="icon" variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
              {bioUrl && (
                <p className="text-xs text-muted-foreground">
                  Vitrine: <span className="font-mono">{bioUrl}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title">Nome exibido</Label>
              <Input id="title" value={form.title} onChange={set("title")} placeholder="Maria Influencer" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={set("bio")}
                placeholder="As melhores ofertas para você ✨"
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl">URL do avatar</Label>
              <Input id="avatarUrl" value={form.avatarUrl} onChange={set("avatarUrl")} placeholder="https://..." type="url" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="themeColor">Cor do tema</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="themeColor"
                  value={form.themeColor}
                  onChange={set("themeColor")}
                  className="h-9 w-14 cursor-pointer rounded border"
                />
                <Input
                  value={form.themeColor}
                  onChange={set("themeColor")}
                  className="w-32 font-mono"
                  placeholder="#6366f1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Domínio customizado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="customDomain">Domínio (opcional)</Label>
              <Input
                id="customDomain"
                value={form.customDomain}
                onChange={set("customDomain")}
                placeholder="links.seunome.com.br"
              />
            </div>
            {form.customDomain && (
              <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                <p className="font-medium">Como configurar:</p>
                <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                  <li>No seu provedor DNS, adicione um registro CNAME:</li>
                  <li className="list-none ml-2">
                    <code className="text-xs bg-background px-2 py-0.5 rounded">
                      {form.customDomain} → cname.vercel-dns.com
                    </code>
                  </li>
                  <li>No Vercel, adicione o domínio ao projeto</li>
                  <li>Aguarde até 24h para propagação</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={saving} className="w-full">
          {saved ? (
            <><Check className="h-4 w-4 mr-1.5" /> Salvo!</>
          ) : saving ? (
            "Salvando..."
          ) : (
            "Salvar configurações"
          )}
        </Button>
      </form>
    </div>
  );
}
