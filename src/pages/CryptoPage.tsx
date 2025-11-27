/**
 * Crypto module page
 */

import { useCrypto } from '@/hooks/useCrypto'
import { ModulePage } from './ModulePage'

export function CryptoPage() {
  const { crypto, loading, addCrypto, updateCrypto, deleteCrypto } = useCrypto()

  return (
    <ModulePage
      type="crypto"
      investments={crypto}
      loading={loading}
      onAdd={addCrypto}
      onUpdate={updateCrypto}
      onDelete={deleteCrypto}
    />
  )
}
