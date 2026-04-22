"use client"

import React, { useEffect, useState } from "react"
import { DonutChart } from "@/shared/components/Charts/DonutChart"
import { fetchExpensesByType } from "@/services/api.expenses"
import { GroupedData } from "@/types"
import { Card, Typography, Box } from "@mui/material"
import { cx } from "@/lib/utils"

const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"]

const ExpensesByTypeChart = () => {
    const [data, setData] = useState<GroupedData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            try {
                const result = await fetchExpensesByType()
                setData(result)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    if (loading) return <div>Cargando gráfico...</div>

    const valueFormatter = (number: number) =>
        `$${Intl.NumberFormat("es-AR").format(number).toString()}`

    return (
        <Card className="p-6 white-color rounded-2xl shadow-lg border-0">
            <Box mb={4}>
                <Typography variant="h5" component="h2" className="text-gray-900 font-bold mb-1">
                    Gastos por Tipo
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                    Distribución de tus gastos según su clasificación
                </Typography>
            </Box>
            <Box sx={{ height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <DonutChart
                    data={data}
                    category="total"
                    index="name"
                    valueFormatter={valueFormatter}
                    className="h-64"
                />
                
                <Box mt={4} className="w-full">
                    <div className="grid grid-cols-2 gap-4">
                        {data.map((item, index) => {
                            const color = CHART_COLORS[index % CHART_COLORS.length]
                            return (
                                <div key={item.name} className="flex items-center space-x-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 uppercase font-semibold">{item.name}</span>
                                        <span className="text-sm font-bold text-gray-900">{valueFormatter(item.total)}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Box>
            </Box>
        </Card>
    )
}

export default ExpensesByTypeChart
