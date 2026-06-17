"use client";

import { Expense } from "@/types";
import React from "react";
import TransactionTable from "@/shared/components/Table/Table.component";

const IncomesList = ({
  incomes,
  total,
}: {
  incomes: Expense[];
  total: number;
}) => {
  return (
    <TransactionTable
      title="Lista de Ingresos"
      data={incomes}
      type="income"
      total={total}
    />
  );
};

export default IncomesList;
