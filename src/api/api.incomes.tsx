import axios from "@/config/api";
import { Expense } from "@/types";

const fetchIncomes = async (): Promise<Expense[]> => {
  try {
    const { data: incomes } = await axios.get("/incomes");
    return incomes;
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    throw new Error("Error al obtener los gastos");
  }
};

const fetchTotal = async (): Promise<number> => {
  try {
    const { data: total } = await axios.get("/incomes/total");

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

const fetchWeekly = async (): Promise<number> => {
  try {
    const { data: weekly } = await axios.get("/incomes/weekly");

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

const fetchMonthly = async (): Promise<number> => {
  try {
    const { data: monthly } = await axios.get("/incomes/monthly");

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

export { fetchIncomes, fetchMonthly, fetchTotal, fetchWeekly };
