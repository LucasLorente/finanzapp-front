import { cookies } from "next/headers";
import { Suspense } from "react";
import IncomesList from "./components/incomes-list";
import {
  fetchIncomes,
  fetchTotalIncomes,
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

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const [incomes, total] = await Promise.all([
    fetchIncomes(dateRange, authHeaders),
    fetchTotalIncomes(dateRange, authHeaders),
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
