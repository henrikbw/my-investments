/**
 * Portfolio summary component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PortfolioSummary as PortfolioSummaryType, Projection } from '@/types'
import { formatCurrency, formatPercentage } from '@/utils/format'

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType
  selectedProjection: Projection | null
}

export function PortfolioSummary({ summary, selectedProjection }: PortfolioSummaryProps) {
  const isPositive = summary.totalGain >= 0
  const currentYear = new Date().getFullYear()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Value ({currentYear})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalValue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.investmentCount} investment{summary.investmentCount !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Gain/Loss
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{formatCurrency(summary.totalGain)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isPositive ? '+' : ''}{formatPercentage(summary.percentageGain)} return
          </p>
        </CardContent>
      </Card>

      {selectedProjection && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projected Value ({currentYear + selectedProjection.year})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(selectedProjection.value)}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +{formatCurrency(selectedProjection.totalGain)} ({formatPercentage(selectedProjection.percentageGain, 1)})
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
