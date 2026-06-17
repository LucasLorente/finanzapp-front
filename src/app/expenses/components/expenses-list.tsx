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
}: {
  categories: ExpenseCategory[];
  types: ExpenseType[];
  expenses: Expense[];
  total: number;
}) => {
  return (
    <TransactionTable
      title="Lista de Gastos"
      data={expenses}
      type="expense"
      total={total}
      categories={categories}
      types={types}
    />
  );
};

export default ExpensesList;
