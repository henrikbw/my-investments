/**
 * Asset allocation chart component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { AllocationChartData } from '@/services/projections'
import { MODULE_LABELS } from '@/constants/defaults'

interface AllocationChartProps {
  data: AllocationChartData[]
}

export function AllocationChart({ data }: AllocationChartProps) {
  // Transform data to include all fields as indexable properties
  const chartData = data.map((item) => ({
    ...item,
    [item.name]: item.value,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry: any) => `${entry.percentage.toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                MODULE_LABELS[name as keyof typeof MODULE_LABELS],
              ]}
            />
            <Legend
              formatter={(value) => MODULE_LABELS[value as keyof typeof MODULE_LABELS]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
