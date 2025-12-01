/**
 * Portfolio summary component
 * Shows 4 summary cards: Current/Projected Value, Gain/Loss, Current/Projected NW, NW Gain/Loss
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PortfolioSummary as PortfolioSummaryType, ProjectionWithBreakdown, Loan } from '@/types'
import { formatCurrency, formatPercentage } from '@/utils/format'
import { calculateFutureValue } from '@/services/calculations'
import { calculateBalanceAfterYears } from '@/services/loanCalculations'
import { Investment } from '@/types'

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType
  selectedProjection: ProjectionWithBreakdown | null
  investments: Investment[]
  loans: Loan[]
}

export function PortfolioSummary({ summary, selectedProjection, investments, loans }: PortfolioSummaryProps) {
  const isPositive = summary.totalGain >= 0
  const selectedYear = selectedProjection?.year ?? 0

  // Calculate net worth values
  const totalLoanBalance = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0)
  const currentNetWorth = summary.totalValue - totalLoanBalance

  // Calculate projected values for net worth
  const projectedAssetValue = investments.reduce(
    (sum, inv) => sum + calculateFutureValue(inv, selectedYear),
    0
  )
  const projectedLoanBalance = loans.reduce(
    (sum, loan) => sum + calculateBalanceAfterYears(loan, selectedYear),
    0
  )
  const projectedNetWorth = projectedAssetValue - projectedLoanBalance
  const netWorthGain = projectedNetWorth - currentNetWorth
  const netWorthGainPercentage = currentNetWorth === 0 ? 0 : (netWorthGain / currentNetWorth) * 100

  const isNWPositive = currentNetWorth >= 0
  const isNWGainPositive = netWorthGain >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Current and Projected Investment Value */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Investment Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalValue)}
          </div>
          {selectedProjection && (
            <p className="text-xs text-muted-foreground mt-1">
              → {formatCurrency(selectedProjection.value)} in {selectedYear}y
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card 2: Investment Gain/Loss */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Investment Gain/Loss
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

      {/* Card 3: Current and Projected Net Worth */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net Worth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isNWPositive ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(currentNetWorth)}
          </div>
          {selectedProjection && (
            <p className="text-xs text-muted-foreground mt-1">
              → {formatCurrency(projectedNetWorth)} in {selectedYear}y
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card 4: Net Worth Gain/Loss */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Projected NW Growth ({selectedYear}y)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isNWGainPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isNWGainPositive ? '+' : ''}{formatCurrency(netWorthGain)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isNWGainPositive ? '+' : ''}{formatPercentage(netWorthGainPercentage)} growth
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
