"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { Investment, InvestmentCategory, InvestmentType } from "@/types";
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
import "@/shared/components/Table/Table.component.scss";

interface InvestmentsTableProps {
  data: Investment[];
  total: number;
  categories: InvestmentCategory[];
  types: InvestmentType[];
}

const InvestmentsTable: React.FC<InvestmentsTableProps> = ({ data, total, categories, types }) => {
  const { formatAmount } = useCurrency();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name;
  const getTypeName = (id: number) => types.find((t) => t.id === id)?.name;

  const colCount = 8;

  return (
    <div className="w-full animate-fade-in-up">
      <TableContainer component={Paper} className="transaction-container" elevation={0}>
        <div className="table-header">
          <div>
            <h2 className="table-title">Lista de Inversiones</h2>
            <p className="table-subtitle">{data.length} registros</p>
          </div>
        </div>

        <Table className="transaction-table w-full">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Ticker</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Monto Invertido</TableCell>
              <TableCell align="right">Valor Actual</TableCell>
              <TableCell align="right">Ganancia/Pérdida</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => {
                const pnl = item.current_value - item.amount_invested;
                const pnlClass = pnl >= 0 ? "income-amount" : "expense-amount";
                return (
                  <TableRow key={item.id}>
                    <TableCell className="date-cell">
                      {dayjs(item.date).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className="description-cell">
                      {item.description || <span className="text-slate-500 italic">Sin descripción</span>}
                    </TableCell>
                    <TableCell>
                      {item.ticker ? (
                        <Chip label={item.ticker} size="small" className="type-chip" />
                      ) : (
                        <span className="text-slate-500 italic">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.type_id && (
                        <Chip label={getTypeName(item.type_id)} size="small" className="type-chip" />
                      )}
                    </TableCell>
                    <TableCell>
                      {item.category_id && (
                        <Chip label={getCategoryName(item.category_id)} size="small" className="category-chip" />
                      )}
                    </TableCell>
                    <TableCell align="right" className="expense-amount">
                      {formatAmount(item.amount_invested)}
                    </TableCell>
                    <TableCell align="right" className="income-amount">
                      {formatAmount(item.current_value)}
                    </TableCell>
                    <TableCell align="right" className={pnlClass}>
                      {pnl >= 0 ? "+" : ""}{formatAmount(pnl)}
                    </TableCell>
                  </TableRow>
                );
              })}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={colCount} align="center">
                  <div className="empty-state">
                    <p className="empty-title">No hay registros aún</p>
                    <p className="empty-subtitle">Añade tu primera inversión usando el botón de abajo</p>
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
                    <span className="summary-label">Valor total actual</span>
                    <span className="summary-value income-amount">{formatAmount(total || 0)}</span>
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

export default InvestmentsTable;
