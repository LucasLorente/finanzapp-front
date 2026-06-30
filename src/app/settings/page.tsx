import { cookies } from "next/headers";
import {
  fetchExpenseCategories,
  fetchExpenseTypes,
  fetchInvestmentCategories,
  fetchInvestmentTypes,
} from "@/services/api.settings";
import SettingsList from "./components/settings-list";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const [expenseCategories, expenseTypes, investmentCategories, investmentTypes] =
    await Promise.all([
      fetchExpenseCategories(authHeaders),
      fetchExpenseTypes(authHeaders),
      fetchInvestmentCategories(authHeaders),
      fetchInvestmentTypes(authHeaders),
    ]);

  return (
    <SettingsList
      expenseCategories={expenseCategories}
      expenseTypes={expenseTypes}
      investmentCategories={investmentCategories}
      investmentTypes={investmentTypes}
    />
  );
}
