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
  actualYear: number
  value: number
  label: string
}

export function prepareGrowthChartData(
  investments: Investment[]
): GrowthChartData[] {
  const currentValue = calculateTotalValue(investments)
  const currentYear = new Date().getFullYear()

  const data: GrowthChartData[] = [
    {
      year: 0,
      actualYear: currentYear,
      value: Math.round(currentValue * 100) / 100,
      label: currentYear.toString(),
    },
  ]

  const projections = generatePortfolioProjections(investments)
  projections.forEach((proj) => {
    data.push({
      year: proj.year,
      actualYear: currentYear + proj.year,
      value: proj.value,
      label: (currentYear + proj.year).toString(),
    })
  })

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
 * Prepare data for allocation pie chart
 */
export interface AllocationChartData {
  name: string
  value: number
  percentage: number
  color: string
}

export function prepareAllocationChartData(
  investments: Investment[],
  years: number = 0
): AllocationChartData[] {
  const allocation = years === 0
    ? calculateAllocation(investments)
    : calculateAllocationForYear(investments, years)

  return allocation.map((item) => ({
    name: item.type,
    value: item.value,
    percentage: item.percentage,
    color: MODULE_COLORS[item.type],
  }))
}
