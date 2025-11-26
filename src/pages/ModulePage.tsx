/**
 * Generic module page component
 */

import { useState } from 'react'
import { Investment, InvestmentType } from '@/types'
import { Button } from '@/components/ui/button'
import { InvestmentCard } from '@/components/shared/InvestmentCard'
import { InvestmentForm } from '@/components/shared/InvestmentForm'
import { DeleteConfirmModal } from '@/components/shared/DeleteConfirmModal'
import { EmptyState } from '@/components/shared/EmptyState'
import { MODULE_LABELS } from '@/constants/defaults'

interface ModulePageProps {
  type: InvestmentType
  investments: Investment[]
  loading: boolean
  onAdd: (investment: Investment) => void
  onUpdate: (id: string, updates: Partial<Investment>) => void
  onDelete: (id: string) => void
}

export function ModulePage({
  type,
  investments,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}: ModulePageProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState<Investment | undefined>()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingInvestment, setDeletingInvestment] = useState<Investment | undefined>()

  const handleAdd = () => {
    setEditingInvestment(undefined)
    setFormOpen(true)
  }

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment)
    setFormOpen(true)
  }

  const handleDelete = (investment: Investment) => {
    setDeletingInvestment(investment)
    setDeleteModalOpen(true)
  }

  const handleFormSubmit = (data: Partial<Investment>) => {
    if (editingInvestment) {
      onUpdate(editingInvestment.id, data)
    } else {
      // Generate ID for new investment
      const newInvestment = {
        ...data,
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
      } as Investment
      onAdd(newInvestment)
    }
    setFormOpen(false)
    setEditingInvestment(undefined)
  }

  const handleConfirmDelete = () => {
    if (deletingInvestment) {
      onDelete(deletingInvestment.id)
    }
    setDeleteModalOpen(false)
    setDeletingInvestment(undefined)
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
          <h2 className="text-3xl font-bold mb-2">{MODULE_LABELS[type]}</h2>
          <p className="text-muted-foreground">
            Manage your {MODULE_LABELS[type].toLowerCase()} investments
          </p>
        </div>
        <Button onClick={handleAdd}>Add {MODULE_LABELS[type]}</Button>
      </div>

      {investments.length === 0 ? (
        <EmptyState
          title={`No ${MODULE_LABELS[type]} Yet`}
          description={`Start tracking your ${MODULE_LABELS[type].toLowerCase()} investments by adding your first one.`}
          action={{
            label: `Add ${MODULE_LABELS[type]}`,
            onClick: handleAdd,
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {investments.map((investment) => (
            <InvestmentCard
              key={investment.id}
              investment={investment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <InvestmentForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingInvestment(undefined)
        }}
        onSubmit={handleFormSubmit}
        type={type}
        initialData={editingInvestment}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Investment"
        description={`Are you sure you want to delete "${deletingInvestment?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
