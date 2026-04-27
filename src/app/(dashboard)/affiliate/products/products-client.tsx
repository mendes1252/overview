"use client";

import { useEffect, useState } from "react";
import { AffiliatePlatform } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ProductForm, ProductFormData } from "@/components/affiliate/product-form";
import { PlatformBadge } from "@/components/affiliate/platform-badge";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
function buildTrackUrl(slug: string) { return `${APP_URL}/r/${slug}`; }
import { Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  affiliateUrl: string;
  price: number | null;
  category: string | null;
  platform: AffiliatePlatform;
  active: boolean;
  order: number;
  links: { slug: string; clickCount: number }[];
}

export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  async function load() {
    const res = await fetch("/api/affiliate/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createProduct(data: ProductFormData) {
    const res = await fetch("/api/affiliate/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { setShowCreate(false); load(); }
  }

  async function updateProduct(id: string, data: object) {
    const res = await fetch(`/api/affiliate/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { setEditing(null); load(); }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await fetch(`/api/affiliate/products/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(product: Product) {
    await fetch(`/api/affiliate/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-sm text-white/60 mt-1">{products.length} produtos cadastrados</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Adicionar produto
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Carregando...</div>
      ) : products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center space-y-3">
            <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Adicionar primeiro produto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className={product.active ? "" : "opacity-60"}>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-3">
                  {product.imageUrl ? (
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-2xl">
                      🛍️
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm leading-tight truncate">{product.name}</p>
                    {product.price != null && (
                      <p className="text-sm font-bold mt-0.5">
                        {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1">
                      <PlatformBadge platform={product.platform} />
                      {product.category && (
                        <span className="text-xs text-muted-foreground">{product.category}</span>
                      )}
                    </div>
                  </div>
                </div>

                {product.links[0] && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {product.links[0].clickCount.toLocaleString("pt-BR")} cliques
                    </span>
                    <a
                      href={buildTrackUrl(product.links[0].slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditing(product)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleActive(product)}>
                    {product.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => deleteProduct(product.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo produto</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={createProduct}
            onCancel={() => setShowCreate(false)}
            submitLabel="Criar produto"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProductForm
              initial={{
                name: editing.name,
                description: editing.description ?? "",
                imageUrl: editing.imageUrl ?? "",
                affiliateUrl: editing.affiliateUrl,
                price: editing.price?.toString() ?? "",
                category: editing.category ?? "",
                platform: editing.platform,
              }}
              onSubmit={(data) => updateProduct(editing.id, data)}
              onCancel={() => setEditing(null)}
              submitLabel="Salvar alterações"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
