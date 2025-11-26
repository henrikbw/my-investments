/**
 * Main hook for accessing portfolio context
 */

import { useContext } from 'react'
import { PortfolioContext } from '@/context/PortfolioContext'

export function usePortfolio() {
  const context = useContext(PortfolioContext)

  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }

  return context
}
