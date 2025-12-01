/**
 * Equity summary component for dashboard
 * Shows total equity across all linked assets and loans
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { useLoans } from '@/hooks/useLoans'
import { calculateBalanceAfterYears } from '@/services/loanCalculations'
import { calculateFutureValue } from '@/services/calculations'
import { Investment } from '@/types'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface EquitySummaryProps {
  selectedYear: number
  investments: Investment[]
}

export function EquitySummary({ selectedYear, investments }: EquitySummaryProps) {
  const { loans, equityData, totalLoanBalance, totalEquity } = useLoans()

  // If no loans, don't show this section
  if (loans.length === 0) {
    return null
  }

  // Calculate projected equity for selected year
  const projectedEquityData = equityData.map((data) => {
    const asset = investments.find((inv) => inv.id === data.assetId)
    if (!asset) return { ...data, projectedAssetValue: 0, projectedLoanBalance: 0, projectedEquity: 0 }

    // Calculate projected asset value
    const projectedAssetValue = calculateFutureValue(asset, selectedYear)

    // Calculate projected loan balance
    const linkedLoans = loans.filter((loan) => loan.linkedAssetId === data.assetId)
    const projectedLoanBalance = linkedLoans.reduce(
      (sum, loan) => sum + calculateBalanceAfterYears(loan, selectedYear),
      0
    )

    return {
      ...data,
      projectedAssetValue,
      projectedLoanBalance,
      projectedEquity: projectedAssetValue - projectedLoanBalance,
    }
  })

  const totalProjectedEquity = projectedEquityData.reduce(
    (sum, data) => sum + data.projectedEquity,
    0
  )

  const equityGrowth = totalProjectedEquity - totalEquity

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Equity Overview</h3>
        <Link to="/loans">
          <Button variant="outline" size="sm">
            Manage Loans
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Loan Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalLoanBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {loans.length} loan{loans.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Equity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalEquity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalEquity)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Assets minus loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projected Equity ({selectedYear}y)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProjectedEquity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProjectedEquity)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              After loan payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Equity Growth ({selectedYear}y)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${equityGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {equityGrowth >= 0 ? '+' : ''}{formatCurrency(equityGrowth)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From payments & appreciation
            </p>
          </CardContent>
        </Card>
      </div>

      {projectedEquityData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Equity by Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectedEquityData.map((data) => (
                <div
                  key={data.assetId}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{data.assetName}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {formatCurrency(data.equity)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${data.projectedEquity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.projectedEquity)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      in {selectedYear} year{selectedYear > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
