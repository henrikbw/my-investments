/**
 * Investment card component
 */

import { Investment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MODULE_COLORS, MODULE_LABELS } from '@/constants/defaults'

interface InvestmentCardProps {
  investment: Investment
  onEdit: (investment: Investment) => void
  onDelete: (investment: Investment) => void
}

export function InvestmentCard({ investment, onEdit, onDelete }: InvestmentCardProps) {
  const gain = investment.currentValue - investment.amountInvested
  const gainPercentage = (gain / investment.amountInvested) * 100
  const isPositive = gain >= 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{investment.name}</CardTitle>
            <Badge
              style={{
                backgroundColor: MODULE_COLORS[investment.type],
                color: 'white',
              }}
            >
              {MODULE_LABELS[investment.type]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Value:</span>
            <span className="font-medium">${investment.currentValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Invested:</span>
            <span>${investment.amountInvested.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gain/Loss:</span>
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              {isPositive ? '+' : ''}${gain.toFixed(2)} ({gainPercentage.toFixed(2)}%)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expected ROI:</span>
            <span>{investment.expectedAnnualROI}% / year</span>
          </div>
          {investment.type === 'fund' && investment.monthlyContribution > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Contribution:</span>
              <span>${investment.monthlyContribution.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(investment)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(investment)}
          >
            Delete
          </Button>
        </div>

        {investment.notes && (
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
            {investment.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
