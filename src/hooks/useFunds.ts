/**
 * Hook for accessing fund investments
 */

import { useMemo } from 'react'
import { usePortfolio } from './usePortfolio'
import { FundInvestment } from '@/types'

export function useFunds() {
  const { state, addInvestment, updateInvestment, deleteInvestment } = usePortfolio()

  const funds = useMemo(
    () => state.investments.filter((inv): inv is FundInvestment => inv.type === 'fund'),
    [state.investments]
  )

  return {
    funds,
    loading: state.loading,
    error: state.error,
    addFund: addInvestment,
    updateFund: updateInvestment,
    deleteFund: deleteInvestment,
  }
}
