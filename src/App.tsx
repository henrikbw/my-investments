/**
 * Main App component with routing
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PortfolioProvider } from '@/context/PortfolioContext'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { StocksPage } from '@/pages/StocksPage'
import { FundsPage } from '@/pages/FundsPage'
import { RealEstatePage } from '@/pages/RealEstatePage'
import { CryptoPage } from '@/pages/CryptoPage'

function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/funds" element={<FundsPage />} />
            <Route path="/real-estate" element={<RealEstatePage />} />
            <Route path="/crypto" element={<CryptoPage />} />
          </Routes>
        </Layout>
      </PortfolioProvider>
    </BrowserRouter>
  )
}

export default App
