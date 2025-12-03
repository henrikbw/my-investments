/**
 * Financial calculation services
 * Implements compound interest formulas for investment projections
 */

import { Investment } from '@/types'

/**
 * Calculate the number of years between two dates as a decimal
 * E.g., 2 years and 6 months returns 2.5
 *
 * @param startDate - Start date as ISO string
 * @param endDate - End date
 * @returns Decimal years between the two dates
 */
export function getYearsBetweenDates(startDate: string, endDate: Date): number {
  const start = new Date(startDate)
  const diffMs = endDate.getTime() - start.getTime()
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25 // Account for leap years
  return diffMs / msPerYear
}

/**
 * Calculate the number of whole months between two dates
 *
 * @param startDate - Start date as ISO string
 * @param endDate - End date
 * @returns Number of whole months between the two dates
 */
export function getMonthsBetweenDates(startDate: string, endDate: Date): number {
  const start = new Date(startDate)
  const years = endDate.getFullYear() - start.getFullYear()
  const months = endDate.getMonth() - start.getMonth()
  return years * 12 + months
}

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
 * Calculate the current value of an investment based on ROI from a starting point to today
 *
 * Uses lastKnownValue/lastKnownDate if available, otherwise uses amountInvested/purchaseDate.
 * For funds with monthly contributions, calculates the compounded value of each contribution.
 *
 * @param investment - The investment to calculate current value for
 * @param asOfDate - Optional date to calculate value as of (defaults to now)
 * @returns Calculated current value based on ROI
 */
export function calculateCurrentValue(
  investment: Investment,
  asOfDate: Date = new Date()
): number {
  // Determine starting point
  const hasLastKnown = investment.lastKnownValue !== undefined && investment.lastKnownDate !== undefined
  const startValue = hasLastKnown ? investment.lastKnownValue! : investment.amountInvested
  const startDateStr = hasLastKnown ? investment.lastKnownDate! : investment.purchaseDate

  // Calculate years elapsed
  const yearsElapsed = getYearsBetweenDates(startDateStr, asOfDate)

  // If negative years (future date as start), return start value
  if (yearsElapsed <= 0) {
    return startValue
  }

  // For funds with monthly contributions
  if (investment.type === 'fund' && investment.monthlyContribution > 0) {
    // Calculate compounded value of initial amount
    const compoundedInitial = calculateCompoundInterest(
      startValue,
      investment.expectedAnnualROI,
      yearsElapsed
    )

    // Calculate number of whole months of contributions
    const monthsElapsed = getMonthsBetweenDates(startDateStr, asOfDate)

    if (monthsElapsed <= 0) {
      return compoundedInitial
    }

    // Calculate compounded value of monthly contributions
    // Each contribution compounds for (monthsElapsed - i) months
    const monthlyRate = investment.expectedAnnualROI / 100 / 12
    let contributionsValue = 0

    if (monthlyRate === 0) {
      // No growth, just sum contributions
      contributionsValue = investment.monthlyContribution * monthsElapsed
    } else {
      // Use the future value of annuity formula for monthly compounding
      // FV = PMT * ((1 + r)^n - 1) / r
      contributionsValue = investment.monthlyContribution *
        (Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate
    }

    return compoundedInitial + contributionsValue
  }

  // For all other investment types, simple compound interest
  return calculateCompoundInterest(
    startValue,
    investment.expectedAnnualROI,
    yearsElapsed
  )
}

/**
 * Calculate total contributions made for a fund investment from a start date to end date
 *
 * @param investment - Fund investment with monthly contribution
 * @param startDateStr - Start date as ISO string
 * @param endDate - End date
 * @returns Total contributions made
 */
export function calculateTotalContributions(
  investment: Investment,
  startDateStr: string,
  endDate: Date = new Date()
): number {
  if (investment.type !== 'fund' || investment.monthlyContribution <= 0) {
    return 0
  }

  const monthsElapsed = getMonthsBetweenDates(startDateStr, endDate)
  if (monthsElapsed <= 0) {
    return 0
  }

  return investment.monthlyContribution * monthsElapsed
}

/**
 * Calculate future value for any investment type
 * Handles monthly contributions for funds
 * Uses calculateCurrentValue as the starting point
 */
export function calculateFutureValue(
  investment: Investment,
  years: number
): number {
  // Get the calculated current value as the starting point
  const currentValue = calculateCurrentValue(investment)

  if (investment.type === 'fund' && investment.monthlyContribution > 0) {
    return calculateWithMonthlyContributions(
      currentValue,
      investment.expectedAnnualROI,
      years,
      investment.monthlyContribution
    )
  }

  return calculateCompoundInterest(
    currentValue,
    investment.expectedAnnualROI,
    years
  )
}

/**
 * Calculate total portfolio value across all investments
 * Uses calculateCurrentValue for each investment
 */
export function calculateTotalValue(investments: Investment[]): number {
  return investments.reduce((sum, inv) => sum + calculateCurrentValue(inv), 0)
}

/**
 * Calculate total amount invested across all investments
 * Includes initial amount plus any monthly contributions made for funds
 */
export function calculateTotalInvested(investments: Investment[]): number {
  return investments.reduce((sum, inv) => {
    let totalForInvestment = inv.amountInvested

    // For funds, add monthly contributions made since purchase date
    if (inv.type === 'fund' && inv.monthlyContribution > 0) {
      totalForInvestment += calculateTotalContributions(inv, inv.purchaseDate)
    }

    return sum + totalForInvestment
  }, 0)
}

/**
 * Calculate total gain/loss
 * Compares calculateCurrentValue against total invested (including contributions)
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
