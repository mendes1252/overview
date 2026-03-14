"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, X } from "lucide-react";

export interface CustomerOption {
  id: string;
  name: string;
  type: "b2b" | "b2c";
  document?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface Props {
  onSelect: (customer: CustomerOption) => void;
  onCreateNew?: (name: string) => void;
  selectedCustomer?: CustomerOption | null;
  onClear?: () => void;
}

export function CustomerSearch({ onSelect, onCreateNew, selectedCustomer, onClear }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/customers?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      setResults(data.customers ?? []);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (selectedCustomer) {
    return (
      <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
        <div className="flex-1">
          <p className="font-medium text-sm">{selectedCustomer.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className="text-xs">
              {selectedCustomer.type.toUpperCase()}
            </Badge>
            {selectedCustomer.phone && (
              <span className="text-xs text-muted-foreground">{selectedCustomer.phone}</span>
            )}
          </div>
        </div>
        {onClear && (
          <button onClick={onClear} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Buscar por nome, CPF/CNPJ ou telefone..."
          className="pl-9"
        />
      </div>

      {open && (
        <div className="absolute z-50 w-full bg-white border rounded-lg shadow-lg mt-1 overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-sm text-muted-foreground">Buscando...</div>
          )}
          {!loading && results.length > 0 && (
            <ul className="max-h-60 overflow-y-auto">
              {results.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(c);
                      setQuery("");
                      setResults([]);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-accent flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="font-medium">{c.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {c.phone && (
                        <span className="text-muted-foreground text-xs">{c.phone}</span>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {c.type.toUpperCase()}
                      </Badge>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="p-3">
              <p className="text-sm text-muted-foreground mb-2">
                Nenhum cliente encontrado para &ldquo;{query}&rdquo;
              </p>
              {onCreateNew && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onCreateNew(query);
                    setOpen(false);
                  }}
                  className="w-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Cadastrar &ldquo;{query}&rdquo;
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
