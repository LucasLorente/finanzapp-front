import axios from "@/config/api";
import { Expense, ExpenseCategory, ExpenseType, GroupedData } from "@/types";
import { DateRange, getDefaultDateRange } from "@/utils/date";

type Headers = Record<string, string>;

const fetchExpenses = async (dateRange?: DateRange, headers?: Headers): Promise<Expense[]> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: expenses } = await axios.get("/expenses", { params: { startDate, endDate }, headers });
    return expenses;
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    throw new Error("Error al obtener los gastos");
  }
};

const fetchTotalExpenses = async (dateRange?: DateRange, headers?: Headers): Promise<number> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: total } = await axios.get("/expenses/total", { params: { startDate, endDate }, headers });

    if (total && total._sum) {
      return total._sum.amount;
    } else {
      console.error("La respuesta no tiene la estructura esperada:", total);
      throw new Error("Error al obtener los gastos totales");
    }
  } catch (error) {
    console.error("Error al obtener el total:", error);
    throw new Error("Error al obtener los gastos totales");
  }
};

const fetchWeeklyExpenses = async (dateRange?: DateRange, headers?: Headers): Promise<number> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: weekly } = await axios.get("/expenses/weekly", { params: { startDate, endDate }, headers });

    if (weekly && weekly._sum) {
      return weekly._sum.amount;
    } else {
      console.error("La respuesta no tiene la estructura esperada:", weekly);
      throw new Error("Error al obtener los gastos semanales");
    }
  } catch (error) {
    console.error("Error al obtener los gastos semanales:", error);
    throw new Error("Error al obtener los gastos semanales");
  }
};

const fetchMonthlyExpenses = async (dateRange?: DateRange, headers?: Headers): Promise<number> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: monthly } = await axios.get("/expenses/monthly", { params: { startDate, endDate }, headers });

    if (monthly && monthly._sum) {
      return monthly._sum.amount;
    } else {
      console.error("La respuesta no tiene la estructura esperada:", monthly);
      throw new Error("Error al obtener los gastos mensuales");
    }
  } catch (error) {
    console.error("Error al obtener los gastos mensuales:", error);
    throw new Error("Error al obtener los gastos mensuales");
  }
};

const fetchExpensesCategories = async (headers?: Headers): Promise<ExpenseCategory[]> => {
  try {
    const { data: expensesCategories } = await axios.get("/expenses-category", { headers });
    return expensesCategories;
  } catch (error) {
    console.error("Error al obtener las categorías de gastos:", error);
    throw new Error("Error al obtener las categorías de gastos");
  }
};

const fetchExpensesTypes = async (headers?: Headers): Promise<ExpenseType[]> => {
  try {
    const { data: expensesTypes } = await axios.get("/expenses-type", { headers });
    return expensesTypes;
  } catch (error) {
    console.error("Error al obtener los tipos de gastos:", error);
    throw new Error("Error al obtener los tipos de gastos");
  }
};

const fetchExpensesByCategory = async (dateRange?: DateRange, headers?: Headers): Promise<GroupedData[]> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data } = await axios.get("/expenses/by-category", { params: { startDate, endDate }, headers });
    return data;
  } catch (error) {
    console.error("Error al obtener gastos por categoría:", error);
    throw new Error("Error al obtener gastos por categoría");
  }
};

const fetchExpensesByType = async (dateRange?: DateRange, headers?: Headers): Promise<GroupedData[]> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data } = await axios.get("/expenses/by-type", { params: { startDate, endDate }, headers });
    return data;
  } catch (error) {
    console.error("Error al obtener gastos por tipo:", error);
    throw new Error("Error al obtener gastos por tipo");
  }
};

const deleteExpense = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/expenses/${id}`);
  } catch (error) {
    console.error("Error al eliminar el gasto:", error);
    throw new Error("Error al eliminar el gasto");
  }
};

export {
  fetchExpenses,
  fetchExpensesCategories,
  fetchExpensesTypes,
  fetchMonthlyExpenses,
  fetchTotalExpenses,
  fetchWeeklyExpenses,
  fetchExpensesByCategory,
  fetchExpensesByType,
  deleteExpense,
};
