"use client";

import React, { useEffect, useState } from "react";
import ExpensesList from "./components/expenses-list";
import { Container, Typography } from "@mui/material";
import axios from "@/config/api";

const Expenses = () => {
  const [expensesTotal, setExpensesTotal] = useState<number>();
  const [expensesWeekly, setExpensesWeekly] = useState<number>();
  const [expensesMonthly, setExpensesMonthly] = useState<number>();

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

  const fetchMonthly = async () => {
    try {
      const { data: monthly } = await axios.get("/expenses/monthly");

      if (monthly && monthly._sum) {
        setExpensesMonthly(monthly._sum.amount);
      } else {
        console.error("La respuesta no tiene la estructura esperada:", monthly);
      }
    } catch (error) {
      console.error("Error al obtener el total:", error);
    }
  };

  useEffect(() => {
    fetchTotal();
    fetchWeekly();
    fetchMonthly();
  }, []);

  return (
    <Container className="flex flex-col items-center justify-center">
      <ExpensesList />
      <Typography>Total: ${expensesTotal}</Typography>
      <Typography>Semanal: ${expensesWeekly}</Typography>
      <Typography>Mensual: ${expensesMonthly}</Typography>
    </Container>
  );
};

export default Expenses;
