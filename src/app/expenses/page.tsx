"use client";

import React from "react";
import ExpensesList from "./components/expenses-list";
import { Container, Typography } from "@mui/material";
import { fetchMonthly, fetchTotal, fetchWeekly } from "@/api/api.expenses";

export default async function Expenses() {
  const expensesTotalData = fetchTotal();
  const expensesWeeklyData = fetchWeekly();
  const expensesMonthlyData = fetchMonthly();

  // Wait for the promises to resolve
  const [total, weekly, monthly] = await Promise.all([
    expensesTotalData,
    expensesWeeklyData,
    expensesMonthlyData,
  ]);

  return (
    <Container className="flex flex-col items-center justify-center">
      <ExpensesList />
      <Typography>Total: ${total}</Typography>
      <Typography>Semanal: ${weekly}</Typography>
      <Typography>Mensual: ${monthly}</Typography>
    </Container>
  );
}
