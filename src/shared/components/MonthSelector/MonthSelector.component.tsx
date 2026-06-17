"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import styles from "./MonthSelector.styles.module.scss";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const MONTHS_SHORT = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export default function MonthSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const popoverRef = useRef<HTMLDivElement>(null);

  const rawMonth = searchParams.get("month");
  const current = rawMonth ? dayjs(rawMonth + "-01") : dayjs().startOf("month");

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverYear, setPopoverYear] = useState(current.year());

  const today = dayjs().startOf("month");
  const isCurrentMonth = current.isSame(today, "month");

  function navigate(yearMonth: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", yearMonth);
    router.push(`?${params.toString()}`);
  }

  function goPrev() {
    navigate(current.subtract(1, "month").format("YYYY-MM"));
  }

  function goNext() {
    if (!isCurrentMonth) {
      navigate(current.add(1, "month").format("YYYY-MM"));
    }
  }

  function selectMonth(monthIndex: number) {
    const selected = dayjs(new Date(popoverYear, monthIndex, 1));
    if (selected.isAfter(today)) return;
    navigate(selected.format("YYYY-MM"));
    setPopoverOpen(false);
  }

  function isMonthDisabled(monthIndex: number) {
    return dayjs(new Date(popoverYear, monthIndex, 1)).isAfter(today);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    }
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverOpen]);

  return (
    <div className={styles.container} ref={popoverRef}>
      <div className={styles.selector}>
        <button className={styles.arrow} onClick={goPrev} aria-label="Mes anterior">
          <ChevronLeft size={20} />
        </button>

        <button
          className={styles.label}
          onClick={() => {
            setPopoverYear(current.year());
            setPopoverOpen((o) => !o);
          }}
        >
          {MONTHS[current.month()]} {current.year()}
        </button>

        <button
          className={`${styles.arrow} ${isCurrentMonth ? styles.arrowDisabled : ""}`}
          onClick={goNext}
          disabled={isCurrentMonth}
          aria-label="Mes siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {popoverOpen && (
        <div className={styles.popover}>
          <div className={styles.yearNav}>
            <button
              className={styles.arrow}
              onClick={() => setPopoverYear((y) => y - 1)}
              aria-label="Año anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span className={styles.yearLabel}>{popoverYear}</span>
            <button
              className={`${styles.arrow} ${popoverYear >= today.year() ? styles.arrowDisabled : ""}`}
              onClick={() => setPopoverYear((y) => y + 1)}
              disabled={popoverYear >= today.year()}
              aria-label="Año siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.monthGrid}>
            {MONTHS_SHORT.map((name, i) => {
              const disabled = isMonthDisabled(i);
              const selected =
                current.month() === i && current.year() === popoverYear;
              return (
                <button
                  key={name}
                  className={`${styles.monthCell} ${selected ? styles.monthCellSelected : ""} ${disabled ? styles.monthCellDisabled : ""}`}
                  onClick={() => selectMonth(i)}
                  disabled={disabled}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
