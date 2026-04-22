"use client";

import axios from "@/config/api";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import dayjs from "dayjs";
import * as Yup from "yup";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormInput from "@/shared/components/Form/form-input";
import InputLabel from "@mui/material/InputLabel";
import "./TransactionModal.component.scss";

interface TransactionModalProps {
  type: "income" | "expense";
  buttonText: string;
  title: string;
}

export default function TransactionModal({ type, buttonText, title }: TransactionModalProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [categories, setCategories] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);

  const isIncome = type === "income";
  const categoryEndpoint = "/expenses-category";
  const expenseTypeEndpoint = "/expenses-type";
  const submitEndpoint = isIncome ? "/incomes" : "/expenses";

  const initialValues = {
    description: "",
    amount: "",
    date: dayjs(),
    categoryId: "",
    typeId: "",
  };

  const validationSchema = Yup.object().shape({
    description: Yup.string()
      .max(50, "Descripción demasiado larga")
      .required("La descripción es requerida"),
    amount: Yup.number()
      .required("El monto es requerido")
      .positive("Debe ser un monto positivo")
      .integer(),
    date: Yup.date().required("La fecha es requerida"),
    categoryId: isIncome
      ? Yup.mixed().notRequired()
      : Yup.number().required("La categoría es requerida").integer(),
    typeId: isIncome
      ? Yup.mixed().notRequired()
      : Yup.number().required("El tipo de gasto es requerido").integer(),
  });

  useEffect(() => {
    if (!open || isIncome) return;

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(categoryEndpoint);
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    const fetchExpenseTypes = async () => {
      try {
        const { data } = await axios.get(expenseTypeEndpoint);
        setExpenseTypes(data);
      } catch (error) {
        console.error("Error al obtener tipos de gasto:", error);
      }
    };

    fetchCategories();
    fetchExpenseTypes();
  }, [open, categoryEndpoint, isIncome]);

  const handleSubmit = async (values: any, { resetForm, setSubmitting }: any) => {
    try {
      const dataToSubmit = { ...values };
      if (isIncome) {
        delete dataToSubmit.categoryId;
        delete dataToSubmit.typeId;
      }

      console.log(dataToSubmit)
      await axios.post(submitEndpoint, dataToSubmit);
      resetForm();
      handleClose();
      // Refrescamos para visualizar el elemento nuevo en la tabla (alternativa a Server Actions en Next js)
      window.location.reload();
    } catch (error) {
      console.error(`Error al crear ${type}:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        color={isIncome ? "success" : "error"}
        variant="contained"
        onClick={handleOpen}
      >
        {buttonText}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
      >
        <div className="transaction-modal-container animate-fade-in-up">
          <Typography id="modal-title" variant="h4" className="transaction-modal-title">
            {title}
          </Typography>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting, values, setFieldValue, isValid, handleChange }) => (
              <Form className="flex flex-col">
                <div className="transaction-form-element">
                  <Field
                    className="w-full"
                    label="Descripción"
                    name="description"
                    type="text"
                    component={FormInput}
                    value={values.description}
                  />
                  <div className="form-error-message">
                    <ErrorMessage name="description" />
                  </div>
                </div>

                <div className="transaction-form-element">
                  <Field
                    className="w-full"
                    label="Monto"
                    name="amount"
                    type="number"
                    component={FormInput}
                    value={values.amount}
                  />
                  <div className="form-error-message">
                    <ErrorMessage name="amount" />
                  </div>
                </div>

                <div className="transaction-form-element">
                  <MobileDatePicker
                    label="Fecha"
                    name="date"
                    format="DD/MM/YYYY"
                    defaultValue={values.date}
                    onChange={(value) => setFieldValue("date", value)}
                    className="w-full"
                  />
                </div>

                {!isIncome && (
                  <div className="transaction-form-element">
                    <FormControl fullWidth>
                      <InputLabel id="expense-type-select-label">Tipo de gasto</InputLabel>
                      <Select
                        labelId="expense-type-select-label"
                        label="Tipo de gasto"
                        name="typeId"
                        value={values.typeId}
                        onChange={handleChange}
                      >
                        {expenseTypes.map((expenseType: any) => (
                          <MenuItem value={expenseType.id} key={expenseType.id}>
                            {expenseType.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div className="form-error-message">
                      <ErrorMessage name="categoryId" />
                    </div>
                  </div>
                )}

                {!isIncome && (
                  <div className="transaction-form-element">
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
                    <div className="form-error-message">
                      <ErrorMessage name="categoryId" />
                    </div>
                  </div>
                )}

                <div className="transaction-modal-actions">
                  <Button
                    onClick={handleClose}
                    variant="text"
                    color="inherit"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="large"
                    variant="contained"
                    color={isIncome ? "success" : "error"}
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="btn-submit"
                  >
                    {isSubmitting ? "Guardando..." : "Crear"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
}
