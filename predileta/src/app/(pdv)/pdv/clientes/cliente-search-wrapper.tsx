"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentQ?: string;
  currentType?: string;
}

export function ClienteSearchWrapper({ currentQ, currentType }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateSearch = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/pdv/clientes?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          defaultValue={currentQ}
          placeholder="Buscar por nome, documento ou telefone..."
          className="pl-9"
          onChange={(e) => {
            const val = e.target.value;
            const timeout = setTimeout(() => {
              updateSearch({ q: val || undefined });
            }, 400);
            return () => clearTimeout(timeout);
          }}
        />
      </div>

      <div className="flex gap-2">
        {(
          [
            { value: undefined, label: "Todos", Icon: Users },
            { value: "b2c", label: "Pessoa física", Icon: User },
            { value: "b2b", label: "Empresa", Icon: Building2 },
          ] as const
        ).map(({ value, label, Icon }) => (
          <Button
            key={label}
            variant={currentType === value ? "default" : "outline"}
            size="sm"
            className={cn(isPending && "opacity-60")}
            onClick={() => updateSearch({ type: value })}
          >
            <Icon className="w-4 h-4 mr-1.5" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
