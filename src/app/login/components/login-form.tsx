"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { login } from "@/services/api.auth";
import { setAuthToken } from "@/lib/auth";
import styles from "../login.module.scss";

const validationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("El email es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
});

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setServerError("");
          const { token } = await login(values.email, values.password);
          setAuthToken(token);
          router.push("/");
        } catch {
          setServerError("Email o contraseña incorrectos");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={styles.form}>
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

          {serverError && <p className={styles["server-error"]}>{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles["submit-btn"]}
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
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
