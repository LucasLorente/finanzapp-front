"use client"

import { BarChart } from "@/shared/components/Charts/BarChart"

interface Props {
    totalExpenses: number
    weeklyExpenses: number
    monthlyExpenses: number
    totalIncomes: number
    weeklyIncomes: number
    monthlyIncomes: number
}

const BARS = [
    { key: "incomes", color: "#4ade80", label: "Ingresos" },
    { key: "expenses", color: "#fb7185", label: "Gastos" },
]

const IncomeVsExpensesChart = ({
    totalExpenses,
    weeklyExpenses,
    monthlyExpenses,
    totalIncomes,
    weeklyIncomes,
    monthlyIncomes,
}: Props) => {
    const valueFormatter = (number: number) =>
        `$${Intl.NumberFormat("es-AR").format(number).toString()}`

    const data = [
        { name: "Total", incomes: totalIncomes, expenses: totalExpenses },
        { name: "Mensual", incomes: monthlyIncomes, expenses: monthlyExpenses },
        { name: "Semanal", incomes: weeklyIncomes, expenses: weeklyExpenses },
    ]

    return (
        <div className="dark-card p-6">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-1">Ingresos vs Gastos</h2>
                <p className="text-sm text-slate-400">Comparación entre ingresos y gastos por período</p>
            </div>
            <BarChart
                data={data}
                bars={BARS}
                valueFormatter={valueFormatter}
                className="h-64"
            />
            <div className="mt-3 flex gap-6 justify-center">
                {BARS.map((bar) => (
                    <div key={bar.key} className="flex items-center space-x-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: bar.color }} />
                        <span className="text-sm font-semibold text-slate-300">{bar.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default IncomeVsExpensesChart
