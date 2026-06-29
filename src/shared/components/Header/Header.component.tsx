"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { removeAuthToken } from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import styles from "./Header.styles.module.scss";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currency, toggleCurrency } = useCurrency();

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  return (
    <div className={`sticky top-0 z-50 min-h-20 flex justify-around items-center ${styles.header}`}>
      <Link
        className={`${styles["nav-link"]} ${pathname === "/expenses" ? styles["nav-link-active"] : ""}`}
        href="/expenses"
      >
        Gastos
      </Link>
      <Link
        className={`${styles["nav-link"]} ${pathname === "/incomes" ? styles["nav-link-active"] : ""}`}
        href="/incomes"
      >
        Ingresos
      </Link>
      <Link
        className={`${styles.logo} ${pathname === "/" ? styles["logo-active"] : ""}`}
        href="/"
      >
        FinanzApp
      </Link>
      <Link
        className={`${styles["nav-link"]} ${pathname === "/investments" ? styles["nav-link-active"] : ""}`}
        href="/investments"
      >
        Inversiones
      </Link>
      <Link
        className={`${styles["nav-link"]} ${pathname === "/settings" ? styles["nav-link-active"] : ""}`}
        href="/settings"
      >
        Configurar
      </Link>
      <button onClick={toggleCurrency} className={styles["currency-toggle"]}>
        {currency}
      </button>
      <button onClick={handleLogout} className={styles["logout-btn"]}>
        Salir
      </button>
    </div>
  );
};

export default Header;
