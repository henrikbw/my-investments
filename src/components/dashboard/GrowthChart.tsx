/**
 * Growth chart component
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
} from 'recharts'
import { GrowthChartData } from '@/services/projections'
import { formatCurrency } from '@/utils/format'
import { MODULE_COLORS, MODULE_LABELS } from '@/constants/defaults'
import { InvestmentType } from '@/types'

interface GrowthChartProps {
  data: GrowthChartData[]
}

export function GrowthChart({ data }: GrowthChartProps) {
  // Check which asset types have non-zero values
  const hasStock = data.some((d) => d.stock > 0)
  const hasFund = data.some((d) => d.fund > 0)
  const hasRealEstate = data.some((d) => d['real-estate'] > 0)
  const hasCrypto = data.some((d) => d.crypto > 0)

  const assetTypes: Array<{ key: keyof GrowthChartData; label: string; color: string; hasData: boolean }> = [
    { key: 'stock', label: MODULE_LABELS.stock, color: MODULE_COLORS.stock, hasData: hasStock },
    { key: 'fund', label: MODULE_LABELS.fund, color: MODULE_COLORS.fund, hasData: hasFund },
    { key: 'real-estate', label: MODULE_LABELS['real-estate'], color: MODULE_COLORS['real-estate'], hasData: hasRealEstate },
    { key: 'crypto', label: MODULE_LABELS.crypto, color: MODULE_COLORS.crypto, hasData: hasCrypto },
  ]

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Growth Projection</CardTitle>
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
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'total') return [formatCurrency(value), 'Total']
                const assetType = assetTypes.find((a) => a.key === name)
                return [formatCurrency(value), assetType?.label || name]
              }}
            />
            <Legend
              formatter={(value) => {
                if (value === 'total') return 'Total'
                const assetType = assetTypes.find((a) => a.key === value)
                return assetType?.label || value
              }}
            />

            {/* Asset type areas (only render if they have data) */}
            {assetTypes.filter(a => a.hasData).map((asset) => (
              <Area
                key={asset.key}
                type="monotone"
                dataKey={asset.key}
                stroke={asset.color}
                fill={asset.color}
                fillOpacity={0.2}
                strokeWidth={1.5}
              />
            ))}

            {/* Total line on top */}
            <Area
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              fill="transparent"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
