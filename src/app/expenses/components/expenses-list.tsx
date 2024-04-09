"use client";

import { Expense } from "@/types";
import {
  Container,
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

const ExpensesList = ({
  expenses,
  total,
  weekly,
  monthly,
}: {
  expenses: Expense[];
  total: number;
  weekly: number;
  monthly: number;
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  function handleChangeRowsPerPage(event: any) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  return (
    <Container className="flex flex-col items-center justify-between">
      <Typography variant="h1" gutterBottom>
        Lista de Gastos
      </Typography>
      <TableContainer
        component={Paper}
        className="secondary-color text-red-500 p-3"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-white text-xl font-bold">
                Fecha
              </TableCell>
              <TableCell className="text-white text-xl font-bold">
                Nombre
              </TableCell>
              <TableCell className="text-white text-xl font-bold">
                Monto
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell className="text-white text-lg">
                    {dayjs(expense.date).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="text-white text-lg">
                    {expense.description}
                  </TableCell>
                  <TableCell className="text-white text-lg">
                    ${expense.amount}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-white text-lg font-bold">
                Semanal: ${weekly || 0}
              </TableCell>
              <TableCell className="text-white text-lg font-bold">
                Mensual: ${monthly || 0}
              </TableCell>
              <TableCell className="text-white text-lg font-bold">
                Total: ${total || 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
          className="text-white"
          component="div"
          count={expenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default ExpensesList;
