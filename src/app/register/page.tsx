"use client";

import RegisterForm from "./components/register-form";
import styles from "./register.module.scss";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>FinanzApp</h1>
        <h2 className={styles.title}>Crear cuenta</h2>
        <RegisterForm />
        <p className={styles.footer}>
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className={styles.link}>
            Iniciá sesión
          </a>
        </p>
      </div>
    </div>
  );
}
