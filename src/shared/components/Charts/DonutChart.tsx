"use client"

import React from "react"
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts"
import { cx } from "@/lib/utils"

const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"]

interface DonutChartProps {
    data: any[]
    category: string
    index: string
    variant?: "donut" | "pie"
    className?: string
    valueFormatter?: (value: number) => string
}

const DonutChart = ({
    data,
    category,
    index,
    variant = "donut",
    className,
    valueFormatter = (value: number) => value.toString(),
}: DonutChartProps) => {
    return (
        <div className={cx("h-80 w-full", className)}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                    <div className="rounded-md border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                                        <p className="text-sm font-medium text-gray-900 shadow-none">
                                            {data[index]}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {valueFormatter(data[category])}
                                        </p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={variant === "donut" ? "75%" : "0%"}
                        outerRadius="100%"
                        paddingAngle={2}
                        dataKey={category}
                        nameKey={index}
                        isAnimationActive={true}
                    >
                        {data.map((_, idx) => (
                            <Cell
                                key={`cell-${idx}`}
                                fill={CHART_COLORS[idx % CHART_COLORS.length]}
                                className="stroke-white dark:stroke-gray-950 transition-all duration-300 outline-none"
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export { DonutChart }
