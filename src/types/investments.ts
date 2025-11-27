/**
 * Investment type definitions
 * Using discriminated unions for type-safe investment handling
 */

export type InvestmentType = 'stock' | 'fund' | 'real-estate' | 'crypto'

export interface BaseInvestment {
  id: string
  name: string
  amountInvested: number
  currentValue: number
  expectedAnnualROI: number  // e.g., 7 for 7%
  purchaseDate: string       // ISO date string
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
