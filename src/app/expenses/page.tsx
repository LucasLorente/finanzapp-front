import React from "react";
import ExpensesList from "./components/expenses-list";
// import { Button, Container } from "@mui/material";
import {
  fetchExpenses,
  fetchMonthly,
  fetchTotal,
  fetchWeekly,
} from "@/api/api.expenses";
import Link from "next/link";
import AddExpensesModal from "./components/add-expenses-modal";

export default async function Expenses() {
  const [expenses, total, weekly, monthly] = await Promise.all([
    fetchExpenses(),
    fetchTotal(),
    fetchWeekly(),
    fetchMonthly(),
  ]);

  return (
    <div className="flex flex-col items-center justify-center">
      <ExpensesList
        expenses={expenses}
        total={total}
        weekly={weekly}
        monthly={monthly}
      />
      <AddExpensesModal />
    </div>
  );
}
