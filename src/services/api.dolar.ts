import { DolarRate } from "@/types";

const fetchDolarOficial = async (): Promise<DolarRate> => {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares/oficial", {
      next: { revalidate: 43200 },
    });
    if (!res.ok) throw new Error("Error al obtener el dólar oficial");
    return res.json();
  } catch (error) {
    console.error("Error al obtener el dólar oficial:", error);
    throw new Error("Error al obtener el dólar oficial");
  }
};

export { fetchDolarOficial };
