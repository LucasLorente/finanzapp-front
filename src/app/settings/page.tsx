import {
  fetchExpenseCategories,
  fetchExpenseTypes,
  fetchInvestmentCategories,
  fetchInvestmentTypes,
} from "@/services/api.settings";
import SettingsList from "./components/settings-list";

export default async function SettingsPage() {
  const [expenseCategories, expenseTypes, investmentCategories, investmentTypes] =
    await Promise.all([
      fetchExpenseCategories(),
      fetchExpenseTypes(),
      fetchInvestmentCategories(),
      fetchInvestmentTypes(),
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
