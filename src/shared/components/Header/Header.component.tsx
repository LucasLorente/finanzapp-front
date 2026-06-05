"use client";

import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="sticky top-0 z-50 min-h-20 flex justify-around items-center secondary-color border-b border-white/10">
      <Link
        className="text-2xl font-bold text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
        href="/expenses"
      >
        Gastos
      </Link>
      <Link className="text-2xl font-bold text-white cursor-pointer" href="/">
        FinanzApp
      </Link>
      <Link
        className="text-2xl font-bold text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
        href="/incomes"
      >
        Ingresos
      </Link>
    </div>
  );
};

export default Header;
