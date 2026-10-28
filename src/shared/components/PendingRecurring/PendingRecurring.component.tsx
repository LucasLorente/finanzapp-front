"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { confirmRecurring } from "@/services/api.recurring";
import { RecurringKind, RecurringTransaction } from "@/types";
import { getRecurringDate } from "@/utils/date";
import "./PendingRecurring.component.scss";

interface PendingRecurringProps {
  kind: RecurringKind;
  items: RecurringTransaction[];
  // Any date inside the month being viewed (YYYY-MM-DD)
  monthDate: string;
}

const isValidAmount = (value: string) => /^\d+$/.test(value) && Number(value) > 0;

export default function PendingRecurring({ kind, items, monthDate }: PendingRecurringProps) {
  // Only holds amounts the user edited; the rest fall back to the recurring amount
  const [amounts, setAmounts] = useState<Record<number, string>>({});
  const [confirming, setConfirming] = useState<number | "all" | null>(null);

  if (items.length === 0) return null;

  const isIncome = kind === "income";
  const getAmount = (item: RecurringTransaction) => amounts[item.id] ?? String(Number(item.amount));
  const allValid = items.every((item) => isValidAmount(getAmount(item)));

  const confirm = (item: RecurringTransaction) =>
    confirmRecurring(item.id, Number(getAmount(item)), getRecurringDate(item.day_of_month, monthDate));

  const handleConfirm = async (item: RecurringTransaction) => {
    setConfirming(item.id);
    try {
      await confirm(item);
      window.location.reload();
    } catch (error) {
      console.error("Error al confirmar:", error);
      setConfirming(null);
    }
  };

  const handleConfirmAll = async () => {
    setConfirming("all");
    try {
      for (const item of items) {
        await confirm(item);
      }
    } catch (error) {
      console.error("Error al confirmar:", error);
    }
    window.location.reload();
  };

  return (
    <div className={`pending-recurring animate-fade-in-up ${isIncome ? "pending-recurring--income" : "pending-recurring--expense"}`}>
      <div className="pending-recurring-header">
        <div>
          <h2 className="pending-recurring-title">
            {isIncome ? "Ingresos" : "Gastos"} recurrentes pendientes
          </h2>
          <p className="pending-recurring-subtitle">
            {isIncome
              ? "Confirmá los ingresos de este mes."
              : "Ajustá el monto si cambió y confirmá para registrarlo."}
          </p>
        </div>
        {items.length > 1 && (
          <Button
            variant="outlined"
            color={isIncome ? "success" : "error"}
            disabled={confirming !== null || !allValid}
            onClick={handleConfirmAll}
            sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, whiteSpace: "nowrap" }}
          >
            {confirming === "all" ? "Confirmando..." : `Confirmar todos (${items.length})`}
          </Button>
        )}
      </div>

      <ul className="pending-recurring-list">
        {items.map((item) => {
          const value = getAmount(item);
          return (
            <li key={item.id} className="pending-recurring-row">
              <div className="pending-recurring-info">
                <span className="pending-recurring-description">{item.description}</span>
                <span className="pending-recurring-date">
                  {dayjs(getRecurringDate(item.day_of_month, monthDate)).format("DD/MM")}
                </span>
              </div>
              <TextField
                size="small"
                type="number"
                value={value}
                onChange={(e) => setAmounts((prev) => ({ ...prev, [item.id]: e.target.value }))}
                error={!isValidAmount(value)}
                className="pending-recurring-amount"
                slotProps={{
                  input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                  htmlInput: { min: 1, "aria-label": `Monto de ${item.description}` },
                }}
              />
              <Button
                variant="contained"
                color={isIncome ? "success" : "error"}
                disabled={confirming !== null || !isValidAmount(value)}
                onClick={() => handleConfirm(item)}
                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
              >
                {confirming === item.id ? "..." : "Confirmar"}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
