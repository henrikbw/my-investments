/**
 * Investment projection services
 * Generates future value projections for investments and portfolios
 */

import {
  Investment,
  InvestmentProjection,
  Projection,
  ProjectionBreakdown,
  ProjectionWithBreakdown,
  PortfolioSummary,
  AllocationData,
  InvestmentType,
} from '@/types'
import {
  calculateFutureValue,
  calculateTotalValue,
  calculateTotalInvested,
  calculateTotalGain,
  calculatePercentageGain,
} from './calculations'
import { PROJECTION_YEARS, MODULE_COLORS } from '@/constants/defaults'

/**
 * Generate projections for a single investment
 */
export function generateInvestmentProjections(
  investment: Investment
): InvestmentProjection {
  const projections: Projection[] = PROJECTION_YEARS.map((year) => {
    const futureValue = calculateFutureValue(investment, year)
    const totalGain = futureValue - investment.currentValue
    const percentageGain =
      investment.currentValue === 0
        ? 0
        : (totalGain / investment.currentValue) * 100

    return {
      year,
      value: Math.round(futureValue * 100) / 100,
      totalGain: Math.round(totalGain * 100) / 100,
      percentageGain: Math.round(percentageGain * 100) / 100,
    }
  })

  return {
    investmentId: investment.id,
    projections,
  }
}

/**
 * Generate portfolio-wide projections
 */
export function generatePortfolioProjections(
  investments: Investment[]
): Projection[] {
  return PROJECTION_YEARS.map((year) => {
    const futureValue = investments.reduce(
      (sum, inv) => sum + calculateFutureValue(inv, year),
      0
    )
    const currentValue = calculateTotalValue(investments)
    const totalGain = futureValue - currentValue
    const percentageGain =
      currentValue === 0 ? 0 : (totalGain / currentValue) * 100

    return {
      year,
      value: Math.round(futureValue * 100) / 100,
      totalGain: Math.round(totalGain * 100) / 100,
      percentageGain: Math.round(percentageGain * 100) / 100,
    }
  })
}

/**
 * Calculate projection breakdown for a specific year
 */
export function calculateProjectionBreakdown(
  investments: Investment[],
  years: number
): ProjectionBreakdown {
  // Calculate the total principal (current value of all investments)
  const principal = calculateTotalValue(investments)

  // Calculate total contributions over the projection period
  const contributions = investments.reduce((sum, inv) => {
    if (inv.type === 'fund' && inv.monthlyContribution > 0) {
      return sum + (inv.monthlyContribution * 12 * years)
    }
    return sum
  }, 0)

  // Calculate the total future value
  const futureValue = investments.reduce(
    (sum, inv) => sum + calculateFutureValue(inv, years),
    0
  )

  // Growth is what's left after principal and contributions
  const growth = futureValue - principal - contributions

  return {
    principal: Math.round(principal * 100) / 100,
    contributions: Math.round(contributions * 100) / 100,
    growth: Math.round(growth * 100) / 100,
    total: Math.round(futureValue * 100) / 100,
  }
}

/**
 * Generate portfolio projections with breakdown
 */
export function generatePortfolioProjectionsWithBreakdown(
  investments: Investment[]
): ProjectionWithBreakdown[] {
  return PROJECTION_YEARS.map((year) => {
    const breakdown = calculateProjectionBreakdown(investments, year)
    const currentValue = calculateTotalValue(investments)
    const totalGain = breakdown.total - currentValue
    const percentageGain =
      currentValue === 0 ? 0 : (totalGain / currentValue) * 100

    return {
      year,
      value: breakdown.total,
      totalGain: Math.round(totalGain * 100) / 100,
      percentageGain: Math.round(percentageGain * 100) / 100,
      breakdown,
    }
  })
}

/**
 * Calculate portfolio summary
 */
export function calculatePortfolioSummary(
  investments: Investment[]
): PortfolioSummary {
  const totalValue = calculateTotalValue(investments)
  const totalInvested = calculateTotalInvested(investments)
  const totalGain = calculateTotalGain(investments)
  const percentageGain = calculatePercentageGain(investments)

  return {
    totalValue: Math.round(totalValue * 100) / 100,
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalGain: Math.round(totalGain * 100) / 100,
    percentageGain: Math.round(percentageGain * 100) / 100,
    investmentCount: investments.length,
  }
}

/**
 * Calculate asset allocation data
 */
