/**
 * Custom hook for FIRE calculations
 * Aggregates portfolio data and provides FIRE metrics
 */

import { useMemo } from 'react'
import { usePortfolio } from './usePortfolio'
import {
  prepareFIREChartData,
  calculateFIRESummary,
} from '@/services/fireCalculations'
import { FIREChartDataPoint, FIRESummary } from '@/types'

interface UseFIREResult {
  chartData: FIREChartDataPoint[]
  summary: FIRESummary
  loading: boolean
  hasData: boolean
}

export function useFIRE(maxYears: number = 30): UseFIREResult {
  const { state } = usePortfolio()
  const { investments, loans, loading } = state

  const chartData = useMemo(() => {
    if (loading) return []
    return prepareFIREChartData(investments, loans, maxYears)
  }, [investments, loans, loading, maxYears])

  const summary = useMemo(() => {
    if (loading) {
      return {
        currentMonthlyIncome: 0,
        currentMonthlyExpenses: 0,
        currentSurplus: 0,
        currentNetWorth: 0,
        yearsToFI: null,
        fiDate: null,
        fiProgress: 0,
        isFinanciallyIndependent: false,
      }
    }
    return calculateFIRESummary(investments, loans)
  }, [investments, loans, loading])

  const hasData = investments.length > 0 || loans.length > 0

  return {
    chartData,
    summary,
    loading,
    hasData,
  }
}
