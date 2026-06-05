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
    <div className="max-w-5xl mx-auto px-6 py-8 w-full">
      <IncomesList
        incomes={incomes}
        total={total}
        weekly={weekly}
        monthly={monthly}
      />
      <div className="mt-4 flex justify-end">
        <TransactionModal
          type="income"
          buttonText="Añadir Ingreso"
          title="Agregar Ingreso"
        />
      </div>
    </div>
  );
}
