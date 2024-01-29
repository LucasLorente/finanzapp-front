import axios from "@/config/api";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data: expenses } = await axios.get("/expenses");
        setExpenses(expenses);
      } catch (error) {
        console.error("Error al obtener gastos:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <Typography variant="h1" gutterBottom>
        Lista de Gastos
      </Typography>
      <ul>
        {expenses.map((expense: any) => (
          <li key={expense.id}>
            {dayjs(expense.date).format("DD/MM/YYYY")}: {expense.description} -
            ${expense.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesList;
