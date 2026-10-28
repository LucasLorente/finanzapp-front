import { cookies } from "next/headers";
import {
  fetchExpenseCategories,
  fetchExpenseTypes,
  fetchInvestmentCategories,
  fetchInvestmentTypes,
} from "@/services/api.settings";
import { fetchRecurring } from "@/services/api.recurring";
import SettingsList from "./components/settings-list";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const [
    expenseCategories,
    expenseTypes,
    investmentCategories,
    investmentTypes,
    recurringExpenses,
    recurringIncomes,
  ] = await Promise.all([
    fetchExpenseCategories(authHeaders),
    fetchExpenseTypes(authHeaders),
    fetchInvestmentCategories(authHeaders),
    fetchInvestmentTypes(authHeaders),
    fetchRecurring("expense", authHeaders),
    fetchRecurring("income", authHeaders),
  ]);

  return (
    <SettingsList
      expenseCategories={expenseCategories}
      expenseTypes={expenseTypes}
      investmentCategories={investmentCategories}
      investmentTypes={investmentTypes}
      recurringExpenses={recurringExpenses}
      recurringIncomes={recurringIncomes}
    />
  );
}
