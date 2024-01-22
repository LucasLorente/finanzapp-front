"use client";

import React from "react";
import ExpensesList from "./components/expenses-list";
import AddExpenses from "./components/expenses-add";

const Expenses = () => {
  return (
    <div>
      <ExpensesList />
      <AddExpenses />
    </div>
  );
};

export default Expenses;