export function calculateAllocation(
  investments: Investment[]
): AllocationData[] {
  const totalValue = calculateTotalValue(investments)

  // Group by type
  const typeGroups = investments.reduce((acc, inv) => {
    if (!acc[inv.type]) {
      acc[inv.type] = []
    }
    acc[inv.type].push(inv)
    return acc
  }, {} as Record<InvestmentType, Investment[]>)

  // Calculate allocation for each type
  const allocation: AllocationData[] = Object.entries(typeGroups).map(
    ([type, invs]) => {
      const value = invs.reduce((sum, inv) => sum + inv.currentValue, 0)
      const percentage = totalValue === 0 ? 0 : (value / totalValue) * 100

      return {
        type: type as InvestmentType,
        value: Math.round(value * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        count: invs.length,
      }
    }
  )

  // Sort by value descending
  return allocation.sort((a, b) => b.value - a.value)
}

/**
 * Prepare data for growth chart with breakdown by asset type
 */
export interface GrowthChartData {
  year: number
  actualYear: number
  label: string
  total: number
  stock: number
  fund: number
  'real-estate': number
  crypto: number
}

export function prepareGrowthChartData(
  investments: Investment[],
  maxYears: number = 20
): GrowthChartData[] {
  const currentYear = new Date().getFullYear()
  const data: GrowthChartData[] = []

  // Generate data for each year from 0 to maxYears
  for (let year = 0; year <= maxYears; year++) {
    const yearData: GrowthChartData = {
      year,
      actualYear: currentYear + year,
      label: (currentYear + year).toString(),
      total: 0,
      stock: 0,
      fund: 0,
      'real-estate': 0,
      crypto: 0,
    }

    // Calculate projected value for each investment and group by type
    investments.forEach((inv) => {
      const projectedValue = calculateFutureValue(inv, year)
      yearData.total += projectedValue
      yearData[inv.type] += projectedValue
    })

    // Round values
    yearData.total = Math.round(yearData.total * 100) / 100
    yearData.stock = Math.round(yearData.stock * 100) / 100
    yearData.fund = Math.round(yearData.fund * 100) / 100
    yearData['real-estate'] = Math.round(yearData['real-estate'] * 100) / 100
    yearData.crypto = Math.round(yearData.crypto * 100) / 100

    data.push(yearData)
  }

  return data
}

/**
 * Calculate allocation for a specific year in the future
 */
export function calculateAllocationForYear(
  investments: Investment[],
  years: number
): AllocationData[] {
  // Project all investments to the target year
  const projectedInvestments = investments.map((inv) => {
    const futureValue = calculateFutureValue(inv, years)
    return {
      type: inv.type,
      value: futureValue,
    }
  })

  // Group by type
  const typeGroups = projectedInvestments.reduce((acc, inv) => {
    if (!acc[inv.type]) {
      acc[inv.type] = { value: 0, count: 0 }
    }
    acc[inv.type].value += inv.value
    acc[inv.type].count += 1
    return acc
  }, {} as Record<InvestmentType, { value: number; count: number }>)

  // Calculate total value
  const totalValue = Object.values(typeGroups).reduce(
    (sum, group) => sum + group.value,
    0
  )

  // Calculate allocation for each type
  const allocation: AllocationData[] = Object.entries(typeGroups).map(
    ([type, data]) => {
      const percentage = totalValue === 0 ? 0 : (data.value / totalValue) * 100

      return {
        type: type as InvestmentType,
        value: Math.round(data.value * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        count: data.count,
      }
    }
  )

  // Sort by value descending
  return allocation.sort((a, b) => b.value - a.value)
}

/**
 * Individual investment data for tooltips
 */
export interface InvestmentDetail {
  id: string
  name: string
  value: number
}

/**
 * Prepare data for allocation pie chart
 */
export interface AllocationChartData {
  name: string
  value: number
  percentage: number
  color: string
  investments: InvestmentDetail[]
}

/** Maximum number of individual investments to show in tooltip */
const MAX_INVESTMENTS_IN_TOOLTIP = 5

export function prepareAllocationChartData(
  investments: Investment[],
  years: number = 0
): AllocationChartData[] {
  const allocation = years === 0
    ? calculateAllocation(investments)
    : calculateAllocationForYear(investments, years)

  return allocation.map((item) => {
    // Get individual investments for this type, projected to the target year
    const typeInvestments = investments
      .filter((inv) => inv.type === item.type)
      .map((inv) => ({
        id: inv.id,
        name: inv.name,
        value: years === 0 ? inv.currentValue : calculateFutureValue(inv, years),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, MAX_INVESTMENTS_IN_TOOLTIP)

    return {
      name: item.type,
      value: item.value,
      percentage: item.percentage,
      color: MODULE_COLORS[item.type],
      investments: typeInvestments,
    }
  })
}

/**
 * Individual investment projection card data
 */
export interface IndividualProjectionData {
  id: string
  name: string
  type: InvestmentType
  currentValue: number
  projectedValue: number
  totalGain: number
  percentageGain: number
  roi: number
  monthlyContribution?: number
  chartData: Array<{ year: number; value: number }>
}

/**
 * Prepare projection data for individual investments
 */
export function prepareIndividualProjections(
  investments: Investment[],
  maxYears: number = 20
): IndividualProjectionData[] {
  return investments.map((inv) => {
    const projectedValue = calculateFutureValue(inv, maxYears)
    const totalGain = projectedValue - inv.currentValue
    const percentageGain =
      inv.currentValue === 0 ? 0 : (totalGain / inv.currentValue) * 100

    // Generate chart data points for mini chart
    const chartData: Array<{ year: number; value: number }> = []
    for (let year = 0; year <= maxYears; year++) {
      chartData.push({
        year,
        value: Math.round(calculateFutureValue(inv, year) * 100) / 100,
      })
    }

    return {
      id: inv.id,
      name: inv.name,
      type: inv.type,
      currentValue: inv.currentValue,
      projectedValue: Math.round(projectedValue * 100) / 100,
      totalGain: Math.round(totalGain * 100) / 100,
      percentageGain: Math.round(percentageGain * 100) / 100,
      roi: inv.expectedAnnualROI,
      monthlyContribution:
        inv.type === 'fund' ? inv.monthlyContribution : undefined,
      chartData,
    }
  }).sort((a, b) => b.projectedValue - a.projectedValue)
}
