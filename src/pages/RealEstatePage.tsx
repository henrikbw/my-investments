/**
 * Real Estate module page
 */

import { useRealEstate } from '@/hooks/useRealEstate'
import { ModulePage } from './ModulePage'

export function RealEstatePage() {
  const { realEstate, loading, addRealEstate, updateRealEstate, deleteRealEstate } = useRealEstate()

  return (
    <ModulePage
      type="real-estate"
      investments={realEstate}
      loading={loading}
      onAdd={addRealEstate}
      onUpdate={updateRealEstate}
      onDelete={deleteRealEstate}
    />
  )
}
