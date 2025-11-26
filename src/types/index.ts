/**
 * Core data types for the investment tracking application
 */

export type InvestmentType = 'stocks' | 'bonds' | 'crypto' | 'real-estate' | 'other'

export interface Investment {
  id: string
  name: string
  type: InvestmentType
  purchaseAmount: number
  purchaseDate: Date
  currentValue: number
  expectedAnnualReturn: number  // Percentage (e.g., 7 for 7%)
  notes?: string
}

export interface Projection {
  years: number
  estimatedValue: number
  totalReturn: number
  percentageGain: number
}

export interface Prognosis {
  investmentId: string
  projections: Projection[]
}
