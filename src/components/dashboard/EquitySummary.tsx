/**
 * Equity summary component for dashboard
 * Shows total equity across ALL assets and loans
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { useLoans } from '@/hooks/useLoans'
import { calculateBalanceAfterYears } from '@/services/loanCalculations'
import { calculateFutureValue, calculateCurrentValue } from '@/services/calculations'
import { Investment } from '@/types'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MODULE_LABELS } from '@/constants/defaults'

interface EquitySummaryProps {
  selectedYear: number
  investments: Investment[]
}

export function EquitySummary({ selectedYear, investments }: EquitySummaryProps) {
  const { loans, totalLoanBalance, totalEquity } = useLoans()

  // Calculate total projected asset value for ALL investments
  const totalCurrentAssetValue = investments.reduce(
    (sum, inv) => sum + calculateCurrentValue(inv),
    0
  )

  const totalProjectedAssetValue = investments.reduce(
    (sum, inv) => sum + calculateFutureValue(inv, selectedYear),
    0
  )

  // Calculate total projected loan balance for ALL loans
  const totalProjectedLoanBalance = loans.reduce(
    (sum, loan) => sum + calculateBalanceAfterYears(loan, selectedYear),
    0
  )

  const totalProjectedEquity = totalProjectedAssetValue - totalProjectedLoanBalance
  const equityGrowth = totalProjectedEquity - totalEquity

  // Group investments by type for display
  const investmentsByType = investments.reduce((acc, inv) => {
    if (!acc[inv.type]) {
      acc[inv.type] = []
    }
    acc[inv.type].push(inv)
    return acc
  }, {} as Record<string, Investment[]>)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Net Worth Overview</h3>
        {loans.length > 0 && (
          <Link to="/loans">
            <Button variant="outline" size="sm">
              Manage Loans
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalCurrentAssetValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {investments.length} investment{investments.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Liabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalLoanBalance > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
              {totalLoanBalance > 0 ? formatCurrency(totalLoanBalance) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {loans.length} loan{loans.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Net Worth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalEquity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalEquity)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Assets minus liabilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projected Net Worth ({selectedYear}y)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProjectedEquity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProjectedEquity)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {equityGrowth >= 0 ? '+' : ''}{formatCurrency(equityGrowth)} growth
            </p>
          </CardContent>
        </Card>
      </div>

      {Object.entries(investmentsByType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Assets by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(investmentsByType).map(([type, invs]) => {
                const currentValue = invs.reduce((sum, inv) => sum + calculateCurrentValue(inv), 0)
                const projectedValue = invs.reduce(
                  (sum, inv) => sum + calculateFutureValue(inv, selectedYear),
                  0
                )
                return (
                  <div
                    key={type}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{MODULE_LABELS[type as keyof typeof MODULE_LABELS]}</p>
                      <p className="text-sm text-muted-foreground">
                        {invs.length} investment{invs.length !== 1 ? 's' : ''} · Current: {formatCurrency(currentValue)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatCurrency(projectedValue)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        in {selectedYear} year{selectedYear > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )
              })}
              {loans.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border-t border-border mt-2 pt-3">
                  <div>
                    <p className="font-medium">Loans (Liabilities)</p>
                    <p className="text-sm text-muted-foreground">
                      {loans.length} loan{loans.length !== 1 ? 's' : ''} · Current: {formatCurrency(totalLoanBalance)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      -{formatCurrency(totalProjectedLoanBalance)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      in {selectedYear} year{selectedYear > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
