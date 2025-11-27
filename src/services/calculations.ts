/**
 * Financial calculation services
 * Implements compound interest formulas for investment projections
 */

import { Investment } from '@/types'

/**
 * Calculate future value using compound interest formula (no monthly contributions)
 * FV = PV × (1 + r)^n
 *
 * @param presentValue - Current investment value
 * @param annualRate - Annual interest rate (as percentage, e.g., 7 for 7%)
 * @param years - Number of years to project
 * @returns Future value
 */
export function calculateCompoundInterest(
  presentValue: number,
  annualRate: number,
  years: number
): number {
  const rate = annualRate / 100
  return presentValue * Math.pow(1 + rate, years)
}

/**
 * Calculate future value with monthly contributions
 * FV = PV × (1 + r)^n + PMT × (((1 + r/12)^(n×12) - 1) / (r/12))
 *
 * @param presentValue - Current investment value
 * @param annualRate - Annual interest rate (as percentage, e.g., 7 for 7%)
 * @param years - Number of years to project
 * @param monthlyContribution - Monthly contribution amount
 * @returns Future value including contributions
 */
export function calculateWithMonthlyContributions(
  presentValue: number,
  annualRate: number,
  years: number,
  monthlyContribution: number
): number {
  const rate = annualRate / 100
  const monthlyRate = rate / 12
  const months = years * 12

  // Future value of present value
  const fvPresent = presentValue * Math.pow(1 + rate, years)

  // Future value of monthly contributions
  const fvContributions = monthlyRate === 0
    ? monthlyContribution * months
    : monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate

  return fvPresent + fvContributions
}

/**
 * Calculate future value for any investment type
 * Handles monthly contributions for funds
 */
export function calculateFutureValue(
  investment: Investment,
  years: number
): number {
  if (investment.type === 'fund' && investment.monthlyContribution > 0) {
    return calculateWithMonthlyContributions(
      investment.currentValue,
      investment.expectedAnnualROI,
      years,
      investment.monthlyContribution
    )
  }

  return calculateCompoundInterest(
    investment.currentValue,
    investment.expectedAnnualROI,
    years
  )
}

/**
 * Calculate total portfolio value across all investments
 */
export function calculateTotalValue(investments: Investment[]): number {
  return investments.reduce((sum, inv) => sum + inv.currentValue, 0)
}

/**
 * Calculate total amount invested across all investments
 */
export function calculateTotalInvested(investments: Investment[]): number {
  return investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
}

/**
 * Calculate total gain/loss
 */
export function calculateTotalGain(investments: Investment[]): number {
  const totalValue = calculateTotalValue(investments)
  const totalInvested = calculateTotalInvested(investments)
  return totalValue - totalInvested
}

/**
 * Calculate percentage gain/loss
 */
export function calculatePercentageGain(investments: Investment[]): number {
  const totalInvested = calculateTotalInvested(investments)
  if (totalInvested === 0) return 0

  const totalGain = calculateTotalGain(investments)
  return (totalGain / totalInvested) * 100
}
