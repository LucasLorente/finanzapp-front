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

  const isIncome = type === "income";
  const categoryEndpoint = isIncome ? "/income-category" : "/expenses-category";
  const submitEndpoint = isIncome ? "/incomes" : "/expenses";

  const initialValues = {
    description: "",
    amount: "",
    date: dayjs(),
    categoryId: "",
  };

  const validationSchema = Yup.object().shape({
    description: Yup.string()
      .max(50, "Descripción demasiado larga")
      .required("La descripción es requerida"),
    amount: Yup.number()
      .required("El monto es requerido")
      .positive("Debe ser un monto positivo")
      .integer(),
    date: Yup.date(),
    categoryId: Yup.number().required("La categoría es requerida").integer(),
  });

  useEffect(() => {
    // Solo fetchear las categorías cuando abrimos el modal
    if (!open) return;

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(categoryEndpoint);
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategories();
  }, [open, categoryEndpoint]);

  const handleSubmit = async (values: any, { resetForm, setSubmitting }: any) => {
    try {
      await axios.post(submitEndpoint, values);
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
        className={`m-3 text-white font-bold px-6 py-2 rounded-xl transition-all ${
           isIncome 
            ? "border border-green-500 hover:bg-green-500/20 hover:border-green-400 text-green-100 bg-green-500/10" 
            : "border border-red-500 hover:bg-red-500/20 hover:border-red-400 text-red-100 bg-red-500/10"
        }`}
        variant="outlined"
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

                <div className="transaction-modal-actions">
                  <Button 
                    onClick={handleClose} 
                    variant="text" 
                    color="inherit" 
                    className="text-white opacity-70 hover:opacity-100 hover:bg-white/10"
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
