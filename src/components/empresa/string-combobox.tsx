"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StringComboboxProps {
  options: readonly string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  emptyLabel?: string;
  onEnter?: () => void;
}

export function StringCombobox({
  options,
  value,
  onValueChange,
  placeholder,
  emptyLabel = "Nenhuma sugestão encontrada.",
  onEnter,
}: StringComboboxProps) {
  const [focused, setFocused] = useState(false);

  const filteredOptions = useMemo(() => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return options.slice(0, 10);
    }

    return options
      .filter((option) => option.toLowerCase().includes(normalized))
      .slice(0, 10);
  }, [options, value]);

  function handleSelect(option: string) {
    onValueChange(option);
  }

  const showSuggestions = focused && (value.trim().length > 0 || filteredOptions.length > 0);

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && onEnter) {
            event.preventDefault();
            onEnter();
          }
        }}
        placeholder={placeholder}
      />

      {showSuggestions ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 rounded-xl border border-border bg-popover p-2 shadow-md">
          {filteredOptions.length === 0 ? (
            <p className="px-2 py-1 text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {filteredOptions.map((option) => {
                const selected = option === value;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      selected ? "bg-primary/10 text-foreground" : "hover:bg-muted"
                    )}
                  >
                    <span>{option}</span>
                    {selected ? <Check className="h-4 w-4 text-primary" /> : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
