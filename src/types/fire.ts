/**
 * FIRE (Financial Independence, Retire Early) type definitions
 */

import { InvestmentType } from './investments'

/**
 * Passive income rates by investment type (annual yield as percentage)
 * These represent the "safe withdrawal" or income generation rates
 * Note: Real estate uses actual rental income, not a percentage
 */
export const PASSIVE_INCOME_RATES: Record<InvestmentType, number> = {
  'real-estate': 0,  // Uses actual monthlyRentalIncome field, not percentage
  fund: 4,           // 4% safe withdrawal rate
  stock: 3,          // 3% dividend/withdrawal rate
  crypto: 2,         // 2% conservative rate for crypto
}

/**
 * FIRE journey data point for charting
 */
export interface FIREChartDataPoint {
  year: number
  actualYear: number
  label: string
  monthlyIncome: number      // Total passive income from all investments
  monthlyExpenses: number    // Total loan costs (interest + principal)
  surplus: number            // Income - Expenses
  netWorth: number           // Total assets - Total loans
  // Breakdown of income by type
  incomeFromRealEstate: number
  incomeFromFunds: number
  incomeFromStocks: number
  incomeFromCrypto: number
  // Breakdown of expenses
  loanInterest: number
  loanPrincipal: number
}

/**
 * Summary metrics for FIRE dashboard
 */
export interface FIRESummary {
  currentMonthlyIncome: number
  currentMonthlyExpenses: number
  currentSurplus: number
  currentNetWorth: number
  yearsToFI: number | null      // null if already FI or never reachable
  fiDate: Date | null
  fiProgress: number            // Percentage (income / expenses * 100)
  isFinanciallyIndependent: boolean
}

/**
 * FIRE Goal configuration
 */
export interface FIREGoal {
  id: string
  name: string
  targetMonthlyIncome?: number  // Optional: override calculated income target
  safeWithdrawalRate: number    // Default 4%
  createdAt: string
  updatedAt: string
}
