"use client"

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
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#94a3b8", fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={valueFormatter}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={80}
                    />
                    <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null
                            return (
                                <div style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 14px" }}>
                                    <p style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600, margin: "0 0 4px 0" }}>{label}</p>
                                    {payload.map((entry) => (
                                        <p key={entry.dataKey as string} style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
                                            <span style={{ color: entry.color, fontWeight: 600 }}>
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
