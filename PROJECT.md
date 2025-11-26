# My Investments - Project Overview

## Vision
Create a simple, intuitive web application for tracking personal investments across multiple asset classes and viewing future value projections based on expected returns.

## Core Goals

1. **Track Investments**: Manage investments across Stocks, Funds, Real Estate, and Crypto
2. **Calculate Projections**: Generate future value predictions (1, 5, 10 years) based on expected ROI
3. **Visualize Growth**: Present portfolio data with clear charts and breakdowns
4. **User-Friendly**: Simple, clean interface that works on all devices

## Target Users
Individual investors who want to:
- Keep track of their investment portfolio across multiple asset classes
- Understand potential future values based on expected returns
- See their asset allocation at a glance
- Have a simple overview of their financial progress

---

## MVP Features (Version 1)

### Main Dashboard
- [ ] Total portfolio value (today's value)
- [ ] Projected values at 1, 5, and 10 years
- [ ] Portfolio growth chart showing projections over time
- [ ] Asset allocation pie chart (Stocks vs Funds vs Real Estate vs Crypto)
- [ ] Quick stats (total invested, expected average ROI, monthly contributions)

### Investment Modules
Four distinct modules, each accessible from the main dashboard:

#### Stocks Module
- [ ] Add individual stocks with: name, amount invested, purchase date, expected annual ROI (%)
- [ ] List view of all stock holdings
- [ ] Edit/delete stocks
- [ ] Module subtotal and projected growth

#### Funds Module
- [ ] Add funds (index funds, ETFs, mutual funds) with: name, amount invested, monthly contribution, expected annual ROI (%)
- [ ] List view of all fund holdings
- [ ] Edit/delete funds
- [ ] Module subtotal and projected growth

#### Real Estate Module
- [ ] Add properties with: name/address, purchase price, current value, expected annual appreciation (%), rental income (optional)
- [ ] List view of all properties
- [ ] Edit/delete properties
- [ ] Module subtotal and projected growth

#### Crypto Module
- [ ] Add crypto holdings with: name/ticker, amount invested, purchase date, expected annual ROI (%)
- [ ] List view of all crypto holdings
- [ ] Edit/delete crypto
- [ ] Module subtotal and projected growth

### Core Functionality
- [ ] Local storage persistence (data survives browser refresh)
- [ ] Compound interest calculations for projections
- [ ] Responsive design (mobile + desktop)
- [ ] Notes field for each investment

---

## Technical Architecture

### Data Model

```typescript
// Base investment properties shared by all types
interface BaseInvestment {
  id: string
  name: string
  amountInvested: number        // Initial/total amount put in
  currentValue: number          // Current value
  expectedAnnualROI: number     // Percentage (e.g., 7 for 7%)
  purchaseDate: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Stocks
interface StockInvestment extends BaseInvestment {
  type: 'stock'
  ticker?: string               // Optional stock ticker symbol
}

// Funds (Index funds, ETFs, Mutual funds)
interface FundInvestment extends BaseInvestment {
  type: 'fund'
  fundType: 'index' | 'etf' | 'mutual' | 'other'
  monthlyContribution: number   // Recurring monthly investment
}

// Real Estate
interface RealEstateInvestment extends BaseInvestment {
  type: 'real-estate'
  propertyType: 'residential' | 'commercial' | 'land' | 'reit' | 'other'
  monthlyRentalIncome?: number  // Optional rental income
}

// Crypto
interface CryptoInvestment extends BaseInvestment {
  type: 'crypto'
  ticker?: string               // e.g., BTC, ETH
}

// Union type for all investments
type Investment = StockInvestment | FundInvestment | RealEstateInvestment | CryptoInvestment

// Investment type category
type InvestmentType = 'stock' | 'fund' | 'real-estate' | 'crypto'
```

### Projection Calculations

```typescript
interface PortfolioProjection {
  years: number
  totalValue: number
  breakdown: {
    stocks: number
    funds: number
    realEstate: number
    crypto: number
  }
}

// Compound interest formula: FV = PV * (1 + r)^n
// With monthly contributions: FV = PV * (1 + r)^n + PMT * (((1 + r)^n - 1) / r)
```

### Portfolio Summary

```typescript
interface PortfolioSummary {
  totalCurrentValue: number
  totalAmountInvested: number
  totalMonthlyContributions: number
  projections: {
    oneYear: PortfolioProjection
    fiveYear: PortfolioProjection
    tenYear: PortfolioProjection
  }
  allocation: {
    stocks: { value: number; percentage: number }
    funds: { value: number; percentage: number }
    realEstate: { value: number; percentage: number }
    crypto: { value: number; percentage: number }
  }
}
```

### State Management
- React Context API for global portfolio state
- Custom hooks for each investment type
- LocalStorage service for persistence
- Automatic save on any data change

### Component Architecture

```
App
├── Layout
│   ├── Header (app title, navigation)
│   └── Navigation (module tabs/links)
│
├── Dashboard (main overview)
│   ├── PortfolioSummary
│   │   ├── TotalValue
│   │   ├── ProjectedValues (1y, 5y, 10y)
│   │   └── MonthlyContributions
│   ├── GrowthChart (line chart of projections)
│   ├── AllocationChart (pie chart)
│   └── ModuleCards (quick links to each module)
│
├── StocksModule
│   ├── StocksList
│   ├── StockCard
│   ├── AddStockForm
│   └── EditStockForm
│
├── FundsModule
│   ├── FundsList
│   ├── FundCard
│   ├── AddFundForm
│   └── EditFundForm
│
├── RealEstateModule
│   ├── PropertiesList
│   ├── PropertyCard
│   ├── AddPropertyForm
│   └── EditPropertyForm
│
├── CryptoModule
│   ├── CryptoList
│   ├── CryptoCard
│   ├── AddCryptoForm
│   └── EditCryptoForm
│
└── Shared Components
    ├── InvestmentForm (reusable form base)
    ├── ProjectionDisplay
    ├── DeleteConfirmModal
    └── EmptyState
```

---

## Design Principles

1. **Module-First Navigation**: Each asset class has its own dedicated space
2. **Dashboard as Hub**: Main page provides complete portfolio overview
3. **Consistent UX**: Same interaction patterns across all modules
4. **Mobile-Responsive**: Works great on phones and desktops
5. **Fast & Lightweight**: Minimal dependencies, fast load times
6. **Privacy-Focused**: All data stored locally, no external tracking
7. **Visual Clarity**: Charts and numbers that are easy to understand at a glance

---

## UI/UX Guidelines

### Color Coding by Asset Class
- **Stocks**: Blue (#3B82F6)
- **Funds**: Green (#10B981)
- **Real Estate**: Orange (#F59E0B)
- **Crypto**: Purple (#8B5CF6)

### Default Expected ROI (Pre-filled suggestions)
- Stocks: 8%
- Index Funds: 7%
- Real Estate: 5%
- Crypto: 15% (with high volatility warning)

### Key Interactions
- Click module card → Navigate to module
- "+" button → Add new investment
- Click investment → View details / Edit
- Swipe or click delete → Remove (with confirmation)

---

## Development Phases

### Phase 1: Foundation (Current)
- [ ] Set up React project with TypeScript
- [ ] Create data models and types
- [ ] Implement LocalStorage service
- [ ] Build basic layout and navigation

### Phase 2: Investment Modules
- [ ] Build Stocks module (full CRUD)
- [ ] Build Funds module (full CRUD)
- [ ] Build Real Estate module (full CRUD)
- [ ] Build Crypto module (full CRUD)

### Phase 3: Dashboard & Calculations
- [ ] Implement projection calculation logic
- [ ] Build portfolio summary component
- [ ] Create growth projection chart
- [ ] Create asset allocation pie chart

### Phase 4: Polish
- [ ] Responsive design refinements
- [ ] Empty states and loading states
- [ ] Error handling
- [ ] Final testing and bug fixes

---

## Future Enhancements (Version 2+)

- [ ] Multiple portfolios/accounts
- [ ] Currency support (multi-currency)
- [ ] Dividend/distribution tracking
- [ ] Transaction history log
- [ ] Import/export CSV
- [ ] API integration for live prices
- [ ] Inflation-adjusted projections
- [ ] Target allocation goals
- [ ] User accounts and cloud sync
- [ ] Dark mode

---

## Success Metrics

Version 1 is successful when:
- ✅ User can add/edit/delete investments in all four modules
- ✅ Total portfolio value is calculated correctly
- ✅ Future value projections display for 1, 5, 10 years
- ✅ Growth chart visualizes portfolio trajectory
- ✅ Asset allocation is shown in pie chart
- ✅ Monthly contributions are factored into projections
- ✅ Data persists across browser sessions
- ✅ App is responsive and works on mobile
- ✅ Code is clean, typed, and maintainable

---

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:5173

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: React Context + useReducer
- **Storage**: LocalStorage
- **Build**: Vite