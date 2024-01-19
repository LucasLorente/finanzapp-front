import AddExpenses from '@/components/expenses/expenses-add';
import ExpensesList from '@/components/expenses/expenses-list';
import React from 'react';

const Expenses = () => {

  return (
    <div>
      <ExpensesList />
      <AddExpenses />
    </div>
  );
};

export default Expenses;