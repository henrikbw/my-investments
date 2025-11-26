/**
 * Portfolio summary component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PortfolioSummary as PortfolioSummaryType, Projection } from '@/types'

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType
  projections: Projection[]
}

export function PortfolioSummary({ summary, projections }: PortfolioSummaryProps) {
  const isPositive = summary.totalGain >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${summary.totalValue.toLocaleString()}
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
            {isPositive ? '+' : ''}${summary.totalGain.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isPositive ? '+' : ''}{summary.percentageGain.toFixed(2)}% return
          </p>
        </CardContent>
      </Card>

      {projections.map((projection) => (
        <Card key={projection.year}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {projection.year} Year Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${projection.value.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +${projection.totalGain.toLocaleString()} ({projection.percentageGain.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
