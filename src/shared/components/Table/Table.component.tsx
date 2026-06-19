"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { Expense, ExpenseCategory, ExpenseType } from "@/types";
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import "./Table.component.scss";

interface TransactionTableProps {
  title: string;
  data: Expense[];
  type: "income" | "expense";
  total: number;
  categories?: ExpenseCategory[];
  types?: ExpenseType[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  title,
  data,
  type,
  total,
  categories,
  types,
}) => {
  const { formatAmount } = useCurrency();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const getCategoryName = (id: number) =>
    categories?.find((c) => c.id === id)?.name;

  const getTypeName = (id: number) =>
    types?.find((t) => t.id === id)?.name;

  const isIncome = type === "income";
  const amountClass = isIncome ? "income-amount" : "expense-amount";
  const colCount = isIncome ? 3 : 5;

  return (
    <div className="w-full animate-fade-in-up">
      <TableContainer component={Paper} className="transaction-container" elevation={0}>
        <div className="table-header">
          <div>
            <h2 className="table-title">{title}</h2>
            <p className="table-subtitle">{data.length} registros</p>
          </div>
        </div>

        <Table className="transaction-table w-full">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Descripción</TableCell>
              {!isIncome && <TableCell>Tipo</TableCell>}
              {!isIncome && <TableCell>Categoría</TableCell>}
              <TableCell align="right">Monto</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="date-cell">
                    {dayjs(item.date).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="description-cell">
                    {item.description || <span className="text-slate-500 italic">Sin descripción</span>}
                  </TableCell>
                  {!isIncome && (
                    <TableCell>
                      {item.type_id && (
                        <Chip label={getTypeName(item.type_id)} size="small" className="type-chip" />
                      )}
                    </TableCell>
                  )}
                  {!isIncome && (
                    <TableCell>
                      {item.category_id && (
                        <Chip label={getCategoryName(item.category_id)} size="small" className="category-chip" />
                      )}
                    </TableCell>
                  )}
                  <TableCell align="right" className={amountClass}>
                    {formatAmount(item.amount)}
                  </TableCell>
                </TableRow>
              ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={colCount} align="center">
                  <div className="empty-state">
                    <p className="empty-title">No hay registros aún</p>
                    <p className="empty-subtitle">Añade tu primer registro usando el botón de abajo</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={colCount}>
                <div className="summary-bar">
                  <div className="summary-item summary-total">
                    <span className="summary-label">Total acumulado</span>
                    <span className={`summary-value ${amountClass}`}>{formatAmount(total || 0)}</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          className="transaction-pagination"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>
    </div>
  );
};

export default TransactionTable;
