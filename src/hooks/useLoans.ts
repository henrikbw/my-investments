/**
 * Hook for accessing loan data and operations
 */

import { useMemo } from 'react'
import { usePortfolio } from './usePortfolio'
import { Loan, LoanType, Investment, EquityData } from '@/types'
import { getMonthlyInstallment } from '@/services/loanCalculations'

export function useLoans() {
  const { state, addLoan, updateLoan, deleteLoan } = usePortfolio()

  const loans = useMemo(() => state.loans, [state.loans])

  // Get loans by type
  const getLoansByType = (type: LoanType): Loan[] => {
    return loans.filter((loan) => loan.type === type)
  }

  // Get loans linked to a specific asset
  const getLoansForAsset = (assetId: string): Loan[] => {
    return loans.filter((loan) => loan.linkedAssetId === assetId)
  }

  // Get unlinked loans (no asset connection)
  const unlinkedLoans = useMemo(
    () => loans.filter((loan) => !loan.linkedAssetId),
    [loans]
  )

  // Calculate total loan balance
  const totalLoanBalance = useMemo(
    () => loans.reduce((sum, loan) => sum + loan.remainingBalance, 0),
    [loans]
  )

  // Calculate total monthly installments (principal only)
  const totalMonthlyInstallments = useMemo(
    () => loans.reduce((sum, loan) => sum + getMonthlyInstallment(loan), 0),
    [loans]
  )

  // Calculate equity data for all assets with linked loans
  const equityData = useMemo((): EquityData[] => {
    const assetIds = new Set(
      loans
        .filter((loan) => loan.linkedAssetId)
        .map((loan) => loan.linkedAssetId as string)
    )

    return Array.from(assetIds).map((assetId) => {
      const asset = state.investments.find((inv) => inv.id === assetId)
      const linkedLoans = loans.filter((loan) => loan.linkedAssetId === assetId)
      const totalLoanBalance = linkedLoans.reduce(
        (sum, loan) => sum + loan.remainingBalance,
        0
      )

      return {
        assetId,
        assetName: asset?.name ?? 'Unknown Asset',
        assetValue: asset?.currentValue ?? 0,
        linkedLoans: linkedLoans.map((loan) => ({
          loanId: loan.id,
          loanName: loan.name,
          remainingBalance: loan.remainingBalance,
        })),
        totalLoanBalance,
        equity: (asset?.currentValue ?? 0) - totalLoanBalance,
        equityPercentage:
          asset?.currentValue && asset.currentValue > 0
            ? ((asset.currentValue - totalLoanBalance) / asset.currentValue) * 100
            : 0,
      }
    })
  }, [loans, state.investments])

  // Calculate total equity (ALL assets - ALL loans)
  const totalEquity = useMemo(() => {
    const totalAssetValue = state.investments.reduce(
      (sum, inv) => sum + inv.currentValue,
      0
    )
    return totalAssetValue - totalLoanBalance
  }, [state.investments, totalLoanBalance])

  // Get linkable assets (investments that can have loans linked to them)
  const linkableAssets = useMemo((): Investment[] => {
    // Real estate is the most common type to have loans linked
    // but we allow any investment to be linked
    return state.investments
  }, [state.investments])

  return {
    loans,
    loading: state.loading,
    error: state.error,
    addLoan,
    updateLoan,
    deleteLoan,
    getLoansByType,
    getLoansForAsset,
    unlinkedLoans,
    totalLoanBalance,
    totalMonthlyInstallments,
    equityData,
    totalEquity,
    linkableAssets,
  }
}
