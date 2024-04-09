import {
  fetchMonthlyExpenses,
  fetchTotalExpenses,
  fetchWeeklyExpenses,
} from "@/api/api.expenses";
import {
  fetchMonthlyIncomes,
  fetchTotalIncomes,
  fetchWeeklyIncomes,
} from "@/api/api.incomes";
import CardComponent from "@/shared/components/Card/Card.component";
import { Container, Typography } from "@mui/material";
import React from "react";

export default async function HomePage() {
  const [
    totalExpenses,
    weeklyExpenses,
    monthlyExpenses,
    totalIncomes,
    weeklyIncomes,
    monthlyIncomes,
  ] = await Promise.all([
    fetchTotalExpenses(),
    fetchWeeklyExpenses(),
    fetchMonthlyExpenses(),
    fetchTotalIncomes(),
    fetchWeeklyIncomes(),
    fetchMonthlyIncomes(),
  ]);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Finance
      </Typography>
      <Container className="flex justify-around">
        <CardComponent
          title="Gastos"
          redirect="/expenses"
          total={totalExpenses}
          weekly={weeklyExpenses}
          monthly={monthlyExpenses}
        ></CardComponent>
        <CardComponent
          title="Ingresos"
          redirect="/incomes"
          total={totalIncomes}
          weekly={weeklyIncomes}
          monthly={monthlyIncomes}
        ></CardComponent>
      </Container>
    </>
  );
}
