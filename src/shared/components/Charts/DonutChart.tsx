"use client"

import {
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts"
import { cx } from "@/lib/utils"

const CHART_COLORS = ["#38bdf8", "#4ade80", "#fb7185", "#fbbf24", "#a78bfa", "#f97316"]

interface DonutChartProps {
    data: Record<string, unknown>[]
    category: string
    index: string
    variant?: "donut" | "pie"
    className?: string
    valueFormatter?: (value: number) => string
    colors?: string[]
}

const DonutChart = ({
    data,
    category,
    index,
    variant = "donut",
    className,
    valueFormatter = (value: number) => value.toString(),
    colors,
}: DonutChartProps) => {
    const palette = colors ?? CHART_COLORS
    const coloredData = data.map((item, idx) => ({
        ...item,
        fill: palette[idx % palette.length],
    }))

    return (
        <div className={cx("h-80 w-full", className)}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const item = payload[0].payload
                                return (
                                    <div style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 12px" }}>
                                        <p style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600, margin: 0 }}>
                                            {item[index]}
                                        </p>
                                        <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
                                            {valueFormatter(item[category])}
                                        </p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Pie
                        data={coloredData}
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
                        stroke="transparent"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export { DonutChart }
