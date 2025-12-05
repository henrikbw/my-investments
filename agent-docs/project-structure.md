# Project Structure

```
my-investments/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── PortfolioSummary.tsx
│   │   │   ├── GrowthChart.tsx
│   │   │   ├── AllocationChart.tsx
│   │   │   └── ModuleCards.tsx
│   │   ├── modules/         # Investment module components
│   │   │   ├── stocks/
│   │   │   ├── funds/
│   │   │   ├── real-estate/
│   │   │   └── crypto/
│   │   ├── shared/          # Reusable components
│   │   │   ├── InvestmentForm.tsx
│   │   │   ├── InvestmentCard.tsx
│   │   │   ├── DeleteConfirmModal.tsx
│   │   │   └── EmptyState.tsx
│   │   └── layout/          # Layout components
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       └── Layout.tsx
│   ├── context/             # React Context providers
│   │   └── PortfolioContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── usePortfolio.ts
│   │   ├── useStocks.ts
│   │   ├── useFunds.ts
│   │   ├── useRealEstate.ts
│   │   ├── useCrypto.ts
│   │   └── useLocalStorage.ts
│   ├── services/            # Business logic
│   │   ├── calculations.ts  # Financial calculations
│   │   ├── projections.ts   # Future value projections
│   │   └── storage.ts       # LocalStorage operations
│   ├── types/               # TypeScript definitions
│   │   ├── investments.ts   # Investment interfaces
│   │   ├── portfolio.ts     # Portfolio & projection types
│   │   └── index.ts         # Re-exports
│   ├── utils/               # Utility functions
│   │   ├── finance.ts       # Financial helpers
│   │   └── utils.ts         # cn() and general utilities
│   ├── constants/           # App constants
│   │   └── defaults.ts      # Default ROIs, colors, etc.
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── agent-docs/              # Detailed documentation for agents
├── .claude/
│   └── agents/              # Agent-specific instructions
├── PROJECT.md               # Feature roadmap & architecture
└── components.json          # shadcn/ui configuration
```

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/components/ui/` | shadcn/ui base components |
| `src/components/dashboard/` | Main dashboard views |
| `src/components/modules/` | Investment type modules (stocks, funds, etc.) |
| `src/components/shared/` | Reusable components across modules |
| `src/context/` | React Context providers for global state |
| `src/hooks/` | Custom React hooks |
| `src/services/` | Business logic and calculations |
| `src/types/` | TypeScript type definitions |
