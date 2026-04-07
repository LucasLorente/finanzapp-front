"use client";

import { Expense } from "@/types";
import React from "react";
import TransactionTable from "@/shared/components/Table/Table.component";

const IncomesList = ({
  incomes,
  total,
  weekly,
  monthly,
}: {
  incomes: Expense[];
  total: number;
  weekly: number;
  monthly: number;
}) => {
  return (
    <TransactionTable 
      title="Lista de Ingresos" 
      data={incomes} 
      type="income" 
      weekly={weekly} 
      monthly={monthly} 
      total={total} 
    />
  );
};

export default IncomesList;
