/**
 * Module cards component - Links to investment modules
 */

import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InvestmentType } from '@/types'
import { MODULE_COLORS, MODULE_LABELS } from '@/constants/defaults'
import { usePortfolio } from '@/hooks/usePortfolio'
import { calculateTotalValue } from '@/services/calculations'

const modules: Array<{ type: InvestmentType; path: string }> = [
  { type: 'stock', path: '/stocks' },
  { type: 'fund', path: '/funds' },
  { type: 'real-estate', path: '/real-estate' },
  { type: 'crypto', path: '/crypto' },
]

export function ModuleCards() {
  const { state } = usePortfolio()

  const getModuleData = (type: InvestmentType) => {
    const investments = state.investments.filter((inv) => inv.type === type)
    const totalValue = calculateTotalValue(investments)
    const count = investments.length

    return { totalValue, count }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {modules.map((module) => {
        const { totalValue, count } = getModuleData(module.type)

        return (
          <Card
            key={module.type}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader
              className="pb-3"
              style={{
                borderLeft: `4px solid ${MODULE_COLORS[module.type]}`,
              }}
            >
              <CardTitle className="text-lg">
                {MODULE_LABELS[module.type]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-medium">
                    ${totalValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investments:</span>
                  <span>{count}</span>
                </div>
              </div>
              <Link to={module.path}>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
