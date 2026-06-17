import { Suspense } from "react";
import IncomesList from "./components/incomes-list";
import {
  fetchIncomes,
  fetchMonthlyIncomes,
  fetchTotalIncomes,
  fetchWeeklyIncomes,
} from "@/services/api.incomes";
import TransactionModal from "@/shared/components/Modal/TransactionModal.component";
import MonthSelector from "@/shared/components/MonthSelector/MonthSelector.component";
import { getDefaultDateRange, getDateRangeForMonth } from "@/utils/date";

export default async function Incomes({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const dateRange = month ? getDateRangeForMonth(month) : getDefaultDateRange();

  const [incomes, total] = await Promise.all([
    fetchIncomes(dateRange),
    fetchTotalIncomes(dateRange)
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 w-full">
      <Suspense fallback={null}>
        <MonthSelector />
      </Suspense>
      <IncomesList
        incomes={incomes}
        total={total}
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
