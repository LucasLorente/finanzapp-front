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
