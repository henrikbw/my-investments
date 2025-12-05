# Data Models Reference

## Investment Types

```typescript
type InvestmentType = 'stock' | 'fund' | 'real-estate' | 'crypto'

/**
 * Base investment interface with support for auto-calculated current values.
 *
 * Value Calculation Logic:
 * - If `lastKnownValue` + `lastKnownDate` are set:
 *   ROI is calculated from `lastKnownValue` starting at `lastKnownDate`
 * - If not set:
 *   ROI is calculated from `amountInvested` starting at `purchaseDate`
 * - For funds with monthly contributions:
 *   Contributions are added from `purchaseDate` (or `lastKnownDate` if override is set)
 */
interface BaseInvestment {
  id: string
  name: string
  amountInvested: number
  currentValue: number        // @deprecated - use calculateCurrentValue() instead
  expectedAnnualROI: number   // e.g., 7 for 7%
  purchaseDate: string        // ISO date string
  lastKnownValue?: number     // Optional: overrides amountInvested for ROI calculation
  lastKnownDate?: string      // Optional: date when lastKnownValue was recorded
  notes?: string
  createdAt: string
  updatedAt: string
}

interface StockInvestment extends BaseInvestment {
  type: 'stock'
  ticker?: string
}

interface FundInvestment extends BaseInvestment {
  type: 'fund'
  fundType: 'index' | 'etf' | 'mutual' | 'other'
  monthlyContribution: number
}

interface RealEstateInvestment extends BaseInvestment {
  type: 'real-estate'
  propertyType: 'residential' | 'commercial' | 'land' | 'reit' | 'other'
  monthlyRentalIncome?: number
}

interface CryptoInvestment extends BaseInvestment {
  type: 'crypto'
  ticker?: string
}

type Investment = StockInvestment | FundInvestment | RealEstateInvestment | CryptoInvestment
```

## Color System

```typescript
const MODULE_COLORS = {
  stocks: '#3B82F6',      // Blue
  funds: '#10B981',       // Green
  realEstate: '#F59E0B',  // Orange
  crypto: '#8B5CF6',      // Purple
}
```

## Default ROIs

```typescript
const DEFAULT_ROI = {
  stock: 8,
  fund: 7,
  'real-estate': 5,
  crypto: 15,
}
```

## Data Persistence

- All data stored in LocalStorage under key `my-investments-portfolio`
- Dates stored as ISO strings, parsed when needed
- Currency assumed to be user's local currency (no conversion in MVP)
