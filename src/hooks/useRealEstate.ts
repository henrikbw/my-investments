/**
 * Hook for accessing real estate investments
 */

import { useMemo } from 'react'
import { usePortfolio } from './usePortfolio'
import { RealEstateInvestment } from '@/types'

export function useRealEstate() {
  const { state, addInvestment, updateInvestment, deleteInvestment } = usePortfolio()

  const realEstate = useMemo(
    () => state.investments.filter((inv): inv is RealEstateInvestment => inv.type === 'real-estate'),
    [state.investments]
  )

  return {
    realEstate,
    loading: state.loading,
    error: state.error,
    addRealEstate: addInvestment,
    updateRealEstate: updateInvestment,
    deleteRealEstate: deleteInvestment,
  }
}
