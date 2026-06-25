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
  triggerClassName?: string;
  open?: boolean;
  onClose?: () => void;
  initialData?: {
    id: number;
    description?: string;
    amount: number;
    date: Date;
    categoryId?: number;
    typeId?: number;
  };
}

export default function TransactionModal({
  type,
  buttonText,
  title,
  triggerClassName,
  open: controlledOpen,
  onClose: controlledOnClose,
  initialData,
}: TransactionModalProps) {
  const [selfOpen, setSelfOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen! : selfOpen;
  const handleOpen = () => setSelfOpen(true);
  const handleClose = () => {
    if (isControlled) controlledOnClose?.();
    else setSelfOpen(false);
  };

  const [categories, setCategories] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);

  const isIncome = type === "income";
  const isEditMode = !!initialData;

  const selectMenuProps = {
    PaperProps: {
      sx: {
        bgcolor: "#161c2d",
        backgroundImage: "none",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        "& .MuiMenuItem-root": {
          color: "#cbd5e1",
          fontSize: "0.925rem",
          "&:hover": {
            bgcolor: "rgba(96, 165, 250, 0.1)",
            color: "#f1f5f9",
          },
          "&.Mui-selected": {
            bgcolor: "rgba(96, 165, 250, 0.15)",
            color: "#60a5fa",
            "&:hover": { bgcolor: "rgba(96, 165, 250, 0.2)" },
          },
        },
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "4px",
        },
      },
    },
  };
  const categoryEndpoint = "/expenses-category";
  const expenseTypeEndpoint = "/expenses-type";
  const submitEndpoint = isIncome ? "/incomes" : "/expenses";

  const initialValues = {
    description: initialData?.description ?? "",
    amount: initialData?.amount ?? "",
    date: initialData?.date ? dayjs(initialData.date) : dayjs(),
    categoryId: initialData?.categoryId ?? "",
    typeId: initialData?.typeId ?? "",
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

      if (isEditMode) {
        await axios.put(`${submitEndpoint}/${initialData!.id}`, dataToSubmit);
      } else {
        await axios.post(submitEndpoint, dataToSubmit);
      }
      resetForm();
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error(`Error al ${isEditMode ? "actualizar" : "crear"} ${type}:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!isControlled && (
        <Button
          color={isIncome ? "success" : "error"}
          variant="contained"
          onClick={handleOpen}
          className={triggerClassName}
        >
          {buttonText}
        </Button>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
      >
        <div className={`transaction-modal-container animate-fade-in-up ${isIncome ? "transaction-modal--income" : "transaction-modal--expense"}`}>
          <Typography id="modal-title" variant="h4" className="transaction-modal-title">
            {title}
          </Typography>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize
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
                    value={values.date}
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
                        MenuProps={selectMenuProps}
                      >
                        {expenseTypes.map((expenseType: any) => (
                          <MenuItem value={expenseType.id} key={expenseType.id}>
                            {expenseType.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div className="form-error-message">
                      <ErrorMessage name="typeId" />
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
                        MenuProps={selectMenuProps}
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
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(255,255,255,0.25)",
                      color: "#94a3b8",
                      borderRadius: "12px",
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.5)",
                        backgroundColor: "rgba(255,255,255,0.05)",
                      },
                    }}
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
                    {isSubmitting ? "Guardando..." : isEditMode ? "Actualizar" : "Crear"}
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
