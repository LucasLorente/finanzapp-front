import axios from '@/config/api';
import React, { useState, useEffect } from 'react';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/expenses');
        setExpenses(response.data);
      } catch (error) {
        console.error('Error al obtener gastos:', error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <h1>Lista de Gastos</h1>
      <ul>
        {expenses.map((expense: any) => (
          <li key={expense.id}>
            {expense.description} - ${expense.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesList;