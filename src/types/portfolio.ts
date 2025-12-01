/**
 * Portfolio and projection type definitions
 */

import { Investment, InvestmentType } from './investments'
import { Loan } from './loans'

export interface Projection {
  year: number
  value: number
  totalGain: number
  percentageGain: number
}

export interface ProjectionBreakdown {
  principal: number
  contributions: number
  growth: number
  total: number
}

export interface InvestmentProjection {
  investmentId: string
  projections: Projection[]
}

export interface ProjectionWithBreakdown extends Projection {
  breakdown: ProjectionBreakdown
}

export interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalGain: number
  percentageGain: number
  investmentCount: number
}

export interface AllocationData {
  type: InvestmentType
  value: number
  percentage: number
  count: number
}

export interface PortfolioState {
  investments: Investment[]
  loans: Loan[]
  loading: boolean
  error: string | null
}

export type PortfolioAction =
  | { type: 'SET_INVESTMENTS'; payload: Investment[] }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: { id: string; updates: Partial<Investment> } }
  | { type: 'DELETE_INVESTMENT'; payload: string }
  | { type: 'SET_LOANS'; payload: Loan[] }
  | { type: 'ADD_LOAN'; payload: Loan }
  | { type: 'UPDATE_LOAN'; payload: { id: string; updates: Partial<Loan> } }
  | { type: 'DELETE_LOAN'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
