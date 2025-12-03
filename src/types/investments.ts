/**
 * Investment type definitions
 * Using discriminated unions for type-safe investment handling
 */

export type InvestmentType = 'stock' | 'fund' | 'real-estate' | 'crypto'

/**
 * Base investment interface with support for auto-calculated current values.
 *
 * Value Calculation Logic:
 * - If `lastKnownValue` + `lastKnownDate` are set:
 *   ROI is calculated from `lastKnownValue` starting at `lastKnownDate`
 * - If not set:
 *   ROI is calculated from `amountInvested` starting at `purchaseDate`
 * - For funds with monthly contributions:
 *   Contributions are added from `purchaseDate` (or `lastKnownDate` if override is set)
 *
 * Note: `currentValue` is kept for backwards compatibility but will be deprecated.
 * New code should use the auto-calculation based on lastKnownValue/amountInvested.
 */
export interface BaseInvestment {
  id: string
  name: string
  amountInvested: number
  /** @deprecated Use auto-calculated value based on lastKnownValue or amountInvested */
  currentValue: number
  expectedAnnualROI: number  // e.g., 7 for 7%
  purchaseDate: string       // ISO date string
  /**
   * The value at a specific known date (overrides amountInvested for ROI calculation start point).
   * Use this when you know the investment's value at a date after purchase.
   */
  lastKnownValue?: number
  /**
   * ISO date string when lastKnownValue was recorded.
   * Required when lastKnownValue is set.
   */
  lastKnownDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface StockInvestment extends BaseInvestment {
  type: 'stock'
  ticker?: string
}

export interface FundInvestment extends BaseInvestment {
  type: 'fund'
  fundType: 'index' | 'etf' | 'mutual' | 'other'
  monthlyContribution: number
}

export interface RealEstateInvestment extends BaseInvestment {
  type: 'real-estate'
  propertyType: 'residential' | 'commercial' | 'land' | 'reit' | 'other'
  monthlyRentalIncome?: number
}

export interface CryptoInvestment extends BaseInvestment {
  type: 'crypto'
  ticker?: string
}

export type Investment = StockInvestment | FundInvestment | RealEstateInvestment | CryptoInvestment
