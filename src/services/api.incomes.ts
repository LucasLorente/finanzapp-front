import axios from "@/config/api";
import { Expense } from "@/types";
import { DateRange, getDefaultDateRange } from "@/utils/date";

const fetchIncomes = async (dateRange?: DateRange): Promise<Expense[]> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: incomes } = await axios.get("/incomes", { params: { startDate, endDate } });
    return incomes;
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    throw new Error("Error al obtener los gastos");
  }
};

const fetchTotalIncomes = async (dateRange?: DateRange): Promise<number> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: total } = await axios.get("/incomes/total", { params: { startDate, endDate } });

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

const fetchWeeklyIncomes = async (dateRange?: DateRange): Promise<number> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: weekly } = await axios.get("/incomes/weekly", { params: { startDate, endDate } });

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

const fetchMonthlyIncomes = async (dateRange?: DateRange): Promise<number> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: monthly } = await axios.get("/incomes/monthly", { params: { startDate, endDate } });

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

export {
  fetchIncomes,
  fetchMonthlyIncomes,
  fetchTotalIncomes,
  fetchWeeklyIncomes,
};
