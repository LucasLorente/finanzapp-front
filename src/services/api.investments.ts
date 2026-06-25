import axios from "@/config/api";
import { Investment, InvestmentCategory, InvestmentType } from "@/types";
import { DateRange, getDefaultDateRange } from "@/utils/date";

const fetchInvestments = async (dateRange?: DateRange): Promise<Investment[]> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: investments } = await axios.get("/investments", { params: { startDate, endDate } });
    return investments;
  } catch (error) {
    console.error("Error al obtener inversiones:", error);
    throw new Error("Error al obtener las inversiones");
  }
};

const fetchTotalInvestments = async (dateRange?: DateRange): Promise<number> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data: total } = await axios.get("/investments/total", { params: { startDate, endDate } });

    if (total && total._sum) {
      return total._sum.current_value ?? 0;
    } else {
      console.error("La respuesta no tiene la estructura esperada:", total);
      throw new Error("Error al obtener el total de inversiones");
    }
  } catch (error) {
    console.error("Error al obtener el total de inversiones:", error);
    throw new Error("Error al obtener el total de inversiones");
  }
};

const fetchInvestmentCategories = async (): Promise<InvestmentCategory[]> => {
  try {
    const { data: categories } = await axios.get("/investment-category");
    return categories;
  } catch (error) {
    console.error("Error al obtener las categorías de inversión:", error);
    throw new Error("Error al obtener las categorías de inversión");
  }
};

const fetchInvestmentTypes = async (): Promise<InvestmentType[]> => {
  try {
    const { data: types } = await axios.get("/investment-type");
    return types;
  } catch (error) {
    console.error("Error al obtener los tipos de inversión:", error);
    throw new Error("Error al obtener los tipos de inversión");
  }
};

const createInvestment = async (data: {
  description?: string;
  amount_invested: number;
  current_value: number;
  date: string;
  typeId: number;
  categoryId: number;
  ticker?: string;
}): Promise<Investment> => {
  try {
    const { data: investment } = await axios.post("/investments", data);
    return investment;
  } catch (error) {
    console.error("Error al crear la inversión:", error);
    throw new Error("Error al crear la inversión");
  }
};

const deleteInvestment = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/investments/${id}`);
  } catch (error) {
    console.error("Error al eliminar la inversión:", error);
    throw new Error("Error al eliminar la inversión");
  }
};

export {
  fetchInvestments,
  fetchTotalInvestments,
  fetchInvestmentCategories,
  fetchInvestmentTypes,
  createInvestment,
  deleteInvestment,
};
