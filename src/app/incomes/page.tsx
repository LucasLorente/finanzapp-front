import { cookies } from "next/headers";
import { Suspense } from "react";
import IncomesList from "./components/incomes-list";
import {
  fetchIncomes,
  fetchTotalIncomes,
} from "@/services/api.incomes";
import { fetchPendingRecurring } from "@/services/api.recurring";
import TransactionModal from "@/shared/components/Modal/TransactionModal.component";
import MonthSelector from "@/shared/components/MonthSelector/MonthSelector.component";
import PendingRecurring from "@/shared/components/PendingRecurring/PendingRecurring.component";
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
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const [incomes, total, pendingRecurring] = await Promise.all([
    fetchIncomes(dateRange, authHeaders),
    fetchTotalIncomes(dateRange, authHeaders),
    fetchPendingRecurring("income", dateRange, authHeaders),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 w-full">
      <Suspense fallback={null}>
        <MonthSelector />
      </Suspense>
      <PendingRecurring
        key={dateRange.startDate}
        kind="income"
        items={pendingRecurring}
        monthDate={dateRange.startDate}
      />
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
