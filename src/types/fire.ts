/**
 * FIRE (Financial Independence, Retire Early) type definitions
 */

import { InvestmentType } from './investments'

/**
 * Default passive income rates by investment type (annual yield as percentage)
 * These represent the "safe withdrawal" or income generation rates
 * Note: Real estate uses actual rental income, not a percentage
 */
export const DEFAULT_PASSIVE_INCOME_RATES: Record<InvestmentType, number> = {
  'real-estate': 0,  // Uses actual monthlyRentalIncome field, not percentage
  fund: 4,           // 4% safe withdrawal rate
  stock: 3,          // 3% dividend/withdrawal rate
  crypto: 2,         // 2% conservative rate for crypto
}

/**
 * @deprecated Use DEFAULT_PASSIVE_INCOME_RATES instead
 */
export const PASSIVE_INCOME_RATES = DEFAULT_PASSIVE_INCOME_RATES

/**
 * FIRE module settings - user-configurable parameters
 */
export interface FIRESettings {
  /** Monthly required expenses after loan costs (living expenses, etc.) */
  monthlyRequiredExpenses: number
  /** Passive income rates by investment type (% of value withdrawn annually) */
  passiveIncomeRates: Record<InvestmentType, number>
  /** Interest rate override for FIRE calculations (only affects FIRE module) */
  interestRateOverride: number | null
  /** Annual percentage increase for rental income */
  rentalIncomeYearlyIncrease: number
  /** Whether to apply refinancing calculations to eligible loans */
  refinancingEnabled: boolean
  /** Whether to pay interest only (no principal) on eligible loans */
  interestOnlyEnabled: boolean
  /** Whether to stop contributions at the suggested year */
  stopContributionsEnabled: boolean
  /** Threshold percentage below which contributions are considered insignificant */
  contributionInsignificanceThreshold: number  // Default: 1 (meaning 1%)
}

/**
 * Default FIRE settings
 */
export const DEFAULT_FIRE_SETTINGS: FIRESettings = {
  monthlyRequiredExpenses: 0,
  passiveIncomeRates: { ...DEFAULT_PASSIVE_INCOME_RATES },
  interestRateOverride: null,
  rentalIncomeYearlyIncrease: 2, // 2% annual increase in rental income
  refinancingEnabled: false,
  interestOnlyEnabled: false,
  stopContributionsEnabled: false,
  contributionInsignificanceThreshold: 1,
}

/**
 * FIRE journey data point for charting
 */
export interface FIREChartDataPoint {
  year: number
  actualYear: number
  label: string
  monthlyIncome: number      // Total passive income from all investments
  monthlyExpenses: number    // Total expenses (loan costs + required expenses)
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
  requiredExpenses: number   // Monthly required living expenses
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

/**
 * Contribution impact data for a single year
 */
export interface ContributionImpactData {
  /** Year number (0 = now, 1 = next year, etc.) */
  year: number
  /** Actual calendar year */
  actualYear: number
  /** Portfolio value at start of year */
  portfolioValue: number
  /** Annual growth from compounding (portfolioValue * ROI) */
  annualGrowth: number
  /** Annual contributions (monthlyContribution * 12) */
  annualContributions: number
  /** Contribution impact ratio: contributions / growth * 100 */
  impactRatio: number
}

/**
 * Summary of contribution impact analysis
 */
export interface ContributionImpactSummary {
  /** Total monthly contributions across all investments */
  totalMonthlyContributions: number
  /** Current contribution impact ratio */
  currentImpactRatio: number
  /** Year when contributions become insignificant (null if already insignificant or never) */
  suggestedStopYear: number | null
  /** Actual calendar year to stop */
  suggestedStopActualYear: number | null
  /** FIRE delay in years if stopping at suggested year */
  fireDelayYears: number | null
  /** Portfolio difference at FIRE date if stopping contributions */
  portfolioDifference: number | null
  /** Data points for charting */
  impactData: ContributionImpactData[]
}
