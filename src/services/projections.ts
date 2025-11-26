/**
 * Investment projection services
 * Generates future value projections for investments and portfolios
 */

import {
  Investment,
  InvestmentProjection,
  Projection,
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
 * Prepare data for growth chart
 */
export interface GrowthChartData {
  year: number
  value: number
  label: string
}

export function prepareGrowthChartData(
  investments: Investment[]
): GrowthChartData[] {
  const currentValue = calculateTotalValue(investments)

  const data: GrowthChartData[] = [
    {
      year: 0,
      value: Math.round(currentValue * 100) / 100,
      label: 'Now',
    },
  ]

  const projections = generatePortfolioProjections(investments)
  projections.forEach((proj) => {
    data.push({
      year: proj.year,
      value: proj.value,
      label: `${proj.year}Y`,
    })
  })

  return data
}

/**
 * Prepare data for allocation pie chart
 */
export interface AllocationChartData {
  name: string
  value: number
  percentage: number
  color: string
}

export function prepareAllocationChartData(
  investments: Investment[]
): AllocationChartData[] {
  const allocation = calculateAllocation(investments)

  return allocation.map((item) => ({
    name: item.type,
    value: item.value,
    percentage: item.percentage,
    color: MODULE_COLORS[item.type],
  }))
}
