"use client";

import { arsToUsd } from "@/utils/currency";
import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "ARS" | "USD";

interface CurrencyContextValue {
  currency: Currency;
  toggleCurrency: () => void;
  dolarRate: number;
  formatAmount: (n: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  children,
  dolarRate,
}: {
  children: React.ReactNode;
  dolarRate: number;
}) {
  const [currency, setCurrency] = useState<Currency>("ARS");

  useEffect(() => {
    const stored = localStorage.getItem("currency");
    if (stored === "ARS" || stored === "USD") setCurrency(stored);
  }, []);

  const toggleCurrency = () => {
    setCurrency((prev) => {
      const next = prev === "ARS" ? "USD" : "ARS";
      localStorage.setItem("currency", next);
      return next;
    });
  };

  const formatAmount = (n: number): string => {
    if (currency === "USD") {
      const usd = arsToUsd(n, dolarRate);
      return `US$${Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usd)}`;
    }
    return `$${Intl.NumberFormat("es-AR").format(n)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, toggleCurrency, dolarRate, formatAmount }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
