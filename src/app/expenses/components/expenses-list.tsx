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
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";

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
  return (
    <>
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
            {expenses.map((expense) => (
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
      </TableContainer>
    </>
  );
};

export default ExpensesList;
