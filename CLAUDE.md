# My Investments - Project Context

## Overview
A web application for tracking investments across Stocks, Funds, Real Estate, and Crypto with future value projections. Built with modern web technologies and designed for collaborative multi-agent development.

## Tech Stack

### Core Framework
- **Vite**: Build tool and dev server
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **shadcn/ui**: Component library built on Radix UI

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: For theming (light/dark mode support built-in)
- **tailwindcss-animate**: Animation utilities

### Charts & Visualization
- **Recharts**: Charting library for growth projections and allocation charts

### State Management
- **React Context API**: Global portfolio state
- **useReducer**: Complex state logic for investments
- **Custom hooks**: Per-module data access (useStocks, useFunds, etc.)

### Data Persistence
- **LocalStorage**: Client-side persistence for MVP

---

## Agent Team & Responsibilities

### 🎨 react-specialist
**Owns**: Components, UI, state management, user interactions

Responsibilities:
- Build all React components (Dashboard, Modules, Forms, Cards)
- Implement Context API and useReducer for global state
- Create custom hooks for each investment module
- Handle routing between dashboard and modules
- Implement responsive layouts with Tailwind
- Integrate shadcn/ui components

Key files:
- `src/components/**`
- `src/hooks/**`
- `src/context/**`
- `src/App.tsx`

### 📐 typescript-pro
**Owns**: Type definitions, data models, type safety

Responsibilities:
- Define and maintain all TypeScript interfaces
- Ensure type safety across the entire codebase
- Create discriminated unions for investment types
- Type all function parameters and return values
- Review PRs for type correctness

Key files:
- `src/types/**`
- All interface definitions
- Generic utility types

### 📊 data-analyst
**Owns**: Financial calculations, projections, chart data

Responsibilities:
- Implement compound interest calculations
- Build projection logic (1, 5, 10 year forecasts)
- Calculate portfolio summaries and totals
- Prepare data structures for Recharts
- Handle monthly contribution calculations
- Asset allocation percentage calculations

Key files:
- `src/services/calculations.ts`
- `src/services/projections.ts`
- `src/utils/finance.ts`

### 🎯 ui-designer
**Owns**: Visual design, UX patterns, polish

Responsibilities:
- Define color system and design tokens
- Ensure consistent spacing and typography
- Design empty states, loading states, error states
- Mobile-first responsive patterns
- Chart styling and data visualization aesthetics
- Accessibility compliance

Key files:
- `src/index.css`
- Component styling decisions
- Design system documentation

---

## Project Structure

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
├── .claude/
│   └── agents/              # Agent-specific instructions (if needed)
├── PROJECT.md               # Feature roadmap & architecture
└── components.json          # shadcn/ui configuration
```

---

## Data Models (Reference)

### Investment Types
```typescript
type InvestmentType = 'stock' | 'fund' | 'real-estate' | 'crypto'

