import axios from '@/config/api';
import React from 'react';

const AddExpenses = () => {

  const createExpense = async () => {
    try {
      await axios.post('/expenses', {
          description: 'Esto es un nuevo gasto',
          amount: 200,
          date: new Date()
        });
    } catch (error) {
      console.error('Error al obtener gastos:', error);
    }
  };

  return (
    <div>
        <h1>Ingresar nuevo gasto</h1>
        <button onClick={()=>createExpense()}>CREAR</button>
    </div>
  );
};

export default AddExpenses;