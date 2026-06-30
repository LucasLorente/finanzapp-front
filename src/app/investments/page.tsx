import { cookies } from "next/headers";
import { Suspense } from "react";
import InvestmentsList from "./components/investments-list";
import {
  fetchInvestments,
  fetchTotalInvestments,
  fetchInvestmentCategories,
  fetchInvestmentTypes,
} from "@/services/api.investments";
import InvestmentModal from "@/shared/components/Modal/InvestmentModal.component";
import MonthSelector from "@/shared/components/MonthSelector/MonthSelector.component";
import { getDefaultDateRange, getDateRangeForMonth } from "@/utils/date";

export default async function Investments({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const dateRange = month ? getDateRangeForMonth(month) : getDefaultDateRange();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const [investments, total, categories, types] = await Promise.all([
    fetchInvestments(dateRange, authHeaders),
    fetchTotalInvestments(dateRange, authHeaders),
    fetchInvestmentCategories(authHeaders),
    fetchInvestmentTypes(authHeaders),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full">
      <Suspense fallback={null}>
        <MonthSelector />
      </Suspense>
      <InvestmentsList
        investments={investments}
        total={total}
        categories={categories}
        types={types}
      />
      <div className="mt-4 flex justify-end">
        <InvestmentModal
          buttonText="Añadir Inversión"
          title="Agregar Inversión"
        />
      </div>
    </div>
  );
}