interface BaseInvestment {
  id: string
  name: string
  amountInvested: number
  currentValue: number
  expectedAnnualROI: number  // e.g., 7 for 7%
  purchaseDate: string       // ISO date string
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

### Color System
```typescript
const MODULE_COLORS = {
  stocks: '#3B82F6',      // Blue
  funds: '#10B981',       // Green
  realEstate: '#F59E0B',  // Orange
  crypto: '#8B5CF6',      // Purple
}
```

### Default ROIs
```typescript
const DEFAULT_ROI = {
  stock: 8,
  fund: 7,
  'real-estate': 5,
  crypto: 15,
}
```

---

## Coding Conventions

### TypeScript
- **Strict mode enabled**: No implicit any, strict null checks
- **Type everything**: Interfaces for objects, type for unions/primitives
- **Discriminated unions**: Use `type` field to distinguish investment types
- **No `any`**: Use `unknown` if type is truly unknown, then narrow
- **Prefer type inference**: Let TypeScript infer when obvious

### React
- **Functional components only**: No class components
- **Named exports**: `export function InvestmentCard() { ... }`
- **Props interfaces**: `interface ComponentNameProps { ... }`
- **Custom hooks**: Extract reusable logic into hooks
- **Component structure**:
  ```tsx
  // 1. Imports
  // 2. Types/Interfaces
  // 3. Component
  // 4. Helper functions (if any)
  ```

### Styling
- **Tailwind utilities**: Prefer utility classes over custom CSS
- **cn() for conditionals**: `className={cn("base", condition && "active")}`
- **shadcn/ui first**: Use existing components before building custom
- **Mobile-first**: Start with mobile layout, add breakpoints for larger screens
- **Consistent spacing**: Use Tailwind's spacing scale (4, 8, 12, 16, etc.)

### File Naming
- **Components**: PascalCase → `InvestmentForm.tsx`
- **Hooks**: camelCase with `use` prefix → `useStocks.ts`
- **Services/Utils**: camelCase → `calculations.ts`
- **Types**: PascalCase or grouped in `index.ts`

### Path Aliases
- `@/*` maps to `src/*`
- Example: `import { Button } from "@/components/ui/button"`

---

## Sub-Agent Delegation Strategy

**IMPORTANT**: Proactively delegate tasks to specialized sub-agents using the Task tool. This improves efficiency, reduces context usage, and leverages domain expertise.

### When to Delegate

| Task Type | Delegate To | Example |
|-----------|-------------|---------|
| React components, hooks, state | `react-specialist` | "Build the InvestmentCard component" |
| Type definitions, interfaces | `typescript-pro` | "Define types for the new export feature" |
| Financial calculations, projections | `data-analyst` | "Implement ROI calculation with dividends" |
| Styling, UX, accessibility | `ui-designer` | "Design the empty state for crypto module" |
| Codebase exploration | `Explore` | "Find all files that handle projections" |
| Multi-step planning | `Plan` | "Plan the implementation of batch import" |

### Delegation Patterns

#### Parallel Delegation (Independent Tasks)
When tasks are independent, launch multiple agents simultaneously:
```
User: "Add a new bond investment type with its own module"

→ Launch in parallel:
  - typescript-pro: "Define BondInvestment interface extending BaseInvestment"
  - ui-designer: "Design the bond module card and form layout"
  - data-analyst: "Implement bond yield calculations"

→ Then sequentially:
  - react-specialist: "Build bond module components using the types, designs, and calculations"
```

#### Sequential Delegation (Dependent Tasks)
When tasks depend on each other, chain agents:
```
User: "Refactor the projection system to support custom time ranges"

→ Step 1: typescript-pro defines new projection types
→ Step 2: data-analyst updates calculation logic with new types
→ Step 3: react-specialist builds UI controls for time range selection
→ Step 4: ui-designer reviews and polishes the interface
```

#### Exploration Before Implementation
Always explore before making significant changes:
```
User: "Optimize the chart rendering performance"

→ First: Explore agent to understand current chart implementation
→ Then: react-specialist to implement optimizations
→ Finally: ui-designer to verify visual quality
```

### Agent Prompt Best Practices

When delegating, provide agents with:
1. **Clear objective**: What specific outcome is needed
2. **Context**: Relevant files, types, or constraints
3. **Boundaries**: What files/areas to modify (or not modify)
4. **Output format**: What to return (code, analysis, recommendations)

Example prompt for react-specialist:
```
"Build a DeleteConfirmModal component in src/components/shared/.

Requirements:
- Accept `isOpen`, `onClose`, `onConfirm`, `itemName` props
- Use existing Dialog component from shadcn/ui
- Include warning icon and confirm/cancel buttons
- Follow existing component patterns in the shared folder

Return the complete component code."
```

### Do NOT Delegate When

- Task is trivial (single file edit, small fix)
- You already have full context and solution is clear
- Task requires back-and-forth user clarification
- Reading a specific known file (use Read tool directly)

---

## Agent Collaboration Guidelines

### Communication
- Reference specific files when discussing changes
- Use TypeScript types as the source of truth for data structures
- When in doubt, check `src/types/` for correct interfaces

### Handoff Points
- **typescript-pro → react-specialist**: Type definitions ready for component props
- **data-analyst → react-specialist**: Calculation functions ready for UI integration
- **ui-designer → react-specialist**: Design specs ready for implementation
- **react-specialist → all**: Component interfaces defined for integration

### Code Review Checklist
- [ ] Types are correct and complete (typescript-pro)
- [ ] Calculations are accurate (data-analyst)
- [ ] UI is responsive and accessible (ui-designer)
- [ ] Component follows React best practices (react-specialist)

### Avoiding Conflicts
- Each agent works in their designated files/folders
- Shared interfaces live in `src/types/` (typescript-pro owns, others consume)
- When modifying shared code, coordinate with the owning agent

---

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Add shadcn/ui component
npx shadcn@latest add [component-name]
```

---

## Key Formulas (Reference)

### Compound Interest (No Contributions)
```
FV = PV × (1 + r)^n

Where:
- FV = Future Value
- PV = Present Value (current investment)
- r = Annual interest rate (as decimal, e.g., 0.07 for 7%)
- n = Number of years
```

### Future Value with Monthly Contributions
```
FV = PV × (1 + r)^n + PMT × (((1 + r/12)^(n×12) - 1) / (r/12))

Where:
- PMT = Monthly contribution amount
- r/12 = Monthly interest rate
- n×12 = Total number of months
```

---

## Implementation Priority

1. **Types first**: Define all interfaces before building components
2. **Services second**: Build calculation logic with tests
3. **Context third**: Set up state management
4. **Components fourth**: Build UI consuming the above
5. **Polish last**: Styling, animations, edge cases

---

## Notes

- All data stored in LocalStorage under key `my-investments-portfolio`
- Dates stored as ISO strings, parsed when needed
- Currency assumed to be user's local currency (no conversion in MVP)
- ROI calculations use compound interest, compounded annually
- Monthly contributions compounded monthly within the annual calculation