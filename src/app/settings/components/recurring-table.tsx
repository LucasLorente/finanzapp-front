"use client";

import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import { useCurrency } from "@/context/CurrencyContext";
import { toRecurringPayload, updateRecurring } from "@/services/api.recurring";
import { ExpenseCategory, ExpenseType, RecurringTransaction } from "@/types";

interface RecurringTableProps {
  rows: RecurringTransaction[];
  categories: ExpenseCategory[];
  types: ExpenseType[];
  onEdit: (row: RecurringTransaction) => void;
  onDelete: (row: RecurringTransaction) => void;
}

const tableCellHeadSx = {
  color: "#94a3b8",
  fontWeight: 700,
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "transparent",
};

const tableCellSx = {
  color: "#cbd5e1",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const iconButtonSx = {
  color: "#64748b",
  "&:hover": { color: "#6290C8", backgroundColor: "rgba(98,144,200,0.1)" },
};

const deleteIconButtonSx = {
  color: "#64748b",
  "&:hover": { color: "#f87171", backgroundColor: "rgba(248,113,113,0.1)" },
};

export default function RecurringTable({ rows, categories, types, onEdit, onDelete }: RecurringTableProps) {
  const { formatAmount } = useCurrency();
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const isExpense = rows[0]?.kind === "expense";

  const getRefLabel = (row: RecurringTransaction) => {
    const type = types.find((t) => t.id === row.type_id)?.name;
    const category = categories.find((c) => c.id === row.category_id)?.name;
    return [type, category].filter(Boolean).join(" · ");
  };

  const handleToggleActive = async (row: RecurringTransaction) => {
    setTogglingId(row.id);
    try {
      await updateRecurring(row.id, { ...toRecurringPayload(row), active: !row.active });
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar:", error);
      setTogglingId(null);
    }
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={tableCellHeadSx}>Descripción</TableCell>
          <TableCell sx={tableCellHeadSx} align="center">Día</TableCell>
          {isExpense && <TableCell sx={tableCellHeadSx}>Tipo · Categoría</TableCell>}
          <TableCell sx={tableCellHeadSx} align="right">Monto</TableCell>
          <TableCell sx={tableCellHeadSx} align="center">Activo</TableCell>
          <TableCell sx={{ ...tableCellHeadSx, width: 100 }} align="right">
            Acciones
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            sx={{ "&:last-child td": { border: 0 }, opacity: row.active ? 1 : 0.5 }}
          >
            <TableCell sx={tableCellSx}>{row.description}</TableCell>
            <TableCell sx={tableCellSx} align="center">{row.day_of_month}</TableCell>
            {isExpense && <TableCell sx={{ ...tableCellSx, color: "#94a3b8" }}>{getRefLabel(row)}</TableCell>}
            <TableCell sx={{ ...tableCellSx, fontVariantNumeric: "tabular-nums" }} align="right">
              {formatAmount(row.amount)}
            </TableCell>
            <TableCell sx={tableCellSx} align="center">
              <Tooltip title={row.active ? "Pausar" : "Reactivar"}>
                <Switch
                  size="small"
                  checked={row.active}
                  disabled={togglingId === row.id}
                  onChange={() => handleToggleActive(row)}
                />
              </Tooltip>
            </TableCell>
            <TableCell sx={{ ...tableCellSx, whiteSpace: "nowrap" }} align="right">
              <IconButton size="small" sx={iconButtonSx} onClick={() => onEdit(row)} aria-label="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </IconButton>
              <IconButton size="small" sx={deleteIconButtonSx} onClick={() => onDelete(row)} aria-label="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
