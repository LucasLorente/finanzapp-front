"use client";

import React from "react";
import ExpensesList from "./components/expenses-list";
import { Container } from "@mui/material";

const Expenses = () => {
  return (
    <Container className="flex flex-col items-center justify-center">
      <ExpensesList />
    </Container>
  );
};

export default Expenses;
