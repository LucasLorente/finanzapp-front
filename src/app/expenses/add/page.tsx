"use client";

import axios from "@/config/api";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import FormInput from "./components/form-input";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";

const AddExpenses = () => {
  const expenseInitialValue = {
    description: "",
    amount: "",
    date: new Date(),
  };

  const createExpense = async (values: any, { resetForm }: any) => {
    try {
      const response = await axios.post("/expenses", values);
      console.log("Respuesta del servidor:", response);
      resetForm();
    } catch (error) {
      console.error("Error al obtener gastos:", error);
    }
  };

  return (
    <div>
      <h1>Ingresar nuevo gasto</h1>
      <Formik initialValues={expenseInitialValue} onSubmit={createExpense}>
        {({ isSubmitting, values }) => (
          <Form>
            <Field
              label="Descripción"
              name="description"
              type="text"
              component={FormInput}
              value={values.description}
            />
            <ErrorMessage name="description" component="div" />
            <Field
              label="Monto"
              name="amount"
              type="number"
              component={FormInput}
              value={values.amount}
            />
            <ErrorMessage name="amount" component="div" />
            <DatePicker label="Fecha" />
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              Crear
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddExpenses;
