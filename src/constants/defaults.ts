/**
 * Application constants and default values
 */

import { InvestmentType, LoanType } from '@/types'

export const MODULE_COLORS: Record<InvestmentType, string> = {
  stock: '#3B82F6',      // Blue
  fund: '#10B981',       // Green
  'real-estate': '#F59E0B',  // Orange
  crypto: '#8B5CF6',     // Purple
}

export const LOAN_COLORS: Record<LoanType, string> = {
  mortgage: '#EF4444',   // Red
  student: '#EC4899',    // Pink
  car: '#F97316',        // Dark Orange
  personal: '#6366F1',   // Indigo
  other: '#71717A',      // Gray
}

export const DEFAULT_ROI: Record<InvestmentType, number> = {
  stock: 8,
  fund: 7,
  'real-estate': 5,
  crypto: 15,
}

export const DEFAULT_INTEREST_RATE: Record<LoanType, number> = {
  mortgage: 3.5,
  student: 4.5,
  car: 6.0,
  personal: 8.0,
  other: 5.0,
}

export const MODULE_LABELS: Record<InvestmentType, string> = {
  stock: 'Stocks',
  fund: 'Funds',
  'real-estate': 'Real Estate',
  crypto: 'Crypto',
}

export const LOAN_LABELS: Record<LoanType, string> = {
  mortgage: 'Mortgage',
  student: 'Student Loan',
  car: 'Car Loan',
  personal: 'Personal Loan',
  other: 'Other',
}

export const STORAGE_KEY = 'my-investments-portfolio'
export const LOANS_STORAGE_KEY = 'my-investments-loans'
export const FIRE_SETTINGS_STORAGE_KEY = 'my-investments-fire-settings'

export const PROJECTION_YEARS = [1, 5, 10, 20] as const
