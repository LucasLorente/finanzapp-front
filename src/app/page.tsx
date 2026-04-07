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
    <>
      <h1 className="text-6xl font-extrabold mb-10">
        Finance
      </h1>
      <div className="flex flex-row justify-center mx-auto w-full gap-10">
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
    </>
  );
}
