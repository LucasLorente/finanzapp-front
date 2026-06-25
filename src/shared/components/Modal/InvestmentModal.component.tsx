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
import { InvestmentCategory, InvestmentType } from "@/types";
import "./InvestmentModal.component.scss";

interface InvestmentModalProps {
  buttonText: string;
  title: string;
  triggerClassName?: string;
}

export default function InvestmentModal({ buttonText, title, triggerClassName }: InvestmentModalProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [categories, setCategories] = useState<InvestmentCategory[]>([]);
  const [investmentTypes, setInvestmentTypes] = useState<InvestmentType[]>([]);

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

  const initialValues = {
    description: "",
    amount_invested: "",
    current_value: "",
    date: dayjs(),
    categoryId: "",
    typeId: "",
    ticker: "",
  };

  const validationSchema = Yup.object().shape({
    description: Yup.string()
      .max(50, "Descripción demasiado larga")
      .required("La descripción es requerida"),
    amount_invested: Yup.number()
      .required("El monto invertido es requerido")
      .positive("Debe ser un monto positivo"),
    current_value: Yup.number()
      .required("El valor actual es requerido")
      .positive("Debe ser un monto positivo"),
    date: Yup.date().required("La fecha es requerida"),
    categoryId: Yup.number().required("La categoría es requerida").integer(),
    typeId: Yup.number().required("El tipo de inversión es requerido").integer(),
    ticker: Yup.string().optional(),
  });

  useEffect(() => {
    if (!open) return;

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/investment-category");
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    const fetchTypes = async () => {
      try {
        const { data } = await axios.get("/investment-type");
        setInvestmentTypes(data);
      } catch (error) {
        console.error("Error al obtener tipos de inversión:", error);
      }
    };

    fetchCategories();
    fetchTypes();
  }, [open]);

  const handleSubmit = async (values: typeof initialValues, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (v: boolean) => void }) => {
    try {
      const dataToSubmit = {
        ...values,
        ticker: values.ticker || undefined,
      };
      await axios.post("/investments", dataToSubmit);
      resetForm();
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al crear la inversión:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        className={triggerClassName}
      >
        {buttonText}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="investment-modal-title"
      >
        <div className="investment-modal-container animate-fade-in-up">
          <Typography id="investment-modal-title" variant="h4" className="investment-modal-title">
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
                    label="Monto Invertido"
                    name="amount_invested"
                    type="number"
                    component={FormInput}
                    value={values.amount_invested}
                  />
                  <div className="form-error-message">
                    <ErrorMessage name="amount_invested" />
                  </div>
                </div>

                <div className="transaction-form-element">
                  <Field
                    className="w-full"
                    label="Valor Actual"
                    name="current_value"
                    type="number"
                    component={FormInput}
                    value={values.current_value}
                  />
                  <div className="form-error-message">
                    <ErrorMessage name="current_value" />
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
                    <InputLabel id="investment-type-select-label">Tipo de inversión</InputLabel>
                    <Select
                      labelId="investment-type-select-label"
                      label="Tipo de inversión"
                      name="typeId"
                      value={values.typeId}
                      onChange={handleChange}
                      MenuProps={selectMenuProps}
                    >
                      {investmentTypes.map((t) => (
                        <MenuItem value={t.id} key={t.id}>
                          {t.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="form-error-message">
                    <ErrorMessage name="typeId" />
                  </div>
                </div>

                <div className="transaction-form-element">
                  <FormControl fullWidth>
                    <InputLabel id="investment-category-select-label">Categoría</InputLabel>
                    <Select
                      labelId="investment-category-select-label"
                      label="Categoría"
                      name="categoryId"
                      value={values.categoryId}
                      onChange={handleChange}
                      MenuProps={selectMenuProps}
                    >
                      {categories.map((c) => (
                        <MenuItem value={c.id} key={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="form-error-message">
                    <ErrorMessage name="categoryId" />
                  </div>
                </div>

                <div className="transaction-form-element">
                  <Field
                    className="w-full"
                    label="Ticker (opcional)"
                    name="ticker"
                    type="text"
                    component={FormInput}
                    value={values.ticker}
                  />
                </div>

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
                    color="primary"
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
