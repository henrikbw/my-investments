/**
 * Loan card component
 */

import { Loan, Investment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LOAN_COLORS, LOAN_LABELS } from '@/constants/defaults'
import { formatCurrency, formatPercentage } from '@/utils/format'
import { getCurrentMonthlyPayment, getMonthlyInstallment, calculateCurrentBalance } from '@/services/loanCalculations'
import { calculateCurrentValue } from '@/services/calculations'

interface LoanCardProps {
  loan: Loan
  linkedAsset?: Investment
  onEdit: (loan: Loan) => void
  onDelete: (loan: Loan) => void
}

export function LoanCard({ loan, linkedAsset, onEdit, onDelete }: LoanCardProps) {
  const monthlyPayment = getCurrentMonthlyPayment(loan)
  const monthlyInstallment = getMonthlyInstallment(loan)

  // Calculate current balance based on time elapsed since loan start
  const currentBalance = calculateCurrentBalance(loan)
  const paidOff = loan.loanAmount - currentBalance
  const paidOffPercentage = (paidOff / loan.loanAmount) * 100

  // Calculate equity if linked to an asset
  const linkedAssetValue = linkedAsset ? calculateCurrentValue(linkedAsset) : 0
  const equity = linkedAsset ? linkedAssetValue - currentBalance : null
  const equityPercentage = linkedAsset && linkedAssetValue > 0
    ? (equity! / linkedAssetValue) * 100
    : null

  // Calculate remaining months
  const startDate = new Date(loan.startDate)
  const now = new Date()
  const monthsPassed = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  )
  const remainingMonths = Math.max(0, loan.termMonths - monthsPassed)
  const remainingYears = Math.floor(remainingMonths / 12)
  const remainingMonthsRemainder = remainingMonths % 12

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{loan.name}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge
                style={{
                  backgroundColor: LOAN_COLORS[loan.type],
                  color: 'white',
                }}
              >
                {LOAN_LABELS[loan.type]}
              </Badge>
              <Badge variant="outline">
                {loan.repaymentType === 'annuity' ? 'Annuity' : 'Serial'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining Balance:</span>
            <span className="font-medium">{formatCurrency(currentBalance)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Original Amount:</span>
            <span>{formatCurrency(loan.loanAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paid Off:</span>
            <span className="text-green-600">
              {formatCurrency(paidOff)} ({formatPercentage(paidOffPercentage)})
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Interest Rate:</span>
            <span>{formatPercentage(loan.interestRate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Payment:</span>
            <span>{formatCurrency(monthlyPayment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Installment:</span>
            <span>{formatCurrency(monthlyInstallment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining Term:</span>
            <span>
              {remainingYears > 0 ? `${remainingYears}y ` : ''}{remainingMonthsRemainder}m
            </span>
          </div>

          {linkedAsset && (
            <>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Linked Asset:</span>
                  <span className="font-medium">{linkedAsset.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Asset Value:</span>
                  <span>{formatCurrency(linkedAssetValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Equity:</span>
                  <span className={equity! >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {formatCurrency(equity!)} ({formatPercentage(equityPercentage!)})
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(loan)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(loan)}
          >
            Delete
          </Button>
        </div>

        {loan.notes && (
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
            {loan.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
