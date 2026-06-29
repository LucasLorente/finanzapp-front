"use client";

import LoginForm from "./components/login-form";
import styles from "./login.module.scss";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>FinanzApp</h1>
        <h2 className={styles.title}>Iniciar sesión</h2>
        <LoginForm />
        <p className={styles.footer}>
          ¿No tenés cuenta?{" "}
          <a href="/register" className={styles.link}>
            Registrate
          </a>
        </p>
      </div>
    </div>
  );
}
