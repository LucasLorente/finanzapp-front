"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { register } from "@/services/api.auth";
import styles from "../register.module.scss";

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string().email("Email inválido").required("El email es requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirmá la contraseña"),
});

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setServerError("");
          await register(values.email, values.password, values.name);
          router.push("/login");
        } catch {
          setServerError("No se pudo crear la cuenta. Intentá con otro email.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={styles.form}>
          <div className={styles["field-wrapper"]}>
            <Field name="name">
              {({ field }: any) => (
                <TextField
                  {...field}
                  label="Nombre"
                  fullWidth
                  error={touched.name && Boolean(errors.name)}
                  sx={inputSx}
                />
              )}
            </Field>
            <ErrorMessage name="name">
              {(msg) => <span className={styles["field-error"]}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={styles["field-wrapper"]}>
            <Field name="email">
              {({ field }: any) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  sx={inputSx}
                />
              )}
            </Field>
            <ErrorMessage name="email">
              {(msg) => <span className={styles["field-error"]}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={styles["field-wrapper"]}>
            <Field name="password">
              {({ field }: any) => (
                <TextField
                  {...field}
                  label="Contraseña"
                  type="password"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  sx={inputSx}
                />
              )}
            </Field>
            <ErrorMessage name="password">
              {(msg) => <span className={styles["field-error"]}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={styles["field-wrapper"]}>
            <Field name="confirmPassword">
              {({ field }: any) => (
                <TextField
                  {...field}
                  label="Confirmar contraseña"
                  type="password"
                  fullWidth
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  sx={inputSx}
                />
              )}
            </Field>
            <ErrorMessage name="confirmPassword">
              {(msg) => <span className={styles["field-error"]}>{msg}</span>}
            </ErrorMessage>
          </div>

          {serverError && <p className={styles["server-error"]}>{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles["submit-btn"]}
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#f1f5f9",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(98,144,200,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#6290C8" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6290C8" },
};
