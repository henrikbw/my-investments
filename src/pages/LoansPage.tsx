/**
 * Loans module page
 */

import { useState } from 'react'
import { Loan, LoanType } from '@/types'
import { Button } from '@/components/ui/button'
import { LoanCard } from '@/components/loans/LoanCard'
import { LoanForm } from '@/components/loans/LoanForm'
import { DeleteConfirmModal } from '@/components/shared/DeleteConfirmModal'
import { EmptyState } from '@/components/shared/EmptyState'
import { useLoans } from '@/hooks/useLoans'
import { usePortfolio } from '@/hooks/usePortfolio'
import { LOAN_LABELS } from '@/constants/defaults'
import { formatCurrency, formatPercentage } from '@/utils/format'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const LOAN_TYPES: LoanType[] = ['mortgage', 'student', 'car', 'personal', 'other']

export function LoansPage() {
  const {
    loans,
    loading,
    addLoan,
    updateLoan,
    deleteLoan,
    totalLoanBalance,
    totalMonthlyInstallments,
    equityData,
    totalEquity,
    linkableAssets,
  } = useLoans()
  const { state } = usePortfolio()

  const [formOpen, setFormOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<LoanType>('mortgage')
  const [editingLoan, setEditingLoan] = useState<Loan | undefined>()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingLoan, setDeletingLoan] = useState<Loan | undefined>()

  const handleAdd = () => {
    setEditingLoan(undefined)
    setFormOpen(true)
  }

  const handleEdit = (loan: Loan) => {
    setSelectedType(loan.type)
    setEditingLoan(loan)
    setFormOpen(true)
  }

  const handleDelete = (loan: Loan) => {
    setDeletingLoan(loan)
    setDeleteModalOpen(true)
  }

  const handleFormSubmit = (data: Partial<Loan>) => {
    if (editingLoan) {
      updateLoan(editingLoan.id, data)
    } else {
      const newLoan = {
        ...data,
        id: `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: selectedType,
      } as Loan
      addLoan(newLoan)
    }
    setFormOpen(false)
    setEditingLoan(undefined)
  }

  const handleConfirmDelete = () => {
    if (deletingLoan) {
      deleteLoan(deletingLoan.id)
    }
    setDeleteModalOpen(false)
    setDeletingLoan(undefined)
  }

  // Get linked asset for each loan
  const getLinkedAsset = (loan: Loan) => {
    if (!loan.linkedAssetId) return undefined
    return state.investments.find((inv) => inv.id === loan.linkedAssetId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Loans</h2>
          <p className="text-muted-foreground">
            Manage your loans and track equity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedType}
            onValueChange={(value: LoanType) => setSelectedType(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOAN_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {LOAN_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd}>Add Loan</Button>
        </div>
      </div>

      {/* Summary Cards */}
      {loans.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Loan Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalLoanBalance)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Installments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(totalMonthlyInstallments)}
              </p>
              <p className="text-xs text-muted-foreground">Principal payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Equity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${totalEquity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalEquity)}
              </p>
              <p className="text-xs text-muted-foreground">From linked assets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Number of Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loans.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Equity Breakdown */}
      {equityData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Equity by Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {equityData.map((data) => (
                <div
                  key={data.assetId}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{data.assetName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(data.assetValue)} - {formatCurrency(data.totalLoanBalance)} debt
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${data.equity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.equity)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPercentage(data.equityPercentage)} equity
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loans List */}
      {loans.length === 0 ? (
        <EmptyState
          title="No Loans Yet"
          description="Start tracking your loans by adding your first one. Link loans to assets to calculate equity."
          action={{
            label: 'Add Loan',
            onClick: handleAdd,
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              linkedAsset={getLinkedAsset(loan)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <LoanForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingLoan(undefined)
        }}
        onSubmit={handleFormSubmit}
        type={editingLoan?.type || selectedType}
        initialData={editingLoan}
        linkableAssets={linkableAssets}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Loan"
        description={`Are you sure you want to delete "${deletingLoan?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
