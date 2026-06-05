"use client"

import React from "react"
import {
    Bar,
    BarChart as RechartsBarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { cx } from "@/lib/utils"

interface BarDef {
    key: string
    color: string
    label: string
}

interface BarChartProps {
    data: { name: string; [key: string]: number | string }[]
    bars: BarDef[]
    valueFormatter?: (value: number) => string
    className?: string
}

const BarChart = ({
    data,
    bars,
    valueFormatter = (v) => v.toString(),
    className,
}: BarChartProps) => {
    return (
        <div className={cx("h-80 w-full", className)}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data} barCategoryGap="30%" barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#9ca3af", fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={valueFormatter}
                        tick={{ fill: "#9ca3af", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={80}
                    />
                    <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                        content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null
                            return (
                                <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
                                    {payload.map((entry) => (
                                        <p key={entry.dataKey as string} className="text-sm text-gray-500">
                                            <span className="font-medium" style={{ color: entry.color }}>
                                                {bars.find((b) => b.key === entry.dataKey)?.label ?? String(entry.dataKey)}
                                            </span>
                                            {": "}
                                            {valueFormatter(entry.value as number)}
                                        </p>
                                    ))}
                                </div>
                            )
                        }}
                    />
                    {bars.map((bar) => (
                        <Bar key={bar.key} dataKey={bar.key} fill={bar.color} radius={[4, 4, 0, 0]} />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    )
}

export { BarChart }
