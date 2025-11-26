/**
 * Hook for accessing crypto investments
 */

import { useMemo } from 'react'
import { usePortfolio } from './usePortfolio'
import { CryptoInvestment } from '@/types'

export function useCrypto() {
  const { state, addInvestment, updateInvestment, deleteInvestment } = usePortfolio()

  const crypto = useMemo(
    () => state.investments.filter((inv): inv is CryptoInvestment => inv.type === 'crypto'),
    [state.investments]
  )

  return {
    crypto,
    loading: state.loading,
    error: state.error,
    addCrypto: addInvestment,
    updateCrypto: updateInvestment,
    deleteCrypto: deleteInvestment,
  }
}
