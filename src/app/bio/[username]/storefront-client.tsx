"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { AffiliatePlatform } from "@prisma/client";
import { StorefrontCard } from "@/components/affiliate/storefront-card";
import { CategoryFilter } from "@/components/affiliate/category-filter";

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  category: string | null;
  platform: AffiliatePlatform;
  trackUrl: string | null;
}

interface Storefront {
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  themeColor: string;
}

interface Props {
  storefront: Storefront;
  products: Product[];
}

const PLATFORM_LABELS: Record<AffiliatePlatform, string> = {
  AMAZON: "Amazon",
  SHOPEE: "Shopee",
  MERCADO_LIVRE: "Mercado Livre",
  OTHER: "Outros",
};

export function StorefrontClient({ storefront, products }: Props) {
  const [platformFilter, setPlatformFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))] as string[],
    [products]
  );

  const platforms = useMemo(
    () =>
      ([...new Set(products.map((p) => p.platform))] as AffiliatePlatform[]).map(
        (p) => PLATFORM_LABELS[p]
      ),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (platformFilter && PLATFORM_LABELS[p.platform] !== platformFilter) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      return true;
    });
  }, [products, platformFilter, categoryFilter]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="w-full py-8 px-4 text-center"
        style={{ background: `linear-gradient(135deg, ${storefront.themeColor}22, ${storefront.themeColor}11)` }}
      >
        {storefront.avatarUrl && (
          <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md relative">
            <Image
              src={storefront.avatarUrl}
              alt={storefront.title ?? ""}
              fill
              className="object-cover"
            />
          </div>
        )}
        {storefront.title && (
          <h1 className="text-xl font-bold">{storefront.title}</h1>
        )}
        {storefront.bio && (
          <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">{storefront.bio}</p>
        )}
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3 space-y-2">
        {platforms.length > 1 && (
          <CategoryFilter
            options={platforms}
            value={platformFilter}
            onChange={setPlatformFilter}
          />
        )}
        {categories.length > 0 && (
          <CategoryFilter
            options={categories}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        )}
      </div>

      {/* Product Grid */}
      <div className="px-4 py-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            Nenhum produto encontrado para este filtro.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <StorefrontCard
                key={product.id}
                name={product.name}
                imageUrl={product.imageUrl}
                price={product.price}
                category={product.category}
                platform={product.platform}
                trackUrl={product.trackUrl}
                themeColor={storefront.themeColor}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground pb-6">
        Links de afiliado — ao comprar, você apoia este criador.
      </p>
    </main>
  );
}
