export interface Expense {
  id: number;
  description?: string;
  amount: number;
  date: Date;
  created_at?: Date;
  updated_at?: Date;
}
