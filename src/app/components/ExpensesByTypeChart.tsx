"use client"

import { useCurrency } from "@/context/CurrencyContext"
import { DonutChart } from "@/shared/components/Charts/DonutChart"
import { GroupedData } from "@/types"

const TYPE_COLORS: Record<string, string> = {
    "Fijos": "#38bdf8",
    "Variables Necesarios": "#fbbf24",
    "Superfluos": "#fb7185",
}
const FALLBACK_COLORS = ["#fb7185", "#4ade80", "#f97316"]

interface Props {
    data: GroupedData[]
}

const ExpensesByTypeChart = ({ data }: Props) => {
    const { formatAmount } = useCurrency()
    const valueFormatter = formatAmount

    let fallbackIdx = 0
    const colors = data.map((item) =>
        TYPE_COLORS[item.name] ?? FALLBACK_COLORS[fallbackIdx++ % FALLBACK_COLORS.length]
    )

    return (
        <div className="dark-card p-6">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-1">Gastos por Tipo</h2>
                <p className="text-sm text-slate-400">Distribución de tus gastos según su clasificación</p>
            </div>
            <div style={{ height: 350, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <DonutChart
                    data={data}
                    category="total"
                    index="name"
                    valueFormatter={valueFormatter}
                    className="h-64"
                    colors={colors}
                />

                <div className="mt-4 w-full">
                    <div className="grid grid-cols-2 gap-4">
                        {data.map((item, index) => (
                            <div key={`${item.name}-${index}`} className="flex items-center space-x-2">
                                <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[index] }} />
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 uppercase font-semibold">{item.name}</span>
                                    <span className="text-sm font-bold text-white">{valueFormatter(item.total)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpensesByTypeChart
