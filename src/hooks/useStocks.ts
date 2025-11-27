/**
 * Hook for accessing stock investments
 */

import { useMemo } from 'react'
import { usePortfolio } from './usePortfolio'
import { StockInvestment } from '@/types'

export function useStocks() {
  const { state, addInvestment, updateInvestment, deleteInvestment } = usePortfolio()

  const stocks = useMemo(
    () => state.investments.filter((inv): inv is StockInvestment => inv.type === 'stock'),
    [state.investments]
  )

  return {
    stocks,
    loading: state.loading,
    error: state.error,
    addStock: addInvestment,
    updateStock: updateInvestment,
    deleteStock: deleteInvestment,
  }
}
