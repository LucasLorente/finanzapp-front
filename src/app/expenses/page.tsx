import React from "react";
import ExpensesList from "./components/expenses-list";
import {
  fetchExpenses,
  fetchMonthlyExpenses,
  fetchTotalExpenses,
  fetchWeeklyExpenses,
} from "@/services/api.expenses";
import TransactionModal from "@/shared/components/Modal/TransactionModal.component";

export default async function Expenses() {
  const [expenses, total, weekly, monthly] = await Promise.all([
    fetchExpenses(),
    fetchTotalExpenses(),
    fetchWeeklyExpenses(),
    fetchMonthlyExpenses(),
  ]);

  return (
    <div className="flex flex-row items-center justify-around">
      <div className="flex flex-col items-center justify-center">
        <ExpensesList
          expenses={expenses}
          total={total}
          weekly={weekly}
          monthly={monthly}
        />
        <TransactionModal
          type="expense"
          buttonText="Añadir Gasto"
          title="Agregar Gasto"
        />
      </div>
    </div>
  );
}
