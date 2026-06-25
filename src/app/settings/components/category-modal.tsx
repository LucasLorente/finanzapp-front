"use client";

import axios from "@/config/api";
import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import FormInput from "@/shared/components/Form/form-input";
import "./category-modal.scss";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  endpoint: string;
  initialValues?: { id: number; name: string };
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, "Nombre demasiado largo")
    .required("El nombre es requerido"),
});

export default function CategoryModal({
  open,
  onClose,
  onSaved,
  endpoint,
  initialValues,
}: CategoryModalProps) {
  const isEdit = !!initialValues;

  const handleSubmit = async (values: { name: string }, { setSubmitting }: any) => {
    try {
      if (isEdit) {
        await axios.put(`${endpoint}/${initialValues!.id}`, { name: values.name });
      } else {
        await axios.post(endpoint, { name: values.name });
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
    <Modal open={open} onClose={onClose} aria-labelledby="category-modal-title">
      <div className="category-modal-container">
        <Typography
          id="category-modal-title"
          variant="h5"
          className="category-modal-title"
        >
          {isEdit ? "Editar" : "Agregar"}
        </Typography>

        <Formik
          initialValues={{ name: initialValues?.name ?? "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, isValid, values }) => (
            <Form>
              <div className="category-form-element">
                <Field
                  className="w-full"
                  label="Nombre"
                  name="name"
                  type="text"
                  component={FormInput}
                  value={values.name}
                />
                <div className="category-form-error">
                  <ErrorMessage name="name" />
                </div>
              </div>

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
