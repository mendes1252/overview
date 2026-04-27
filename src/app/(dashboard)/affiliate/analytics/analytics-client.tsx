"use client";

import { useEffect, useState } from "react";
import { AffiliatePlatform } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformBadge } from "@/components/affiliate/platform-badge";
import { MousePointerClick, Smartphone, Monitor } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface AnalyticsData {
  totalClicks: number;
  topProducts: {
    slug: string;
    clickCount: number;
    product: { id: string; name: string; platform: AffiliatePlatform; imageUrl: string | null };
  }[];
  clicksByDay: { date: string; count: number }[];
  devices: { device: string; count: number }[];
}

const DEVICE_ICON: Record<string, React.ReactNode> = {
  mobile: <Smartphone className="h-4 w-4" />,
  desktop: <Monitor className="h-4 w-4" />,
  tablet: <Smartphone className="h-4 w-4" />,
};

export function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/affiliate/analytics?days=${days}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [days]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-white/60 mt-1">Performance dos seus links de afiliado</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                days === d
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Carregando...</div>
      ) : !data ? null : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MousePointerClick className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{data.totalClicks.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-muted-foreground">Cliques ({days}d)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {data.devices.map((d) => (
              <Card key={d.device}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {DEVICE_ICON[d.device] ?? <MousePointerClick className="h-8 w-8" />}
                    <div>
                      <p className="text-2xl font-bold">{d.count.toLocaleString("pt-BR")}</p>
                      <p className="text-xs text-muted-foreground capitalize">{d.device}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cliques por dia</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.clicksByDay}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#888" }}
                    tickFormatter={(v: string) => v.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#888" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#1e1e2e", border: "1px solid #333", borderRadius: 8 }}
                    labelStyle={{ color: "#ccc" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#colorClicks)"
                    name="Cliques"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum clique registrado ainda.
                  </p>
                )}
                {data.topProducts.map((item, i) => (
                  <div key={item.slug} className="flex items-center gap-3">
                    <span className="w-5 text-sm text-muted-foreground font-mono">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <PlatformBadge platform={item.product.platform} />
                    </div>
                    <span className="text-sm font-bold tabular-nums">
                      {item.clickCount.toLocaleString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
