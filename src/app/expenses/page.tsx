import { Suspense } from "react";
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
import MonthSelector from "@/shared/components/MonthSelector/MonthSelector.component";
import { getDefaultDateRange, getDateRangeForMonth } from "@/utils/date";

export default async function Expenses({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const dateRange = month ? getDateRangeForMonth(month) : getDefaultDateRange();

  const [expenses, total, categories, types] = await Promise.all([
    fetchExpenses(dateRange),
    fetchTotalExpenses(dateRange),
    fetchExpensesCategories(),
    fetchExpensesTypes(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 w-full">
      <Suspense fallback={null}>
        <MonthSelector />
      </Suspense>
      <ExpensesList
        categories={categories}
        types={types}
        expenses={expenses}
        total={total}
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
