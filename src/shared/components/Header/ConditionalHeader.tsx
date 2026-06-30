"use client";

import { usePathname } from "next/navigation";
import Header from "./Header.component";

const HIDDEN_ROUTES = ["/login", "/register"];

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (HIDDEN_ROUTES.includes(pathname)) return null;
  return <Header />;
}
