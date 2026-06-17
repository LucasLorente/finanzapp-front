"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "./Header.styles.module.scss";

const Header = () => {
  const pathname = usePathname();

  return (
    <div className={`sticky top-0 z-50 min-h-20 flex justify-around items-center ${styles.header}`}>
      <Link
        className={`${styles["nav-link"]} ${pathname === "/expenses" ? styles["nav-link-active"] : ""}`}
        href="/expenses"
      >
        Gastos
      </Link>
      <Link
        className={`${styles.logo} ${pathname === "/" ? styles["logo-active"] : ""}`}
        href="/"
      >
        FinanzApp
      </Link>
      <Link
        className={`${styles["nav-link"]} ${pathname === "/incomes" ? styles["nav-link-active"] : ""}`}
        href="/incomes"
      >
        Ingresos
      </Link>
    </div>
  );
};

export default Header;
