import axios from "@/config/api";
import { Expense, ExpenseCategory, ExpenseType } from "@/types";

const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const { data: expenses } = await axios.get("/expenses");
    return expenses;
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    throw new Error("Error al obtener los gastos");
  }
};

const fetchTotalExpenses = async (): Promise<number> => {
  try {
    const { data: total } = await axios.get("/expenses/total");

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

const fetchWeeklyExpenses = async (): Promise<number> => {
  try {
    const { data: weekly } = await axios.get("/expenses/weekly");

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

const fetchMonthlyExpenses = async (): Promise<number> => {
  try {
    const { data: monthly } = await axios.get("/expenses/monthly");

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

const fetchExpensesCategories = async (): Promise<ExpenseCategory[]> => {
  try {
    const { data: expensesCategories } = await axios.get("/expenses-category");
    return expensesCategories;
  } catch (error) {
    console.error("Error al obtener las categorías de gastos:", error);
    throw new Error("Error al obtener las categorías de gastos");
  }
};

const fetchExpensesTypes = async (): Promise<ExpenseType[]> => {
  try {
    const { data: expensesTypes } = await axios.get("/expenses-type");
    return expensesTypes;
  } catch (error) {
    console.error("Error al obtener los tipos de gastos:", error);
    throw new Error("Error al obtener los tipos de gastos");
  }
};

export {
  fetchExpenses,
  fetchExpensesCategories,
  fetchExpensesTypes,
  fetchMonthlyExpenses,
  fetchTotalExpenses,
  fetchWeeklyExpenses,
};
