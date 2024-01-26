"use client";

import axios from "@/config/api";
import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import FormInput from "./components/form-input";
import dayjs from "dayjs";
import { Expense } from "@/types";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const AddExpenses = () => {
  const expenseInitialValue = {
    description: "",
    amount: "",
    date: dayjs(),
    categoryId: "",
  };

  const ExpenseCreationSchema = Yup.object().shape({
    description: Yup.string().max(50, "Descripción demasiado larga"),
    amount: Yup.number()
      .required("Este campo es requerido")
      .positive("Debe ser un monto positivo")
      .integer(),
    date: Yup.date(),
    categoryId: Yup.number()
      .required("Este campo es requerido")
      .positive("Debe ser un monto positivo")
      .integer(),
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categories } = await axios.get("/category");
        setCategories(categories);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const createExpense = async (values: any, { resetForm }: any) => {
    try {
      const response: Expense = await axios.post("/expenses", values);
      resetForm();
    } catch (error) {
      console.error("Error al obtener gastos:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center">
      <Typography variant="h1" className="m-10">
        Ingresar nuevo gasto
      </Typography>
      <Formik
        initialValues={expenseInitialValue}
        onSubmit={createExpense}
        validationSchema={ExpenseCreationSchema}
      >
        {({ isSubmitting, values, setFieldValue, isValid, handleChange }) => (
          <Form className="flex flex-col items-center justify-center">
            <Card variant="outlined">
              <CardContent className="flex flex-col justify-between min-h-72">
                <Field
                  label="Descripción"
                  name="description"
                  type="text"
                  component={FormInput}
                  value={values.description}
                />
                <ErrorMessage name="description" />
                <Field
                  label="Monto"
                  name="amount"
                  type="number"
                  component={FormInput}
                  value={values.amount}
                />
                <ErrorMessage name="amount" component="div" />
                <MobileDatePicker
                  label="Fecha"
                  name="date"
                  format="DD/MM/YYYY"
                  defaultValue={values.date}
                  onChange={(value) => setFieldValue("date", value)}
                />
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Categoría</InputLabel>
                  <Select
                    labelId="category-select-label"
                    label="Categoría"
                    name="categoryId"
                    value={values.categoryId}
                    onChange={handleChange}
                  >
                    {categories.map((category: any) => (
                      <MenuItem value={category.id} key={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
              <CardActions className="flex justify-center">
                <Button
                  size="large"
                  variant="outlined"
                  color="success"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                >
                  Crear
                </Button>
              </CardActions>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddExpenses;
