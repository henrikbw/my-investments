/**
 * Portfolio and projection type definitions
 */

import { Investment, InvestmentType } from './investments'

export interface Projection {
  year: number
  value: number
  totalGain: number
  percentageGain: number
}

export interface InvestmentProjection {
  investmentId: string
  projections: Projection[]
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
  loading: boolean
  error: string | null
}

export type PortfolioAction =
  | { type: 'SET_INVESTMENTS'; payload: Investment[] }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: { id: string; updates: Partial<Investment> } }
  | { type: 'DELETE_INVESTMENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
