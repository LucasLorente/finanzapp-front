import React from "react";
import IncomesList from "./components/incomes-list";
import AddIncomeModal from "./components/add-income-modal";
import {
  fetchIncomes,
  fetchMonthly,
  fetchTotal,
  fetchWeekly,
} from "@/api/api.incomes";

export default async function Incomes() {
  const [incomes, total, weekly, monthly] = await Promise.all([
    fetchIncomes(),
    fetchTotal(),
    fetchWeekly(),
    fetchMonthly(),
  ]);

  return (
    <div className="flex flex-col items-center justify-center">
      <IncomesList
        incomes={incomes}
        total={total}
        weekly={weekly}
        monthly={monthly}
      />
      <AddIncomeModal />
    </div>
  );
}
