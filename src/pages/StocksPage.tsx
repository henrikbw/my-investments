/**
 * Stocks module page
 */

import { useStocks } from '@/hooks/useStocks'
import { ModulePage } from './ModulePage'

export function StocksPage() {
  const { stocks, loading, addStock, updateStock, deleteStock } = useStocks()

  return (
    <ModulePage
      type="stock"
      investments={stocks}
      loading={loading}
      onAdd={addStock}
      onUpdate={updateStock}
      onDelete={deleteStock}
    />
  )
}
