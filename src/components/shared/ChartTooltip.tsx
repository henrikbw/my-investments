/**
 * Reusable custom tooltip components for charts
 */

import { MODULE_LABELS, MODULE_COLORS } from '@/constants/defaults'
import { formatCurrency, formatPercentage } from '@/utils/format'
import { InvestmentType } from '@/types'
import { GrowthChartData, InvestmentDetail } from '@/services/projections'

interface GrowthChartTooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    payload: GrowthChartData
  }>
  label?: string
  startValue?: number
}

/**
 * Custom tooltip for the growth projection chart
 * Shows year, total value, breakdown by investment type, and growth from start
 */
export function GrowthChartTooltip({
  active,
  payload,
  startValue = 0,
}: GrowthChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  const totalValue = data.total
  const growthFromStart = totalValue - startValue
  const growthPercentage = startValue > 0 ? (growthFromStart / startValue) * 100 : 0

  // Get asset types that have data
  const assetTypes: Array<{ key: InvestmentType; value: number }> = [
    { key: 'stock', value: data.stock },
    { key: 'fund', value: data.fund },
    { key: 'real-estate', value: data['real-estate'] },
    { key: 'crypto', value: data.crypto },
  ].filter((item) => item.value > 0)

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-2 font-semibold text-card-foreground">{data.actualYear}</p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-medium text-card-foreground">
            {formatCurrency(totalValue)}
          </span>
        </div>

        {assetTypes.length > 0 && (
          <div className="my-2 border-t border-border pt-2">
            {assetTypes.map((asset) => (
              <div
                key={asset.key}
                className="flex items-center justify-between gap-4"
              >
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: MODULE_COLORS[asset.key] }}
                  />
                  {MODULE_LABELS[asset.key]}
                </span>
                <span className="text-sm text-card-foreground">
                  {formatCurrency(asset.value)}
                </span>
              </div>
            ))}
          </div>
        )}

        {startValue > 0 && data.year > 0 && (
          <div className="border-t border-border pt-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Growth</span>
              <span
                className={`text-sm font-medium ${
                  growthFromStart >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {growthFromStart >= 0 ? '+' : ''}
                {formatCurrency(growthFromStart)} ({formatPercentage(growthPercentage, 1)})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface AllocationTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
      percentage: number
      color: string
      investments: InvestmentDetail[]
    }
  }>
}

/**
 * Custom tooltip for the allocation pie chart
 * Shows investment type, projected value, percentage, and individual investments
 */
export function AllocationChartTooltip({ active, payload }: AllocationTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload
  const investmentType = data.name as InvestmentType
  const investments = data.investments || []

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-semibold text-card-foreground">
          {MODULE_LABELS[investmentType]}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Value</span>
          <span className="font-medium text-card-foreground">
            {formatCurrency(data.value)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Allocation</span>
          <span className="font-medium text-card-foreground">
            {formatPercentage(data.percentage, 1)}
          </span>
        </div>
      </div>

      {investments.length > 0 && (
        <div className="mt-2 border-t border-border pt-2">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Investments</p>
          <div className="space-y-0.5">
            {investments.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {inv.name}
                </span>
                <span className="text-xs text-card-foreground">
                  {formatCurrency(inv.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
