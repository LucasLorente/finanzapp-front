"use client"

import { DonutChart } from "@/shared/components/Charts/DonutChart"
import { GroupedData } from "@/types"

const CHART_COLORS = ["#38bdf8", "#4ade80", "#fb7185", "#fbbf24", "#a78bfa", "#f97316"]

interface Props {
    data: GroupedData[]
}

const ExpensesByCategoryChart = ({ data }: Props) => {
    const valueFormatter = (number: number) =>
        `$${Intl.NumberFormat("es-AR").format(number).toString()}`

    const filtered = [...data].filter(item => item.total > 0).sort((a, b) => b.total - a.total)

    return (
        <div className="dark-card p-6">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-1">Gastos por Categoría</h2>
                <p className="text-sm text-slate-400">Distribución de tus gastos según su categoría</p>
            </div>
            <div style={{ height: 350, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <DonutChart
                    data={filtered}
                    category="total"
                    index="name"
                    valueFormatter={valueFormatter}
                    className="h-64"
                />

                <div className="mt-4 w-full">
                    <div className="grid grid-cols-4 gap-4">
                        {filtered.map((item, index) => {
                            const color = CHART_COLORS[index % CHART_COLORS.length]
                            return (
                                <div key={item.name} className="flex items-center space-x-2">
                                    <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-semibold">{item.name}</span>
                                        <span className="text-sm font-bold text-white">{valueFormatter(item.total)}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpensesByCategoryChart
