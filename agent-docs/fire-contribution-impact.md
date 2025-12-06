# Contribution Impact Analysis - Implementation Plan

## Feature Overview

Add a "Contribution Impact Analysis" feature to the FIRE module that helps users understand when their monthly contributions become insignificant compared to portfolio growth from compounding. This enables users to identify the optimal point to "coast" - stop contributions while still reaching FIRE on a reasonable timeline.

## Core Concept

**The Insight**: As a portfolio grows, compound growth eventually dwarfs monthly contributions. At some point, a $500/month contribution becomes less than 1% of annual growth, making it effectively negligible.

**Example**:
- Portfolio: $1,000,000 at 7% ROI = $70,000/year growth
- Monthly contribution: $500/month = $6,000/year
- Contribution impact: 6,000 / 70,000 = 8.6%

When this ratio drops below a threshold (e.g., 1%), contributions have minimal impact on the FIRE timeline.

---

## User Experience

### 1. New Toggle: "Stop Contributions"

Located alongside "Refinancing" and "Interest Only" toggles in the FIRE page header.

**Behavior**:
- When OFF: Normal calculations (contributions continue forever)
- When ON: Monthly contributions stop from the "suggested year" onward
- The "suggested year" is dynamically calculated based on the insignificance threshold

### 2. Contribution Impact Analysis Card

A new card section showing:

```
┌─────────────────────────────────────────────────────┐
│ Contribution Impact Analysis                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Insignificance Threshold: [1%] ▼                   │
│                                                     │
│  ════════════════════════════════════════════       │
│  Your contributions become insignificant            │
│  (< 1% of growth) in Year 12 (2037)                │
│  ════════════════════════════════════════════       │
│                                                     │
│  Current Impact: 15.3%                              │
│  At Year 5: 8.2%                                    │
│  At Year 10: 3.1%                                   │
│  At Year 12: 0.9% ← Threshold crossed               │
│                                                     │
│  If you stop contributions at Year 12:              │
│  • FIRE delayed by: 0.5 years                       │
│  • Final portfolio difference: -$45,000             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. Impact Ratio Chart (Optional Enhancement)

A small area/line chart showing contribution impact % declining over time, with a horizontal line at the threshold.

---

## Technical Implementation

### Phase 1: Type Definitions

**File**: `src/types/fire.ts`

```typescript
// Add to FIRESettings interface
interface FIRESettings {
  // ... existing fields

  /** Whether to stop contributions at the suggested year */
  stopContributionsEnabled: boolean

  /** Threshold percentage below which contributions are considered insignificant */
  contributionInsignificanceThreshold: number  // Default: 1 (meaning 1%)
}

// Add to DEFAULT_FIRE_SETTINGS
const DEFAULT_FIRE_SETTINGS: FIRESettings = {
  // ... existing fields
  stopContributionsEnabled: false,
  contributionInsignificanceThreshold: 1,
}

// New interface for contribution impact data
interface ContributionImpactData {
  /** Year number (0 = now, 1 = next year, etc.) */
  year: number

  /** Actual calendar year */
  actualYear: number

  /** Portfolio value at start of year */
  portfolioValue: number

  /** Annual growth from compounding (portfolioValue * ROI) */
  annualGrowth: number

  /** Annual contributions (monthlyContribution * 12) */
  annualContributions: number

  /** Contribution impact ratio: contributions / growth * 100 */
  impactRatio: number
}

interface ContributionImpactSummary {
  /** Total monthly contributions across all investments */
  totalMonthlyContributions: number

  /** Current contribution impact ratio */
  currentImpactRatio: number

  /** Year when contributions become insignificant (null if already insignificant or never) */
  suggestedStopYear: number | null

  /** Actual calendar year to stop */
  suggestedStopActualYear: number | null

  /** FIRE delay in years if stopping at suggested year */
  fireDelayYears: number | null

  /** Portfolio difference at FIRE date if stopping contributions */
  portfolioDifference: number | null

  /** Data points for charting */
  impactData: ContributionImpactData[]
}
```

### Phase 2: Calculation Functions

**File**: `src/services/fireCalculations.ts`

#### 2.1 Calculate Total Monthly Contributions

```typescript
/**
 * Calculate total monthly contributions across all investments
 * Currently only funds have monthly contributions
 */
export function calculateTotalMonthlyContributions(investments: Investment[]): number {
  return investments.reduce((total, inv) => {
    if (inv.type === 'fund' && inv.monthlyContribution > 0) {
      return total + inv.monthlyContribution
    }
    return total
  }, 0)
}
```

#### 2.2 Calculate Weighted Average ROI

```typescript
/**
 * Calculate weighted average ROI for investments with contributions
 * Used to project growth rate for contribution impact calculations
 */
export function calculateWeightedAverageROI(investments: Investment[]): number {
  let totalValue = 0
  let weightedROI = 0

  investments.forEach(inv => {
    if (inv.type === 'fund' && inv.monthlyContribution > 0) {
      const value = calculateCurrentValue(inv)
      totalValue += value
      weightedROI += value * inv.expectedAnnualROI
    }
  })

  return totalValue > 0 ? weightedROI / totalValue : 0
}
```

#### 2.3 Calculate Contribution Impact at Year

```typescript
/**
 * Calculate the contribution impact ratio at a specific year
 * Impact = (Annual Contributions / Annual Growth) * 100
 */
export function calculateContributionImpactAtYear(
  investments: Investment[],
  year: number
): ContributionImpactData {
  const currentYear = new Date().getFullYear()

  // Get portfolio value of contributing investments at this year
  let portfolioValue = 0
  let annualContributions = 0
  let weightedGrowthRate = 0
  let totalValue = 0

  investments.forEach(inv => {
    if (inv.type === 'fund' && inv.monthlyContribution > 0) {
      const futureValue = calculateFutureValue(inv, year)
      portfolioValue += futureValue
      annualContributions += inv.monthlyContribution * 12
      totalValue += futureValue
      weightedGrowthRate += futureValue * inv.expectedAnnualROI
    }
  })

  const avgROI = totalValue > 0 ? weightedGrowthRate / totalValue : 0
  const annualGrowth = portfolioValue * (avgROI / 100)

  // Avoid division by zero
  const impactRatio = annualGrowth > 0
    ? (annualContributions / annualGrowth) * 100
    : (annualContributions > 0 ? 100 : 0)

  return {
    year,
    actualYear: currentYear + year,
    portfolioValue: Math.round(portfolioValue * 100) / 100,
    annualGrowth: Math.round(annualGrowth * 100) / 100,
    annualContributions,
    impactRatio: Math.round(impactRatio * 100) / 100,
  }
}
```

#### 2.4 Calculate Contribution Impact Summary

```typescript
/**
 * Calculate full contribution impact analysis
 */
export function calculateContributionImpactSummary(
  investments: Investment[],
  loans: Loan[],
  settings: FIRESettings,
  maxYears: number = 30
): ContributionImpactSummary {
  const totalMonthlyContributions = calculateTotalMonthlyContributions(investments)
  const threshold = settings.contributionInsignificanceThreshold

  // Generate impact data for each year
  const impactData: ContributionImpactData[] = []
  let suggestedStopYear: number | null = null

  for (let year = 0; year <= maxYears; year++) {
    const data = calculateContributionImpactAtYear(investments, year)
    impactData.push(data)

    // Find first year where impact drops below threshold
    if (suggestedStopYear === null && data.impactRatio < threshold && data.impactRatio > 0) {
      suggestedStopYear = year
    }
  }

  const currentImpactRatio = impactData[0]?.impactRatio ?? 0
  const suggestedStopActualYear = suggestedStopYear !== null
    ? new Date().getFullYear() + suggestedStopYear
    : null

  // Calculate FIRE delay if stopping at suggested year
  let fireDelayYears: number | null = null
  let portfolioDifference: number | null = null

  if (suggestedStopYear !== null) {
    // Calculate FIRE year with contributions
    const summaryWithContributions = calculateFIRESummary(investments, loans, settings)

    // Calculate FIRE year without contributions (from suggested year)
    const settingsWithStop = { ...settings, stopContributionsEnabled: true }
    const summaryWithoutContributions = calculateFIRESummaryWithStopContributions(
      investments,
      loans,
      settingsWithStop,
      suggestedStopYear
    )

    if (summaryWithContributions.yearsToFI !== null && summaryWithoutContributions.yearsToFI !== null) {
      fireDelayYears = Math.round((summaryWithoutContributions.yearsToFI - summaryWithContributions.yearsToFI) * 10) / 10

      // Calculate portfolio difference at FIRE date
      const fiYear = summaryWithContributions.yearsToFI
      const portfolioWithContribs = calculateTotalFutureValue(investments, fiYear)
      const portfolioWithoutContribs = calculateTotalFutureValueWithStopYear(investments, fiYear, suggestedStopYear)
      portfolioDifference = Math.round(portfolioWithoutContribs - portfolioWithContribs)
    }
  }

  return {
    totalMonthlyContributions,
    currentImpactRatio,
    suggestedStopYear,
    suggestedStopActualYear,
    fireDelayYears,
    portfolioDifference,
    impactData,
  }
}
```

#### 2.5 Modified Future Value Calculation

```typescript
/**
 * Calculate future value with optional contribution stop year
 * After stopYear, monthlyContribution is treated as 0
 */
export function calculateFutureValueWithStopYear(
  investment: Investment,
  targetYear: number,
  stopContributionsAtYear: number
): number {
  if (investment.type !== 'fund' || investment.monthlyContribution <= 0) {
    return calculateFutureValue(investment, targetYear)
  }

  const currentValue = calculateCurrentValue(investment)

  if (targetYear <= stopContributionsAtYear) {
    // Still contributing - use normal calculation
    return calculateWithMonthlyContributions(
      currentValue,
      investment.expectedAnnualROI,
      targetYear,
      investment.monthlyContribution
    )
  }

  // Phase 1: Grow with contributions until stop year
  const valueAtStopYear = calculateWithMonthlyContributions(
    currentValue,
    investment.expectedAnnualROI,
    stopContributionsAtYear,
    investment.monthlyContribution
  )

  // Phase 2: Compound without contributions for remaining years
  const remainingYears = targetYear - stopContributionsAtYear
  return calculateCompoundInterest(
    valueAtStopYear,
    investment.expectedAnnualROI,
    remainingYears
  )
}
```

### Phase 3: Update FIRE Chart Data Generation

**File**: `src/services/fireCalculations.ts`

Modify `prepareFIREChartData` to accept the stop contributions setting:

```typescript
export function prepareFIREChartData(
  investments: Investment[],
  loans: Loan[],
  maxYears: number = 30,
  settings: FIRESettings = DEFAULT_FIRE_SETTINGS
): FIREChartDataPoint[] {
  // ... existing code

  // Get suggested stop year if feature is enabled
  const stopYear = settings.stopContributionsEnabled
    ? calculateContributionImpactSummary(investments, loans, settings, maxYears).suggestedStopYear
    : null

  for (let year = 0; year <= maxYears; year++) {
    const monthsFromNow = year * 12

    // Use stop year in income calculation if enabled
    const income = calculateTotalMonthlyIncomeAtYear(
      investments,
      year,
      settings,
      stopYear  // New parameter
    )

    // ... rest of calculation
  }
}
```

### Phase 4: UI Components

**File**: `src/pages/FIREPage.tsx`

#### 4.1 Add Toggle to Header

```tsx
<div className="flex items-center gap-2">
  <Switch
    id="stopContributions"
    checked={settings.stopContributionsEnabled}
    onCheckedChange={(checked: boolean) =>
      updateSettings({ stopContributionsEnabled: checked })
    }
  />
  <Label htmlFor="stopContributions" className="text-sm cursor-pointer">
    Stop Contributions
  </Label>
</div>
```

#### 4.2 New Contribution Impact Card Component

```tsx
function ContributionImpactCard({
  impactSummary,
  threshold,
  onThresholdChange,
  isEnabled,
}: {
  impactSummary: ContributionImpactSummary
  threshold: number
  onThresholdChange: (value: number) => void
  isEnabled: boolean
}) {
  if (impactSummary.totalMonthlyContributions === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No monthly contributions found. Add monthly contributions to funds to see impact analysis.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contribution Impact Analysis</span>
          <div className="flex items-center gap-2">
            <Label htmlFor="threshold" className="text-sm font-normal">
              Threshold:
            </Label>
            <Select value={threshold.toString()} onValueChange={(v) => onThresholdChange(parseFloat(v))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5%</SelectItem>
                <SelectItem value="1">1%</SelectItem>
                <SelectItem value="2">2%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary message */}
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          {impactSummary.suggestedStopYear !== null ? (
            <>
              <p className="text-sm text-muted-foreground">
                Your contributions become insignificant (&lt;{threshold}% of growth) in
              </p>
              <p className="text-2xl font-bold mt-1">
                Year {impactSummary.suggestedStopYear} ({impactSummary.suggestedStopActualYear})
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">
              Contributions remain significant throughout the projection period
            </p>
          )}
        </div>

        {/* Current stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Monthly Contributions</p>
            <p className="font-semibold">{formatCurrency(impactSummary.totalMonthlyContributions)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Impact</p>
            <p className="font-semibold">{impactSummary.currentImpactRatio.toFixed(1)}%</p>
          </div>
        </div>

        {/* Impact if stopping */}
        {isEnabled && impactSummary.suggestedStopYear !== null && (
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm font-medium">If contributions stop at Year {impactSummary.suggestedStopYear}:</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">FIRE Delay</p>
                <p className={`font-semibold ${impactSummary.fireDelayYears && impactSummary.fireDelayYears > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {impactSummary.fireDelayYears !== null
                    ? `+${impactSummary.fireDelayYears} years`
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Portfolio Impact</p>
                <p className="font-semibold text-amber-600">
                  {impactSummary.portfolioDifference !== null
                    ? formatCurrency(impactSummary.portfolioDifference)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Impact ratio progression */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Impact Ratio Over Time</p>
          <div className="space-y-1 text-sm">
            {[0, 5, 10, 15, 20].map(year => {
              const data = impactSummary.impactData.find(d => d.year === year)
              if (!data) return null
              const isBelowThreshold = data.impactRatio < threshold
              return (
                <div key={year} className="flex justify-between">
                  <span className="text-muted-foreground">Year {year}</span>
                  <span className={isBelowThreshold ? 'text-green-600' : ''}>
                    {data.impactRatio.toFixed(1)}%
                    {isBelowThreshold && year === impactSummary.suggestedStopYear && ' ← Stop here'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Phase 5: Hook Updates

**File**: `src/hooks/useFIRE.ts`

Add contribution impact summary to the hook return value:

```typescript
export function useFIRE(maxYears: number = 30) {
  // ... existing code

  const contributionImpact = useMemo(() => {
    if (!investments.length) return null
    return calculateContributionImpactSummary(investments, loans, settings, maxYears)
  }, [investments, loans, settings, maxYears])

  return {
    // ... existing returns
    contributionImpact,
  }
}
```

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/types/fire.ts` | Add `stopContributionsEnabled`, `contributionInsignificanceThreshold` to FIRESettings; Add `ContributionImpactData` and `ContributionImpactSummary` interfaces |
| `src/services/fireCalculations.ts` | Add `calculateTotalMonthlyContributions`, `calculateContributionImpactAtYear`, `calculateContributionImpactSummary`, `calculateFutureValueWithStopYear`; Modify `prepareFIREChartData` and `calculateTotalMonthlyIncomeAtYear` |
| `src/services/calculations.ts` | No changes (existing functions sufficient) |
| `src/hooks/useFIRE.ts` | Add `contributionImpact` to return value |
| `src/pages/FIREPage.tsx` | Add "Stop Contributions" toggle; Add `ContributionImpactCard` component |

---

## Implementation Order

1. **Types first** (`fire.ts`) - Define all new interfaces and update FIRESettings
2. **Core calculations** (`fireCalculations.ts`) - Implement contribution impact functions
3. **Hook integration** (`useFIRE.ts`) - Add contribution impact to hook
4. **UI components** (`FIREPage.tsx`) - Add toggle and impact card

---

## Testing Scenarios

1. **No contributions**: Impact card shows "No monthly contributions found"
2. **Small portfolio**: High impact ratio initially, decreases over time
3. **Large portfolio**: Impact may already be below threshold
4. **Toggle ON**: FIRE numbers update to reflect stopped contributions
5. **Threshold change**: Suggested year updates dynamically
6. **Edge cases**: 0% ROI, negative growth years

---

## Future Enhancements

1. **Interactive chart**: Show contribution impact ratio as an area chart
2. **Comparison view**: Overlay "with contributions" vs "without contributions" on main chart
3. **Per-investment breakdown**: Show which investments have highest/lowest impact
4. **What-if scenarios**: Slider to manually choose stop year and see effects
