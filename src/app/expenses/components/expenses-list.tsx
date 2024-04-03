import axios from "@/config/api";
import { Expense } from "@/types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data: expenses } = await axios.get("/expenses");
        setExpenses(expenses);
      } catch (error) {
        console.error("Error al obtener gastos:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Lista de Gastos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell component="th" scope="row">
                  {dayjs(expense.date).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>${expense.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ExpensesList;
