export interface ExpenseCategory {
  id: number;
  name: string;
}

export interface ExpenseType {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  description?: string;
  amount: number;
  date: Date;
  type_id: number;
  category_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface GroupedData {
  name: string;
  id: number;
  total: number;
  [key: string]: unknown;
}

export interface DolarRate {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface Investment {
  id: number;
  description?: string;
  amount_invested: number;
  current_value: number;
  date: Date;
  type_id: number;
  category_id: number;
  ticker?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface InvestmentCategory {
  id: number;
  name: string;
}

export interface InvestmentType {
  id: number;
  name: string;
}
