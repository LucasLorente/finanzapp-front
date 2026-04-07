"use client";

import { Expense } from "@/types";
import React from "react";
import TransactionTable from "@/shared/components/Table/Table.component";

const ExpensesList = ({
  expenses,
  total,
  weekly,
  monthly,
}: {
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
    />
  );
};

export default ExpensesList;
