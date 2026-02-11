"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { formatPhone } from "@/lib/utils";
import type { Cliente } from "@/types";

interface ClienteSearchProps {
  onSelect: (cliente: Cliente) => void;
  selectedCliente?: Cliente | null;
  onClear?: () => void;
}

export function ClienteSearch({ onSelect, selectedCliente, onClear }: ClienteSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Cliente[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/clientes?search=${encodeURIComponent(query)}&pageSize=10`);
        const data = await res.json();
        setResults(data.data || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (selectedCliente) {
    return (
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div>
          <p className="font-medium text-blue-900">{selectedCliente.nome}</p>
          <p className="text-sm text-blue-700">{formatPhone(selectedCliente.telefone)}</p>
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Alterar
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        type="text"
        placeholder="Buscar por nome, telefone ou CPF..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      )}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((cliente) => (
            <button
              key={cliente.id}
              type="button"
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
              onClick={() => {
                onSelect(cliente);
                setQuery("");
                setIsOpen(false);
              }}
            >
              <p className="font-medium text-sm">{cliente.nome}</p>
              <p className="text-xs text-gray-500">
                {formatPhone(cliente.telefone)}
                {cliente.email && ` | ${cliente.email}`}
              </p>
            </button>
          ))}
        </div>
      )}
      {isOpen && results.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
          Nenhum cliente encontrado
        </div>
      )}
    </div>
  );
}
