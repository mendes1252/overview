"use client";

interface CategoryFilterProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function CategoryFilter({ options, value, onChange, label }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {label && <span className="text-xs text-muted-foreground self-center mr-1">{label}</span>}
      {["Todos", ...options].map((opt) => {
        const isActive = opt === "Todos" ? value === "" : value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt === "Todos" ? "" : opt)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
