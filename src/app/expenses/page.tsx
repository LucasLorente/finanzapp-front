"use client";

import React, { useEffect, useState } from "react";
import ExpensesList from "./components/expenses-list";
import { Container, Typography } from "@mui/material";
import axios from "@/config/api";

const Expenses = () => {
  const [expensesTotal, setExpensesTotal] = useState<number>();
  const [expensesWeekly, setExpensesWeekly] = useState<number>();

  const fetchTotal = async () => {
    try {
      const { data: total } = await axios.get("/expenses/total");

      if (total && total._sum) {
        setExpensesTotal(total._sum.amount);
      } else {
        console.error("La respuesta no tiene la estructura esperada:", total);
      }
    } catch (error) {
      console.error("Error al obtener el total:", error);
    }
  };

  const fetchWeekly = async () => {
    try {
      const { data: weekly } = await axios.get("/expenses/weekly");

      if (weekly && weekly._sum) {
        setExpensesWeekly(weekly._sum.amount);
      } else {
        console.error("La respuesta no tiene la estructura esperada:", weekly);
      }
    } catch (error) {
      console.error("Error al obtener el total:", error);
    }
  };

  useEffect(() => {
    fetchTotal();
    fetchWeekly();
  }, []);

  return (
    <Container className="flex flex-col items-center justify-center">
      <ExpensesList />
      <Typography>Total: ${expensesTotal}</Typography>
      <Typography>Semanal: ${expensesWeekly}</Typography>
    </Container>
  );
};

export default Expenses;
