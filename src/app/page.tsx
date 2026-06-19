import ExpensesByTypeChart from "@/app/components/ExpensesByTypeChart";
import ExpensesByCategoryChart from "@/app/components/ExpensesByCategoryChart";
import {
  fetchTotalExpenses,
  fetchExpensesByType,
  fetchExpensesByCategory,
} from "@/services/api.expenses";
import {
  fetchTotalIncomes,
} from "@/services/api.incomes";
import CardComponent from "@/shared/components/Card/Card.component";
import BalanceCard from "@/shared/components/Card/BalanceCard.component";
import DolarRate from "@/shared/components/DolarRate/DolarRate.component";
import MonthSelector from "@/shared/components/MonthSelector/MonthSelector.component";
import { getDefaultDateRange, getDateRangeForMonth } from "@/utils/date";
import { Suspense } from "react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const dateRange = month ? getDateRangeForMonth(month) : getDefaultDateRange();

  const [
    totalExpenses,
    totalIncomes,
    expensesByType,
    expensesByCategory,
  ] = await Promise.all([
    fetchTotalExpenses(dateRange),
    fetchTotalIncomes(dateRange),
    fetchExpensesByType(dateRange),
    fetchExpensesByCategory(dateRange),
  ]);

  const totalBalance = totalIncomes - totalExpenses;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <Suspense fallback={null}>
        <MonthSelector />
      </Suspense>

      <div className="mb-6">
        <BalanceCard total={totalBalance} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CardComponent
          title="Gastos"
          redirect="/expenses"
          total={totalExpenses}
        ></CardComponent>
        <CardComponent
          title="Ingresos"
          redirect="/incomes"
          total={totalIncomes}
        ></CardComponent>
        <DolarRate />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(totalExpenses > 0 || totalIncomes > 0) && (
          <>
            <div className="lg:col-span-1">
              <ExpensesByTypeChart data={expensesByType} />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-10">
              {expensesByCategory.length > 0 && (
                <ExpensesByCategoryChart data={expensesByCategory} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
