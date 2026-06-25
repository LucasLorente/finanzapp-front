import axios from "@/config/api";
import { ExpenseCategory, ExpenseType, InvestmentCategory, InvestmentType } from "@/types";

// ── Expense Categories ──────────────────────────────────────────────────────

const fetchExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  try {
    const { data } = await axios.get("/expenses-category");
    return data;
  } catch (error) {
    console.error("Error al obtener las categorías de gastos:", error);
    throw new Error("Error al obtener las categorías de gastos");
  }
};

const createExpenseCategory = async (name: string): Promise<ExpenseCategory> => {
  try {
    const { data } = await axios.post("/expenses-category", { name });
    return data;
  } catch (error) {
    console.error("Error al crear la categoría de gasto:", error);
    throw new Error("Error al crear la categoría de gasto");
  }
};

const updateExpenseCategory = async (id: number, name: string): Promise<ExpenseCategory> => {
  try {
    const { data } = await axios.put(`/expenses-category/${id}`, { name });
    return data;
  } catch (error) {
    console.error("Error al actualizar la categoría de gasto:", error);
    throw new Error("Error al actualizar la categoría de gasto");
  }
};

const deleteExpenseCategory = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/expenses-category/${id}`);
  } catch (error) {
    console.error("Error al eliminar la categoría de gasto:", error);
    throw new Error("Error al eliminar la categoría de gasto");
  }
};

// ── Expense Types ───────────────────────────────────────────────────────────

const fetchExpenseTypes = async (): Promise<ExpenseType[]> => {
  try {
    const { data } = await axios.get("/expenses-type");
    return data;
  } catch (error) {
    console.error("Error al obtener los tipos de gasto:", error);
    throw new Error("Error al obtener los tipos de gasto");
  }
};

const createExpenseType = async (name: string): Promise<ExpenseType> => {
  try {
    const { data } = await axios.post("/expenses-type", { name });
    return data;
  } catch (error) {
    console.error("Error al crear el tipo de gasto:", error);
    throw new Error("Error al crear el tipo de gasto");
  }
};

const updateExpenseType = async (id: number, name: string): Promise<ExpenseType> => {
  try {
    const { data } = await axios.put(`/expenses-type/${id}`, { name });
    return data;
  } catch (error) {
    console.error("Error al actualizar el tipo de gasto:", error);
    throw new Error("Error al actualizar el tipo de gasto");
  }
};

const deleteExpenseType = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/expenses-type/${id}`);
  } catch (error) {
    console.error("Error al eliminar el tipo de gasto:", error);
    throw new Error("Error al eliminar el tipo de gasto");
  }
};

// ── Investment Categories ───────────────────────────────────────────────────

const fetchInvestmentCategories = async (): Promise<InvestmentCategory[]> => {
  try {
    const { data } = await axios.get("/investment-category");
    return data;
  } catch (error) {
    console.error("Error al obtener las categorías de inversión:", error);
    throw new Error("Error al obtener las categorías de inversión");
  }
};

const createInvestmentCategory = async (name: string): Promise<InvestmentCategory> => {
  try {
    const { data } = await axios.post("/investment-category", { name });
    return data;
  } catch (error) {
    console.error("Error al crear la categoría de inversión:", error);
    throw new Error("Error al crear la categoría de inversión");
  }
};

const updateInvestmentCategory = async (id: number, name: string): Promise<InvestmentCategory> => {
  try {
    const { data } = await axios.put(`/investment-category/${id}`, { name });
    return data;
  } catch (error) {
    console.error("Error al actualizar la categoría de inversión:", error);
    throw new Error("Error al actualizar la categoría de inversión");
  }
};

const deleteInvestmentCategory = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/investment-category/${id}`);
  } catch (error) {
    console.error("Error al eliminar la categoría de inversión:", error);
    throw new Error("Error al eliminar la categoría de inversión");
  }
};

// ── Investment Types ────────────────────────────────────────────────────────

const fetchInvestmentTypes = async (): Promise<InvestmentType[]> => {
  try {
    const { data } = await axios.get("/investment-type");
    return data;
  } catch (error) {
    console.error("Error al obtener los tipos de inversión:", error);
    throw new Error("Error al obtener los tipos de inversión");
  }
};

const createInvestmentType = async (name: string): Promise<InvestmentType> => {
  try {
    const { data } = await axios.post("/investment-type", { name });
    return data;
  } catch (error) {
    console.error("Error al crear el tipo de inversión:", error);
    throw new Error("Error al crear el tipo de inversión");
  }
};

const updateInvestmentType = async (id: number, name: string): Promise<InvestmentType> => {
  try {
    const { data } = await axios.put(`/investment-type/${id}`, { name });
    return data;
  } catch (error) {
    console.error("Error al actualizar el tipo de inversión:", error);
    throw new Error("Error al actualizar el tipo de inversión");
  }
};

const deleteInvestmentType = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/investment-type/${id}`);
  } catch (error) {
    console.error("Error al eliminar el tipo de inversión:", error);
    throw new Error("Error al eliminar el tipo de inversión");
  }
};

export {
  fetchExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  fetchExpenseTypes,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
  fetchInvestmentCategories,
  createInvestmentCategory,
  updateInvestmentCategory,
  deleteInvestmentCategory,
  fetchInvestmentTypes,
  createInvestmentType,
  updateInvestmentType,
  deleteInvestmentType,
};
