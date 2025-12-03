/**
 * Loan form component
 * Handles create and edit for all loan types
 */

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loan, LoanType, Investment, RepaymentType } from '@/types'
import { DEFAULT_INTEREST_RATE, LOAN_LABELS } from '@/constants/defaults'
import { calculateCurrentBalance } from '@/services/loanCalculations'

interface LoanFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (loan: Partial<Loan>) => void
  type: LoanType
  initialData?: Loan
  linkableAssets: Investment[]
}

export function LoanForm({
  open,
  onClose,
  onSubmit,
  type,
  initialData,
  linkableAssets,
}: LoanFormProps) {
  const [formData, setFormData] = useState<Partial<Loan>>({
    type,
    name: '',
    loanAmount: 0,
    remainingBalance: 0,
    interestRate: DEFAULT_INTEREST_RATE[type],
    startDate: new Date().toISOString().split('T')[0],
    termMonths: 360, // 30 years default for mortgage
    repaymentType: 'annuity',
    linkedAssetId: undefined,
    notes: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        type,
        name: '',
        loanAmount: 0,
        remainingBalance: 0,
        interestRate: DEFAULT_INTEREST_RATE[type],
        startDate: new Date().toISOString().split('T')[0],
        termMonths: type === 'mortgage' ? 360 : type === 'car' ? 60 : 120,
        repaymentType: 'annuity',
        linkedAssetId: undefined,
        notes: '',
      })
    }
  }, [initialData, type, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Always calculate remaining balance based on amortization schedule
    const tempLoan = {
      ...formData,
      id: initialData?.id || 'temp',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Loan
    const remainingBalance = calculateCurrentBalance(tempLoan)

    onSubmit({
      ...formData,
      remainingBalance: remainingBalance || formData.loanAmount,
    })
    onClose()
  }

  const updateField = (field: string, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Loan' : `Add ${LOAN_LABELS[type]}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder={`e.g., ${type === 'mortgage' ? 'Home Mortgage' : type === 'student' ? 'Federal Student Loan' : 'My Loan'}`}
              required
            />
          </div>

          <div>
            <Label htmlFor="loanAmount">Original Loan Amount *</Label>
            <Input
              id="loanAmount"
              type="number"
              step="0.01"
              value={formData.loanAmount}
              onChange={(e) => updateField('loanAmount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="interestRate">Annual Interest Rate (%) *</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              value={formData.interestRate}
              onChange={(e) => updateField('interestRate', parseFloat(e.target.value) || 0)}
              placeholder="3.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="startDate">Loan Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="termMonths">Loan Term (months) *</Label>
            <Input
              id="termMonths"
              type="number"
              value={formData.termMonths}
              onChange={(e) => updateField('termMonths', parseInt(e.target.value) || 0)}
              placeholder="360"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.termMonths && formData.termMonths > 0
                ? `${Math.floor(formData.termMonths / 12)} years ${formData.termMonths % 12} months`
                : ''}
            </p>
          </div>

          <div>
            <Label htmlFor="repaymentType">Repayment Type *</Label>
            <Select
              value={formData.repaymentType}
              onValueChange={(value: RepaymentType) => updateField('repaymentType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annuity">Annuity (Fixed Payment)</SelectItem>
                <SelectItem value="serial">Serial (Fixed Principal)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.repaymentType === 'annuity'
                ? 'Same total payment each month'
                : 'Same principal payment, decreasing interest'}
            </p>
          </div>

          {linkableAssets.length > 0 && (
            <div>
              <Label htmlFor="linkedAssetId">Link to Asset (Optional)</Label>
              <Select
                value={formData.linkedAssetId || 'none'}
                onValueChange={(value) =>
                  updateField('linkedAssetId', value === 'none' ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No linked asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No linked asset</SelectItem>
                  {linkableAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Link to an asset to calculate equity
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Optional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? 'Update' : 'Add Loan'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
