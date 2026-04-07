"use client";

import { Expense } from "@/types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import "./Table.component.scss";

interface TransactionTableProps {
  title: string;
  data: Expense[];
  type: "income" | "expense";
  weekly: number;
  monthly: number;
  total: number;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  title,
  data,
  type,
  weekly,
  monthly,
  total,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isIncome = type === "income";
  const amountClass = isIncome ? "income-amount" : "expense-amount";

  return (
    <div className="w-full max-w-5xl mx-auto my-6 animate-fade-in-up">
      <Typography variant="h1" gutterBottom className="transaction-title text-center sm:text-left">
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        className="transaction-container"
        elevation={0}
      >
        <Table className="transaction-table w-full">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {dayjs(item.date).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right" className={amountClass}>
                    ${item.amount}
                  </TableCell>
                </TableRow>
              ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" className="py-8 !text-gray-300">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>
                Semanal: <span className={amountClass}>${weekly || 0}</span>
              </TableCell>
              <TableCell>
                Mensual: <span className={amountClass}>${monthly || 0}</span>
              </TableCell>
              <TableCell align="right">
                Total: <span className={amountClass}>${total || 0}</span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          className="transaction-pagination"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
        />
      </TableContainer>
    </div>
  );
};

export default TransactionTable;
