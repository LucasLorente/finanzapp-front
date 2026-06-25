import {
  fetchExpenseCategoriesSettings,
  fetchExpenseTypesSettings,
  fetchInvestmentCategoriesSettings,
  fetchInvestmentTypesSettings,
} from "@/services/api.settings";
import SettingsList from "./components/settings-list";

export default async function SettingsPage() {
  const [expenseCategories, expenseTypes, investmentCategories, investmentTypes] =
    await Promise.all([
      fetchExpenseCategoriesSettings(),
      fetchExpenseTypesSettings(),
      fetchInvestmentCategoriesSettings(),
      fetchInvestmentTypesSettings(),
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
