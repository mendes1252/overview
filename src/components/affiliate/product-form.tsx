"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AffiliatePlatform } from "@prisma/client";

export interface ProductFormData {
  name: string;
  description: string;
  imageUrl: string;
  affiliateUrl: string;
  price: string;
  category: string;
  platform: AffiliatePlatform;
}

interface ProductFormProps {
  initial?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const DEFAULT_CATEGORIES = [
  "Eletrônicos", "Moda", "Casa", "Beleza", "Esportes",
  "Livros", "Games", "Infantil", "Pets", "Outros",
];

export function ProductForm({ initial, onSubmit, onCancel, submitLabel = "Salvar" }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    affiliateUrl: initial?.affiliateUrl ?? "",
    price: initial?.price ?? "",
    category: initial?.category ?? "",
    platform: initial?.platform ?? "OTHER",
  });
  const [loading, setLoading] = useState(false);

  const set = (field: keyof ProductFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome do produto *</Label>
        <Input id="name" value={form.name} onChange={set("name")} required placeholder="Ex: Fone de Ouvido JBL" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="affiliateUrl">Link de afiliado *</Label>
        <Input
          id="affiliateUrl"
          value={form.affiliateUrl}
          onChange={set("affiliateUrl")}
          required
          placeholder="https://amzn.to/..."
          type="url"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Plataforma</Label>
          <Select
            value={form.platform}
            onValueChange={(v) => setForm((prev) => ({ ...prev, platform: v as AffiliatePlatform }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AMAZON">Amazon</SelectItem>
              <SelectItem value="SHOPEE">Shopee</SelectItem>
              <SelectItem value="MERCADO_LIVRE">Mercado Livre</SelectItem>
              <SelectItem value="OTHER">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Categoria</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm((prev) => ({ ...prev, category: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            value={form.price}
            onChange={set("price")}
            placeholder="199.90"
            type="number"
            step="0.01"
            min="0"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="imageUrl">URL da imagem</Label>
          <Input
            id="imageUrl"
            value={form.imageUrl}
            onChange={set("imageUrl")}
            placeholder="https://..."
            type="url"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={set("description")}
          placeholder="Breve descrição do produto..."
          rows={2}
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
