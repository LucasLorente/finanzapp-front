import axios from "@/config/api";
import { RecurringKind, RecurringTransaction } from "@/types";
import { DateRange, getDefaultDateRange } from "@/utils/date";

type Headers = Record<string, string>;

export interface RecurringPayload {
  kind: RecurringKind;
  description: string;
  amount: number;
  dayOfMonth: number;
  startDate: string;
  active: boolean;
  categoryId?: number | null;
  typeId?: number | null;
}

const fetchRecurring = async (kind: RecurringKind, headers?: Headers): Promise<RecurringTransaction[]> => {
  try {
    const { data } = await axios.get("/recurring", { params: { kind }, headers });
    return data;
  } catch (error) {
    console.error("Error al obtener los recurrentes:", error);
    throw new Error("Error al obtener los recurrentes");
  }
};

const fetchPendingRecurring = async (
  kind: RecurringKind,
  dateRange?: DateRange,
  headers?: Headers
): Promise<RecurringTransaction[]> => {
  try {
    const { startDate, endDate } = dateRange ?? getDefaultDateRange();
    const { data } = await axios.get("/recurring/pending", { params: { kind, startDate, endDate }, headers });
    return data;
  } catch (error) {
    console.error("Error al obtener los recurrentes pendientes:", error);
    throw new Error("Error al obtener los recurrentes pendientes");
  }
};

const createRecurring = async (payload: RecurringPayload): Promise<RecurringTransaction> => {
  try {
    const { data } = await axios.post("/recurring", payload);
    return data;
  } catch (error) {
    console.error("Error al crear el recurrente:", error);
    throw new Error("Error al crear el recurrente");
  }
};

const updateRecurring = async (id: number, payload: RecurringPayload): Promise<RecurringTransaction> => {
  try {
    const { data } = await axios.put(`/recurring/${id}`, payload);
    return data;
  } catch (error) {
    console.error("Error al actualizar el recurrente:", error);
    throw new Error("Error al actualizar el recurrente");
  }
};

const confirmRecurring = async (id: number, amount: number, date: string): Promise<void> => {
  try {
    await axios.post(`/recurring/${id}/confirm`, { amount, date });
  } catch (error) {
    console.error("Error al confirmar el recurrente:", error);
    throw new Error("Error al confirmar el recurrente");
  }
};

const toRecurringPayload = (row: RecurringTransaction): RecurringPayload => ({
  kind: row.kind,
  description: row.description,
  amount: row.amount,
  dayOfMonth: row.day_of_month,
  startDate: String(row.start_date).slice(0, 10),
  active: row.active,
  categoryId: row.category_id,
  typeId: row.type_id,
});

export {
  fetchRecurring,
  fetchPendingRecurring,
  createRecurring,
  updateRecurring,
  confirmRecurring,
  toRecurringPayload,
};
