"use client";

import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { ErrorMessage, Field, Form, Formik } from "formik";
import dayjs from "dayjs";
import * as Yup from "yup";
import FormInput from "@/shared/components/Form/form-input";
import { selectMenuProps } from "@/shared/components/Form/select-menu-props";
import { createRecurring, updateRecurring } from "@/services/api.recurring";
import { ExpenseCategory, ExpenseType, RecurringKind, RecurringTransaction } from "@/types";
import "./category-modal.scss";

interface RecurringModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  kind: RecurringKind;
  categories: ExpenseCategory[];
  types: ExpenseType[];
  initialValues?: RecurringTransaction;
}

export default function RecurringModal({
  open,
  onClose,
  onSaved,
  kind,
  categories,
  types,
  initialValues,
}: RecurringModalProps) {
  const isEdit = !!initialValues;
  const isIncome = kind === "income";

  const validationSchema = Yup.object().shape({
    description: Yup.string()
      .max(50, "Descripción demasiado larga")
      .required("La descripción es requerida"),
    amount: Yup.number()
      .required("El monto es requerido")
      .positive("Debe ser un monto positivo")
      .integer(),
    dayOfMonth: Yup.number()
      .required("El día es requerido")
      .integer()
      .min(1, "Debe ser entre 1 y 31")
      .max(31, "Debe ser entre 1 y 31"),
    startDate: Yup.mixed().required("El mes de inicio es requerido"),
    categoryId: isIncome
      ? Yup.mixed().notRequired()
      : Yup.number().required("La categoría es requerida").integer(),
    typeId: isIncome
      ? Yup.mixed().notRequired()
      : Yup.number().required("El tipo de gasto es requerido").integer(),
  });

  const formValues = {
    description: initialValues?.description ?? "",
    amount: initialValues?.amount ?? "",
    dayOfMonth: initialValues?.day_of_month ?? "",
    startDate: initialValues ? dayjs(String(initialValues.start_date).slice(0, 10)) : dayjs().startOf("month"),
    categoryId: initialValues?.category_id ?? "",
    typeId: initialValues?.type_id ?? "",
  };

  const handleSubmit = async (values: typeof formValues, { setSubmitting }: any) => {
    try {
      const payload = {
        kind,
        description: values.description,
        amount: Number(values.amount),
        dayOfMonth: Number(values.dayOfMonth),
        startDate: values.startDate.startOf("month").format("YYYY-MM-DD"),
        active: initialValues?.active ?? true,
        categoryId: isIncome ? null : Number(values.categoryId),
        typeId: isIncome ? null : Number(values.typeId),
      };
      if (isEdit) {
        await updateRecurring(initialValues!.id, payload);
      } else {
        await createRecurring(payload);
      }
      onClose();
      onSaved();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="recurring-modal-title">
      <div className="category-modal-container">
        <Typography id="recurring-modal-title" variant="h5" className="category-modal-title">
          {isEdit ? "Editar" : "Agregar"} {isIncome ? "ingreso recurrente" : "gasto recurrente"}
        </Typography>

        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, isValid, values, setFieldValue, handleChange }) => (
            <Form>
              <div className="category-form-element">
                <Field
                  className="w-full"
                  label="Descripción"
                  name="description"
                  type="text"
                  component={FormInput}
                  value={values.description}
                />
                <div className="category-form-error">
                  <ErrorMessage name="description" />
                </div>
              </div>

              <div className="category-form-element">
                <Field
                  className="w-full"
                  label={isIncome ? "Monto" : "Monto estimado"}
                  name="amount"
                  type="number"
                  component={FormInput}
                  value={values.amount}
                />
                <div className="category-form-error">
                  <ErrorMessage name="amount" />
                </div>
              </div>

              <div className="category-form-element">
                <Field
                  className="w-full"
                  label="Día del mes"
                  name="dayOfMonth"
                  type="number"
                  component={FormInput}
                  value={values.dayOfMonth}
                  inputProps={{ min: 1, max: 31 }}
                />
                <div className="category-form-error">
                  <ErrorMessage name="dayOfMonth" />
                </div>
              </div>

              <div className="category-form-element">
                <MobileDatePicker
                  label="Desde"
                  views={["year", "month"]}
                  openTo="month"
                  format="MM/YYYY"
                  value={values.startDate}
                  onChange={(value) => setFieldValue("startDate", value)}
                  className="w-full"
                />
              </div>

              {!isIncome && (
                <div className="category-form-element">
                  <FormControl fullWidth>
                    <InputLabel id="recurring-type-select-label">Tipo de gasto</InputLabel>
                    <Select
                      labelId="recurring-type-select-label"
                      label="Tipo de gasto"
                      name="typeId"
                      value={values.typeId}
                      onChange={handleChange}
                      MenuProps={selectMenuProps}
                    >
                      {types.map((type) => (
                        <MenuItem value={type.id} key={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="category-form-error">
                    <ErrorMessage name="typeId" />
                  </div>
                </div>
              )}

              {!isIncome && (
                <div className="category-form-element">
                  <FormControl fullWidth>
                    <InputLabel id="recurring-category-select-label">Categoría</InputLabel>
                    <Select
                      labelId="recurring-category-select-label"
                      label="Categoría"
                      name="categoryId"
                      value={values.categoryId}
                      onChange={handleChange}
                      MenuProps={selectMenuProps}
                    >
                      {categories.map((category) => (
                        <MenuItem value={category.id} key={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="category-form-error">
                    <ErrorMessage name="categoryId" />
                  </div>
                </div>
              )}

              <div className="category-modal-actions">
                <Button
                  onClick={onClose}
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
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !isValid}
                  sx={{
                    borderRadius: "12px",
                    fontWeight: 800,
                    textTransform: "none",
                    fontSize: "1rem",
                    padding: "10px",
                  }}
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
