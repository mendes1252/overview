"use client";

import Link from "next/link";
import { AffiliateStorefront } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Package, MousePointerClick, Settings, BarChart2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  storefront: AffiliateStorefront | null;
  productCount: number;
  totalClicks: number;
}

export function AffiliateDashboard({ storefront, productCount, totalClicks }: Props) {
  const [copied, setCopied] = useState(false);

  const bioUrl = storefront
    ? `${process.env.NEXT_PUBLIC_APP_URL}/bio/${storefront.username}`
    : null;

  async function copyUrl() {
    if (!bioUrl) return;
    await navigator.clipboard.writeText(bioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Afiliados</h1>
        <p className="text-sm text-white/60 mt-1">
          Gerencie sua vitrine de produtos afiliados
        </p>
      </div>

      {!storefront && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center space-y-3">
            <p className="text-muted-foreground">Você ainda não configurou sua vitrine.</p>
            <Button asChild>
              <Link href="/affiliate/storefront">Configurar vitrine</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {storefront && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Link da vitrine</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-muted px-3 py-2 text-sm font-mono">{bioUrl}</code>
            <Button size="icon" variant="outline" onClick={copyUrl}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="outline" asChild>
              <a href={bioUrl!} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{productCount}</p>
                <p className="text-xs text-muted-foreground">Produtos ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MousePointerClick className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-muted-foreground">Cliques totais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/affiliate/products" className="block">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 space-y-2">
              <Package className="h-6 w-6 text-primary" />
              <p className="font-semibold">Produtos</p>
              <p className="text-sm text-muted-foreground">Adicionar e gerenciar produtos afiliados</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/affiliate/storefront" className="block">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 space-y-2">
              <Settings className="h-6 w-6 text-primary" />
              <p className="font-semibold">Vitrine</p>
              <p className="text-sm text-muted-foreground">Personalizar aparência e domínio</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/affiliate/analytics" className="block">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 space-y-2">
              <BarChart2 className="h-6 w-6 text-primary" />
              <p className="font-semibold">Analytics</p>
              <p className="text-sm text-muted-foreground">Cliques, dispositivos e tendências</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
