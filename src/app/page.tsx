import ExpensesByTypeChart from "@/app/components/ExpensesByTypeChart";
import {
  fetchMonthlyExpenses,
  fetchTotalExpenses,
  fetchWeeklyExpenses,
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
  ] = await Promise.all([
    fetchTotalExpenses(),
    fetchWeeklyExpenses(),
    fetchMonthlyExpenses(),
    fetchTotalIncomes(),
    fetchWeeklyIncomes(),
    fetchMonthlyIncomes(),
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
          <ExpensesByTypeChart />
        </div>
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-8 flex items-center justify-center border border-white/20">
          <p className="text-white/60 italic text-lg">Más estadísticas próximamente...</p>
        </div>
      </div>
    </div>
  );
}
