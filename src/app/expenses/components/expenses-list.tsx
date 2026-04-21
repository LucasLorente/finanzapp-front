"use client";

import { Expense } from "@/types";
import React from "react";
import TransactionTable from "@/shared/components/Table/Table.component";
import { ExpenseCategory, ExpenseType } from "@/types";

const ExpensesList = ({
  categories,
  types,
  expenses,
  total,
  weekly,
  monthly,
}: {
  categories: ExpenseCategory[];
  types: ExpenseType[];
  expenses: Expense[];
  total: number;
  weekly: number;
  monthly: number;
}) => {
  return (
    <TransactionTable
      title="Lista de Gastos"
      data={expenses}
      type="expense"
      weekly={weekly}
      monthly={monthly}
      total={total}
      categories={categories}
      types={types}
    />
  );
};

export default ExpensesList;
