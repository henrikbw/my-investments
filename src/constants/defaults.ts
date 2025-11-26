/**
 * Application constants and default values
 */

import { InvestmentType } from '@/types'

export const MODULE_COLORS: Record<InvestmentType, string> = {
  stock: '#3B82F6',      // Blue
  fund: '#10B981',       // Green
  'real-estate': '#F59E0B',  // Orange
  crypto: '#8B5CF6',     // Purple
}

export const DEFAULT_ROI: Record<InvestmentType, number> = {
  stock: 8,
  fund: 7,
  'real-estate': 5,
  crypto: 15,
}

export const MODULE_LABELS: Record<InvestmentType, string> = {
  stock: 'Stocks',
  fund: 'Funds',
  'real-estate': 'Real Estate',
  crypto: 'Crypto',
}

export const STORAGE_KEY = 'my-investments-portfolio'

export const PROJECTION_YEARS = [1, 5, 10] as const
