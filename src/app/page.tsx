import { cookies } from "next/headers";
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
import { fetchTotalInvestments } from "@/services/api.investments";
import { fetchPendingRecurring } from "@/services/api.recurring";
import CardComponent from "@/shared/components/Card/Card.component";
import BalanceCard from "@/shared/components/Card/BalanceCard.component";
import MonthSelector from "@/shared/components/MonthSelector/MonthSelector.component";
import PendingRecurring from "@/shared/components/PendingRecurring/PendingRecurring.component";
import { getDefaultDateRange, getDateRangeForMonth } from "@/utils/date";
import { Suspense } from "react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const dateRange = month ? getDateRangeForMonth(month) : getDefaultDateRange();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const [
    totalExpenses,
    totalIncomes,
    totalInvestments,
    expensesByType,
    expensesByCategory,
    pendingExpenses,
    pendingIncomes,
  ] = await Promise.all([
    fetchTotalExpenses(dateRange, authHeaders),
    fetchTotalIncomes(dateRange, authHeaders),
    fetchTotalInvestments(dateRange, authHeaders),
    fetchExpensesByType(dateRange, authHeaders),
    fetchExpensesByCategory(dateRange, authHeaders),
    fetchPendingRecurring("expense", dateRange, authHeaders).catch(() => []),
    fetchPendingRecurring("income", dateRange, authHeaders).catch(() => []),
  ]);

  const totalBalance = totalIncomes - (totalExpenses + totalInvestments);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <Suspense fallback={null}>
        <MonthSelector />
      </Suspense>

      <PendingRecurring
        key={`income-${dateRange.startDate}`}
        kind="income"
        items={pendingIncomes}
        monthDate={dateRange.startDate}
      />
      <PendingRecurring
        key={`expense-${dateRange.startDate}`}
        kind="expense"
        items={pendingExpenses}
        monthDate={dateRange.startDate}
      />

      <div className="mb-6">
        <BalanceCard total={totalBalance} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CardComponent
          title="Gastos"
          redirect="/expenses"
          total={totalExpenses}
        />
        <CardComponent
          title="Ingresos"
          redirect="/incomes"
          total={totalIncomes}
        />
        <CardComponent
          title="Inversiones"
          redirect="/investments"
          total={totalInvestments}
          type="investment"
        />
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
