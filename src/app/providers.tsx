"use client";

import { CurrencyProvider } from "@/context/CurrencyContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
  dolarRate: number;
}

export function Providers({ children, dolarRate }: ProvidersProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CurrencyProvider dolarRate={dolarRate}>
        {children}
      </CurrencyProvider>
    </LocalizationProvider>
  );
}
