/**
 * Custom hook for FIRE calculations
 * Aggregates portfolio data and provides FIRE metrics
 */

import { useMemo, useState, useCallback, useEffect } from 'react'
import { usePortfolio } from './usePortfolio'
import {
  prepareFIREChartData,
  calculateFIRESummary,
} from '@/services/fireCalculations'
import {
  FIREChartDataPoint,
  FIRESummary,
  FIRESettings,
  DEFAULT_FIRE_SETTINGS,
} from '@/types'
import { FIRE_SETTINGS_STORAGE_KEY } from '@/constants/defaults'

interface UseFIREResult {
  chartData: FIREChartDataPoint[]
  summary: FIRESummary
  loading: boolean
  hasData: boolean
  settings: FIRESettings
  updateSettings: (settings: Partial<FIRESettings>) => void
  resetSettings: () => void
}

function loadSettings(): FIRESettings {
  try {
    const stored = localStorage.getItem(FIRE_SETTINGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to ensure all fields are present
      return {
        ...DEFAULT_FIRE_SETTINGS,
        ...parsed,
        passiveIncomeRates: {
          ...DEFAULT_FIRE_SETTINGS.passiveIncomeRates,
          ...parsed.passiveIncomeRates,
        },
      }
    }
  } catch (error) {
    console.error('Error loading FIRE settings:', error)
  }
  return { ...DEFAULT_FIRE_SETTINGS }
}

function saveSettings(settings: FIRESettings): void {
  try {
    localStorage.setItem(FIRE_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving FIRE settings:', error)
  }
}

export function useFIRE(maxYears: number = 30): UseFIREResult {
  const { state } = usePortfolio()
  const { investments, loans, loading } = state
  const [settings, setSettings] = useState<FIRESettings>(loadSettings)

  // Persist settings to localStorage when they change
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const updateSettings = useCallback((updates: Partial<FIRESettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
      passiveIncomeRates: {
        ...prev.passiveIncomeRates,
        ...(updates.passiveIncomeRates || {}),
      },
    }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_FIRE_SETTINGS })
  }, [])

  const chartData = useMemo(() => {
    if (loading) return []
    return prepareFIREChartData(investments, loans, maxYears, settings)
  }, [investments, loans, loading, maxYears, settings])

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
    return calculateFIRESummary(investments, loans, settings)
  }, [investments, loans, loading, settings])

  const hasData = investments.length > 0 || loans.length > 0

  return {
    chartData,
    summary,
    loading,
    hasData,
    settings,
    updateSettings,
    resetSettings,
  }
}
