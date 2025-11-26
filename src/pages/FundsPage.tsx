/**
 * Funds module page
 */

import { useFunds } from '@/hooks/useFunds'
import { ModulePage } from './ModulePage'

export function FundsPage() {
  const { funds, loading, addFund, updateFund, deleteFund } = useFunds()

  return (
    <ModulePage
      type="fund"
      investments={funds}
      loading={loading}
      onAdd={addFund}
      onUpdate={updateFund}
      onDelete={deleteFund}
    />
  )
}
