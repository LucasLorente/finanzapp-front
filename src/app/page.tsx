import { fetchMonthly, fetchTotal, fetchWeekly } from "@/api/api.expenses";
import CardComponent from "@/shared/components/Card/Card.component";
import { Container, Typography } from "@mui/material";
import React from "react";

export default async function HomePage() {
  const expensesTotalData = fetchTotal();
  const expensesWeeklyData = fetchWeekly();
  const expensesMonthlyData = fetchMonthly();

  // Wait for the promises to resolve
  const [total, weekly, monthly] = await Promise.all([
    expensesTotalData,
    expensesWeeklyData,
    expensesMonthlyData,
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
          total={total}
          weekly={weekly}
          monthly={monthly}
        ></CardComponent>
        <CardComponent
          title="Ingresos"
          redirect="/income"
          total={total}
          weekly={weekly}
          monthly={monthly}
        ></CardComponent>
      </Container>
    </>
  );
}
