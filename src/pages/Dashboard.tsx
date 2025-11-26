/**
 * Dashboard page
 */

import { usePortfolio } from '@/hooks/usePortfolio'
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary'
import { GrowthChart } from '@/components/dashboard/GrowthChart'
import { AllocationChart } from '@/components/dashboard/AllocationChart'
import { ModuleCards } from '@/components/dashboard/ModuleCards'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  calculatePortfolioSummary,
  generatePortfolioProjections,
  prepareGrowthChartData,
  prepareAllocationChartData,
} from '@/services/projections'

export function Dashboard() {
  const { state } = usePortfolio()
  const { investments, loading } = state

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <EmptyState
        title="No Investments Yet"
        description="Start tracking your portfolio by adding your first investment. Choose from stocks, funds, real estate, or crypto."
        action={{
          label: 'Add Investment',
          onClick: () => {
            // Will be handled by navigation
            window.location.href = '/stocks'
          },
        }}
      />
    )
  }

  const summary = calculatePortfolioSummary(investments)
  const projections = generatePortfolioProjections(investments)
  const growthData = prepareGrowthChartData(investments)
  const allocationData = prepareAllocationChartData(investments)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Portfolio Overview</h2>
        <p className="text-muted-foreground">
          Track your investments and projected growth
        </p>
      </div>

      <PortfolioSummary summary={summary} projections={projections} />

      <div className="grid gap-6 md:grid-cols-2">
        <GrowthChart data={growthData} />
        <AllocationChart data={allocationData} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Investment Modules</h3>
        <ModuleCards />
      </div>
    </div>
  )
}
