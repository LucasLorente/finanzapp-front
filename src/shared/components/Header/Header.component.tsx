"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { removeAuthToken } from "@/lib/auth";
import { cx } from "@/lib/utils";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.styles.module.scss";

const NAV_LINKS = [
  { href: "/", label: "Resumen" },
  { href: "/expenses", label: "Gastos" },
  { href: "/incomes", label: "Ingresos" },
  { href: "/investments", label: "Inversiones" },
  { href: "/settings", label: "Configurar" },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currency, toggleCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    removeAuthToken();
    router.push("/login");
  };

  return (
    <header className={cx("sticky top-0 z-50", styles.header)}>
      <div className="px-4 h-16 flex items-center gap-3">
        <button
          type="button"
          className={styles["icon-btn"]}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="side-menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className={styles.logo} onClick={closeMenu}>
          FinanzApp
        </Link>

        <div className={styles["currency-toggle"]} role="group" aria-label="Moneda">
          {(["ARS", "USD"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={currency === option}
              onClick={() => currency !== option && toggleCurrency()}
              className={cx(
                styles["currency-option"],
                currency === option && styles["currency-option-active"]
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {menuOpen && (
        <>
          <div className={styles.backdrop} onClick={closeMenu} aria-hidden="true" />
          <aside id="side-menu" className={styles["side-menu"]}>
            <nav className="flex flex-col gap-1" aria-label="Principal">
              {NAV_LINKS.map(({ href, label }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={cx(styles["nav-link"], active && styles["nav-link-active"])}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            <button type="button" onClick={handleLogout} className={styles["logout-btn"]}>
              <LogOut size={16} />
              Salir
            </button>
          </aside>
        </>
      )}
    </header>
  );
};

export default Header;
