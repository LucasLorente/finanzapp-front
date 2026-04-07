import React from "react";
import IncomesList from "./components/incomes-list";
import {
  fetchIncomes,
  fetchMonthlyIncomes,
  fetchTotalIncomes,
  fetchWeeklyIncomes,
} from "@/services/api.incomes";
import TransactionModal from "@/shared/components/Modal/TransactionModal.component";

export default async function Incomes() {
  const [incomes, total, weekly, monthly] = await Promise.all([
    fetchIncomes(),
    fetchTotalIncomes(),
    fetchWeeklyIncomes(),
    fetchMonthlyIncomes(),
  ]);

  return (
    <div className="flex flex-col items-center justify-center">
      <IncomesList
        incomes={incomes}
        total={total}
        weekly={weekly}
        monthly={monthly}
      />
      <TransactionModal
        type="income"
        buttonText="Añadir Ingreso"
        title="Agregar Ingreso"
      />
    </div>
  );
}
