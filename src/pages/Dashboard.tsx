/**
 * Dashboard page
 */

import { useState } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary'
import { GrowthChart } from '@/components/dashboard/GrowthChart'
import { AllocationChart } from '@/components/dashboard/AllocationChart'
import { ModuleCards } from '@/components/dashboard/ModuleCards'
import { IndividualProjections } from '@/components/dashboard/IndividualProjections'
import { EquitySummary } from '@/components/dashboard/EquitySummary'
import { EquityProjectionChart } from '@/components/dashboard/EquityProjectionChart'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import {
  calculatePortfolioSummary,
  generatePortfolioProjectionsWithBreakdown,
  prepareGrowthChartData,
  prepareAllocationChartData,
  prepareIndividualProjections,
  prepareEquityChartData,
} from '@/services/projections'
import { PROJECTION_YEARS } from '@/constants/defaults'

export function Dashboard() {
  const { state } = usePortfolio()
  const { investments, loans, loading } = state
  const [selectedYear, setSelectedYear] = useState<number>(5)

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
  const projections = generatePortfolioProjectionsWithBreakdown(investments)
  const selectedProjection = projections.find((p) => p.year === selectedYear) || null
  const growthData = prepareGrowthChartData(investments, selectedYear)
  const allocationData = prepareAllocationChartData(investments, selectedYear)
  const individualProjections = prepareIndividualProjections(investments, selectedYear)
  const equityChartData = prepareEquityChartData(investments, loans, selectedYear)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Portfolio Overview</h2>
        <p className="text-muted-foreground">
          Track your investments and projected growth
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Projection Year:</span>
          <div className="flex gap-2">
            {PROJECTION_YEARS.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedYear(year)}
              >
                {year} Year{year > 1 ? 's' : ''}
              </Button>
            ))}
          </div>
        </div>

        <PortfolioSummary summary={summary} selectedProjection={selectedProjection} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GrowthChart data={growthData} />
        <AllocationChart data={allocationData} year={selectedYear} />
      </div>

      <IndividualProjections data={individualProjections} selectedYear={selectedYear} />

      <div className="space-y-6">
        {equityChartData.length > 0 && (
          <EquityProjectionChart data={equityChartData} />
        )}
        <EquitySummary selectedYear={selectedYear} investments={investments} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Investment Modules</h3>
        <ModuleCards />
      </div>
    </div>
  )
}
