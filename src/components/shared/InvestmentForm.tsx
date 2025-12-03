/**
 * Investment form component
 * Handles create and edit for all investment types
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
import { Checkbox } from '@/components/ui/checkbox'
import { Investment, InvestmentType } from '@/types'
import { DEFAULT_ROI } from '@/constants/defaults'

interface InvestmentFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (investment: Partial<Investment>) => void
  type: InvestmentType
  initialData?: Investment
}

type InvestmentFormData = Partial<Investment> & {
  lastKnownValue?: number
  lastKnownDate?: string
}

export function InvestmentForm({
  open,
  onClose,
  onSubmit,
  type,
  initialData,
}: InvestmentFormProps) {
  const [formData, setFormData] = useState<InvestmentFormData>({
    type,
    name: '',
    amountInvested: 0,
    currentValue: 0,
    expectedAnnualROI: DEFAULT_ROI[type],
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
    lastKnownValue: undefined,
    lastKnownDate: undefined,
  })

  // Track whether the "last known value" section is expanded
  const [showLastKnownValue, setShowLastKnownValue] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      // Expand the section if editing an investment with lastKnownValue
      setShowLastKnownValue(
        initialData.lastKnownValue !== undefined && initialData.lastKnownValue > 0
      )
    } else {
      setFormData({
        type,
        name: '',
        amountInvested: 0,
        currentValue: 0,
        expectedAnnualROI: DEFAULT_ROI[type],
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
        lastKnownValue: undefined,
        lastKnownDate: undefined,
      })
      setShowLastKnownValue(false)
    }
  }, [initialData, type, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare submission data
    const submissionData = { ...formData }

    // If lastKnownValue section is hidden, clear those fields
    if (!showLastKnownValue) {
      submissionData.lastKnownValue = undefined
      submissionData.lastKnownDate = undefined
    }

    // Set currentValue for backwards compatibility
    // Use lastKnownValue if available, otherwise amountInvested
    if (submissionData.lastKnownValue && submissionData.lastKnownValue > 0) {
      submissionData.currentValue = submissionData.lastKnownValue
    } else {
      submissionData.currentValue = submissionData.amountInvested || 0
    }

    onSubmit(submissionData)
    onClose()
  }

  const updateField = (field: string, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLastKnownToggle = (checked: boolean) => {
    setShowLastKnownValue(checked)
    if (!checked) {
      // Clear the fields when unchecking
      setFormData((prev) => ({
        ...prev,
        lastKnownValue: undefined,
        lastKnownDate: undefined,
      }))
    } else if (!formData.lastKnownDate) {
      // Set default date to today when enabling
      setFormData((prev) => ({
        ...prev,
        lastKnownDate: new Date().toISOString().split('T')[0],
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Investment' : 'Add New Investment'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., Apple Stock"
              required
            />
          </div>

          {type === 'stock' && (
            <div>
              <Label htmlFor="ticker">Ticker Symbol</Label>
              <Input
                id="ticker"
                value={(formData as any).ticker || ''}
                onChange={(e) => updateField('ticker', e.target.value)}
                placeholder="e.g., AAPL"
              />
            </div>
          )}

          {type === 'fund' && (
            <>
              <div>
                <Label htmlFor="fundType">Fund Type *</Label>
                <Select
                  value={(formData as any).fundType || 'index'}
                  onValueChange={(value) => updateField('fundType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index">Index Fund</SelectItem>
                    <SelectItem value="etf">ETF</SelectItem>
                    <SelectItem value="mutual">Mutual Fund</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  step="0.01"
                  value={(formData as any).monthlyContribution || 0}
                  onChange={(e) =>
                    updateField('monthlyContribution', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
            </>
          )}

          {type === 'real-estate' && (
            <>
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  value={(formData as any).propertyType || 'residential'}
                  onValueChange={(value) => updateField('propertyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="reit">REIT</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="monthlyRentalIncome">Monthly Rental Income</Label>
                <Input
                  id="monthlyRentalIncome"
                  type="number"
                  step="0.01"
                  value={(formData as any).monthlyRentalIncome || 0}
                  onChange={(e) =>
                    updateField('monthlyRentalIncome', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
            </>
          )}

          {type === 'crypto' && (
            <div>
              <Label htmlFor="ticker">Ticker Symbol</Label>
              <Input
                id="ticker"
                value={(formData as any).ticker || ''}
                onChange={(e) => updateField('ticker', e.target.value)}
                placeholder="e.g., BTC"
              />
            </div>
          )}

          <div>
            <Label htmlFor="amountInvested">Amount Invested *</Label>
            <Input
              id="amountInvested"
              type="number"
              step="0.01"
              value={formData.amountInvested}
              onChange={(e) =>
                updateField('amountInvested', parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="expectedAnnualROI">Expected Annual ROI (%) *</Label>
            <Input
              id="expectedAnnualROI"
              type="number"
              step="0.1"
              value={formData.expectedAnnualROI}
              onChange={(e) =>
                updateField('expectedAnnualROI', parseFloat(e.target.value) || 0)
              }
              placeholder="7.0"
              required
            />
          </div>

          <div>
            <Label htmlFor="purchaseDate">Purchase Date *</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => updateField('purchaseDate', e.target.value)}
              required
            />
          </div>

          {/* Last Known Value Section */}
          <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showLastKnownValue"
                checked={showLastKnownValue}
                onCheckedChange={handleLastKnownToggle}
              />
              <Label
                htmlFor="showLastKnownValue"
                className="text-sm font-medium cursor-pointer"
              >
                Override with known value
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this if you know a more recent value for this investment.
              Projections will be calculated from this value instead.
            </p>

            {showLastKnownValue && (
              <div className="space-y-3 pt-2 border-t">
                <div>
                  <Label htmlFor="lastKnownValue">Last Known Value *</Label>
                  <Input
                    id="lastKnownValue"
                    type="number"
                    step="0.01"
                    value={formData.lastKnownValue || ''}
                    onChange={(e) =>
                      updateField(
                        'lastKnownValue',
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    placeholder="0.00"
                    required={showLastKnownValue}
                  />
                </div>
                <div>
                  <Label htmlFor="lastKnownDate">Value Date *</Label>
                  <Input
                    id="lastKnownDate"
                    type="date"
                    value={formData.lastKnownDate || ''}
                    onChange={(e) => updateField('lastKnownDate', e.target.value)}
                    required={showLastKnownValue}
                  />
                </div>
              </div>
            )}
          </div>

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
            <Button type="submit">
              {initialData ? 'Update' : 'Add Investment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
