"use client";

import { Investment, InvestmentCategory, InvestmentType } from "@/types";
import InvestmentsTable from "./investments-table";

interface InvestmentsListProps {
  investments: Investment[];
  total: number;
  categories: InvestmentCategory[];
  types: InvestmentType[];
}

export default function InvestmentsList({ investments, total, categories, types }: InvestmentsListProps) {
  return (
    <InvestmentsTable
      data={investments}
      total={total}
      categories={categories}
      types={types}
    />
  );
}
