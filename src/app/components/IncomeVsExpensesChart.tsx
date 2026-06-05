"use client"

import React from "react"
import { BarChart } from "@/shared/components/Charts/BarChart"
import { Card, Typography, Box } from "@mui/material"

interface Props {
    totalExpenses: number
    weeklyExpenses: number
    monthlyExpenses: number
    totalIncomes: number
    weeklyIncomes: number
    monthlyIncomes: number
}

const BARS = [
    { key: "incomes", color: "#10b981", label: "Ingresos" },
    { key: "expenses", color: "#ec4899", label: "Gastos" },
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
        <Card className="p-6 white-color rounded-2xl shadow-lg border-0">
            <Box mb={4}>
                <Typography variant="h5" component="h2" className="text-gray-900 font-bold mb-1">
                    Ingresos vs Gastos
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                    Comparación entre ingresos y gastos por período
                </Typography>
            </Box>
            <BarChart
                data={data}
                bars={BARS}
                valueFormatter={valueFormatter}
                className="h-64"
            />
            <Box mt={3} className="flex gap-6 justify-center">
                {BARS.map((bar) => (
                    <div key={bar.key} className="flex items-center space-x-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: bar.color }} />
                        <span className="text-sm font-semibold text-gray-600">{bar.label}</span>
                    </div>
                ))}
            </Box>
        </Card>
    )
}

export default IncomeVsExpensesChart
