/**
 * Equity projection chart component
 * Shows equity growth over time (assets - loans)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '@/utils/format'

export interface EquityChartData {
  year: number
  actualYear: number
  label: string
  assetValue: number
  loanBalance: number
  equity: number
}

interface EquityProjectionChartProps {
  data: EquityChartData[]
}

function EquityChartTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload as EquityChartData
  const isPositiveEquity = data.equity >= 0

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-2 font-semibold text-card-foreground">{data.actualYear}</p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Asset Value</span>
          <span className="font-medium text-green-600">
            {formatCurrency(data.assetValue)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Loan Balance</span>
          <span className="font-medium text-red-600">
            {formatCurrency(data.loanBalance)}
          </span>
        </div>

        <div className="border-t pt-1.5 mt-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">Equity</span>
            <span className={`font-bold ${isPositiveEquity ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.equity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EquityProjectionChart({ data }: EquityProjectionChartProps) {
  // Calculate appropriate interval for X-axis labels
  const dataLength = data.length
  let xAxisInterval = 0
  if (dataLength > 20) {
    xAxisInterval = Math.floor(dataLength / 10)
  } else if (dataLength > 10) {
    xAxisInterval = Math.floor(dataLength / 8)
  } else if (dataLength > 5) {
    xAxisInterval = 1
  }

  // Find min/max for better Y-axis scaling
  const allValues = data.flatMap(d => [d.assetValue, d.loanBalance, d.equity])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const padding = (maxValue - minValue) * 0.1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equity Projection</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="label"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              interval={xAxisInterval}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => {
                if (Math.abs(value) >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`
                }
                return `${(value / 1000).toFixed(0)}k`
              }}
              domain={[Math.floor(minValue - padding), Math.ceil(maxValue + padding)]}
            />
            <Tooltip
              content={<EquityChartTooltip />}
              cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
            />
            <Legend />

            {/* Zero reference line */}
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />

            {/* Asset value area */}
            <Area
              type="monotone"
              dataKey="assetValue"
              name="Asset Value"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.1}
              strokeWidth={2}
            />

            {/* Loan balance area */}
            <Area
              type="monotone"
              dataKey="loanBalance"
              name="Loan Balance"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.1}
              strokeWidth={2}
            />

            {/* Equity line (most prominent) */}
            <Area
              type="monotone"
              dataKey="equity"
              name="Equity"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
