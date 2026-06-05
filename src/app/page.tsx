import ExpensesByTypeChart from "@/app/components/ExpensesByTypeChart";
import ExpensesByCategoryChart from "@/app/components/ExpensesByCategoryChart";
import IncomeVsExpensesChart from "@/app/components/IncomeVsExpensesChart";
import {
  fetchMonthlyExpenses,
  fetchTotalExpenses,
  fetchWeeklyExpenses,
  fetchExpensesByType,
  fetchExpensesByCategory,
} from "@/services/api.expenses";
import {
  fetchMonthlyIncomes,
  fetchTotalIncomes,
  fetchWeeklyIncomes,
} from "@/services/api.incomes";
import CardComponent from "@/shared/components/Card/Card.component";
import React from "react";

export default async function HomePage() {
  const [
    totalExpenses,
    weeklyExpenses,
    monthlyExpenses,
    totalIncomes,
    weeklyIncomes,
    monthlyIncomes,
    expensesByType,
    expensesByCategory,
  ] = await Promise.all([
    fetchTotalExpenses(),
    fetchWeeklyExpenses(),
    fetchMonthlyExpenses(),
    fetchTotalIncomes(),
    fetchWeeklyIncomes(),
    fetchMonthlyIncomes(),
    fetchExpensesByType(),
    fetchExpensesByCategory(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-6xl font-extrabold mb-10 text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <CardComponent
          title="Gastos"
          redirect="/expenses"
          total={totalExpenses}
          weekly={weeklyExpenses}
          monthly={monthlyExpenses}
        ></CardComponent>
        <CardComponent
          title="Ingresos"
          redirect="/incomes"
          total={totalIncomes}
          weekly={weeklyIncomes}
          monthly={monthlyIncomes}
        ></CardComponent>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <ExpensesByTypeChart data={expensesByType} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-10">
          <IncomeVsExpensesChart
            totalExpenses={totalExpenses}
            weeklyExpenses={weeklyExpenses}
            monthlyExpenses={monthlyExpenses}
            totalIncomes={totalIncomes}
            weeklyIncomes={weeklyIncomes}
            monthlyIncomes={monthlyIncomes}
          />
          <ExpensesByCategoryChart data={expensesByCategory} />
        </div>
      </div>
    </div>
  );
}
