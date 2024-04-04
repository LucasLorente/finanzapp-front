"use client";

import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="sticky top-0 z-50 min-h-20 flex justify-around items-center secondary-color">
      <Link
        className="text-3xl font-bold text-white cursor-pointer"
        href="/expenses"
      >
        Expenses
      </Link>
      <Link className="text-3xl font-bold text-white cursor-pointer" href="/">
        Home
      </Link>
      <Link
        className="text-3xl font-bold text-white cursor-pointer"
        href="/incomes"
      >
        Incomes
      </Link>
    </div>
  );
};

export default Header;
