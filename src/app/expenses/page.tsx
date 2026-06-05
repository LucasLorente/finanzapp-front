import React from "react";
import ExpensesList from "./components/expenses-list";
import {
  fetchExpenses,
  fetchExpensesCategories,
  fetchExpensesTypes,
  fetchMonthlyExpenses,
  fetchTotalExpenses,
  fetchWeeklyExpenses,
} from "@/services/api.expenses";
import TransactionModal from "@/shared/components/Modal/TransactionModal.component";

export default async function Expenses() {
  const [expenses, total, weekly, monthly, categories, types] = await Promise.all([
    fetchExpenses(),
    fetchTotalExpenses(),
    fetchWeeklyExpenses(),
    fetchMonthlyExpenses(),
    fetchExpensesCategories(),
    fetchExpensesTypes(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 w-full">
      <ExpensesList
        categories={categories}
        types={types}
        expenses={expenses}
        total={total}
        weekly={weekly}
        monthly={monthly}
      />
      <div className="mt-4 flex justify-end">
        <TransactionModal
          type="expense"
          buttonText="Añadir Gasto"
          title="Agregar Gasto"
        />
      </div>
    </div>
  );
}
